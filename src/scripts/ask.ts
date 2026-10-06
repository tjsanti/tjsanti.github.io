import { portfolio } from '../data/portfolio.ts';

export interface DemoCitation { label: string; href: string }
export interface DemoAnswer { text: string; citations: DemoCitation[] }
export interface DemoMessage { role: 'user' | 'assistant'; text: string; citations?: DemoCitation[] }

const citation = (label: string, anchor: string): DemoCitation => ({ label, href: `/profile/#${anchor}` });
const demoPrefix = 'Local demo using reviewed Portfolio content. ';
export const demoWelcome = 'Ask about a project, experience, skills, or education. Responses use the reviewed Portfolio content.';

/** Shared by every Ask panel. It only selects canned copy from the local corpus. */
export function getDemoAnswer(question: string, conversation: DemoMessage[] = []): DemoAnswer {
  const query = question.trim().toLowerCase();
  if (!query) return { text: 'Enter a question to try the local demo.', citations: [] };
  if (/job description|\bfit\b|qualified|requirements|assess.*alignment/.test(query)) return {
    text: 'This local demo cannot assess job fit. It provides canned replies from reviewed Portfolio content rather than interpreting a job description. You can inspect the skills and experience directly.',
    citations: [citation('Skills', 'skills'), citation('Experience', 'experience')],
  };
  let project = portfolio.projects.find(item => [item.title, item.id, ...(item.aliases ?? [])].some(name => new RegExp(`\\b${name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(query)));
  if (!project && /^(tell me more|more|why|how|what about it|what did it use)\b/.test(query)) {
    const projectIds = new Set(portfolio.projects.map(item => item.id));
    const last = [...conversation].reverse().find(message => message.role === 'assistant' && message.citations?.some(item => projectIds.has(item.href.split('#')[1])));
    const previousProject = last?.citations?.find(item => projectIds.has(item.href.split('#')[1]))?.href.split('#')[1];
    project = portfolio.projects.find(item => item.id === previousProject);
  }
  if (project) return { text: `${demoPrefix}${project.summary}\n\n${project.detail.join('\n\n')}\n\nTechnologies: ${project.tags.join(', ')}.`, citations: [citation(project.title, project.id)] };
  if (/preferences|remote|relocat|location|work authorization|sponsorship|citizen/.test(query)) return { text: `${demoPrefix}${portfolio.location}. ${portfolio.workAuthorization}\n\n${portfolio.preferences.join('\n\n')}`, citations: [citation('Location and work preferences', 'work-preferences')] };
  if (/certificat|credentials|courses|recognition|awards?/.test(query)) return { text: `${demoPrefix}${[...portfolio.certifications, ...portfolio.recognition].map(record => `${record.title}, ${record.organization}, ${record.period}.`).join('\n')}`, citations: [citation('Certifications', 'certifications'), citation('Recognition', 'recognition')] };
  if (/languages?/.test(query)) return { text: `${demoPrefix}Programming tools include ${portfolio.skills.join(', ')}.\n\nProfessional working language: ${portfolio.languages.join(', ')}.`, citations: [citation('Skills', 'skills'), citation('Profile details', 'work-preferences')] };
  if (/skills?|technolog|python|typescript|technical|fine.tun|qlora/.test(query)) return { text: `${demoPrefix}Trevor uses ${portfolio.skills.join(', ')}.`, citations: [citation('Skills', 'skills')] };
  if (/experience|career|history|worked|roles?|background|alldata|mets/.test(query)) return { text: `${demoPrefix}${portfolio.experience.map(role => `${role.title} at ${role.organization}, ${role.period}. ${role.summary}\n${role.bullets.join('\n')}`).join('\n\n')}`, citations: [citation('Experience', 'experience')] };
  if (/education|degree|university|school/.test(query)) return { text: `${demoPrefix}${portfolio.education.map(record => `${record.title}, ${record.institution}, ${record.period}. ${record.summary}`).join('\n\n')}`, citations: [citation('Education', 'education')] };
  if (/projects?|\bbuilt\b|archive|portfolio/.test(query)) return { text: `${demoPrefix}Featured projects: ${portfolio.projects.filter(project => project.featured).map(project => project.title).join(', ')}.\n\nProject archive: ${portfolio.projects.filter(project => !project.featured).map(project => project.title).join(', ')}. Ask about a project by name to read its evidence.`, citations: portfolio.projects.map(project => citation(project.title, project.id)) };
  if (/trevor|about this|this preview|hello|^hi\b/.test(query)) return { text: `${demoPrefix}${portfolio.about.join('\n\n')}`, citations: [citation('About Trevor', 'about')] };
  return { text: 'This canned demo recognizes projects, experience, skills, education, certifications, and work preferences. It has no evidence for that question. Try a suggestion or ask about NormFlow.', citations: [] };
}

function setupAskPanel(panel: HTMLElement) {
  if (panel.dataset.askReady) return;
  panel.dataset.askReady = 'true';
  const form = panel.querySelector<HTMLFormElement>('[data-ask-form]')!;
  const input = panel.querySelector<HTMLTextAreaElement>('[data-ask-input]')!;
  const submit = panel.querySelector<HTMLButtonElement>('[data-ask-submit]')!;
  const log = panel.querySelector<HTMLElement>('[data-ask-conversation]')!;
  const status = panel.querySelector<HTMLElement>('[data-ask-status]')!;
  const failure = panel.querySelector<HTMLButtonElement>('[data-ask-failure]')!;
  let conversation: DemoMessage[] = [];
  let pending = false;
  let failNext = false;
  let generation = 0;
  const setStatus = (text: string, error = false) => { status.textContent = text; status.dataset.error = String(error); };
  const setPending = (value: boolean) => { pending = value; submit.disabled = value; input.disabled = value; form.setAttribute('aria-busy', String(value)); };

  function addMessage(message: DemoMessage) {
    log.querySelector('.ask-welcome')?.remove();
    const entry = document.createElement('div');
    entry.className = 'ask-message';
    entry.dataset.role = message.role;
    const name = document.createElement('strong');
    name.textContent = message.role === 'user' ? 'YOU' : 'LOCAL DEMO';
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
  }

  panel.querySelectorAll<HTMLButtonElement>('[data-ask-suggestion]').forEach(button => button.addEventListener('click', () => {
    if (pending) return;
    input.value = button.dataset.askSuggestion!;
    input.focus();
    setStatus('Suggestion filled. Submit when ready.');
  }));
  failure.addEventListener('click', () => {
    failNext = !failNext;
    failure.setAttribute('aria-pressed', String(failNext));
    setStatus(failNext ? 'The next submitted question will show the unavailable preview.' : 'The next question will receive a canned demo answer.');
  });
  panel.querySelector('[data-ask-reset]')!.addEventListener('click', () => {
    generation++;
    conversation = [];
    log.replaceChildren();
    const welcome = document.createElement('p');
    welcome.className = 'ask-welcome';
    welcome.textContent = demoWelcome;
    log.append(welcome);
    input.value = '';
    failNext = false;
    failure.setAttribute('aria-pressed', 'false');
    setPending(false);
    setStatus('Conversation reset.');
    input.focus();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;
    const question = input.value.trim();
    if (!question) { input.focus(); setStatus('Enter a question first.', true); return; }
    if (question.length > 2000) { setStatus('Keep the demo question under 2,000 characters.', true); return; }
    const answer = getDemoAnswer(question, conversation);
    const failThisReply = failNext;
    failNext = false;
    failure.setAttribute('aria-pressed', 'false');
    const token = ++generation;
    const message: DemoMessage = { role: 'user', text: question };
    conversation.push(message);
    addMessage(message);
    setPending(true);
    setStatus('Preparing canned demo response…');
    await new Promise(resolve => window.setTimeout(resolve, 450));
    if (token !== generation) return;
    setPending(false);
    if (failThisReply) {
      setStatus('Demo unavailable state. No provider was contacted. Your question is still in the input so you can retry.', true);
      input.focus();
      return;
    }
    const response: DemoMessage = { role: 'assistant', text: answer.text, citations: answer.citations };
    conversation.push(response);
    conversation = conversation.slice(-12);
    addMessage(response);
    input.value = '';
    setStatus('Demo reply ready. Conversation stays in this page until refresh.');
    input.focus();
  });
}

if (typeof document !== 'undefined') {
  document.querySelectorAll<HTMLElement>('[data-ask-panel]').forEach(setupAskPanel);
  document.addEventListener('astro:page-load', () => document.querySelectorAll<HTMLElement>('[data-ask-panel]').forEach(setupAskPanel));
}
