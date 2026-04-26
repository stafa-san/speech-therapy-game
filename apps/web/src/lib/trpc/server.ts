// Server-side tRPC caller for React Server Components — calls routers
// directly without round-tripping through HTTP.

import { auth } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { cache } from 'react';

import { appRouter, createCallerFactory, createContext } from '@habla/api';

const createCaller = createCallerFactory(appRouter);

const hasClerkKeys =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) && Boolean(process.env.CLERK_SECRET_KEY);

export const getServerCaller = cache(async () => {
  const requestHeaders = await headers();

  let session: { id: string; userId: string } | null = null;
  if (hasClerkKeys) {
    try {
      const { userId, sessionId } = await auth();
      if (userId && sessionId) session = { id: sessionId, userId };
    } catch {
      // Anonymous or unavailable.
    }
  }

  const ctx = await createContext({ headers: requestHeaders, session });
  return createCaller(ctx);
});
