import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter, createContext } from '@habla/api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: () =>
      createContext({
        headers: request.headers,
        // The dedicated /api/play handler (PR 9) flips this to true.
        isPlayRoute: false,
      }),
    onError({ error, path }) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[trpc] ${path ?? '<no-path>'}: ${error.message}`);
      }
    },
  });

export { handler as GET, handler as POST };
