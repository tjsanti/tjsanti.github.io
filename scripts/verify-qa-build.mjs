import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const sentinel = 'qa-build-fake-key-never-publish';
const cases = [
  { name: 'disabled default', env: { VERCEL_ENV: 'preview', QA_ENABLED: '0', GROQ_ZDR_ENABLED: '0' }, live: false },
  { name: 'enabled Preview', env: { VERCEL_ENV: 'preview', QA_ENABLED: '1', GROQ_ZDR_ENABLED: '1' }, live: true },
  { name: 'unconfirmed ZDR', env: { VERCEL_ENV: 'preview', QA_ENABLED: '1', GROQ_ZDR_ENABLED: '0' }, live: false },
  { name: 'Production even with opt-in', env: { VERCEL_ENV: 'production', QA_ENABLED: '1', GROQ_ZDR_ENABLED: '1' }, live: false },
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
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', QA_DEMO: '0', GROQ_API_KEY: sentinel, ...scenario.env },
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
    if (scenario.live) assert.match(dom.window.document.querySelector('.ask-notice').textContent, /Groq Zero Data Retention is enabled/);
    dom.window.close();
  }
  const config = JSON.parse(readFileSync('.vercel/output/config.json', 'utf8'));
  assert.ok(config.routes.some(route => route.dest === '_render' && new RegExp(route.src).test('/api/ask')), 'API must route to a Vercel function');
  assert.ok(readdirSync('.vercel/output/functions').includes('_render.func'));
  verifyNoStaticKey('.vercel/output/static');
  console.log(`Verified ${scenario.name}: Profile, Game, function routing, and no static API key.`);
}
