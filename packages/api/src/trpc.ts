// tRPC v11 base. The base procedure has rate-limit + logging middleware
// hooks defined here but unimplemented — they'll be filled in by PR 12
// (assignment-link rate limit) and PR 17 (request logging).

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import type { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/** Base router primitive. */
export const router = t.router;
/** Use server-side fetch helpers in RSCs without going through HTTP. */
export const createCallerFactory = t.createCallerFactory;
/** Public procedure — anyone can call. Used for phonemes, games, /play. */
export const publicProcedure = t.procedure;

/**
 * Therapist-protected procedure. Throws UNAUTHORIZED if context has no session,
 * or NOT_FOUND if Clerk says we're authed but the local Therapist row is missing
 * (e.g., the clerk webhook hasn't fired yet on a brand-new account).
 *
 * Wired to a real Clerk session in PR 7. Until then this guards against
 * accidental anonymous calls — `ctx.therapist` is always non-null inside.
 */
export const therapistProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  if (!ctx.therapist) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Therapist record not found for this session.',
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      therapist: ctx.therapist,
    },
  });
});

/**
 * Pro-tier-only procedure. Same as therapistProcedure but additionally
 * checks `therapist.planTier === 'pro'`.
 */
export const proProcedure = therapistProcedure.use(async ({ ctx, next }) => {
  if (ctx.therapist.planTier !== 'pro') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'This action requires a Pro subscription.',
    });
  }
  return next({ ctx });
});
