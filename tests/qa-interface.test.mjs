import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const turn = () => new Promise(resolve => setTimeout(resolve, 0));
const answer = (text = 'NormFlow uses FAISS.') => Response.json({ status: 'answered', text, citations: [{ label: 'NormFlow', href: '/profile/#normflow' }] });

function markup(mode) {
  return `<section data-ask-panel data-mode="${mode}">
    <div data-ask-conversation><p class="ask-welcome">Welcome</p></div>
    <form data-ask-form><textarea data-ask-input></textarea><button data-ask-submit>Ask</button>
    <button type="button" data-ask-reset>Reset</button><button type="button" data-ask-suggestion="What is NormFlow?">Suggestion</button>
    <p data-ask-status></p></form>${mode === 'demo' ? '<button data-ask-failure>Fail next reply</button>' : ''}</section>`;
}

test('shared Q&A interface supports follow-ups, safe rendering, retries, reset, and the canned demo', async t => {
  const dom = new JSDOM(markup('live') + markup('demo'), { url: 'https://preview.example/profile/' });
  const original = { document: globalThis.document, window: globalThis.window, fetch: globalThis.fetch };
  globalThis.document = dom.window.document;
  globalThis.window = dom.window;
  const calls = [];
  let respond = async () => answer();
  globalThis.fetch = async (url, options) => { calls.push({ url, ...options }); return respond(options); };
  t.after(() => { Object.assign(globalThis, original); dom.window.close(); });
  await import('../src/scripts/ask.ts');
  const [live, demo] = document.querySelectorAll('[data-ask-panel]');
  const input = live.querySelector('textarea');
  const submit = (panel = live) => panel.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));

  live.querySelector('[data-ask-suggestion]').click();
  assert.equal(input.value, 'What is NormFlow?');
  assert.equal(calls.length, 0, 'suggestions only fill the input');
  submit();
  submit();
  await turn();
  assert.equal(calls.length, 1, 'pending requests cannot be submitted twice');
  assert.equal(input.value, '');
  assert.equal(live.querySelector('.ask-citations a').getAttribute('href'), '/profile/#normflow');
  assert.equal(live.querySelectorAll('.ask-message').length, 2);

  input.value = 'Tell me more';
  respond = async () => answer('<img src=x onerror=alert(1)>');
  submit();
  await turn();
  assert.equal(JSON.parse(calls.at(-1).body).messages.length, 3);
  assert.equal(live.querySelector('img'), null, 'model text is rendered as text, not HTML');
  assert.match(live.textContent, /<img src=x onerror=alert\(1\)>/);

  input.value = 'What skills are listed?';
  respond = async () => new Response('Provider quota reached', { status: 503 });
  submit();
  await turn();
  assert.equal(input.value, 'What skills are listed?');
  assert.equal(live.querySelectorAll('.ask-message').length, 4, 'failed requests are not committed to the log');
  assert.match(live.querySelector('[data-ask-status]').textContent, /temporarily unavailable/);
  respond = async () => answer();
  submit();
  await turn();
  const retried = JSON.parse(calls.at(-1).body).messages;
  assert.equal(retried.filter(message => message.text === 'What skills are listed?').length, 1, 'retry does not duplicate the question');
  assert.equal(retried.length, 5);

  input.value = 'Late question';
  let finish;
  respond = async () => new Promise(resolve => { finish = resolve; });
  submit();
  const pending = calls.at(-1);
  live.querySelector('[data-ask-reset]').click();
  assert.equal(pending.signal.aborted, true);
  finish(answer('This stale answer must be ignored.'));
  await turn();
  assert.equal(live.querySelectorAll('.ask-message').length, 0);
  assert.doesNotMatch(live.textContent, /stale answer/);
  assert.equal(input.disabled, false);

  input.value = 'New conversation';
  respond = async () => answer();
  submit();
  await turn();
  assert.deepEqual(JSON.parse(calls.at(-1).body).messages, [{ role: 'user', text: 'New conversation' }]);

  const providerCalls = calls.length;
  const demoInput = demo.querySelector('textarea');
  demoInput.value = 'What is NormFlow?';
  submit(demo);
  await new Promise(resolve => setTimeout(resolve, 500));
  assert.match(demo.textContent, /FAISS/);
  demoInput.value = 'Tell me more';
  submit(demo);
  await new Promise(resolve => setTimeout(resolve, 500));
  assert.match(demo.querySelector('.ask-message:last-child').textContent, /FAISS/);
  assert.equal(calls.length, providerCalls, 'demo never contacts a provider');
});
