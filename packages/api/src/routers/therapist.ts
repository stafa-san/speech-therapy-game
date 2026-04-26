import { TRPCError } from '@trpc/server';

import { updateLocaleSchema } from '../schemas';
import { router, therapistProcedure } from '../trpc';

export const therapistRouter = router({
  me: therapistProcedure.query(async ({ ctx }) => {
    return {
      id: ctx.therapist.id,
      email: ctx.therapist.email,
      fullName: ctx.therapist.fullName,
      locale: ctx.therapist.locale,
      planTier: ctx.therapist.planTier,
      credential: ctx.therapist.credential,
    };
  }),

  updateLocale: therapistProcedure.input(updateLocaleSchema).mutation(async () => {
    throw new TRPCError({
      code: 'METHOD_NOT_SUPPORTED',
      message: 'therapist.updateLocale lands in PR 7 with the DB connection.',
    });
  }),
});
