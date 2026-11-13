import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const sentinel = 'qa-build-fake-key-never-publish';
const cases = [
  { name: 'disabled default', env: { VERCEL_ENV: 'preview', QA_ENABLED: '0' }, live: false },
  { name: 'enabled Preview', env: { VERCEL_ENV: 'preview', QA_ENABLED: '1' }, live: true },
  { name: 'Production even with opt-in', env: { VERCEL_ENV: 'production', QA_ENABLED: '1' }, live: false },
];
function verifyNoStaticKey(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) verifyNoStaticKey(path);
    else if (/\.(html|js|json|map)$/.test(path)) assert.ok(!readFileSync(path, 'utf8').includes(sentinel), `Key leaked in ${path}`);
  }
}
for (const scenario of cases) {
  try {
    execFileSync(process.execPath, [realpathSync('node_modules/.bin/astro'), 'build'], {
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', QA_DEMO: '0', AI_GATEWAY_API_KEY: sentinel, ...scenario.env },
      stdio: 'pipe',
    });
  } catch (error) {
    process.stderr.write(error.stdout ?? '');
    process.stderr.write(error.stderr ?? '');
    throw error;
  }
  for (const page of ['profile', 'explore']) {
    const dom = new JSDOM(readFileSync(`.vercel/output/static/${page}/index.html`, 'utf8'));
    const panel = dom.window.document.querySelector('[data-ask-panel]');
    assert.equal(panel?.dataset.mode === 'live', scenario.live, `${scenario.name}: ${page} availability`);
    assert.equal(Boolean(dom.window.document.querySelector('[data-ask-form]')), scenario.live, `${scenario.name}: ${page} form`);
    assert.equal(dom.window.document.querySelector('[data-ask-failure]'), null, 'live/public builds must not expose canned failure controls');
    if (scenario.live) {
      const notice = dom.window.document.querySelector('.ask-notice').textContent;
      assert.match(notice, /Vercel AI Gateway/);
      assert.match(notice, /Model providers may retain content/);
      assert.doesNotMatch(notice, /Zero Data Retention is enabled/);
    }
    dom.window.close();
  }
  const config = JSON.parse(readFileSync('.vercel/output/config.json', 'utf8'));
  assert.ok(config.routes.some(route => route.dest === '_render' && new RegExp(route.src).test('/api/ask')), 'API must route to a Vercel function');
  assert.ok(readdirSync('.vercel/output/functions').includes('_render.func'));
  // Exercise Astro routing and runtime env handling in the actual function bundle.
  execFileSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import app from './.vercel/output/functions/_render.func/.vercel/output/server/entry.mjs';
    let calls = 0;
    globalThis.fetch = async (url, options) => {
      calls++;
      assert.equal(url, 'https://ai-gateway.vercel.sh/v1/chat/completions');
      assert.equal(options.headers.Authorization, 'Bearer ${sentinel}');
      const requestBody = JSON.parse(options.body);
      assert.equal(requestBody.max_tokens, 2048);
      assert.equal(requestBody.providerOptions, undefined);
      return Response.json({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify({
        status: 'answered', text: 'Known Fixes ranks parts for trouble codes.', evidenceIds: ['known-fixes']
      }) } }] });
    };
    const response = await app.fetch(new Request('https://preview.example/api/ask', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://preview.example' },
      body: JSON.stringify({ messages: [{ role: 'user', text: 'What is Known Fixes?' }] })
    }));
    assert.equal(response.status, ${scenario.live ? 200 : 503});
    assert.equal(calls, ${scenario.live ? 1 : 0});
    const body = await response.json();
    assert.equal(body.status, '${scenario.live ? 'answered' : 'unavailable'}');
    if (calls) assert.equal(body.citations[0].href, '/profile/#known-fixes');
  `], {
    env: { ...process.env, AI_GATEWAY_API_KEY: sentinel, ...scenario.env },
    stdio: 'pipe',
  });
  verifyNoStaticKey('.vercel/output/static');
  console.log(`Verified ${scenario.name}: Profile, Game, function execution, and no static API key.`);
}
