# Setup

Follow these steps to run Signalist locally from scratch.

## 1) Prerequisites

- Node.js 20+
- A MongoDB database (Atlas or self‑hosted)
- An SMTP provider (Gmail with App Password is supported out of the box)
- Optional: Google AI Studio key (Gemini) for AI‑generated email personalization

## 2) Install dependencies

```
npm install
```

## 3) Configure environment

Create a `.env` file in the project root and set required variables. See `docs/environment.md` for full details and examples. Do not commit real secrets.

Minimum required variables:

- `MONGODB_URI`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL` (e.g., http://localhost:3000)
- `NODEMAILER_EMAIL` and `NODEMAILER_PASSWORD` (Gmail App Password recommended)
- `GEMINI_API_KEY` (only if using AI personalization)

## 4) Start the dev server

```
npm run dev
```

Open http://localhost:3000

## 5) Verify DB connectivity (optional)

CLI test (does not require the Next.js server):

```
npm run db:test
```

HTTP health check (requires dev server):

```
GET http://localhost:3000/api/health/db
```

## 6) Trigger a welcome email (optional)

- Use the sign‑up flow wired to `signUpWithEmail` (see `lib/actions/auth.actions.ts`). On successful registration, an `app/user.created` event is emitted, which triggers the Inngest function that generates a personalized intro and sends the welcome email.

## 7) Folder highlights

- `database/mongoose.ts` — Mongoose connection helper with caching
- `lib/better-auth/auth.ts` — BetterAuth initialization (MongoDB adapter, Next.js cookies)
- `lib/inngest/*` — Inngest client, functions, and AI prompts
- `lib/nodemailer/*` — Nodemailer transporter and responsive email templates
- `app/api/*` — API routes (health, Inngest adapter)
- `scripts/db-test.mjs` — CLI MongoDB connectivity check
