// Context construction. The HTTP handler in apps/web/src/app/api/trpc/[trpc]/route.ts
// builds a Context from each Request. Auth is wired up properly in PR 7 with Clerk;
// for now `session` and `therapist` resolve to null on every call, which is
// the correct behavior for the public routers we have today.

import type { Therapist } from '@habla/db';

export interface Context {
  /** Clerk session id + userId, or null when anonymous. */
  session: { id: string; userId: string } | null;
  /** Local therapist row, hydrated from the Clerk userId. Null when anonymous. */
  therapist: Therapist | null;
  /** Source of the request — used to gate cookie/IP-stripping per Project.md §8. */
  source: 'web' | 'play';
  /** Headers from the incoming request, for downstream middleware that needs them. */
  headers: Headers;
}

export interface CreateContextOptions {
  headers: Headers;
  /** When true, the route is considered the family player surface. Strips
   *  IP-bearing headers and never resolves a therapist session. */
  isPlayRoute?: boolean;
}

export async function createContext({
  headers,
  isPlayRoute,
}: CreateContextOptions): Promise<Context> {
  // PR 7 wires Clerk's `auth()` helper here. Today: anonymous everywhere.
  return {
    session: null,
    therapist: null,
    source: isPlayRoute ? 'play' : 'web',
    headers,
  };
}
