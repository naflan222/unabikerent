# Una AI chat

The floating chat appears on all six HTML pages. `api/chat.js` runs as a Vercel Node.js Function and uses the Vercel AI SDK with AI Gateway. Static hosting alone cannot run this endpoint.

## Deployment

The existing `unabikerent` Vercel project uses Node.js 24 and supports this function. Deploy through the usual GitHub pull-request and merge workflow. The project must have AI Gateway access and available credits. The SDK uses Vercel's server-side OIDC credentials automatically; no API key belongs in the website JavaScript.

The default model was verified in the Gateway catalogue when this change was made. Optionally set `AI_GATEWAY_MODEL` in Vercel to another supported text model. For a server outside Vercel, store `AI_GATEWAY_API_KEY` in its secure environment instead. Never commit credentials.

## Business information

Edit `server/rental-knowledge.js` when services, hours, policies or inventory change. Pricing and availability remain subject to the team's confirmation. The model cannot make bookings, take payments or access live stock.

## Verification

Run `npm ci`, `npm test`, and `npm run check`. A live model request also needs Gateway credentials and credits; request validation tests use an injected generator and do not spend credits. Preview deployments should be checked for a successful POST to `/api/chat` before merging. The widget keeps conversation context in page memory only and renders replies as plain text. It provides a retry action and a WhatsApp handoff when the API is unavailable.

## Current preview verification

The Vercel preview builds successfully and serves the chat endpoint. A live model request was attempted on 7 November 2026. AI Gateway rejected it with HTTP 403; the sanitized server diagnostic identifies a credit-related error. Complete AI Gateway credit/account setup in the owning Vercel team before enabling this feature in production, then verify a real chat reply. Until that succeeds, keep the pull request in draft. The tested failure state directs visitors to WhatsApp.
