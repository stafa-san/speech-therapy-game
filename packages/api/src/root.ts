// Root tRPC router. Importing from @habla/api/server returns a typed caller
// usable from React Server Components without round-tripping through HTTP.

import { router } from './trpc';
import { assignmentsRouter } from './routers/assignments';
import { billingRouter } from './routers/billing';
import { gamesRouter } from './routers/games';
import { mediaRouter } from './routers/media';
import { phonemesRouter } from './routers/phonemes';
import { playRouter } from './routers/play';
import { therapistRouter } from './routers/therapist';
import { wordListsRouter } from './routers/wordLists';

export const appRouter = router({
  therapist: therapistRouter,
  phonemes: phonemesRouter,
  games: gamesRouter,
  wordLists: wordListsRouter,
  assignments: assignmentsRouter,
  play: playRouter,
  billing: billingRouter,
  media: mediaRouter,
});

export type AppRouter = typeof appRouter;
