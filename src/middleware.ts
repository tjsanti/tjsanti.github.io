import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  // Local content reviews must not reuse HTML from an earlier preview server.
  if (import.meta.env.DEV) response.headers.set('Cache-Control', 'no-store');
  return response;
});
