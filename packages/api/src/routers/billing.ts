import { TRPCError } from '@trpc/server';

import { router, therapistProcedure } from '../trpc';

export const billingRouter = router({
  checkout: therapistProcedure.mutation(async () => {
    throw new TRPCError({
      code: 'METHOD_NOT_SUPPORTED',
      message: 'billing.checkout lands in PR 14 (Stripe Billing).',
    });
  }),

  portal: therapistProcedure.mutation(async () => {
    throw new TRPCError({
      code: 'METHOD_NOT_SUPPORTED',
      message: 'billing.portal lands in PR 14 (Stripe Billing).',
    });
  }),
});
