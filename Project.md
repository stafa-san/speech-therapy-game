# CLAUDE.md — Habla Juega (working name)

> **Duolingo for Spanish speech therapy practice.** SLP-vetted articulation word lists across all Spanish phonemes, paired with delightful, animated mini-games. Therapists assign work; families play it at home. Web first, native app next.

> **Project Brief v1.0 · Last Updated: April 2026 · Current Status: Pre-development (planning complete)**

This file is the source of truth for Claude Code in this repo. Read it fully before starting any task. When you finish a meaningful unit of work, update §17 Progress Log and the relevant section's status.

---

## 1. Product Vision

### 1.1 The problem
Spanish-speaking children in speech therapy in the US (and globally) have very few digital practice tools in their language. Pink Cat Games — the closest analog — is English-first; Spanish word lists on it are sparse, user-uploaded, and not vetted by a licensed SLP. Families who don't speak English can't navigate the platform with their child. Bilingual SLPs spend hours each week building Spanish materials from scratch.

### 1.2 The product
A web app (Vercel) where:
1. **A therapist signs up** (free or Pro tier).
2. **They pick a target sound** (e.g., /r/, /rr/, /s/, /l/, /ch/, /k/) and a **word position** (initial, medial, final).
3. **They get a curated, SLP-vetted word list** with native Spanish images and audio.
4. **They pick a game** and assign it to a child.
5. **They send a single link** to the family. No login required for the child to play.
6. **In each game turn**, the child sees/hears the target word, says it, and taps to advance — Duolingo-style satisfying feedback throughout.
7. **Pro therapists** can build custom word lists, upload images, and reuse them across all games.

### 1.3 Why we win
- **No real Spanish-first competitor.** Pink Cat Games is English-first; Spanish content is crowd-sourced and unvetted.
- **Therapist time saved.** Pre-made, vetted lists by phoneme + position is the fastest path to "no-prep" therapy.
- **Family accessible.** Spanish UI for parents and kids; English UI for therapists (toggle).
- **The feel.** Duolingo-grade polish — Rive animations, haptics on mobile, satisfying micro-interactions. Pink Cat Games looks like 2014. We look like 2026.
- **Recurring revenue.** SLPs already pay $50–60/yr for Pink Cat Games; same audience pays for Spanish-first.

### 1.4 Non-goals (v1)
- **Not** a teletherapy platform. No video, no live sessions.
- **Not** a screener or assessment tool. No standardized test logic.
- **Not** a marketplace for other SLPs to sell content (later, maybe).
- **Not** a kid-account product. Children play via assignment links; we don't store child accounts.

### 1.5 Positioning
**Hyper-clean. Spanish-first. Animated. Therapist-trusted. Family-friendly.** Web-native MVP, Expo app to follow.

---

## 2. Phoneme & Content Model (the heart of the product)

This part has to be right. The founder (licensed SLP) validates every seed word list herself — that's the moat.

### 2.1 Spanish phonemes we'll target

Based on McLeod & Crowe (2018) norms; Latin American Spanish (Mexican dialect default; flag dialect variants where relevant). Initial seed targets, in order of how commonly they're worked on in therapy:

| Phoneme | IPA | Positions | Notes |
|---|---|---|---|
| /r/ (single tap) | ɾ | initial, medial, final | Often substituted for /rr/ |
| /rr/ (trill) | r | initial, medial | One of the latest-acquired sounds |
| /s/ | s | initial, medial, final | Dialect variation (Spain vs LatAm) |
| /l/ | l | initial, medial, final | |
| /k/ | k | initial, medial | spelled `c` before a/o/u, `qu` before e/i |
| /g/ | g | initial, medial | |
| /f/ | f | initial, medial | rarely final in Spanish |
| /ch/ | tʃ | initial, medial | |
| /ñ/ | ɲ | medial | rarely initial |
| /j/ | x | initial, medial | spelled `j` or `g` (before e/i) |
| L-blends | bl, cl, fl, gl, pl | initial, medial | |
| R-blends | br, cr, dr, fr, gr, pr, tr | initial, medial | |

Early-developing sounds (b, p, m, t, d, n) are **omitted from the seed library** — rarely targeted in therapy and they clutter the picker. Therapists can still build custom lists for them.

### 2.2 Word list shape
Every seed list has:
- `phonemeId` (FK)
- `position` (initial / medial / final)
- `difficultyTier` (1 = CV/CVCV simple, 2 = CVC/multisyllabic, 3 = blends/complex)
- `words[]` — 20–30 per list to support multiple game rounds

Each word has:
- `text` — Spanish word, lowercase
- `textEn` — English gloss for monolingual SLPs
- `ipa` — phonetic transcription
- `imageUrl` — CDN-hosted, never hotlinked
- `audioUrl` — TTS or recorded
- `targetPhonemeId`
- `position`
- `dialectNotes` — nullable (e.g., "in some dialects pronounced as 'sapato'")

### 2.3 Seed list sources (legal — do not scrape)
- **Speech is Beautiful** (free, with email signup) — https://speechisbeautiful.com/2018/01/spanish-articulation-word-lists-speech-therapy/
- **Colorado DOE phoneme guide** — https://www.cde.state.co.us/coloradoliteracy/phonemesimilaritiesinenglishandspanish
- **MultiCSD Spanish (Latin American Standard)** — https://sites.google.com/view/multicsd/global-languages/spanish-

