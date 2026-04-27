// Player surface layout — COPPA-strict (Project.md §8).
//
// Hard rules enforced here:
//   1. NO third-party SDKs (no Clerk provider, no analytics, no replay).
//   2. NO IP-bearing headers reach this server tree (proxy.ts strips them).
//   3. UI labels follow the therapist's locale cookie (parent reads them);
//      Spanish vocabulary is content baked into the word list, regardless.
//   4. No metadata that could leak user identity.
//
// The COPPA bundle test (apps/web/tests/coppa.spec.ts) greps the built
// player route bundle for tracker domains and fails CI if any appear.

import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';

import { getLocale } from '@/i18n/locale';
import enMessages from '../../../../../messages/en.json';
import esMessages from '../../../../../messages/es.json';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PlayLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = locale === 'es' ? esMessages : enMessages;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="bg-background min-h-dvh">{children}</div>
    </NextIntlClientProvider>
  );
}
