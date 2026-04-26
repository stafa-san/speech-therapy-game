// Lazy singleton Prisma client.
//
// Build-time safety: instantiation is deferred until the first property
// access. Without this, Next's `next build` page-data collection crashes
// any route that imports the prisma symbol when DATABASE_URL is unset.
//
// We type the export as PrismaClient via a Proxy whose target is a real
// PrismaClient prototype so cross-package TypeScript inference resolves
// to the same generated types — using `{} as PrismaClient` instead loses
// inference in consumers that go through the api package.

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

// Use the prototype as the proxy target so TypeScript inference picks
// up PrismaClient's full method types in cross-package consumers.
const proxyTarget = PrismaClient.prototype as PrismaClient;

export const prisma: PrismaClient = new Proxy(proxyTarget, {
  get(_target, prop, receiver) {
    const client = getClient();
    return Reflect.get(client, prop, receiver);
  },
});
