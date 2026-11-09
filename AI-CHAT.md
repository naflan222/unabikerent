# Una chat assistant — Google Gemini free tier

An English-only floating assistant appears on every HTML page. It answers rental and safari questions using the business facts in `server/chat.mjs` and directs enquiries to the existing WhatsApp number. It cannot check live availability, quote unverified rates, take payment or confirm bookings.

## Free setup

1. Open https://aistudio.google.com/api-keys and create an API key for a Google project on the **Free Tier**. Do not enable billing, link a paid billing account, or upgrade the project. Eligibility and any account verification are controlled by Google.
2. In Vercel, select **renta222 → unabikerent → Settings → Environment Variables**.
3. Add `GOOGLE_GENERATIVE_AI_API_KEY` as a sensitive server-side variable for Production and Preview. Paste the Google key there, never in chat, source files or browser JavaScript.
4. Deploy this change, or redeploy after adding the variable. Ask the chat a real question to verify your project's free quota is available.

Calls go directly to Google's Generative Language API using `@ai-sdk/google`. Vercel AI Gateway, gateway credits, OIDC and a Vercel payment method are not required. The fixed model is `gemini-2.5-flash-lite`, verified against Google's official pricing and deprecation pages on 2026-11-09. Google lists free input/output tokens for this model and no announced shutdown date. Recheck pricing and availability when changing models.

Free access is quota-limited, not unlimited. Actual limits depend on the account/project and may change. When Google returns 429, the visitor sees a free-limit message and can continue on WhatsApp. There is no model/provider fallback and no automatic paid upgrade. Keeping the Google project on Free Tier prevents paid model usage; the application cannot independently verify the key's billing tier. Existing website hosting remains on the current Vercel plan.

## Local development and maintenance

Node.js 22+ is required. Run `npm ci` and `npm test`. Tests use mocks and need no real key. For local AI requests, set `GOOGLE_GENERATIVE_AI_API_KEY` securely in the server process environment. The static HTML is served from the repository root and `api/chat.mjs` is a Node.js Vercel Function at `/api/chat`.

Set `UNA_CHAT_ENABLED=false` to disable generation while preserving the WhatsApp handoff. Redeploy after changing environment variables. Legacy `AI_GATEWAY_API_KEY`, `AI_GATEWAY_MODEL` and `VERCEL_OIDC_TOKEN` variables are not used by this assistant.

Update `server/chat.mjs` when verified vehicles, destinations, contact details or policies change. No page scraping, invented prices or live booking access is used. History, input length, output tokens and generation time are bounded; these are not a distributed rate limiter. Consider an endpoint rate limit to preserve the shared free quota. No firewall or billing settings are changed by this code.

## Privacy

Conversation context lives in page memory, not localStorage or a database. Navigating away or starting a new chat clears it. Messages are sent to Google Gemini for a reply. Under Google's free-tier terms, submitted content may be used to improve Google products. The widget discloses this and asks visitors not to share personal, payment or ID details. The server logs only error type/status, not prompts, replies, credentials or provider payloads.

The visitor chooses to open WhatsApp and send the draft. No enquiry is automatically sent to staff. Model replies are rendered as plain text, never HTML.

Sources: https://ai.google.dev/gemini-api/docs/pricing#gemini-2.5-flash-lite · https://ai.google.dev/gemini-api/docs/billing · https://ai.google.dev/gemini-api/docs/deprecations
