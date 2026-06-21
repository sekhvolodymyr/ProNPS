# ProNPS

MVP for private customer feedback collection and 1-5 star loyalty metrics.

## Stack

- Next.js App Router
- Prisma
- PostgreSQL
- Resend for transactional email
- S3/R2-ready logo storage, local filesystem adapter for development

## Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL`, `AUTH_SECRET`, and `APP_URL`.
3. Set Supabase server SDK values from the Supabase dashboard Connect dialog:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`
   - `SUPABASE_JWKS_URL`

Never commit `.env` or any secret key.

For Supabase Postgres in local development, prefer the pooler connection string for `DATABASE_URL` if the direct `db.*.supabase.co:5432` host is not reachable from your network.

## Supabase Server SDK

The project includes `@supabase/server` for request handlers that need Supabase header-based auth.

Example routes:

- `GET /api/supabase/health` uses `auth: "none"` and verifies SDK env resolution.
- `GET /api/supabase/reviews` uses `auth: "user"` and requires `Authorization: Bearer <jwt>`.

`ctx.supabase` is RLS-scoped. `ctx.supabaseAdmin` bypasses RLS and must only be used in trusted server-side handlers.

Continue setup:

3. Install dependencies:

```bash
npm install
```

4. Create database tables:

```bash
npm run prisma:migrate
```

5. Optional demo data:

```bash
npm run prisma:seed
```

Demo accounts:

- owner: `owner@pronps.test` / `password123`
- admin: `admin@pronps.test` / `admin12345`

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm test
npm run build
```

Playwright E2E requires the browser binary:

```bash
npx playwright install chromium
npm run test:e2e
```
