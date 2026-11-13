import { portfolio } from '../data/portfolio.ts';
import type { Citation, QAMessage } from './qa.ts';

export type DemoCitation = Citation;
export interface DemoAnswer { text: string; citations: DemoCitation[] }
export interface DemoMessage extends QAMessage { citations?: Citation[] }

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
  return { text: 'This canned demo recognizes projects, experience, skills, education, certifications, and work preferences. It has no evidence for that question. Try a suggestion or ask about Repair Trends.', citations: [] };
}

