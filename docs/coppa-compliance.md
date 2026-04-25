# COPPA Compliance — Habla Juega

> The amended COPPA Rule's compliance deadline was **April 22, 2026**. This document is the source of truth for how we comply. Anyone touching `/play/[token]`, `apps/web/src/features/player/`, `packages/api/src/routers/play.ts`, or middleware that runs on those paths **must** read this and follow it.

## Position

Habla Juega is an EdTech service directed at children under 13. We design to **collect no PII from children at all** — that is the simplest compliant path and the path we are committed to.

## Hard rules (enforced in code)

1. **Children never create accounts.** Family access is via assignment-link tokens (`Assignment.token`) only.
2. **No persistent identifiers from a child's browser.** No cookies set by the player route except a strictly-necessary in-memory session cookie that clears on tab close (the `sessionId` for `AssignmentSession` aggregates).
3. **No third-party SDKs on the player route.** No GA, Meta pixel, Hotjar, PostHog, Sentry session replay, Segment, or anything else that could persist or transmit identifiers.
4. **No IP addresses logged from the player route.** Middleware on `/play/*` and `/api/play/*` strips IP-bearing headers (`x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`, `true-client-ip`) before they reach handlers. Sentry is configured to drop events from these routes.
5. **Aggregate-only session analytics.** `AssignmentSession` stores `assignmentId`, `startedAt`, `completedAt`, `trialsCompleted` — and **never** IP, UA, fingerprint, geo, or `studentLabel`.
6. **No behavioral advertising.** No ad networks at all on this product.
7. **No AI on child input.** Even when we add pronunciation feedback later, the 2026 rule requires separate explicit parental consent for AI processing of child speech. v1 has zero AI processing of child input.
8. **Auto-deletion.** `AssignmentSession` rows older than 90 days are deleted by the Vercel Cron at `/api/cron/delete-old-sessions` daily at 03:00 UTC.
9. **De-identification of `studentLabel`.** The therapist's label for a student (e.g., "María G.") is stored on `Assignment` but **the play route never selects it**. Enforced at the tRPC router level — `play.byToken` explicitly omits `studentLabel` from its select clause.
10. **Rive telemetry off.** Rive's runtime telemetry is disabled on the player route via the Rive wrapper component.
11. **Bundle scan.** A test (`apps/web/tests/coppa.spec.ts`) builds `/play/[token]` and greps the resulting bundle for known tracker domains; CI fails if any are found.

## What we collect, and from whom

- **Therapists (adults):** email, full name (via Clerk), payment info (via Stripe — we never see the card). Standard adult B2B data.
- **Children / families:** **nothing personal.** Only aggregate `AssignmentSession` rows — `assignmentId`, timestamps, trial counts.

## Data flow diagram

```
Therapist (logged in via Clerk)
  └─> creates Assignment(token, wordListId, gameId, studentLabel?)
        ├─> studentLabel stays in DB, scoped to therapist
        └─> token shared with family via copy-link

Family (no auth) opens https://hablajuega.com/play/{token}
  ├─> middleware: strip IP-bearing headers
  ├─> Edge runtime fetches Assignment by token (NO studentLabel field selected)
  ├─> Renders <PlayerShell> with no analytics/replay/3p SDKs
  └─> POST /api/play/session
        └─> AssignmentSession(assignmentId, startedAt, completedAt?, trialsCompleted)
              └─> NO IP, UA, fingerprint, geo, or label persisted
              └─> Deleted by daily cron after 90 days
```

## Required documents (built / pending)

- [ ] `/privacy` page (English + Spanish) with a children's-privacy section.
- [ ] `/terms` page.
- [ ] DPA template for school district customers (Phase 9+).
- [x] This document (`docs/coppa-compliance.md`) — the internal data-flow source of truth.

## Features that require a privacy review before they ship

These features could pull us toward identifiers; do not implement without sign-off and (where applicable) verifiable parental consent:

- Voice recording from the child
- Speech-to-text on child speech
- Saved game scores tied to a named child
- Push notifications
- Cross-device session linking
- Any AI/ML on child input
- Streaks, leaderboards, or any identifier-shaped engagement loop
- A/B testing on the player route
- Server logs that include request bodies from `/api/play/*`

## Engineering checklist for any PR touching the player surface

Every PR's description includes the COPPA checklist (`/.github/PULL_REQUEST_TEMPLATE.md`). Reviewers must verify the answers before approving:

- Does this change touch `/play/[token]` or anything used by it?
- Does this change collect, store, or transmit any data that could come from a child?
- Does this change add a third-party SDK, script, pixel, or analytics call to any route reachable from `/play/[token]`?

If any answer is yes, the PR must explain the mitigation and link to the relevant section above.

## Reference

- FTC COPPA rule: https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa
- 2025 Final Rule (effective 2026-04-22): https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule
