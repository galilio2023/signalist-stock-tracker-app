# Signalist — Stocks App

A Next.js 15 app that integrates MongoDB (Mongoose), BetterAuth, Inngest (serverless jobs) with Google Gemini for AI-generated content, and Nodemailer for transactional emails. The project provides a production‑ready foundation for user sign‑up, background processing, and email delivery.

## Features

- Next.js App Router (15) with TypeScript
- MongoDB via Mongoose with connection caching
- Authentication using better-auth + MongoDB adapter
- Inngest background function to send personalized welcome emails
- Gemini (Google AI) integration to generate personalized email intro text
- Nodemailer with a production-grade responsive HTML template
- Health endpoint for DB connectivity and a CLI DB test script

## Quick Start

1) Prerequisites
- Node.js 20+
- A MongoDB database (Atlas or self-hosted)
- Gmail account (use an App Password) or another SMTP service
- Google AI Studio key (Gemini) if you want AI personalization

2) Install
```
npm install
```

3) Configure environment
- Copy `.env.example` to `.env` and replace placeholder values with your own secrets. Do NOT commit real secrets.
- See docs/environment.md for all variables.

4) Run in development
```
npm run dev
```
Open http://localhost:3000

5) Verify database connectivity (optional but recommended)
```
npm run db:test
```
or HTTP health check while dev server is running:
```
GET http://localhost:3000/api/health/db
```

## Documentation

### Architecture Overview

- Next.js (App Router) for UI and API routes under `app/api/*`.
- MongoDB via Mongoose; a cached connection helper lives in `database/mongoose.ts`.
- Authentication configured with BetterAuth using a MongoDB adapter and Next.js cookies; see `lib/better-auth/auth.ts`.
- Background processing with Inngest; HTTP handler in `app/api/inngest/route.ts`, jobs in `lib/inngest/functions.ts` and prompts in `lib/inngest/prompts.ts`.
- Transactional email via Nodemailer using a responsive HTML template; see `lib/nodemailer/*`.

### Environment Variables

Set these in `.env` (never commit real secrets):

- MONGODB_URI: MongoDB connection string for Mongoose and db-test script.
- BETTER_AUTH_SECRET: Secret for BetterAuth; use a strong random value.
- BETTER_AUTH_URL: Public base URL for auth callbacks (e.g., http://localhost:3000 in dev).
- NEXT_PUBLIC_BASE_URL: Public site URL exposed to the browser when needed.
- NODEMAILER_EMAIL: SMTP username (for Gmail, the full email address).
- NODEMAILER_PASSWORD: SMTP/App Password (for Gmail, create an App Password; do not use your normal password).
- GEMINI_API_KEY: Google AI Studio key for Gemini (used by Inngest AI inference).
- NODE_ENV: development or production (optional; set by platform in production).

Example (do not use these sample values in production):

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/mydb
BETTER_AUTH_SECRET=replace-with-strong-secret
BETTER_AUTH_URL=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key
NODEMAILER_EMAIL=your@gmail.com
NODEMAILER_PASSWORD=your-app-password
```

### Authentication

- Implemented with BetterAuth and the MongoDB adapter.
- Initialization: `lib/better-auth/auth.ts` connects to MongoDB (via `connectToDatabase()`), then configures BetterAuth with:
  - `emailAndPassword` enabled
  - Cookie storage via `nextCookies()` plugin
- Usage in server actions: `lib/actions/auth.actions.ts` shows `signUpWithEmail`, which calls `auth.api.signUpEmail` then emits an Inngest event on success.

### Email (Nodemailer)

- Transport in `lib/nodemailer/index.ts` using Gmail service by default; customize if you use a different SMTP provider.
- Template in `lib/nodemailer/templates.ts` (responsive, dark‑mode friendly HTML).
- Helper `sendWelcomeEmail` builds the email HTML, subject, and sends via the configured transporter.
- Gmail note: enable 2FA and create an App Password; assign it to `NODEMAILER_PASSWORD`.

### Inngest Jobs and AI Integration

- Inngest client configured at `lib/inngest/client.ts` with project id and Gemini API key.
- HTTP route at `app/api/inngest/route.ts` exposes GET/POST/PUT for Inngest’s Next.js adapter.
- Function `sendSignUpEmail` (id: `sign-up-email`) listens to `app/user.created` events and:
  1) Builds a user profile string from event data (country, goals, risk, industry)
  2) Calls `step.ai.infer` with the Gemini model to generate a personalized intro paragraph
  3) Sends the welcome email via `sendWelcomeEmail`
- Prompts live in `lib/inngest/prompts.ts` with strict formatting guidance for AI output.

#### Triggering locally

- Trigger automatically by registering users via the sign‑up flow (see `lib/actions/auth.actions.ts`).
- Or manually emit an event from server‑side code using `inngest.send({ name: "app/user.created", data })`.

### API Routes

- GET /api/health/db — verifies MongoDB connectivity.
  - Response on success: `{ ok: true, state: 1, elapsedMs: <number> }`
  - Response on failure: `{ ok: false, error: <message>, elapsedMs: <number> }`
- GET|POST|PUT /api/inngest — Inngest adapter endpoint for function dispatching.

### Database

- Connection helper at `database/mongoose.ts` caches the Mongoose connection per runtime to avoid duplicate connections.
- Health route at `app/api/health/db/route.ts` uses the helper to test connectivity.
- CLI script `scripts/db-test.mjs` pings MongoDB using the official driver:
  - Run: `npm run db:test`
  - Output example: `[db-test] MongoDB ping ok in 45ms: { ok: 1 }`

### Deployment

- Build: `npm run build`; Start: `npm start`.
- Provide all environment variables in your hosting platform (e.g., Vercel, Render, Fly.io), ensuring server‑only secrets are not exposed as `NEXT_PUBLIC_*`.
- Inngest: the Next.js adapter route `/api/inngest` must be accessible publicly for Inngest to invoke functions.
- Email: if not using Gmail, update the transporter configuration accordingly.

### Troubleshooting

- MongoDB connection fails:
  - Check `MONGODB_URI`, IP allowlist (Atlas), and network connectivity.
  - Use `npm run db:test` to isolate credential vs. network issues.
- Gmail rejects login:
  - Ensure 2FA is enabled and you’re using an App Password; service may block non‑secure access.
- Gemini errors (permission/invalid API key):
  - Verify `GEMINI_API_KEY` and model availability in your region; reduce to a basic model if needed.
- Inngest 404/401:
  - Confirm the `/api/inngest` route is deployed and the client id/route wiring matches your environment.

## Scripts

- dev — start Next.js in dev mode (Turbopack)
- build — production build (Turbopack)
- start — run production server
- db:test — ping MongoDB via official driver

## Tech Stack

- next, react, typescript
- mongoose, mongodb
- better-auth
- inngest
- nodemailer

## License

This repository is provided as-is without warranty. Ensure you remove sample secrets and configure your own environment before deploying.