> **Rule:** the founder writes/curates every seed list herself, or works from public-domain sources. We are **not** republishing copyrighted decks (TpT, Talking with Rebecca, etc.). The original SLP-vetted library is the moat.

### 2.4 Dummy data for development
Until real lists are produced, we use clearly-marked dummy data in `packages/db/src/seed/dummy/*.json`. Every dummy word list has:
```json
{
  "isSeed": true,
  "isReviewed": false,
  "reviewer": null,
  "_dummyData": true
}
```
Any list with `_dummyData: true` shows a small "Vista previa de desarrollo" badge in non-production environments and is **excluded from the production seed**. The seeder script refuses to run against the production DB if any dummy lists are detected. This is enforced in `packages/db/src/seed/index.ts`.

---

## 3. User Personas & Flows

### 3.1 Therapist (primary buyer)
Bilingual or monolingual SLP, school-based or private practice, sees 20–50 students/week, several of whom are Spanish-dominant. Currently pieces together Pink Cat Games + her own Word docs. **Will pay $5–10/month.**

**Critical flows:**
1. Sign up → email verify → land on dashboard.
2. **Quick play** (no setup): pick sound + position → pick game → click Play. Working in under 30 seconds.
3. **Assign to family**: pick list + game → click "Send to family" → copy link → paste in email/text.
4. **(Pro) Build custom list**: name it, pick phoneme/position, type words, choose stock images or upload, save.
5. View basic usage: "Maria's family opened the link 4 times this week."

### 3.2 Family / child (player, never pays)
Parent receives a link from the therapist. Opens on tablet/phone/laptop. **No login.** Spanish UI by default. Plays the game with the child.

**Critical flows:**
1. Open link → see "¡Hola! Vamos a practicar la /r/" → tap **Empezar**.
2. Play through game; each turn: target word + image + audio button. Parent prompts child to say it. Tap to advance. Rive animation rewards the turn.
3. End-of-game reward animation. Option to play again, or try a different game with the same list.

### 3.3 Admin (you)
- Curate phoneme library and seed word lists.
- Monitor signups, MRR, churn.
- Moderate user-uploaded images.

---

## 4. Tech Stack

