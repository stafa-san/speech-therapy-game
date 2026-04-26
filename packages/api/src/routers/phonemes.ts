import { PHONEMES } from '@habla/db/seed/data';

import { publicProcedure, router } from '../trpc';

/**
 * Public, cacheable. Falls back to the static seed list when the DB
 * isn't reachable yet (PR 5+) so the picker renders even pre-migrate.
 */
export const phonemesRouter = router({
  list: publicProcedure.query(async ({ ctx: _ctx }) => {
    // Once Clerk + DB are wired (PR 7), prefer DB so admins can hide phonemes.
    return PHONEMES.map((p) => ({
      id: p.id,
      symbol: p.symbol,
      ipa: p.ipa,
      displayNameEs: p.displayNameEs,
      displayNameEn: p.displayNameEn,
      sortOrder: p.sortOrder,
    }));
  }),
});
