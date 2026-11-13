import type { APIRoute } from 'astro';
import { handleAsk } from '../../server/ask-handler.ts';

export const prerender = false;

export const ALL: APIRoute = ({ request }) => handleAsk(request, {
  QA_ENABLED: process.env.QA_ENABLED ?? import.meta.env.QA_ENABLED,
  VERCEL_ENV: process.env.VERCEL_ENV ?? import.meta.env.VERCEL_ENV,
  AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY ?? import.meta.env.AI_GATEWAY_API_KEY,
  AI_GATEWAY_MODEL: process.env.AI_GATEWAY_MODEL ?? import.meta.env.AI_GATEWAY_MODEL,
});
