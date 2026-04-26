// Lazy singleton Prisma client.
//
// Build-time safety: instantiation is deferred until the first property
// access. Without this, Next's `next build` page-data collection crashes
// any route that imports the prisma symbol when DATABASE_URL is unset
// (deploys without Neon wired up yet, local previews, the Vercel build).
//
// The Proxy is invisible to consumers — `prisma.therapist.findUnique(...)` just works.

import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

declare global {
  var __habla_prisma__: PrismaClient | undefined;
}

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      '[@habla/db] DATABASE_URL is not set. Set it in apps/web/.env.local for dev or in Vercel Project Settings → Environment Variables for deploys.',
    );
  }

  if (typeof WebSocket !== 'undefined') {
    neonConfig.webSocketConstructor = WebSocket;
  }

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

function getClient(): PrismaClient {
  if (globalThis.__habla_prisma__) return globalThis.__habla_prisma__;
  const client = createClient();
  if (process.env.NODE_ENV !== 'production') {
    globalThis.__habla_prisma__ = client;
  }
  return client;
}

// Lazy proxy: any property access (`prisma.therapist`, `prisma.$disconnect`)
// instantiates on demand. The empty target is safe because the proxy
// always defers to the real client.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    return Reflect.get(client, prop, receiver);
  },
});
