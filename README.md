# Upwork Watcher

Node.js + TypeScript service that periodically fetches jobs from Upwork, filters and scores them with an LLM and optionally sends notifications.

## Features
- Fetch jobs from Upwork GraphQL API with retry and pagination.
- Deduplication and high‑water mark stored in SQLite via Prisma.
- Hard filters for budget, contract type, payment verification and required skills.
- LLM scoring using OpenAI Chat Completions and rubric in `src/scoring/prompt.md`.
- Notifications via Telegram and Email (disabled by default).
- HTTP endpoints: `/health` and `/run`.
- CLI `npm run once` for manual runs.

## Quick start
```bash
npm i
npx prisma migrate dev --name init
npm run dev    # start HTTP server
curl http://localhost:3000/health
npm run once -- --lookback-min 90 --dry-run
```

## Environment
Copy `.env.example` to `.env` and fill in values.

Key variables:
- `UPWORK_CLIENT_ID` / `UPWORK_CLIENT_SECRET` / `UPWORK_ACCESS_TOKEN`
- `OPENAI_API_KEY`
- `DATABASE_URL` (default `file:./prisma/dev.db`)
- `NOTIFY_ENABLED` (`false` by default)
- Telegram / Email settings

## Prisma
SQLite database with schema in `prisma/schema.prisma`.
Run migrations:
```bash
npx prisma migrate dev --name init
```
Seed sample data:
```bash
npx tsx scripts/dev-seed.ts
```

## CLI
`npm run once` accepts:
- `--since "YYYY-MM-DDTHH:mm:ssZ"`
- `--lookback-min <int>`
- `--dry-run`

## Error recovery & limits
- High‑water mark `last_seen_posted_at` stored in `Meta` table. On restart the service fetches jobs posted since that time minus safety buffer (default 10 minutes).
- API errors and rate limits retried with exponential backoff (max 5 retries).
- Input to LLM is truncated to avoid token limits.
- Do not cache jobs >24h and respect Upwork/OpenAI rate limits.
