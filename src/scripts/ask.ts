import { buildConversation, MAX_QUESTION_CHARS, QA_WELCOME, type Citation, type QAAnswer, type QAMessage } from '../lib/qa.ts';

const unavailable = 'Grounded Q&A is temporarily unavailable. Your question is still in the input so you can retry, or browse the Profile evidence.';

function isAnswer(value: unknown): value is QAAnswer {
  if (!value || typeof value !== 'object' || !('status' in value) || !['answered', 'unsupported'].includes(String(value.status)) ||
    !('text' in value) || typeof value.text !== 'string' || !('citations' in value) || !Array.isArray(value.citations)) return false;
  return value.citations.every((source: Citation) => source && typeof source.label === 'string' && typeof source.href === 'string' && /^\/profile\/#[-a-z0-9]+$/.test(source.href));
}

function setupAskPanel(panel: HTMLElement) {
  if (panel.dataset.askReady) return;
  panel.dataset.askReady = 'true';
  const live = panel.dataset.mode === 'live';
  const form = panel.querySelector<HTMLFormElement>('[data-ask-form]')!;
  const input = panel.querySelector<HTMLTextAreaElement>('[data-ask-input]')!;
  const submit = panel.querySelector<HTMLButtonElement>('[data-ask-submit]')!;
  const log = panel.querySelector<HTMLElement>('[data-ask-conversation]')!;
  const status = panel.querySelector<HTMLElement>('[data-ask-status]')!;
  const failure = panel.querySelector<HTMLButtonElement>('[data-ask-failure]');
  let conversation: (QAMessage & { citations?: Citation[] })[] = [];
  let pending = false;
  let failNext = false;
  let generation = 0;
  let controller: AbortController | undefined;
  const setStatus = (text: string, error = false) => { status.textContent = text; status.dataset.error = String(error); };
  const setPending = (value: boolean) => { pending = value; submit.disabled = value; input.disabled = value; form.setAttribute('aria-busy', String(value)); };

  function addMessage(message: QAMessage & { citations?: Citation[] }) {
    log.querySelector('.ask-welcome')?.remove();
    const entry = document.createElement('div');
    entry.className = 'ask-message';
    entry.dataset.role = message.role;
    const name = document.createElement('strong');
    name.textContent = message.role === 'user' ? 'YOU' : live ? 'AI Q&A' : 'LOCAL DEMO';
    const text = document.createElement('p');
    text.textContent = message.text;
    entry.append(name, text);
    if (message.citations?.length) {
      const links = document.createElement('div');
      links.className = 'ask-citations';
      for (const source of message.citations) {
        const link = document.createElement('a');
        link.href = source.href;
        link.textContent = source.label;
        links.append(link);
      }
      entry.append(links);
    }
    log.append(entry);
    log.scrollTop = log.scrollHeight;
    return entry;
  }

  panel.querySelectorAll<HTMLButtonElement>('[data-ask-suggestion]').forEach(button => button.addEventListener('click', () => {
    if (pending) return;
    input.value = button.dataset.askSuggestion!;
    input.focus();
    setStatus('Suggestion filled. Submit when ready.');
  }));
  failure?.addEventListener('click', () => {
    failNext = !failNext;
    failure.setAttribute('aria-pressed', String(failNext));
    setStatus(failNext ? 'The next submitted question will show the unavailable preview.' : 'The next question will receive a canned demo answer.');
  });
  panel.querySelector('[data-ask-reset]')!.addEventListener('click', () => {
    generation++;
    controller?.abort();
    conversation = [];
    log.replaceChildren();
    const greeting = document.createElement('p');
    greeting.className = 'ask-welcome';
    greeting.textContent = QA_WELCOME;
    log.append(greeting);
    input.value = '';
    failNext = false;
    failure?.setAttribute('aria-pressed', 'false');
    setPending(false);
    setStatus('Conversation reset.');
    input.focus();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;
    const question = input.value.trim();
    if (!question) { input.focus(); setStatus('Enter a question first.', true); return; }
    const limit = live ? MAX_QUESTION_CHARS : 2000;
    if (question.length > limit) { setStatus(`Keep the question under ${limit.toLocaleString()} characters.`, true); return; }
    const messages = buildConversation(conversation, question);
    const failThisReply = failNext;
    failNext = false;
    failure?.setAttribute('aria-pressed', 'false');
    const token = ++generation;
    const entry = addMessage({ role: 'user', text: question });
    setPending(true);
    setStatus(live ? 'Finding supporting evidence…' : 'Preparing canned demo response…');
    const requestController = new AbortController();
    controller = requestController;
    const timer = window.setTimeout(() => requestController.abort(), 18000);
    try {
      let answer: QAAnswer;
      if (live) {
        const response = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: messages.map(({ role, text }) => ({ role, text })) }),
          signal: requestController.signal,
          cache: 'no-store',
        });
        if (!response.ok) throw new Error(unavailable);
        const result: unknown = await response.json();
        if (!isAnswer(result)) throw new Error(unavailable);
        answer = result;
      } else {
        const { getDemoAnswer } = await import('../lib/qa-demo.ts');
        await new Promise(resolve => window.setTimeout(resolve, 450));
        if (failThisReply) throw new Error('Demo unavailable');
        answer = { status: 'answered', ...getDemoAnswer(question, conversation) };
      }
      if (token !== generation) return;
      conversation = [...messages, { role: 'assistant', text: answer.text, citations: answer.citations }];
      addMessage({ role: 'assistant', text: answer.text, citations: answer.citations });
      input.value = '';
      setStatus(live ? 'Reply ready. Check the supporting evidence. Conversation resets on refresh.' : 'Demo reply ready. Conversation stays in this page until refresh.');
    } catch {
      if (token !== generation) return;
      entry.remove();
      setStatus(live ? unavailable : 'Demo unavailable state. No provider was contacted. Your question is still in the input so you can retry.', true);
    } finally {
      window.clearTimeout(timer);
      if (token === generation) { setPending(false); input.focus(); }
    }
  });
}

if (typeof document !== 'undefined') {
  document.querySelectorAll<HTMLElement>('[data-ask-panel]').forEach(setupAskPanel);
  document.addEventListener('astro:page-load', () => document.querySelectorAll<HTMLElement>('[data-ask-panel]').forEach(setupAskPanel));
}
