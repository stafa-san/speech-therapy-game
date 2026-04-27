import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, BookOpen, Send, Sparkles, TrendingUp } from 'lucide-react';

import { RiveMascot } from '@habla/rive';

import { DuoButton } from '@/components/ui/duo-button';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-col gap-1">
        <p className="text-foreground/55 text-sm font-bold uppercase tracking-wider">
          {t('greeting')}
        </p>
        <h1 className="text-foreground text-4xl font-extrabold tracking-tight">{t('title')}</h1>
      </header>

      {/* Quick play hero — gradient + mascot, like a Duolingo lesson cap */}
      <section className="from-brand-500 to-brand-700 rounded-4xl bg-linear-to-br relative overflow-hidden p-6 text-white sm:p-10">
        <div className="bg-sunshine-300 absolute -right-12 -top-12 size-48 rounded-full opacity-40 blur-2xl" />
        <div className="bg-coral-300 absolute -bottom-10 left-12 size-40 rounded-full opacity-30 blur-2xl" />
        <div className="relative grid items-center gap-6 sm:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-3">
            <span className="text-sunshine-300 w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="mr-1 inline size-3" />
              {t('quickPlay.comingSoon')}
            </span>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {t('quickPlay.title')}
            </h2>
            <p className="max-w-md text-white/85">{t('quickPlay.description')}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <DuoButton asChild size="lg" variant="sunshine">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Link href={'/lists' as any}>
                  {t('quickPlay.cta')} <ArrowRight className="size-4" />
                </Link>
              </DuoButton>
            </div>
          </div>
          <div className="hidden size-40 sm:block">
            <RiveMascot mood="happy" forcePlaceholder />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashCard
          icon={Send}
          tone="coral"
          title={t('cards.recentAssignments.title')}
          description={t('cards.recentAssignments.description')}
          href="/assignments"
          ctaLabel={t('cards.cta')}
        />
        <DashCard
          icon={BookOpen}
          tone="brand"
          title={t('cards.savedLists.title')}
          description={t('cards.savedLists.description')}
          href="/lists"
          ctaLabel={t('cards.cta')}
        />
        <DashCard
          icon={TrendingUp}
          tone="grape"
          title={t('cards.usage.title')}
          description={t('cards.usage.description')}
          ctaLabel={t('cards.usage.cta')}
        />
      </section>
    </div>
  );
}

const TONE_STYLES: Record<'brand' | 'coral' | 'grape', string> = {
  brand: 'bg-brand-100 text-brand-700',
  coral: 'bg-coral-100 text-coral-700',
  grape: 'bg-grape-100 text-grape-700',
};

function DashCard({
  icon: Icon,
  tone,
  title,
  description,
  href,
  ctaLabel,
}: {
  icon: typeof Send;
  tone: 'brand' | 'coral' | 'grape';
  title: string;
  description: string;
  href?: string;
  ctaLabel: string;
}) {
  const inner = (
    <article className="bg-card flex h-full flex-col gap-3 rounded-3xl border-2 p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className={`grid size-12 place-items-center rounded-2xl ${TONE_STYLES[tone]}`}>
        <Icon className="size-6" />
      </div>
      <h3 className="text-foreground text-xl font-extrabold leading-tight">{title}</h3>
      <p className="text-foreground/60 text-sm leading-relaxed">{description}</p>
      <span className="text-foreground/45 mt-auto text-xs font-bold uppercase tracking-wide">
        {ctaLabel}
      </span>
    </article>
  );
  if (!href) return inner;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Link
      href={href as any}
      className="ring-border focus-visible:ring-brand-500 block rounded-3xl focus-visible:outline-none focus-visible:ring-4"
    >
      {inner}
    </Link>
  );
}
