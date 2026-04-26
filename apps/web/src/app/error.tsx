'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');
  const tCommon = useTranslations('common');

  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16 text-center">
      <div>
        <p className="text-destructive text-sm font-semibold">{t('label')}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-4">{t('description')}</p>
        {error.digest ? (
          <p className="text-muted-foreground/70 mt-2 font-mono text-xs">
            {t('ref', { digest: error.digest })}
          </p>
        ) : null}
        <Button onClick={reset} className="mt-8">
          {tCommon('retry')}
        </Button>
      </div>
    </main>
  );
}
