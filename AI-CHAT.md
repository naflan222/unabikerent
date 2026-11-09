# Una chat assistant

An English-only floating assistant appears on every HTML page. It answers rental and safari questions using the business facts in `server/chat.mjs` and directs booking enquiries to the existing WhatsApp number. It cannot check live availability, quote unverified rates, take payment or confirm bookings.

## Run and deploy

- Node.js 22+; the existing Vercel project uses Node.js 24.
- `npm ci`, then `npm test`.
- Deploy the repository to the existing **renta222 / unabikerent** Vercel project. Static HTML remains at the root; `api/chat.mjs` runs as a Node.js Function at `/api/chat` with a 30-second maximum.
- Deployed requests authenticate to Vercel AI Gateway using Vercel's injected `VERCEL_OIDC_TOKEN`. The team's AI Gateway must have access and available credits. No browser API key is used.
- For local model testing, set `AI_GATEWAY_API_KEY` securely in your process environment. No local credential is needed for `npm test`.
- `AI_GATEWAY_MODEL` optionally overrides the default `openai/gpt-4.1-mini`, verified against the live model catalog during implementation. Selected for fast, low-cost text answers. The catalog listed $0.40/million input tokens and $1.60/million output tokens; verify current pricing before launch.
- `UNA_CHAT_ENABLED=false` disables generation while retaining the widget and WhatsApp handoff. Redeploy after changing Vercel environment variables.

## Behaviour and privacy

Conversation context lives in page memory, not localStorage or a database. Navigating away or starting a new chat clears it. Messages go to the AI provider through AI Gateway to generate answers. The server does not log prompts or replies; provider-side retention and platform logging follow the provider/project configuration.

Only customer-entered messages are included in the WhatsApp draft. The visitor must open WhatsApp and send the draft; nothing is automatically sent to staff. The draft remains available when AI fails. Failed requests are removed from model context so the next turn can retry normally.

Update `server/chat.mjs` when vehicles, destinations, contact details or verified policies change. No page scraping or invented prices are used. Model answers are rendered as plain text, never HTML.

## Before public launch

Confirm AI Gateway credits/access in Vercel and send a real test question in a preview. Model calls incur the team's AI Gateway usage charges. The included tests use mocks and spend no model credits.

Configure an appropriate Vercel Firewall rate limit for POST `/api/chat` and an AI Gateway project spend limit. Request sizes, history, output tokens and generation time are bounded in code, but these are not a distributed rate limiter. No firewall configuration or account budget is changed by this PR. Origin checks prevent accidental cross-site browser requests; they are not authentication and do not stop direct API callers.

Browser layout still needs checking on desktop and mobile. Automated tests cover server validation, actual SDK prompt forwarding with a mock model, WhatsApp handoff, safe text rendering, keyboard opening/closing, failed requests and chat reset races.
