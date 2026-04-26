// Server-side tRPC caller for React Server Components — calls routers
// directly without round-tripping through HTTP.

import { headers } from 'next/headers';
import { cache } from 'react';

import { appRouter, createCallerFactory, createContext } from '@habla/api';

const createCaller = createCallerFactory(appRouter);

export const getServerCaller = cache(async () => {
  const requestHeaders = await headers();
  const ctx = await createContext({ headers: requestHeaders });
  return createCaller(ctx);
});
