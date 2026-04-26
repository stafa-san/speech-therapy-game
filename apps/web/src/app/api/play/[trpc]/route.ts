// Dedicated tRPC fetch handler for the family player.
//
// Differs from /api/trpc/[trpc] in two ways:
//   1. createContext is called with `isPlayRoute: true` — disables
//      Clerk session resolution and never reads cookies that belong
//      to the therapist surface.
//   2. We never read or pass the Clerk session — children don't authenticate.
//
// IP headers are already stripped upstream by `src/proxy.ts`, so handlers
// downstream cannot see them. This is enforced at three levels (proxy +
// router select clauses + bundle scan).

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter, createContext } from '@habla/api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: '/api/play',
    req: request,
    router: appRouter,
    createContext: () =>
      createContext({
        headers: request.headers,
        session: null,
        isPlayRoute: true,
      }),
    onError({ error, path }) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[trpc-play] ${path ?? '<no-path>'}: ${error.message}`);
      }
    },
  });

export { handler as GET, handler as POST };
