// Context construction.
//
// Auth resolution lives in apps/web (where Clerk runs); the api package
// stays Next-agnostic. Callers pass an already-resolved userId+sessionId,
// and we look up the local Therapist row by clerkUserId.
//
// Player surface (`/play/[token]`): never authenticated. Callers from that
// route pass `isPlayRoute: true` and we skip the DB lookup entirely.

import { prisma, type Therapist } from '@habla/db';

export interface Context {
  session: { id: string; userId: string } | null;
  therapist: Therapist | null;
  source: 'web' | 'play';
  headers: Headers;
}

export interface CreateContextOptions {
  headers: Headers;
  /** Already-resolved Clerk session, if any. apps/web passes this from `auth()`. */
  session?: { id: string; userId: string } | null;
  isPlayRoute?: boolean;
}

const hasDatabase = Boolean(process.env.DATABASE_URL);

export async function createContext({
  headers,
  session,
  isPlayRoute,
}: CreateContextOptions): Promise<Context> {
  const baseCtx: Context = {
    session: null,
    therapist: null,
    source: isPlayRoute ? 'play' : 'web',
    headers,
  };

  // Player surface: never resolve a therapist — children don't authenticate.
  if (isPlayRoute) return baseCtx;

  if (!session?.userId) return baseCtx;

  if (!hasDatabase) {
    return { ...baseCtx, session };
  }

  const therapist = await prisma.therapist.findUnique({
    where: { clerkUserId: session.userId },
  });

  return { ...baseCtx, session, therapist };
}
