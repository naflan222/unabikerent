# Ask Una — website-only assistant

Ask Una is a free, browser-based guide with prepared English answers about Una Bike Rental. It does not use a generative AI model, API key, AI provider, server endpoint or usage credits. It answers immediately from the website's business information and redirects unrelated questions back to Una Bike Rental topics.

## Included topics

- Listed bikes and cars, rental enquiries and availability confirmation.
- Yala, Udawalawe, Bundala and Ridiyagama safari experiences.
- Quotes, long-term rental discounts, delivery, helmets and unlimited kilometres.
- Licence/document guidance and terms that need staff confirmation.
- Business address, contact details and website-listed hours.

Answers are prepared in `js/una-chat.js`. Update them whenever the published website details change. The matcher selects a relevant answer; it cannot understand every phrasing. Unknown questions get a business-only fallback and a WhatsApp handoff. It cannot quote unverified prices, check live availability, guarantee animal sightings or confirm a booking.

## Booking handoff and privacy

The chat keeps recent questions in page memory only. It does not call fetch, XMLHttpRequest, AI services or chat telemetry and does not store conversations in localStorage, sessionStorage or a database. New chat and page navigation clear the conversation.

Continue on WhatsApp opens a draft addressed to +94 77 313 2168 containing the visitor's recent questions. The visitor must choose to open WhatsApp and send the draft. Nothing is sent automatically, and no booking is confirmed in chat. The existing website's other external resources are unchanged.

## Deployment and checks

Deploy the normal static website to the existing Vercel project. No environment variables, billing setup or backend Functions are required. The previous chat API, provider runtime dependencies and Function configuration are removed. Existing Vercel hosting limits remain unchanged.

`npm ci` followed by `npm test` runs the DOM behaviour tests. npm and the development-only test dependencies are not needed by visitors. The tests cover business-only answers, destination distinctions, price/availability boundaries, local responses without network access, WhatsApp handoff, text escaping, reset, navigation and keyboard controls.

This replaces the proposed Gateway and Gemini integrations in PRs #9 and #10; neither is needed for this version.
