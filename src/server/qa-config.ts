import { isQAEnabled } from '../lib/qa.ts';

// Vite only exposes private build variables through explicit property accesses.
export const qaEnabledForBuild = isQAEnabled({
  QA_ENABLED: import.meta.env.QA_ENABLED,
  GROQ_ZDR_ENABLED: import.meta.env.GROQ_ZDR_ENABLED,
  VERCEL_ENV: import.meta.env.VERCEL_ENV,
});
