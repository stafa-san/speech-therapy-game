// Middleware runs on every request. Two responsibilities:
//
//   1. **Clerk auth** for the therapist dashboard. Protected routes require
//      a session; visitors are redirected to /sign-in.
//
//   2. **COPPA header strip** for `/play/[token]` and `/api/play/*`.
//      We remove `x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`, and
//      `true-client-ip` so handlers downstream can never log them, even
//      accidentally. See Project.md §8 + docs/coppa-compliance.md.
//
// Graceful degradation: if Clerk env vars are missing (e.g., a bare
// preview deploy without secrets) the auth bits no-op so the app still
// renders the marketing surface.

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const IP_HEADERS = [
  'x-forwarded-for',
  'x-real-ip',
  'cf-connecting-ip',
  'true-client-ip',
  'x-client-ip',
  'fastly-client-ip',
  'forwarded',
];

const PLAYER_PATH = /^\/(?:play|api\/play)(\/|$)/;

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/lists(.*)',
  '/assignments(.*)',
  '/settings(.*)',
  '/api/trpc(.*)',
]);

const hasClerkKeys =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) && Boolean(process.env.CLERK_SECRET_KEY);

function stripPlayerHeaders(request: NextRequest): NextRequest {
  if (!PLAYER_PATH.test(request.nextUrl.pathname)) return request;
  const cleaned = new Headers(request.headers);
  for (const h of IP_HEADERS) cleaned.delete(h);
  return new NextRequest(request, { headers: cleaned });
}

const middleware = hasClerkKeys
  ? clerkMiddleware(async (auth, request) => {
      // Strip IP headers before any handler sees them.
      stripPlayerHeaders(request as NextRequest);

      // Therapist routes — require a session.
      if (isProtectedRoute(request)) {
        const session = await auth();
        if (!session.userId) {
          return session.redirectToSignIn({ returnBackUrl: request.url });
        }
      }
      return NextResponse.next();
    })
  : function middlewareNoop(request: NextRequest) {
      stripPlayerHeaders(request);
      return NextResponse.next();
    };

export default middleware;

export const config = {
  matcher: [
    // Skip Next internals and all static files.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
