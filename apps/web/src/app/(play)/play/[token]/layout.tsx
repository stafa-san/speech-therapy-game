// Player surface layout — COPPA-strict (Project.md §8).
//
// Hard rules enforced here:
//   1. NO third-party SDKs (no Clerk provider, no analytics, no replay).
//   2. NO IP-bearing headers reach this server tree (proxy.ts strips them).
//   3. Spanish locale by default; we don't read the user's `NEXT_LOCALE`
//      cookie (that belongs to the therapist surface). The locale used
//      for messages comes from the assignment's word list (PR 9 does
//      this; today we hardcode 'es').
//   4. No metadata that could leak user identity.
//
// The COPPA bundle test (apps/web/tests/coppa.spec.ts) greps the built
// player route bundle for tracker domains and fails CI if any appear.

import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import esMessages from '../../../../../messages/es.json';

export const metadata: Metadata = {
  // Indexing is also blocked at the CDN layer (vercel.json, next.config.ts);
  // this is a triple-belt for crawlers that ignore HTTP headers.
  robots: { index: false, follow: false },
  // Player route is referrer-stripped at the header level too — see next.config.ts.
};

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="es" messages={esMessages}>
      <div className="bg-background min-h-dvh">{children}</div>
    </NextIntlClientProvider>
  );
}
