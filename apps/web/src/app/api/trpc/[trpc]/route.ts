import { auth } from '@clerk/nextjs/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter, createContext } from '@habla/api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const hasClerkKeys =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) && Boolean(process.env.CLERK_SECRET_KEY);

const handler = async (request: Request) => {
  // Resolve Clerk session (if any) before the router runs. The api package
  // stays Next-agnostic — we hand it the already-resolved values.
  let session: { id: string; userId: string } | null = null;
  if (hasClerkKeys) {
    try {
      const { userId, sessionId } = await auth();
      if (userId && sessionId) session = { id: sessionId, userId };
    } catch {
      // Anonymous request or Clerk unavailable; fall through.
    }
  }

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: () =>
      createContext({
        headers: request.headers,
        session,
        // The dedicated /api/play handler (PR 9) flips this to true.
        isPlayRoute: false,
      }),
    onError({ error, path }) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[trpc] ${path ?? '<no-path>'}: ${error.message}`);
      }
    },
  });
};

export { handler as GET, handler as POST };
