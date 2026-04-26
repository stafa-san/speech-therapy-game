# Deployment & Environment Setup

This is the runbook for taking Habla Juega from "demo on Vercel preview" to "real, signed-in therapists creating real assignments." Follow it top-to-bottom; each section sets up one external service and the env vars that go with it.

The app gracefully degrades — every step you skip becomes a feature that's unavailable, not a deploy failure. So you can do this incrementally.

## Quick map

| Step | Service                            | Adds                                              | Time   |
| ---- | ---------------------------------- | ------------------------------------------------- | ------ |
| 0    | Vercel project (already exists)    | Deploys on every push to `main` and `dev`         | —      |
| 1    | Neon Postgres                      | Real word lists, assignments, sessions            | ~5 min |
| 2    | Clerk                              | Therapist sign-in, dashboard, sending assignments | ~5 min |
| 3    | Cron secret                        | Daily 90-day session cleanup (§8.2 retention)     | ~1 min |
| 4    | (later) Stripe                     | Pro tier, billing                                 | PR 14  |
| 5    | (later) Pexels / R2 / Azure Speech | Custom list builder, real images, TTS audio       | PR 15  |

All env vars below go into **Vercel → Project → Settings → Environment Variables**. Set them for **Production**, **Preview**, **Development** (or just Production+Preview for secrets you don't want to mirror to local previews).

## 0 · The current demo deploy

What works **without any env vars**:

- `/` — marketing landing with three buttons (game demo, browse lists, therapist view)
- `/play/<anything>` — full Feed the Shark game with the first dummy /r/ list
- `/lists` — chip-filter browser of the 12 dummy SLP-vetted lists from `@habla/db` seeds
- `/lists/[slug]` — list detail + the disabled "Mandar a familia" button
- `/dashboard` — placeholder cards
- `/assignments` — shows "Modo demo" empty state (the API returns `UNAUTHORIZED` without Clerk; the UI handles it)

What's gated:

- "Mandar a familia" → the dialog opens but `assignments.create` will fail without auth + DB.
- `/sign-in`, `/sign-up` — render Clerk's hosted components but those throw without keys.
- `/api/webhooks/clerk` — returns 500 with "CLERK_WEBHOOK_SECRET not configured".
- `/api/cron/delete-old-sessions` — returns 500 with "CRON_SECRET not configured" in production.

## 1 · Neon Postgres (database)

1. Create a project at https://console.neon.tech/.
2. In the project dashboard, copy two connection strings:
   - **Pooled connection** (looks like `…-pooler.…neon.tech`) → `DATABASE_URL`
   - **Direct connection** (no `-pooler`) → `DIRECT_URL`
     The pooled URL is what the app uses at request time; the direct URL is what `prisma migrate` uses (migrations need a real connection, not pgbouncer).
3. Add both to Vercel as env vars.
4. From your local machine, with the same values in `apps/web/.env.local`:
   ```bash
   pnpm --filter @habla/db migrate:dev --name init
   pnpm --filter @habla/db seed
   ```
   This creates the schema and loads 12 phonemes + 3 games + 12 dummy word lists. The seeder refuses to load dummy data when `NODE_ENV=production` or when `DATABASE_URL` matches the production heuristic (§2.4 Project.md).

After this:

- `/lists` keeps working (the read endpoints still hit the static seed array as a fallback today; PR 13 will switch them over to DB-backed reads).
- `assignments.create` and `play.byToken` start working — but only after Clerk is wired (§2 below).

### Verification

```bash
curl https://<your-domain>/api/health
# → { "status": "ok", "version": "…" }
```

A successful Neon connection shows up in the Vercel deployment logs as `[@habla/db] connected`.

## 2 · Clerk (therapist auth)

1. Create an application at https://dashboard.clerk.com/.
2. Choose providers (Email + Google is fine to start). Disable username/password if you want passwordless only.
3. From the **API Keys** page, copy:
   - `Publishable key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `Secret key` → `CLERK_SECRET_KEY`
4. Set these optional redirect overrides (all are URL paths, not full URLs):
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard`
5. **Add the webhook** so a Therapist row gets created when someone signs up:
   - In Clerk: **Webhooks → Add Endpoint**.
   - URL: `https://<your-domain>/api/webhooks/clerk`
   - Subscribe to: `user.created` (and optionally `user.updated`).
   - Copy the **Signing Secret** → `CLERK_WEBHOOK_SECRET` in Vercel.

Redeploy once the keys are in. You'll see:

- `/dashboard`, `/lists`, `/assignments`, `/settings`, `/api/trpc/*` are now Clerk-gated. Visitors get redirected to `/sign-in`.
- The "Modo demo" badge in the sidebar disappears.
- Signing up triggers the webhook → a row in `Therapist` table.

### Test the webhook locally

Clerk lets you replay events from the dashboard. After deploy, sign up a test user, then in Clerk **Webhooks → your endpoint → Recent deliveries**, expand the `user.created` event and confirm a `200 OK`. If you get `401`, the signing secret is wrong; if `500`, check Vercel function logs.

## 3 · Cron secret (90-day session cleanup)

The session retention sweep at `/api/cron/delete-old-sessions` is wired up in `apps/web/vercel.json`:

```json
"crons": [{ "path": "/api/cron/delete-old-sessions", "schedule": "0 3 * * *" }]
```

It deletes any `AssignmentSession` row older than 90 days (Project.md §8.2).

To prevent a leaked URL from draining the table, the route requires a `Bearer` token:

1. Generate a strong random string:
   ```bash
   openssl rand -base64 32
   ```
2. Add it to Vercel as `CRON_SECRET` (Production scope only).

Vercel automatically attaches `Authorization: Bearer $CRON_SECRET` to scheduled requests.

### Verification

After the next 03:00 UTC run, check **Vercel → Project → Logs → Crons**:

```
GET /api/cron/delete-old-sessions 200 → { ok: true, deleted: 0, cutoff: "…" }
```

## 4 · (Later) Stripe — Pro billing

Lands with PR 14. Env vars to provision **before** that PR is needed:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_ID_MONTHLY`
- `STRIPE_PRICE_ID_YEARLY`

Webhook endpoint will be `/api/webhooks/stripe`, subscribed to `checkout.session.completed`, `customer.subscription.{created,updated,deleted}`, `invoice.payment_failed`.

## 5 · (Later) Custom-list media pipeline (PR 15)

- `PEXELS_API_KEY` — image search.
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` — Cloudflare R2 (image storage).
- `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION` — Azure Speech TTS for the audio button.

## All env vars at a glance

```bash
# === Required for any DB-backed feature ===
DATABASE_URL=postgres://...-pooler.neon.tech/...
DIRECT_URL=postgres://...neon.tech/...

# === Required for therapist sign-in ===
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# === Required for the daily cron ===
CRON_SECRET=<openssl rand -base64 32>

# === PR 14 (Stripe billing) ===
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...

# === PR 15 (custom list media pipeline) ===
PEXELS_API_KEY=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=habla-juega
R2_PUBLIC_URL=https://media.hablajuega.com
AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=eastus

# === Optional ===
NEXT_PUBLIC_APP_URL=https://hablajuega.com
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

## Rollback / "I broke it" cheat sheet

- **App returns 500 on every request after adding Clerk**: the publishable key didn't propagate to the client bundle. Trigger a redeploy (the env vars marked `NEXT_PUBLIC_*` are baked at build time, not runtime).
- **`assignments.create` fails with "Therapist record not found"**: the Clerk webhook hasn't fired yet. In Clerk dashboard → Webhooks → your endpoint → "Send test event" with type `user.created`, payload your real user id.
- **Cron job logs show `401`**: `CRON_SECRET` mismatch. Vercel auto-attaches it from the env var; just re-save it in the env vars panel and redeploy.
- **Player route shows the Modo demo /r/ list even though I created a real assignment**: the demo fallback in `/play/[token]` is still active. PR 13 will switch the page to `getPlayCaller().play.byToken({ token })`. Until then, real and demo tokens both render the demo list — they just persist sessions correctly when the DB is connected.
