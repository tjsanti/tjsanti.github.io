import { isQAEnabled, MAX_ANSWER_CHARS, MAX_CONVERSATION_CHARS, MAX_MESSAGES, MAX_QUESTION_CHARS, type QAEnvironment, type QAMessage } from '../lib/qa.ts';
import { askGroq } from './groq.ts';

export interface AskEnvironment extends QAEnvironment { GROQ_API_KEY?: string; GROQ_MODEL?: string }
const MAX_REQUEST_BYTES = 65536;
const unavailable = { status: 'unavailable', message: 'Grounded Q&A is temporarily unavailable. Please browse the Profile evidence or try again later.' };
const reply = (body: unknown, status = 200, headers = {}) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });

class InvalidRequest extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}

async function readMessages(request: Request): Promise<QAMessage[]> {
  if (Number(request.headers.get('content-length')) > MAX_REQUEST_BYTES) throw new InvalidRequest('Request is too large.', 413);
  const reader = request.body?.getReader();
  if (!reader) throw new InvalidRequest('Send a JSON conversation.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_REQUEST_BYTES) {
        await reader.cancel();
        throw new InvalidRequest('Request is too large.', 413);
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let body;
  try { body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new InvalidRequest('Send valid JSON.'); }
  if (!body || !Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > MAX_MESSAGES || body.messages.length % 2 !== 1) throw new InvalidRequest('Send a bounded conversation ending with a question.');
  let total = 0;
  const messages = body.messages.map((message: unknown, index: number) => {
    if (!message || typeof message !== 'object' || !('role' in message) || !('text' in message) ||
      message.role !== (index % 2 === 0 ? 'user' : 'assistant') || typeof message.text !== 'string' ||
      !message.text.trim() || message.text.length > (message.role === 'user' ? MAX_QUESTION_CHARS : MAX_ANSWER_CHARS)) throw new InvalidRequest('Invalid message role, text, or length.');
    total += message.text.length;
    return { role: message.role, text: message.text.trim() } as QAMessage;
  });
  if (total > MAX_CONVERSATION_CHARS) throw new InvalidRequest('Conversation is too long. Reset and try again.');
  return messages;
}

export async function handleAsk(request: Request, env: AskEnvironment, fetcher: typeof fetch = fetch): Promise<Response> {
  if (request.method !== 'POST') return reply({ status: 'invalid_request', message: 'Use POST.' }, 405, { Allow: 'POST' });
  if (!isQAEnabled(env) || !env.GROQ_API_KEY?.trim()) return reply(unavailable, 503);
  const origin = request.headers.get('origin');
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get('sec-fetch-site') === 'cross-site') return reply({ status: 'invalid_request', message: 'Use the Q&A on this site.' }, 403);
  if (request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json') return reply({ status: 'invalid_request', message: 'Send application/json.' }, 415);
  try {
    const messages = await readMessages(request);
    const answer = await askGroq(messages, { apiKey: env.GROQ_API_KEY, model: env.GROQ_MODEL?.trim() || 'openai/gpt-oss-120b' }, fetcher);
    return reply(answer);
  } catch (error) {
    if (error instanceof InvalidRequest) return reply({ status: 'invalid_request', message: error.message }, error.status);
    return reply(unavailable, 503);
  }
}
