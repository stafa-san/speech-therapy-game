import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Plus_Jakarta_Sans } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import { getLocale } from '@/i18n/locale';
import { TRPCProvider } from '@/lib/trpc/client';
import './globals.css';

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display-loaded',
  display: 'swap',
});

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
    <html lang={locale} className={display.variable} suppressHydrationWarning>
      <body className="min-h-dvh font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TRPCProvider>{children}</TRPCProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );

  // ClerkProvider requires a publishable key. Without it (early previews),
  // render the tree directly so the demo still works.
  return hasClerkKeys ? <ClerkProvider>{tree}</ClerkProvider> : tree;
}
