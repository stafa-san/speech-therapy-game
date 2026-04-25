// Singleton Prisma client. In dev, Next.js hot-reloads Server Components and
// would otherwise spawn a new client per HMR cycle, exhausting connections.
// In prod (Vercel serverless), we use Neon's serverless driver via the Prisma
// adapter so cold starts are HTTP-fetch-fast and connections don't pile up.

import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

declare global {
  var __habla_prisma__: PrismaClient | undefined;
}

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      '[@habla/db] DATABASE_URL is not set. Set it in apps/web/.env.local for dev or in Vercel Project Settings → Environment Variables for deploys.',
    );
  }

  // Edge / browser environments expose `WebSocket` natively and Neon will
  // pick it up. In Node we fall back to the polyfill ws picks up dynamically.
  if (typeof WebSocket !== 'undefined') {
    neonConfig.webSocketConstructor = WebSocket;
  }

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.__habla_prisma__ ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__habla_prisma__ = prisma;
}
