import type { APIRoute } from 'astro';
import { handleAsk } from '../../server/ask-handler.ts';

export const prerender = false;

export const ALL: APIRoute = ({ request }) => handleAsk(request, {
  QA_ENABLED: process.env.QA_ENABLED ?? import.meta.env.QA_ENABLED,
  GROQ_ZDR_ENABLED: process.env.GROQ_ZDR_ENABLED ?? import.meta.env.GROQ_ZDR_ENABLED,
  VERCEL_ENV: process.env.VERCEL_ENV ?? import.meta.env.VERCEL_ENV,
  GROQ_API_KEY: process.env.GROQ_API_KEY ?? import.meta.env.GROQ_API_KEY,
  GROQ_MODEL: process.env.GROQ_MODEL ?? import.meta.env.GROQ_MODEL,
});