> **Important — stack rationale.** The previous draft of this brief used a .NET API (founder's preferred language). We're flipping that. Vercel doesn't run .NET; splitting into a separate C# API would mean two hosting providers, two deploy pipelines, and CORS overhead — not worth it for an MVP. **Stack is now TypeScript end-to-end** (Next.js full-stack on Vercel, with Expo to follow), which:
> - Deploys to Vercel in one click
> - Shares types between web and (future) Expo app via `@habla/api` package
> - Plays cleanly with Rive's React runtime
> - Matches the architectural pattern you used for Happy Hour Haven (monorepo, shared packages, Next.js admin)
>
> If at any point we genuinely need a long-running C# service (e.g., heavy audio processing), we can add it as a separate Azure Functions deployment and call it from Next.js. We're not doing that on day one.

### 4.1 Stack summary

| Layer | Choice | Why |
|---|---|---|
| Monorepo | **Turborepo + pnpm workspaces** | Vercel-native; same model as Happy Hour Haven. |
| Web app | **Next.js 15** (App Router, RSC) + **TypeScript** | Therapist dashboard + family player + marketing all in one. |
| Mobile app (later) | **Expo SDK 54** + React Navigation | Standalone (excluded from workspaces, lessons learned from Happy Hour Haven). |
| API layer | **tRPC v11** inside Next.js route handlers | End-to-end type safety; Expo can hit the same routes. |
| Database | **PostgreSQL 16** on **Neon** | Serverless, scales to zero, free tier covers MVP. |
| ORM | **Prisma** | Type-safe; Drizzle is fine but Prisma's tooling is more mature. |
| Auth | **Clerk** | Therapist auth done in 30 minutes. Has Spanish locale. Free tier covers MVP. **Children never touch auth** — link tokens only (see §8). |
| Validation | **Zod** | Shared between client and tRPC routers. |
| State (client) | **TanStack Query** (via tRPC) + **Zustand** for ephemeral UI | Same pattern as Happy Hour Haven. |
| UI | **Tailwind CSS v4** + **shadcn/ui** | Composable, fast. |
| Animations (showcase) | **Rive** (`@rive-app/react-canvas`) | Game rewards, character reactions, end-of-game celebrations. |
| Animations (UI) | **Framer Motion** | Page transitions, micro-interactions outside Rive canvases. |
| Game scenes | **Phaser 3** (lazy-loaded, web-only) | Canvas-based games (Feed the Shark, etc.). |
| Sound effects | **Howler.js** | UI sounds (correct/incorrect, button taps). |
| i18n | **next-intl** | Spanish (default for player) + English (therapist dashboard). |
| TTS (audio for words) | **Azure Speech** (`es-MX-DaliaNeural`) | Cached to R2; cheap. |
| Images | **Pexels API** for stock + **Cloudflare R2** for hosting + **Next.js Image** for serving | Copyright-safe, fast. |
| Payments | **Stripe Billing** via `stripe-node` SDK | Hosted Checkout for v1. |
| Email | **Resend** + **React Email** | Transactional. |
| Hosting | **Vercel** (web), **Neon** (DB), **Cloudflare R2** (images/audio), **Clerk** (auth) | All free tier for MVP. |
| Analytics | **PostHog** for therapist dashboard, **NOTHING** on the player route | See §8 (COPPA). |
| Errors | **Sentry**, with player route excluded from session replay & IP capture | See §8. |
| CI/CD | **GitHub Actions** + Vercel auto-deploys | Standard. |

### 4.2 Repo layout (monorepo)

```
habla-juega/
├── apps/
│   ├── web/                # Next.js 15 — therapist dashboard + family player + marketing
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (marketing)/        # Landing, pricing, about
│   │   │   │   ├── (therapist)/        # Auth-gated dashboard
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── lists/
│   │   │   │   │   ├── assignments/
│   │   │   │   │   └── settings/
│   │   │   │   ├── play/
│   │   │   │   │   └── [token]/        # Public family player — COPPA-strict
│   │   │   │   ├── api/
│   │   │   │   │   ├── trpc/[trpc]/
│   │   │   │   │   └── webhooks/stripe/
│   │   │   │   └── layout.tsx
│   │   │   ├── features/
│   │   │   │   ├── therapist-dashboard/
│   │   │   │   ├── word-lists/
│   │   │   │   ├── assignments/
│   │   │   │   └── player/             # The family-facing player
│   │   │   ├── games/                  # One folder per game
│   │   │   │   ├── _shared/            # GameShell, useGameSession, etc.
│   │   │   │   ├── feed-the-shark/
│   │   │   │   ├── build-a-monster/
│   │   │   │   └── la-ruleta/
│   │   │   ├── components/             # shadcn/ui + custom
│   │   │   ├── lib/
│   │   │   ├── hooks/
│   │   │   └── styles/
│   │   ├── public/
│   │   │   ├── rive/                   # .riv animation files
│   │   │   ├── audio/sfx/              # UI sound effects
│   │   │   └── images/
│   │   ├── messages/                   # next-intl
│   │   │   ├── es.json
│   │   │   └── en.json
│   │   └── package.json
│   └── mobile/             # (Phase 8+) Expo app — STANDALONE, not in workspaces
│       └── README.md       # placeholder for now
├── packages/
│   ├── api/                # tRPC routers, Zod schemas, types
│   │   ├── src/
│   │   │   ├── routers/
│   │   │   ├── schemas/
│   │   │   └── trpc.ts
│   │   └── package.json
│   ├── db/                 # Prisma schema, migrations, seed scripts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   └── seed/
│   │   │       ├── index.ts
│   │   │       ├── phonemes.ts
│   │   │       └── dummy/                 # marked _dummyData: true
│   │   └── package.json
│   ├── ui/                 # Shared design tokens + a few cross-app components
│   ├── rive/               # Wrapped Rive components: <RiveReward />, <RiveMascot />
│   ├── i18n/               # Shared message keys (in case mobile reuses)
│   └── config/             # Shared eslint, tsconfig, tailwind preset
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── CLAUDE.md               # ← this file
```

**Implementation notes:**
- `apps/mobile` is a placeholder until Phase 8. **It is excluded from pnpm workspaces** (lessons from Happy Hour Haven — Expo doesn't play with workspaces cleanly). When we add it, its own README documents how to run.
- Local dev: `pnpm dev` runs Turbo, which runs Next.js + DB + emulators.
- Vercel deploys `apps/web` directly. Each preview deploy gets its own Neon branch (Neon's preview branching).

### 4.3 Architectural rules Claude Code must respect
- **The `play/[token]` route is sacred.** No analytics SDKs, no third-party scripts, no IP logging, no cookies except a strictly-necessary session cookie. See §8.
- **tRPC routers are the API.** Don't put business logic in route components. Don't fetch directly from Prisma in client components.
- **Game scenes are isolated.** Each game in `apps/web/src/games/{slug}/` exposes one component with a strict prop contract (§6.6). They own their own Phaser/Rive instance and clean up on unmount.
- **Rive components live in `packages/rive/`.** Wrapped, lazy-loaded, with a Suspense fallback. Never inline a `<Rive>` in a feature component without going through the wrapper.
- **No business logic in render.** No date math in JSX. No filtering during render. Memoize, use `useMemo`, push it into selectors or server.

---

## 5. Data Model (Postgres / Prisma)

```prisma
// packages/db/prisma/schema.prisma — abridged

model Therapist {
  id              String    @id @default(cuid())
  clerkUserId     String    @unique  // Clerk handles auth; we mirror minimal state
  email           String    @unique
  fullName        String
  locale          Locale    @default(en)
  stripeCustomerId String?  @unique
  planTier        PlanTier  @default(free)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  wordLists       WordList[]
  assignments     Assignment[]
  subscription    Subscription?
}

model Phoneme {
  id            Int        @id
  symbol        String     // e.g., "/r/", "/rr/", "/s/"
  ipa           String
  displayNameEs String
  displayNameEn String
  sortOrder     Int

  wordLists     WordList[]
}

model WordList {
  id                 String       @id @default(cuid())
  name               String
  description        String?
  phonemeId          Int
  phoneme            Phoneme      @relation(fields: [phonemeId], references: [id])
  position           Position
  difficultyTier     Int          // 1 | 2 | 3
  isSeed             Boolean      @default(false)
  isReviewed         Boolean      @default(false)  // SLP-reviewed
  reviewer           String?      // SLP credentials (e.g., "Maria Lopez, M.S., CCC-SLP")
  ownerTherapistId   String?      // null when isSeed=true
  ownerTherapist     Therapist?   @relation(fields: [ownerTherapistId], references: [id])
  locale             String       @default("es")
  // dummy data flag, dev-only — see §2.4
  isDummyData        Boolean      @default(false)
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt

  words              Word[]
  assignments        Assignment[]

  @@index([phonemeId, position, difficultyTier])
}

model Word {
  id              String    @id @default(cuid())
  wordListId      String
  wordList        WordList  @relation(fields: [wordListId], references: [id], onDelete: Cascade)
  text            String
  textEn          String?
  ipa             String?
  position        Position
  imageUrl        String?
  audioUrl        String?
  dialectNotes    String?
  sortOrder       Int

  @@index([wordListId])
}

model Game {
  id          Int      @id
  slug        String   @unique  // 'feed-the-shark', 'build-a-monster', 'la-ruleta'
  nameEs      String
  nameEn      String
  minTrials   Int
  maxTrials   Int
  isFreeTier  Boolean  @default(false)

  assignments Assignment[]
}

model Assignment {
  id             String     @id @default(cuid())
  token          String     @unique  // URL-safe, 22+ chars, unguessable
  therapistId    String
  therapist      Therapist  @relation(fields: [therapistId], references: [id])
  wordListId     String
  wordList       WordList   @relation(fields: [wordListId], references: [id])
  gameId         Int
  game           Game       @relation(fields: [gameId], references: [id])
  studentLabel   String?    // therapist's label, e.g., "Maria G." — NEVER sent to /play route
  createdAt      DateTime   @default(now())
  expiresAt      DateTime?
  isRevoked      Boolean    @default(false)

  sessions       AssignmentSession[]

  @@index([therapistId])
}

// Aggregate-only. Anonymous. No IP, UA, or fingerprint. See §8.
model AssignmentSession {
  id                String     @id @default(cuid())
  assignmentId      String
  assignment        Assignment @relation(fields: [assignmentId], references: [id], onDelete: Cascade)
  startedAt         DateTime   @default(now())
  completedAt       DateTime?
  trialsCompleted   Int        @default(0)

  @@index([assignmentId, startedAt])
}

model Subscription {
  id                    String    @id @default(cuid())
  therapistId           String    @unique
  therapist             Therapist @relation(fields: [therapistId], references: [id])
  stripeSubscriptionId  String    @unique
  status                String    // 'active' | 'trialing' | 'past_due' | 'canceled'
  currentPeriodEnd      DateTime
  priceId               String
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

enum Locale { en es }
enum PlanTier { free pro }
enum Position { initial medial final mixed }
```

**Key invariants:**
- `WordList.isSeed = true` → `ownerTherapistId IS NULL`, read-only to therapists.
- Custom lists (Pro tier only) → `ownerTherapistId NOT NULL`, visible only to owner.
- `Assignment.token` is the only secret in the share link. Generate via:
  ```ts
  import { randomBytes } from 'crypto';
  const token = randomBytes(16).toString('base64url'); // ~22 chars, URL-safe
  ```
- `AssignmentSession` rows are anonymous. **No IP, no UA, no fingerprint.** Auto-deleted after 90 days by a daily Vercel Cron.

---

## 6. Feature Spec (v1 scope)

### 6.1 Therapist auth
- Clerk (email + password, magic link, social) handles signup/login.
- On first login, `therapist.created` webhook creates the local `Therapist` row.
- Email verification handled by Clerk.

### 6.2 Therapist dashboard (Duolingo-inspired layout)
- **Home**: "Hola, {name}" header + Pro badge if applicable. Below: a hero "Quick play" card (sound → position → game → Play) and a recent-assignments list.
- **Lists**: browse/filter seed library; on Pro, manage custom lists.
- **Assignments**: table with student label, list, game, copy-link button, opens count, last opened, revoke.
- **Settings**: locale toggle, billing portal link.

The dashboard uses a **soft, friendly aesthetic** with one Rive mascot character ("Lola" the parrot, working name) that reacts to state — celebrates when a list is completed, naps when there are no active assignments, etc. Mascot lives in `packages/rive/src/RiveMascot.tsx`.

### 6.3 Word list browser
- Filter by phoneme + position + difficulty.
- List card: name, phoneme badge, position chip, word count, sample image, "SLP-reviewed" check if `isReviewed=true`.
- Click → preview screen with all words, images, audio playback.
- Pro therapists see "Duplicate to my lists" to fork seed lists.

### 6.4 Custom list builder (Pro only)
- Step 1: name, phoneme, position, difficulty.
- Step 2: add words. For each: text, optional English gloss, image (built-in Pexels search OR upload), audio (auto-TTS or upload).
- Built-in image search: query Pexels API → user picks → we cache to R2. **Never hotlink.**

### 6.5 Audio
- **v1**: TTS for every seed word using Azure Speech `es-MX-DaliaNeural`. Cache to R2. ~$16/M chars; entire seed library is well under that.
- **v1**: Custom words → lazy-generate TTS on save.
- **v1.1**: SLP partner records authoritative pronunciations for high-traffic lists.

### 6.6 Games — the Duolingo feel

**Three games ship in v1.** Each is a self-contained module under `apps/web/src/games/{slug}/` with a strict contract:

```ts
// apps/web/src/games/_shared/game-contract.ts
export type GameProps = {
  wordList: { id: string; words: Word[] };
  config: { trials: number };
  onTrialComplete: (wordId: string) => void;
  onGameComplete: (stats: { trialsCompleted: number; durationMs: number }) => void;
};
```

All games share a **`<GameShell>`** that:
- Loads via the `/play/[token]` page
- Renders an intro: "¡Vamos a practicar la /r/!" + Rive parrot waving + Empezar button
- Mounts the chosen game
- Each turn: shows target word + image + 🔊 button → child says it → adult taps to advance → game scene reacts → Rive micro-celebration
- End screen: full-canvas Rive celebration + "¡Otra vez!" / "Otro juego con esta lista"

**Games:**

1. **Alimenta al Tiburón** (Feed the Shark) — Phaser canvas. Tap a food, target word appears, say it, tap to feed → shark animation eats it. 10 trials. Reward Rive plays at end.
2. **Arma el Monstruo** (Build a Monster) — Pure Rive, state-machine driven. Each correct trial adds a feature (eyes, hat, tail) to a Rive monster character. 8–12 trials. The monster waves at the end.
3. **La Ruleta** (Spin the Wheel) — Hybrid: spin animation in Rive, content layer in React/Tailwind. Spin → land on a word → say it → win points. Variable trials, supports 2-player turns.

**Why Rive instead of just Lottie/CSS?** Rive's state machines let one character respond to dozens of events (correct, incorrect, idle, celebrate, encourage) without us swapping animation files. The runtime is ~78KB WASM; we lazy-load it on the player route only. Rive integrates with React via `@rive-app/react-canvas` (recommended over WebGL2 for our use case — smaller bundle, no Vector Feathering needed).

### 6.7 Assignment links
- Therapist clicks "Send to family" on a list+game → backend creates Assignment with token → returns `https://hablajuega.com/play/{token}`.
- Public route, no auth.
- Token can be revoked any time (soft-delete via `isRevoked`).
- Optional expiration date.
- **Rate-limited** (Upstash Redis or Vercel KV) per token to prevent abuse.

### 6.8 Billing
- **Free tier**: all seed lists, 3 games, unlimited assignments.
- **Pro tier ($7/month or $60/year)**: custom word lists, image upload, all games (including future ones), basic usage analytics, Rive mascot personalization.
- Stripe Checkout (hosted) for v1.
- Webhook at `POST /api/webhooks/stripe`.
- Customer Portal for plan changes / cancellations.

---

## 7. API Surface (tRPC routers)

All under `packages/api/src/routers/`. tRPC v11. Auth context comes from Clerk's `auth()` helper.

```ts
// Routers (auth required unless noted)

router.therapist
  .me()                       // current therapist
  .updateLocale({ locale })   // 'en' | 'es'

router.phonemes
  .list()                     // public, cached

router.wordLists
  .list({ phonemeId?, position?, difficulty?, owned? })
  .byId({ id })
  .create(input)              // Pro only
  .update({ id, ...input })   // Pro only, owner only
  .delete({ id })             // Pro only, owner only
  .duplicate({ id })          // Pro only, fork a seed list

router.words
  .add({ wordListId, ...input })
  .update({ id, ...input })
  .delete({ id })

router.games
  .list()                     // public, cached

router.assignments
  .list()
  .create({ wordListId, gameId, studentLabel?, expiresAt? })
  .stats({ id })              // { opens, lastOpened, completedSessions, avgTrials }
  .revoke({ id })

// Public router — NO AUTH, COPPA-strict
router.play
  .byToken({ token })         // returns wordList + game config; 404 if revoked/expired
  .startSession({ token })    // returns sessionId
  .updateSession({ token, sessionId, trialsCompleted, completed })

router.billing
  .checkout()                 // returns Stripe Checkout URL
  .portal()                   // returns Customer Portal URL

router.media
  .searchImages({ query })    // proxies Pexels
  .uploadImage(formData)      // Pro only, validates, stores in R2
  .synthesizeAudio({ text, voice })  // returns cached URL
```

**Webhook (REST, not tRPC):**
- `POST /api/webhooks/stripe` — signature-verified, handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
- `POST /api/webhooks/clerk` — signature-verified, handles `user.created` to insert local Therapist row.

---

## 8. COPPA & Privacy (READ THIS BEFORE TOUCHING ANY DATA FLOW)

> **The amended COPPA Rule's compliance deadline was April 22, 2026 — three days ago.** Build to the new rule from day one. Penalties run up to ~$51,744 per violation per day.

### 8.1 Position
We are an **EdTech service "directed at children under 13"** (animated characters, child-oriented games, school context). COPPA applies. We design to **not collect PII from children at all** — the simplest compliant path.

### 8.2 Hard rules in the code
- **Children never create accounts.** Family access is via assignment links. Period.
- **No persistent identifiers from a child's browser.** No cookies on `/play/[token]` except a strictly-necessary in-memory session cookie cleared on tab close. No GA, no Meta pixel, no Hotjar, no PostHog, no Sentry session replay, no anything.
- **No IP address logging on the play route.** `/api/play/*` and `/play/*` are added to a special middleware that strips IP-bearing headers before they reach handlers, and Sentry is configured to ignore these routes entirely. Document the configuration in `docs/coppa-compliance.md`.
- **Aggregate-only session analytics.** `AssignmentSession` stores trials and timestamps, **never** IP, UA, fingerprint, or geo.
- **No behavioral advertising.** We have no ads anyway, but the rule is explicit.
- **No AI on child input.** Even if we add pronunciation scoring later, the 2026 rule requires **separate explicit parental consent**. v1 has zero AI processing of child input — keep it that way.
- **Data retention.** `AssignmentSession` rows older than 90 days are auto-deleted by a daily Vercel Cron job (`/api/cron/delete-old-sessions`).
- **No third-party SDKs in the player shell.** A test in `apps/web/tests/coppa.test.ts` greps the player bundle for known tracker domains and fails the build if any are found.
- **De-identification.** `studentLabel` ("Maria G.") is only ever returned to the therapist's own dashboard. The play route never sees it. Enforced at the tRPC router level — `play.byToken` explicitly does not select that field.
- **Rive analytics off.** Rive's runtime can phone home if asked; we explicitly disable telemetry on the player route.

### 8.3 What we do collect, and from whom
- **From therapists:** email, name, payment info (via Stripe — we never see the card). Standard adult B2B.
- **From children/families:** nothing personal. Aggregate session counts only.

### 8.4 Required documents
- `/privacy` page (English + Spanish), with a children's-privacy section.
- `/terms` page.
- DPA template for school district customers (Phase 9+).
- `docs/coppa-compliance.md` — internal data flow diagram showing every touchpoint of any data that could be tied to a child, confirming none is.

### 8.5 Features that will require a privacy review before implementation
- Voice recording from the child
- Speech-to-text on child speech
- Saved game scores tied to a named child
- Push notifications
- Cross-device session linking
- Any AI/ML on child input
- Streaks or leaderboards (yes, even Duolingo-style — these can pull us toward identifiers)

---

## 9. The Duolingo Feel — Animation & Sound System

This is the section that turns a competent product into one people post about. Take it seriously.

### 9.1 Three animation tiers
1. **Rive (`@rive-app/react-canvas`)** — character animations and game rewards. Lazy-loaded, lives in `packages/rive/`, isolated wrapper components.
2. **Framer Motion** — page transitions, list reorderings, button states, modal entrances.
3. **Tailwind transitions** — hover, focus, simple state changes.

### 9.2 Rive animations needed for v1
| Asset | Where used | State machine inputs |
|---|---|---|
| `mascot-lola.riv` | Therapist dashboard mascot | `mood: idle/happy/sleepy/celebrate` (number) |
| `reward-celebrate.riv` | End of game (all 3 games) | `intensity: 0..1` (number, scales from "good job" to "amazing!") |
| `reward-correct.riv` | Per-turn micro-celebration | `trigger: play` |
| `monster-build.riv` | Game: Build-a-Monster | inputs for each feature (eyes, hat, tail, color) |
| `shark-feed.riv` | Game: Feed-the-Shark intro & end | `state: idle/eating/dancing` |
| `wheel-spin.riv` | Game: La Ruleta | `targetIndex: 0..N` (number) |

**Until real Rive files exist**, we use placeholders:
- For mascot: a Framer-Motion-animated SVG parrot in `packages/rive/src/placeholders/MascotPlaceholder.tsx`.
- For game rewards: confetti via `react-confetti` + a "¡Bien hecho!" Tailwind-animated card.
- The wrapper component pattern means swapping placeholder → real `.riv` is a one-file change per asset.

Source candidates for Rive remixes (free, Rive Community):
- "Loading", "Confetti", "Stars" — celebration patterns
- Animal characters — for mascot inspiration
- See https://rive.app/community for browseable assets

### 9.3 Rive integration pattern (mandatory)
Every Rive component lives in `packages/rive/`. Pattern:
```tsx
// packages/rive/src/RiveReward.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const RiveRewardImpl = dynamic(() => import('./RiveReward.impl'), {
  ssr: false,
  loading: () => <RewardPlaceholder />,
});

export function RiveReward(props: RiveRewardProps) {
  return (
    <Suspense fallback={<RewardPlaceholder />}>
      <RiveRewardImpl {...props} />
    </Suspense>
  );
}
```
The `.impl.tsx` file is where `useRive` lives. The wrapper:
- Lazy-loads the implementation (separate JS chunk; Rive WASM only fetched when needed)
- Provides a placeholder that prevents layout shift
- Is `ssr: false` because Rive needs `window`

This pattern is required. **Don't import `@rive-app/react-canvas` directly from a feature component** — go through `packages/rive/`.

### 9.4 Sound effects
- Howler.js. Files in `apps/web/public/audio/sfx/`.
- Inventory: `correct.mp3`, `incorrect.mp3` (gentle), `tap.mp3`, `celebrate.mp3`, `whoosh.mp3` (transitions).
- All sounds respect `prefers-reduced-motion` (we don't autoplay sound either) — there's an explicit "🔊 sounds on" toggle in the player intro screen.

### 9.5 Haptics (mobile + supported web)
- Use the Web Vibration API on mobile browsers that support it.
- Single short vibration on tap, double on correct, none on incorrect (don't punish the child).
- On Expo (Phase 8+), use `expo-haptics`.

### 9.6 Reduced-motion compliance
- All Rive animations check `prefers-reduced-motion: reduce` and either play a static "final frame" pose or skip entirely.
- Framer Motion respects it via the `useReducedMotion()` hook.
- Sound is off by default; user has to opt in per session.

---

## 10. Internationalization

- **Default locale on `/play/[token]`**: Spanish (`es`). Determined from the assignment's word list locale.
- **Default locale on therapist dashboard**: English; one-click toggle to Spanish, persisted on the Therapist row.
- All UI strings in `apps/web/messages/{es,en}.json` via `next-intl`. **No hard-coded user-facing strings in components** — ESLint rule enforces this (`react/jsx-no-literals` configured for our project).
- Number/date formatting via `Intl.*`.
- Phoneme display names live in the database (`Phoneme.displayNameEs`, `displayNameEn`), not in i18n files.

---

## 11. Accessibility (WCAG 2.2 AA)

Targets are children, often with co-occurring disabilities. Accessibility is non-negotiable.

- All games keyboard-navigable (space/enter advances).
- All audio prompts also have visible written word.
- Color contrast verified on every UI surface (`@axe-core/playwright` runs in CI).
- No autoplay audio without an explicit "🔊" tap.
- Reduced-motion support on every animation (Rive, Framer, CSS).
- Screen reader labels on all icon buttons.
- Test with NVDA + VoiceOver before each release.

---

## 12. Testing strategy

- **Unit / component**: **Vitest** + Testing Library for hooks, utils, and components.
- **tRPC routers**: Vitest with a Postgres testcontainer (`@testcontainers/postgresql`).
- **End-to-end**: **Playwright** for critical flows — signup → create assignment → open play link → complete a game.
- **COPPA bundle test**: `tests/coppa.test.ts` greps the player bundle for tracker domains and fails CI if any appear.
- **Stripe**: use Stripe test clocks for subscription lifecycle tests.
- **Manual matrix**: each game on iPad Safari, iPhone Safari, Chrome desktop, Edge desktop. These are the realistic devices.

---

## 13. Pricing & business notes (context, not code)

- **Free**: all seed lists, 3 games, unlimited assignment links.
- **Pro**: $7/mo or $60/yr. Custom lists, image upload, all games.
- **(v2) School / district**: $200/yr per SLP, BAA available, district-level analytics.
- Pink Cat Games charges $50–60/yr for English; we're priced similarly. Spanish-first is the differentiator, not the price.

---

## 14. How Claude Code should work in this repo

### 14.1 Before starting a task
1. Re-read the relevant section of this file. Touching billing → re-read §6.8 + §7. Touching the player route → re-read §8.
2. Check the §17 Progress Log to know what's already done.
3. If ambiguous, ask **one** clarifying question. Not three.

### 14.2 When writing code
- **tRPC routers are the API.** Don't fetch directly from Prisma in client components.
- **Feature folders, not type folders.** A change to "assignments" should touch one folder.
- **No hard-coded user-facing strings.** Always use `useTranslations()`.
- **Names match the domain language.** `WordList`, `Phoneme`, `Assignment`, `Therapist`. Not `User`. Not `Item`.
- **Don't add libraries casually.** Prefer the stack in §4.1. New dependency? Justify in the PR description.
- **Tests**: write a test alongside any new public method on a router. Don't bolt them on later.
- **Rive**: always go through `packages/rive/` wrappers. Never `import '@rive-app/react-canvas'` from a feature.

### 14.3 COPPA — every PR
Before opening a PR, answer in the description:
- Does this change touch `/play/[token]` or anything used by it?
- Does this change collect, store, or transmit any data that could come from a child?
- Does this change add a third-party SDK, script, or pixel?

If any answer is yes, link to §8 and explain the mitigation.

### 14.4 Migrations
- All schema changes are Prisma migrations: `pnpm --filter @habla/db prisma migrate dev --name verb_noun_context`.
- Update `docs/data-model.md` whenever the schema changes.

### 14.5 Commits
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- Reference the section being implemented when relevant: `feat: implement assignment token generation (§5, §6.7)`.

### 14.6 When you finish a unit of work
- Update §17 Progress Log: date, what you did, what's next.
- If you discovered something that contradicts this file, **update this file in the same PR**. CLAUDE.md is a living document, not a frozen spec.

### 14.7 What NOT to do
- Don't replace the stack with what's "trendier." Stack is set; deviate only with a written reason.
- Don't add a "user" account for children. Ever.
- Don't generate seed word lists with an LLM and ship them as SLP-vetted. Mark dummy lists with `isDummyData: true` per §2.4.
- Don't ship without `prefers-reduced-motion` handling on Rive and Framer animations.
- Don't ship a Rive animation without a non-Rive fallback for the loading/no-WASM case.
- Don't put any analytics SDK anywhere near `/play/[token]`.
- Don't cleanly route the family player through a logged-in layout. It must be its own route group with its own minimal layout.

---

## 15. Build order (Claude Code: this is your roadmap)

### Phase 0 — Foundation (1–2 sessions)
1. `pnpm dlx create-turbo@latest` — initialize monorepo with the structure in §4.2.
2. `apps/web` set up with Next.js 15 App Router, Tailwind v4, shadcn/ui, next-intl.
3. `packages/db` set up with Prisma + Postgres connection (Neon dev branch or local Docker).
4. `packages/api` with tRPC v11 skeleton, `appRouter` exported.
5. `packages/rive` with placeholder mascot component (Framer Motion SVG parrot — no Rive yet).
6. CI: typecheck + lint + test on PR.
7. README at root with `pnpm dev` instructions.
8. **Vercel project connected**, preview deploys working. Use Neon's preview branching so each preview gets its own DB.

### Phase 1 — Auth & data model (2 sessions)
1. Prisma schema (§5), initial migration.
2. Clerk integration in `apps/web`, `(therapist)` layout group is auth-gated.
3. Clerk webhook → create local `Therapist` on `user.created`.
4. Seed `Phoneme` table (§2.1) via `packages/db/src/seed/phonemes.ts`.
5. Therapist landing/dashboard skeleton.

### Phase 2 — Word lists & DUMMY data (2 sessions)
1. WordList + Word entities, full tRPC CRUD endpoints.
2. **Dummy data**: 12 word lists across the highest-priority phonemes (/r/, /rr/, /s/, /l/, /k/, /ch/), each with 20 placeholder words. Mark all as `isDummyData: true`. Use Lorem Ipsum-Spanish placeholder text where needed (`palabra-1`, `palabra-2`, etc.) — clearly fake, not pretending to be real curated content.
3. Seed runner that refuses to run with dummy data on `NODE_ENV=production`.
4. Word list browser UI in dashboard.
5. Pexels image search integration (gated to admin only initially).

### Phase 3 — One game, end-to-end (3–4 sessions)
1. `<GameShell>` + game contract in `apps/web/src/games/_shared/`.
2. Build **Alimenta al Tiburón** as the reference game. Phaser 3 integration, polished.
3. Integrate one Rive reward (use a Rive Community asset — see §9.2 — until custom assets exist).
4. Therapist quick-play flow.

### Phase 4 — Assignments & play route (2 sessions)
1. Assignment entity + token generation (`randomBytes(16).toString('base64url')`).
2. Public `/play/[token]` route, COPPA-strict layout (§8).
3. AssignmentSession aggregate logging.
4. Therapist "Send to family" flow + copy-link UI with toast.
5. Vercel Cron at `/api/cron/delete-old-sessions`.

### Phase 5 — Two more games (2–3 sessions)
1. Arma el Monstruo (pure Rive, state-machine driven).
2. La Ruleta (hybrid Rive + React).
3. Animation/sound polish pass — feel must be Duolingo-grade.

### Phase 6 — Billing (2 sessions)
1. Stripe Checkout integration (§6.8).
2. Webhook handler at `/api/webhooks/stripe`.
3. Pro-tier feature gating in tRPC routers.
4. Customer Portal link.

### Phase 7 — Custom lists (2 sessions)
1. Custom list builder UI (Pro only).
2. Image upload to R2.
3. TTS audio synthesis on save (Azure Speech).

### Phase 8 — Mobile (Expo) — POST-MVP
1. `apps/mobile` Expo app, standalone (not in workspaces).
2. Imports `@habla/api` types via tRPC client.
3. Native Rive (`rive-react-native`) for the games.
4. Ship to App Store + Play Store.

### Phase 9 — Polish & launch prep
1. Privacy policy + terms (English + Spanish).
2. Marketing landing page (within `apps/web/(marketing)/`).
3. WCAG 2.2 AA audit.
4. Beta with 5 SLPs the founder knows.
5. **Replace dummy data with real SLP-curated word lists.** This is the gating step for production launch.

---

## 16. Open questions (founder to decide)

- [ ] Brand name: "Habla Juega"? "Logopalabra"? "FonoFiesta"? "Habla"? Working title for now. **Domain availability to verify before commits reference it.**
- [ ] TTS voice: `es-MX-DaliaNeural` vs `es-US-PalomaNeural` vs `es-ES-ElviraNeural`. Probably MX for the US bilingual market.
- [ ] Free tier limits: 3 games is the default, but capping active assignments at 5 is another option. Less restrictive = better growth.
- [ ] Founder's CCC-SLP credential displayed prominently on marketing site? (This is the trust signal for buyers.)
- [ ] Custom Rive animations: built in-house, hired out, or remix from Rive Community? Cost vs. uniqueness trade-off.
- [ ] When does the "Lola the parrot" mascot get her real Rive personality? Phase 5 or Phase 9?

---

## 17. Progress log

> Append entries here as you complete work. Newest entries at the top.

| Date | Author | Section(s) | Summary | Next step |
|---|---|---|---|---|
| 2026-04-25 | (initial) | all | CLAUDE.md drafted. Repo not yet initialized. | Phase 0, step 1: `pnpm dlx create-turbo@latest`, scaffold apps/web and packages/. |

---

## 18. Reference links (vetted on 2026-04-25)

**Domain & competitive research**
- Pink Cat Games — https://www.pinkcatgames.com/
- Spanish articulation word list overview — https://speechisbeautiful.com/2018/01/spanish-articulation-word-lists-speech-therapy/
- Colorado DOE phoneme similarities (EN/ES) — https://www.cde.state.co.us/coloradoliteracy/phonemesimilaritiesinenglishandspanish

**COPPA (mandatory reading for anyone touching the play route)**
- FTC COPPA rule page — https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa
- FTC final amended rule (Federal Register, April 22, 2025) — https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule

**Stack docs**
- Turborepo on Vercel — https://vercel.com/docs/monorepos/turborepo
- Vercel Turborepo + Next.js template — https://vercel.com/templates/next.js/monorepo-turborepo
- Vercel Turborepo + React Native template — https://vercel.com/templates/next.js/turborepo-react-native
- tRPC v11 — https://trpc.io/docs
- Prisma with Next.js — https://www.prisma.io/docs/guides/nextjs
- Clerk + Next.js — https://clerk.com/docs/quickstarts/nextjs
- Rive React quick start — https://rive.app/docs/runtimes/react/react
- Rive React optimization (Pixel Point) — https://pixelpoint.io/blog/rive-react-optimizations/
- Rive Community (free remixable assets) — https://rive.app/community
- next-intl — https://next-intl.dev
- Stripe Billing — https://docs.stripe.com/billing/subscriptions/build-subscriptions
- Azure Speech voices (es-MX) — https://learn.microsoft.com/azure/ai-services/speech-service/language-support

— End of CLAUDE.md —