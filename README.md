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
