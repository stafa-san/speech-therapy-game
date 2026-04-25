import type { Metadata, Viewport } from 'next';

import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Habla Juega',
    template: '%s · Habla Juega',
  },
  description:
    'Spanish-first articulation practice for speech therapy. SLP-vetted word lists paired with delightful animated games.',
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
    title: 'Habla Juega',
    description: 'Spanish-first articulation practice for speech therapy.',
    locale: 'es_MX',
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-dvh font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
