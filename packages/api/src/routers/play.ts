// Family player router — PUBLIC, COPPA-strict. See Project.md §8.
//
// Hard rules enforced here:
//   1. Every endpoint is a `publicProcedure` — children never authenticate.
//   2. The `byToken` query NEVER returns `studentLabel` or any therapist PII.
//      The select clause must be explicit; do not spread Assignment.*.
//   3. `startSession` / `updateSession` write only the trial-count aggregate
//      (no IP, UA, geo, fingerprint).
//   4. The HTTP handler that mounts this router strips IP-bearing headers
//      *before* calling createContext (apps/web middleware, PR 9).
//
// Today the implementations stub; PR 9 wires them to the DB.

import { TRPCError } from '@trpc/server';

import { sessionUpdateSchema, tokenSchema } from '../schemas';
import { publicProcedure, router } from '../trpc';

export const playRouter = router({
  /**
   * Resolve an assignment from the share-link token.
   * MUST NOT include studentLabel in the response shape.
   */
  byToken: publicProcedure.input(tokenSchema).query(async ({ input: _input }) => {
    // PR 9 implementation:
    //   const a = await prisma.assignment.findFirst({
    //     where: { token: _input.token, isRevoked: false, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    //     select: { id: true, gameId: true, wordListId: true, /* NO studentLabel */ },
    //   });
    //   if (!a) throw new TRPCError({ code: 'NOT_FOUND' });
    //   const wordList = await prisma.wordList.findUniqueOrThrow({ ... });
    //   return { assignmentId: a.id, gameId: a.gameId, wordList };
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Player route lands in PR 9.',
    });
  }),

  /**
   * Open a session row. Returns the sessionId so the client can update
   * trial counts as the child plays. No identifiers are persisted.
   */
  startSession: publicProcedure.input(tokenSchema).mutation(async () => {
    throw new TRPCError({
      code: 'METHOD_NOT_SUPPORTED',
      message: 'Player route lands in PR 9.',
    });
  }),

  updateSession: publicProcedure.input(sessionUpdateSchema).mutation(async () => {
    throw new TRPCError({
      code: 'METHOD_NOT_SUPPORTED',
      message: 'Player route lands in PR 9.',
    });
  }),
});
