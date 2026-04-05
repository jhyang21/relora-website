# Relora Personal Site

Waitlist-first personal site for Relora, with a separate About Andrew page.

## Routes

- `/` - Relora waitlist landing page
- `/about` - About Andrew
- `/privacy` - privacy policy
- `/terms` - terms of use
- `/request-data` - privacy rights request form
- `/api/waitlist` - waitlist submit endpoint
- `/api/demo-engagement` - demo engagement logging endpoint
- `/api/request-data` - privacy rights request submit endpoint

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Waitlist backend (Supabase Postgres)

The API route uses a direct Postgres connection and creates the `waitlist_signups` table automatically on first valid request.

Required environment variable:

- `POSTGRES_URL` (use the Supabase Transaction Pooler connection string)

Get this value from Supabase:

- Open your project dashboard.
- Go to **Connect** -> **Connection string** -> **Transaction pooler**.
- Copy the URI and use it as `POSTGRES_URL`.

Notes:

- Keep SSL enabled in the URL (`sslmode=require`).
- Pooler connections are recommended for serverless/API routes.

Optional local `.env.local` example:

```bash
POSTGRES_URL=postgres://...
```

## PostHog analytics

Website analytics is gated behind env vars and should stay disabled in production until the
privacy copy is reviewed and merged.

Required public env vars for website analytics:

```bash
NEXT_PUBLIC_POSTHOG_ENABLED=false
NEXT_PUBLIC_POSTHOG_TOKEN=phc_your_project_token
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Behavior:

- Website events register `platform=web` and `surface=marketing_site` so they can be filtered apart from mobile.
- Automatic pageviews run on public routes.
- Homepage and other public marketing routes allow autocapture and session replay.
- `/request-data` disables autocapture and session replay in code.
- Sensitive waitlist and request-data inputs are masked or excluded from replay/autocapture classes.
- API outcome events are sent server-side with sanitized categorical props only. Emails, names, and free-text request content are not sent to PostHog.

### Table schema

```sql
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  intent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Design system

The UI follows a custom "Soft Index Card" visual language:

- Warm paper background and subtle card texture
- Persimmon primary accent for calls to action
- Juniper for calm metadata accents
- Fraunces for headlines, Inter for body/UI

Core tokens live in `src/app/globals.css`.
