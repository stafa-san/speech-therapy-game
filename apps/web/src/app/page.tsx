import { ArrowRight, Github, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { RiveMascot } from '@habla/rive';

import { LocaleSwitch } from '@/components/locale-switch';
import {
  FeatureBook,
  FeatureClock,
  FeatureFamily,
  FeatureGlobe,
  FeatureShield,
  FeatureSpark,
} from '@/components/illustrations/feature-icons';
import {
  BuildAMonsterThumb,
  FeedTheSharkThumb,
  SpinTheWheelThumb,
} from '@/components/illustrations/game-thumbnails';
import { HeroScene } from '@/components/illustrations/hero-scene';
import { Badge } from '@/components/ui/badge';
import { DuoButton } from '@/components/ui/duo-button';

export default function Home() {
  return (
    <main className="bg-hero-gradient relative overflow-hidden">
      <NavBar />
      <Hero />
      <Strip />
      <GamesPreview />
      <Features />
      <HowItWorks />
      <FinalCta />
      <Footer />
    </main>
  );
}

function NavBar() {
  const t = useTranslations('landing');
  return (
    <nav className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
      <Link
        href="/"
        className="text-brand-700 flex items-center gap-2 text-lg font-extrabold tracking-tight"
      >
        <span className="bg-brand-500 grid size-9 place-items-center rounded-2xl text-white shadow-[0_3px_0_0_var(--color-brand-700)]">
          <Sparkles className="size-5" />
        </span>
        Habla Juega
      </Link>
      <div className="flex items-center gap-2">
        <LocaleSwitch />
        <DuoButton asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={'/dashboard' as any}>{t('navTherapist')}</Link>
        </DuoButton>
        <DuoButton asChild size="sm" variant="primary">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={'/play/demo' as any}>{t('navPlay')}</Link>
        </DuoButton>
      </div>
    </nav>
  );
}

function Hero() {
  const t = useTranslations('landing');

  return (
    <section className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-6 pb-16 pt-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-24">
      <div className="relative z-10 flex flex-col items-start gap-6 text-left">
        <Badge
          variant="secondary"
          className="bg-sunshine-300 text-coral-700 border-coral-300 rounded-full px-3 py-1 text-sm font-bold uppercase tracking-wide"
        >
          <span className="bg-coral-500 mr-1.5 inline-block size-1.5 rounded-full" />
          {t('preLaunchBadge')}
        </Badge>
        <h1 className="text-foreground text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          {t('hero.line1')}
          <br />
          <span className="from-brand-500 to-coral-500 bg-linear-to-r bg-clip-text text-transparent">
            {t('hero.line2')}
          </span>
        </h1>
        <p className="text-foreground/70 max-w-xl text-lg sm:text-xl">{t('tagline')}</p>
        <div className="flex flex-wrap items-center gap-3">
          <DuoButton asChild size="xl" variant="primary">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Link href={'/play/demo' as any}>
              {t('ctaPlayDemo')} <ArrowRight className="size-5" />
            </Link>
          </DuoButton>
          <DuoButton asChild size="xl" variant="ghost">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Link href={'/lists' as any}>{t('ctaBrowseLists')}</Link>
          </DuoButton>
        </div>
        <p className="text-foreground/50 text-xs">{t('demoNote')}</p>
      </div>

      <div className="relative aspect-[4/3] w-full max-w-[560px] justify-self-center lg:justify-self-end">
        <div className="shadow-brand-900/10 rounded-4xl absolute inset-0 -z-10 overflow-hidden shadow-2xl">
          <HeroScene />
        </div>
        <div className="absolute inset-0 grid place-items-end p-6 sm:p-10">
          <RiveMascot mood="happy" className="size-56 sm:size-72" forcePlaceholder />
        </div>
      </div>
    </section>
  );
}

function Strip() {
  const t = useTranslations('landing');
  return (
    <div className="bg-foreground relative z-10 -mt-1 overflow-hidden py-3 text-white">
      <div className="animate-marquee mx-auto flex w-max gap-12 whitespace-nowrap text-sm font-bold uppercase tracking-[0.2em]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-12">
            <span>{t('strip.phonemes')}</span>
            <span className="text-sunshine-300">·</span>
            <span>{t('strip.games')}</span>
            <span className="text-sunshine-300">·</span>
            <span>{t('strip.coppa')}</span>
            <span className="text-sunshine-300">·</span>
            <span>{t('strip.coverage')}</span>
            <span className="text-sunshine-300">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GamesPreview() {
  const t = useTranslations('landing');
  const games = [
    {
      slug: 'feed-the-shark',
      Thumb: FeedTheSharkThumb,
      tone: 'bg-sky-soft-100 hover:bg-sky-soft-300',
    },
    {
      slug: 'build-a-monster',
      Thumb: BuildAMonsterThumb,
      tone: 'bg-grape-100 hover:bg-grape-300',
    },
    {
      slug: 'spin-the-wheel',
      Thumb: SpinTheWheelThumb,
      tone: 'bg-sunshine-100 hover:bg-sunshine-300',
    },
  ] as const;

  return (
    <section className="bg-background relative z-10 mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{t('games.title')}</h2>
        <p className="text-foreground/60 mt-3 text-lg">{t('games.subtitle')}</p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {games.map(({ slug, Thumb, tone }) => (
          <Link
            key={slug}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            href={`/play/demo?game=${slug}` as any}
            className={`rounded-4xl ring-border focus-visible:ring-brand-500 group relative flex flex-col overflow-hidden ring-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 ${tone}`}
          >
            <Thumb className="h-44 w-full object-cover" />
            <div className="bg-card flex flex-col gap-2 p-6">
              <h3 className="text-xl font-extrabold">{t(`games.items.${slug}.title`)}</h3>
              <p className="text-foreground/60 text-sm">{t(`games.items.${slug}.body`)}</p>
              <span className="text-brand-700 group-hover:text-brand-500 mt-2 text-sm font-bold">
                {t('games.cta')} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const t = useTranslations('landing');
  const features = [
    { icon: FeatureSpark, key: 'fast' },
    { icon: FeatureFamily, key: 'family' },
    { icon: FeatureBook, key: 'curated' },
    { icon: FeatureShield, key: 'safe' },
    { icon: FeatureClock, key: 'short' },
    { icon: FeatureGlobe, key: 'spanish' },
  ] as const;

  return (
    <section className="bg-background relative z-10 mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t('features.title')}
        </h2>
        <p className="text-foreground/60 mt-3 text-lg">{t('features.subtitle')}</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, key }) => (
          <div
            key={key}
            className="bg-card group flex flex-col gap-4 rounded-3xl border-2 p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <Icon className="size-16" />
            <h3 className="text-xl font-extrabold">{t(`features.items.${key}.title`)}</h3>
            <p className="text-foreground/65 text-sm leading-relaxed">
              {t(`features.items.${key}.body`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const t = useTranslations('landing');
  const steps = ['choose', 'send', 'play'] as const;
  const accents = [
    'bg-brand-100 text-brand-700 border-brand-300',
    'bg-coral-100 text-coral-700 border-coral-300',
    'bg-sunshine-100 text-coral-700 border-sunshine-500',
  ];

  return (
    <section className="bg-mesh-soft relative z-10 mx-auto w-full px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{t('how.title')}</h2>
          <p className="text-foreground/60 mt-3 text-lg">{t('how.subtitle')}</p>
        </div>
        <ol className="mt-16 grid gap-6 lg:grid-cols-3">
          {steps.map((key, i) => (
            <li key={key} className="bg-card relative rounded-3xl border-2 p-8 shadow-sm">
              <span
                className={`absolute -top-5 left-6 grid size-10 place-items-center rounded-2xl border-2 text-base font-extrabold ${accents[i]}`}
              >
                {i + 1}
              </span>
              <h3 className="mt-2 text-2xl font-extrabold">{t(`how.steps.${key}.title`)}</h3>
              <p className="text-foreground/65 mt-2 leading-relaxed">
                {t(`how.steps.${key}.body`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FinalCta() {
  const t = useTranslations('landing');
  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24">
      <div className="from-brand-500 to-brand-700 rounded-4xl bg-linear-to-br relative overflow-hidden p-10 text-white shadow-2xl sm:p-16">
        <div className="bg-sunshine-300 absolute -right-12 -top-12 size-48 rounded-full opacity-30" />
        <div className="bg-coral-300 absolute -bottom-8 -left-8 size-40 rounded-full opacity-30" />
        <div className="relative flex flex-col items-start gap-6 sm:items-center sm:text-center">
          <Sparkles className="size-12" />
          <h2 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {t('finalCta.title')}
          </h2>
          <p className="max-w-xl text-lg text-white/85">{t('finalCta.body')}</p>
          <div className="flex flex-wrap gap-3 sm:justify-center">
            <DuoButton asChild size="xl" variant="sunshine">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Link href={'/play/demo' as any}>{t('ctaPlayDemo')}</Link>
            </DuoButton>
            <DuoButton asChild size="xl" variant="ghost">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Link href={'/dashboard' as any}>{t('ctaTherapistView')}</Link>
            </DuoButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const t = useTranslations('landing');
  return (
    <footer className="bg-foreground relative z-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm opacity-70">{t('footer.copy')}</p>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="https://github.com/stafa-san/speech-therapy-game"
            className="inline-flex items-center gap-2 opacity-80 transition hover:opacity-100"
          >
            <Github className="size-4" /> {t('ctaRepo')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
