/** Shared browser/server contract. Keep credentials and corpus imports out of this module. */
export const MAX_QUESTION_CHARS = 8000;
export const MAX_ANSWER_CHARS = 6000;
export const MAX_CONVERSATION_CHARS = 24000;
export const MAX_MESSAGES = 9;
export const QA_WELCOME = 'Ask about a project, experience, skills, or education. Answers use the reviewed Portfolio evidence.';

export interface QAMessage { role: 'user' | 'assistant'; text: string }
export interface Citation { label: string; href: string }
export interface QAAnswer { status: 'answered' | 'unsupported'; text: string; citations: Citation[] }
export interface QAEnvironment {
  QA_ENABLED?: string;
  GROQ_ZDR_ENABLED?: string;
  VERCEL_ENV?: string;
}

/** Both the prerendered input and runtime endpoint must opt in; Production never opts in. */
export function isQAEnabled(env: QAEnvironment): boolean {
  return env.VERCEL_ENV !== 'production' && env.QA_ENABLED === '1' && env.GROQ_ZDR_ENABLED === '1';
}

/** Retain complete recent turns, leaving room for the next question. */
export function buildConversation(history: QAMessage[], question: string): QAMessage[] {
  const messages: QAMessage[] = [...history.slice(-(MAX_MESSAGES - 1)), { role: 'user', text: question }];
  while (messages.length > 1 && messages.reduce((total, message) => total + message.text.length, 0) > MAX_CONVERSATION_CHARS) {
    messages.splice(0, 2);
  }
  return messages;
}
