# `@habla/api`

tRPC v11 routers — the API surface for the web app and (later) the Expo app.

## Layers

```
@habla/api
├── trpc.ts          ← initTRPC, procedure builders (public/therapist/pro)
├── context.ts       ← Context type + createContext factory
├── schemas.ts       ← Zod validators shared across routers
├── routers/
│   ├── phonemes.ts       (public, cached)
│   ├── games.ts          (public, cached)
│   ├── wordLists.ts      (public read; pro write)
│   ├── therapist.ts      (therapist-only)
│   ├── assignments.ts    (therapist-only)
│   ├── play.ts           (PUBLIC, COPPA-strict, no studentLabel)
│   ├── billing.ts        (therapist; Stripe in PR 14)
│   └── media.ts          (therapist + pro; Pexels/R2/Azure in PR 15)
└── root.ts          ← appRouter
```

## Procedure ladder

- `publicProcedure` — anyone, including the family player surface.
- `therapistProcedure` — requires Clerk session + a Therapist row.
- `proProcedure` — therapist + `planTier === 'pro'`.

## COPPA invariants (Project.md §8)

- The `play` router never selects `Assignment.studentLabel`. The static select
  clauses in `routers/play.ts` are the gate.
- `startSession` / `updateSession` only persist `trialsCompleted` + timestamps.
  No IP, UA, geo, fingerprint.

## What's stubbed today

This package ships in PR 6 with public read endpoints (phonemes, games,
wordLists.list/byId) backed by `@habla/db` static seed data. Mutating routes
throw `METHOD_NOT_SUPPORTED` until the DB + Clerk wiring lands in subsequent
PRs (7, 9, 12, 14, 15).
