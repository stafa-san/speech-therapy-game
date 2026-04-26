import { TRPCError } from '@trpc/server';

import { createAssignmentSchema, wordListIdSchema } from '../schemas';
import { router, therapistProcedure } from '../trpc';

const NOT_YET = (lands: string) =>
  new TRPCError({ code: 'METHOD_NOT_SUPPORTED', message: `Lands in ${lands}.` });

export const assignmentsRouter = router({
  list: therapistProcedure.query(async () => {
    throw NOT_YET('PR 12 (assignments)');
  }),

  create: therapistProcedure.input(createAssignmentSchema).mutation(async () => {
    throw NOT_YET('PR 12 (assignments)');
  }),

  stats: therapistProcedure.input(wordListIdSchema).query(async () => {
    throw NOT_YET('PR 12 (assignments)');
  }),

  revoke: therapistProcedure.input(wordListIdSchema).mutation(async () => {
    throw NOT_YET('PR 12 (assignments)');
  }),
});
