import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

import { Toaster } from '@/components/ui/sonner';
import { getLocale } from '@/i18n/locale';
import { TRPCProvider } from '@/lib/trpc/client';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: {
      default: t('title'),
      template: t('titleTemplate'),
    },
    description: t('description'),
    applicationName: 'Habla Juega',
    authors: [{ name: 'Habla Juega' }],
    keywords: [
      'speech therapy',
      'logopedia',
      'articulación',
      'spanish speech therapy',
      'phoneme practice',
      'SLP tools',
    ],
    openGraph: {
      type: 'website',
      siteName: 'Habla Juega',
      title: t('title'),
      description: t('description'),
      locale: 'es_MX',
    },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const hasClerkKeys = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  const tree = (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-dvh font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TRPCProvider>{children}</TRPCProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );

  // ClerkProvider requires a publishable key. When unset (e.g., previews
  // before keys are wired), render without it so the marketing surface
  // still works.
  return hasClerkKeys ? <ClerkProvider>{tree}</ClerkProvider> : tree;
}
