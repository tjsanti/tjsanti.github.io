import type { APIRoute } from 'astro';
import { handleAsk } from '../../server/ask-handler.ts';

export const prerender = false;

// Only the dev server may read Vite's .env values. Built functions use runtime env
// exclusively so credentials and configuration are not compiled into the artifact.
export const ALL: APIRoute = ({ request }) => handleAsk(request, {
  QA_ENABLED: process.env.QA_ENABLED ?? (import.meta.env.DEV ? import.meta.env.QA_ENABLED : undefined),
  VERCEL_ENV: process.env.VERCEL_ENV ?? (import.meta.env.DEV ? import.meta.env.VERCEL_ENV : undefined),
  AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY ?? (import.meta.env.DEV ? import.meta.env.AI_GATEWAY_API_KEY : undefined),
  AI_GATEWAY_MODEL: process.env.AI_GATEWAY_MODEL ?? (import.meta.env.DEV ? import.meta.env.AI_GATEWAY_MODEL : undefined),
});
