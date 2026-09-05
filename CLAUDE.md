# CLAUDE.md — Relora Website

Marketing/waitlist site for Relora. Next.js 16 App Router, Tailwind v4, raw SQL via `postgres` library. Legal entity: **immForm, Inc.**

---

## Commands

Scripts live in `package.json`. The one thing they do not say: override the API tests' target with `WAITLIST_API_BASE_URL=http://...`

---

## Toolchain

- **Tailwind v4** — CSS-first config in `globals.css` (`@theme inline`), no `tailwind.config.*`
- **`postgres`** npm package (not `pg`, not Prisma, not Drizzle) — raw tagged-template SQL
- **Resend** for transactional email
- **PostHog** for analytics (client + server)
- **Motion** (Framer Motion successor) for animations

---

## Database

- Connection via `POSTGRES_URL` (Supabase Transaction Pooler)
- **Prepared statements disabled** (`prepare: false`) — required for transaction pooler
- **Schema auto-creates on first request** — `CREATE TABLE IF NOT EXISTS` in each route, no migration files
- Tables: `waitlist_signups`, `data_requests`, `demo_engagements`, `api_rate_limits`
- Rate limiting is pure SQL (atomic upsert), no Redis

---

## API Routes

All POST-only:

| Route | Purpose |
|---|---|
| `POST /api/waitlist` | Waitlist signup — upserts, sends notification email |
| `POST /api/request-data` | GDPR/CCPA data request — inserts with status='pending' |
| `POST /api/demo-engagement` | Demo interaction logging — monotonic field accumulation |

- Both waitlist and request-data use **honeypot fields** (`company` / `website`) — non-empty = silent 200, no DB write
- Notification emails go to hardcoded `andrew@immform.com` (not env var)

---

## Environment Variables

```
POSTGRES_URL                              # required — Supabase Transaction Pooler
NEXT_PUBLIC_POSTHOG_ENABLED=true          # optional — all three needed to enable analytics
NEXT_PUBLIC_POSTHOG_TOKEN=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://...
RESEND_API_KEY=re_...                     # optional — email notifications skip silently without it
NEXT_PUBLIC_SHOW_UNDER_CONSTRUCTION_PAGES # gates /about page (404s without it)
```

Use `.env.local` for local dev.

---

## Key Patterns

- Fonts: Inter (sans) + Fraunces (serif headings) via `next/font/google`
- Design tokens as CSS custom properties in `globals.css`
- `/request-data` suppresses PostHog autocapture + session recording (privacy-sensitive)
- `www.reloraapp.com` is canonical — `next.config.ts` redirects bare domain
- Tests are plain Node.js scripts (`scripts/`), no test framework — they `fetch()` against a running server

---

## What to Avoid

- `pnpm` or `yarn`
- Adding a test framework — current scripts work, keep them simple
- Changing the honeypot field names (anti-spam depends on them)
- Removing `prepare: false` from postgres client (breaks transaction pooler)
- Adding migration tooling — schema auto-creates by design
