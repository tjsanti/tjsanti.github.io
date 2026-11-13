# Use Vercel AI Gateway with standard provider retention

**Date:** 2026-11-13

Grounded Q&A uses Vercel AI Gateway's Chat Completions API and a dedicated server-side `AI_GATEWAY_API_KEY`. Start with `openai/gpt-oss-120b`, which Vercel currently lists with free-credit-eligible serving routes and structured-output support. The model remains configurable through `AI_GATEWAY_MODEL` so it can be updated if eligibility changes. Use the existing Vercel free Gateway allowance without purchasing credits or enabling automatic top-ups for this testing stage.

Consolidating model access in Vercel avoids another provider account. Trevor accepted standard provider retention for this public Portfolio and removed the ZDR requirement. This supersedes the Groq-specific provider choice in ADR 0003 and removes the ZDR configuration gate and privacy promise. The interface identifies Vercel AI Gateway and its model providers and states that model providers may retain content under their policies. The application continues to avoid conversation logging and persistence, and asks Evaluators not to submit confidential or sensitive information.

The approved Portfolio corpus, stateless endpoint, grounded-answer schema, citation validation, request limits, unavailable response, and protected Preview release gate remain in place. The application requests one model, with no configured fallback models or independent application-level provider fallback. AI Gateway handles upstream provider routing for that model. Production builds remain disabled until a separate evaluated release change.

The free tier has limited monthly credits and per-model rate limits; exhaustion shows the unavailable state. ZDR-specific options, BYOK provider credentials, and paid security controls are not part of this integration. Actual credit eligibility, quotas, and model availability must be checked in the Vercel team account during setup.

References: [Gateway pricing](https://vercel.com/docs/ai-gateway/pricing), [GPT OSS 120B](https://vercel.com/ai-gateway/models/gpt-oss-120b), [Chat Completions API](https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions).
