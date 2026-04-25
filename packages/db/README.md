# `@habla/db`

Prisma client + schema + seed scaffolding. Backed by Neon Postgres via the Prisma serverless adapter so the client is fast on Vercel cold starts and doesn't require `pgbouncer` middlemen.

## Local dev

```bash
# 1. Set DATABASE_URL + DIRECT_URL in apps/web/.env.local (use a Neon dev branch).
pnpm --filter @habla/db generate
pnpm --filter @habla/db migrate:dev
pnpm --filter @habla/db seed
```

The seed runner upserts phonemes (12 entries) and games (3), then loads dummy word lists. **Dummy lists are skipped** when `NODE_ENV=production` or when `DATABASE_URL` looks like prod (heuristic: matches `prod`, `hablajuega.com`).

## Schema highlights — see Project.md §5 for the full spec

- `Therapist` mirrors a Clerk user; `clerkUserId` is the join key.
- `Phoneme` is a small static table (12 rows) — driven by `src/seed/phonemes.ts`.
- `WordList.isDummyData` flag — production seed refuses anything with this set.
- `Assignment.token` is the only secret in the family share URL.
- `AssignmentSession` is **aggregate-only** — no IP, UA, geo. Auto-deleted by the daily cron after 90 days. See `docs/coppa-compliance.md`.
- `WebhookEvent` is the idempotency log for Stripe + Clerk inbound webhooks.
- `AuditLog` captures therapist-side actions (assignment created / list deleted / etc.).

## Adding a model

1. Edit `prisma/schema.prisma`.
2. `pnpm --filter @habla/db migrate:dev --name <verb_noun_context>`.
3. Update `docs/data-model.md` (Project.md §14.4 rule).
4. If the new model holds anything that could be tied to a child, **flag it in the PR** and update `docs/coppa-compliance.md`.
