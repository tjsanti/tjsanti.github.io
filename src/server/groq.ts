import { MAX_ANSWER_CHARS, type QAAnswer, type QAMessage } from '../lib/qa.ts';
import { citationsById, systemPrompt } from './qa-corpus.ts';

const responseFormat = {
  type: 'json_schema',
  json_schema: {
    name: 'portfolio_answer',
    strict: true,
    schema: {
      type: 'object',
      additionalProperties: false,
      required: ['status', 'text', 'evidenceIds'],
      properties: {
        status: { type: 'string', enum: ['answered', 'unsupported'] },
        text: { type: 'string' },
        evidenceIds: { type: 'array', items: { type: 'string', enum: [...citationsById.keys()] } },
      },
    },
  },
};

export interface GroqConfig { apiKey: string; model: string }

/** The only provider boundary. No prompts, responses, or raw provider errors are logged. */
export async function askGroq(messages: QAMessage[], config: GroqConfig, fetcher: typeof fetch = fetch): Promise<QAAnswer> {
  const signal = AbortSignal.timeout(12000);
  const body = JSON.stringify({
    model: config.model,
    messages: [{ role: 'system', content: systemPrompt }, ...messages.map(message => ({ role: message.role, content: message.text }))],
    response_format: responseFormat,
    reasoning_effort: 'low',
    include_reasoning: false,
    max_completion_tokens: 2048,
    stream: false,
  });

  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetcher('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
      body,
      signal,
    });
    if (attempt === 0 && [502, 503, 504].includes(response.status)) {
      await response.body?.cancel();
      await new Promise(resolve => setTimeout(resolve, 250));
      continue;
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error('Q&A provider unavailable');
    }
    const completion = await response.json();
    const choice = completion.choices?.[0];
    if (choice?.finish_reason !== 'stop' || typeof choice.message?.content !== 'string') throw new Error('Incomplete Q&A response');
    const answer = JSON.parse(choice.message.content);
    if (!answer || !['answered', 'unsupported'].includes(answer.status) || typeof answer.text !== 'string' ||
      !answer.text.trim() || answer.text.length > MAX_ANSWER_CHARS || !Array.isArray(answer.evidenceIds) ||
      answer.evidenceIds.length > 8 || answer.evidenceIds.some((id: unknown) => typeof id !== 'string' || !citationsById.has(id)) ||
      (answer.status === 'answered' && answer.evidenceIds.length === 0)) throw new Error('Invalid Q&A response');
    const ids: string[] = [...new Set<string>(answer.evidenceIds)];
    return { status: answer.status, text: answer.text.trim(), citations: ids.map(id => citationsById.get(id)!) };
  }
  throw new Error('Q&A provider unavailable');
}
