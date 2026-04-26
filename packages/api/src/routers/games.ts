import { GAMES } from '@habla/db/seed/data';

import { publicProcedure, router } from '../trpc';

export const gamesRouter = router({
  list: publicProcedure.query(async () => {
    return GAMES.filter((g) => g.isEnabled).map((g) => ({
      id: g.id,
      slug: g.slug,
      nameEs: g.nameEs,
      nameEn: g.nameEn,
      minTrials: g.minTrials,
      maxTrials: g.maxTrials,
      isFreeTier: g.isFreeTier,
      sortOrder: g.sortOrder,
    }));
  }),
});
