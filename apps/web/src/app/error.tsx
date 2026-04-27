'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { RiveMascot } from '@habla/rive';

import { DuoButton } from '@/components/ui/duo-button';

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
    <main className="bg-hero-gradient relative grid min-h-dvh place-items-center overflow-hidden px-4 py-8">
      <div className="bg-coral-300 pointer-events-none absolute inset-0 -z-10 opacity-30 blur-3xl" />
      <div className="bg-card rounded-4xl relative z-10 mx-auto flex w-full max-w-md flex-col items-center gap-5 border-4 border-white p-8 text-center shadow-2xl">
        <div className="from-coral-100 to-sunshine-100 bg-linear-to-br grid size-44 place-items-center rounded-full">
          <RiveMascot mood="sleepy" className="size-40" forcePlaceholder />
        </div>
        <p className="text-coral-700 text-sm font-bold uppercase tracking-widest">{t('label')}</p>
        <h1 className="text-foreground text-3xl font-extrabold tracking-tight">{t('title')}</h1>
        <p className="text-foreground/65">{t('description')}</p>
        {error.digest ? (
          <p className="text-foreground/40 font-mono text-xs">
            {t('ref', { digest: error.digest })}
          </p>
        ) : null}
        <DuoButton size="xl" variant="primary" onClick={reset}>
          {tCommon('retry')}
        </DuoButton>
      </div>
    </main>
  );
}
