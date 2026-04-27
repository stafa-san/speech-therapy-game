import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { RiveMascot } from '@habla/rive';

import { DuoButton } from '@/components/ui/duo-button';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <main className="bg-hero-gradient relative grid min-h-dvh place-items-center overflow-hidden px-4 py-8">
      <div className="bg-sunshine-300 pointer-events-none absolute -left-12 top-12 size-40 rounded-full opacity-40 blur-xl" />
      <div className="bg-coral-300 pointer-events-none absolute -bottom-10 right-0 size-56 rounded-full opacity-40 blur-xl" />
      <div className="bg-card rounded-4xl relative z-10 mx-auto flex w-full max-w-md flex-col items-center gap-5 border-4 border-white p-8 text-center shadow-2xl">
        <div className="from-brand-100 to-brand-50 bg-linear-to-br grid size-44 place-items-center rounded-full">
          <RiveMascot mood="sleepy" className="size-40" forcePlaceholder />
        </div>
        <p className="text-coral-700 text-sm font-bold uppercase tracking-widest">{t('label')}</p>
        <h1 className="text-foreground text-4xl font-extrabold tracking-tight">{t('title')}</h1>
        <p className="text-foreground/65">{t('description')}</p>
        <DuoButton asChild size="xl" variant="primary">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={'/' as any}>{t('cta')}</Link>
        </DuoButton>
      </div>
    </main>
  );
}
