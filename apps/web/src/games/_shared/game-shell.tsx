'use client';

// Shared shell every game lives inside. Owns the intro/play/end screens
// and the end-of-game reward. Games slot in as `<children />` rendering
// the actual scene during the play phase.
//
// Visual language follows the Duolingo-inspired design system:
// - DuoButton for every kid-facing CTA.
// - Lola the parrot for personality on intro + end.
// - Big, bouncy, gradient backgrounds keyed off the phoneme.

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Home, Shuffle, Star, Volume2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { RiveMascot, RiveReward } from '@habla/rive';

import { Badge } from '@/components/ui/badge';
import { DuoButton } from '@/components/ui/duo-button';

import type { GameWordList } from './game-contract';
import { speakSpanish } from './speech';

type Phase = 'intro' | 'play' | 'end';

export interface GameShellProps {
  wordList: GameWordList;
  trials: number;
  /** Slug of the game we're inside — used to "try another game" link out. */
  gameSlug?: string;
  onPlayAgain?: () => void;
  children: (args: {
    onTrialComplete: (id: string) => void;
    onGameComplete: () => void;
  }) => React.ReactNode;
}

const ALL_GAMES = ['feed-the-shark', 'build-a-monster', 'spin-the-wheel'] as const;

function nextGameSlug(current: string | undefined): string {
  const others = ALL_GAMES.filter((g) => g !== current);
  return others[Math.floor(Math.random() * others.length)] ?? ALL_GAMES[0];
}

export function GameShell({ wordList, trials, gameSlug, onPlayAgain, children }: GameShellProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [completedTrials, setCompletedTrials] = useState(0);

  if (phase === 'intro')
    return <IntroScreen wordList={wordList} onStart={() => setPhase('play')} />;

  if (phase === 'end') {
    return (
      <EndScreen
        completedTrials={completedTrials}
        totalTrials={trials}
        gameSlug={gameSlug}
        onPlayAgain={() => {
          setCompletedTrials(0);
          setPhase('play');
          onPlayAgain?.();
        }}
      />
    );
  }

  return (
    <main className="bg-hero-gradient grid min-h-dvh place-items-center px-4 py-8">
      <PlayHud
        phonemeSymbol={wordList.phonemeSymbol}
        completedTrials={completedTrials}
        totalTrials={trials}
      />
      {children({
        onTrialComplete: () => setCompletedTrials((c) => c + 1),
        onGameComplete: () => setPhase('end'),
      })}
    </main>
  );
}

function IntroScreen({ wordList, onStart }: { wordList: GameWordList; onStart: () => void }) {
  const t = useTranslations('player');
  return (
    <main className="bg-hero-gradient relative grid min-h-dvh place-items-center overflow-hidden px-4 py-8">
      <div className="bg-sunshine-300 pointer-events-none absolute -left-12 top-12 size-40 rounded-full opacity-40 blur-xl" />
      <div className="bg-coral-300 pointer-events-none absolute -bottom-10 right-0 size-56 rounded-full opacity-40 blur-xl" />

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 0.7 }}
        className="bg-card rounded-4xl relative z-10 mx-auto flex w-full max-w-md flex-col items-center gap-5 border-4 border-white p-8 text-center shadow-2xl"
      >
        <div className="from-brand-100 to-brand-50 bg-linear-to-br grid size-44 place-items-center rounded-full">
          <RiveMascot mood="happy" className="size-40" forcePlaceholder />
        </div>
        <Badge
          variant="secondary"
          className="bg-sunshine-300 text-coral-700 border-coral-300 px-3 py-1 text-base font-extrabold"
        >
          {wordList.phonemeSymbol}
        </Badge>
        <h1 className="text-foreground text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {t('intro.title', { phoneme: wordList.phonemeSymbol })}
        </h1>
        <p className="text-foreground/65 max-w-xs">{t('intro.description')}</p>
        <DuoButton size="xl" variant="primary" onClick={onStart} className="mt-2 w-full max-w-xs">
          {t('intro.start')}
        </DuoButton>
      </motion.div>
    </main>
  );
}

function EndScreen({
  completedTrials,
  totalTrials,
  gameSlug,
  onPlayAgain,
}: {
  completedTrials: number;
  totalTrials: number;
  gameSlug: string | undefined;
  onPlayAgain: () => void;
}) {
  const t = useTranslations('player');
  const ratio = completedTrials / Math.max(1, totalTrials);
  const stars = ratio >= 1 ? 3 : ratio >= 0.66 ? 2 : ratio >= 0.33 ? 1 : 0;
  const tryNext = nextGameSlug(gameSlug);

  return (
    <main className="bg-celebrate-gradient relative grid min-h-dvh place-items-center overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute inset-0">
        <RiveReward intensity={1} />
      </div>
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.6 }}
        className="bg-card rounded-4xl relative z-10 mx-auto flex w-full max-w-md flex-col items-center gap-5 border-4 border-white p-8 text-center shadow-2xl"
      >
        <div className="from-sunshine-300 to-coral-300 bg-linear-to-br grid size-44 place-items-center rounded-full">
          <RiveMascot mood="celebrate" className="size-40" forcePlaceholder />
        </div>
        <h1 className="text-foreground text-4xl font-extrabold tracking-tight">{t('end.title')}</h1>
        <div className="flex gap-2" aria-label={`${stars} of 3 stars`}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.6, delay: 1 + i * 0.18 }}
            >
              <Star
                className={`size-12 ${i < stars ? 'fill-sunshine-500 text-sunshine-700' : 'fill-muted text-muted-foreground/30'}`}
                strokeWidth={2.5}
              />
            </motion.div>
          ))}
        </div>
        <p className="text-foreground/65">{t('end.summary', { count: completedTrials })}</p>

        <div className="mt-2 flex w-full max-w-xs flex-col gap-3">
          <DuoButton size="xl" variant="primary" onClick={onPlayAgain}>
            {t('end.again')}
          </DuoButton>
          <DuoButton asChild size="lg" variant="sky">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Link href={`/play/demo?game=${tryNext}` as any}>
              <Shuffle className="size-4" />
              {t('end.tryAnother')}
            </Link>
          </DuoButton>
          <DuoButton asChild size="lg" variant="ghost">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Link href={'/' as any}>
              <Home className="size-4" />
              {t('end.home')}
            </Link>
          </DuoButton>
        </div>
      </motion.div>
    </main>
  );
}

function PlayHud({
  phonemeSymbol,
  completedTrials,
  totalTrials,
}: {
  phonemeSymbol: string;
  completedTrials: number;
  totalTrials: number;
}) {
  const t = useTranslations('player');
  const progress = Math.round((completedTrials / Math.max(1, totalTrials)) * 100);
  return (
    <div className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-md items-center gap-2 px-3 py-4 sm:gap-3 sm:px-4">
      <Link
        href="/"
        aria-label={t('exit')}
        className="bg-card text-foreground/65 hover:bg-coral-100 hover:text-coral-700 grid size-10 shrink-0 place-items-center rounded-full border-2 border-white shadow-md transition-colors"
      >
        <X className="size-5" />
      </Link>
      <Badge
        variant="secondary"
        className="bg-card border-brand-300 text-brand-700 rounded-full border-2 px-3 py-1 text-base font-extrabold"
      >
        {phonemeSymbol}
      </Badge>
      <div className="bg-card/80 relative h-3 flex-1 overflow-hidden rounded-full border-2 border-white">
        <motion.div
          className="from-brand-500 to-coral-500 bg-linear-to-r absolute inset-y-0 left-0"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', bounce: 0.2 }}
        />
      </div>
      <div className="text-coral-500 flex items-center gap-1 font-bold">
        <Heart className="fill-coral-500 size-5" />
        <span className="text-sm">{totalTrials - completedTrials}</span>
      </div>
    </div>
  );
}

export function TrialCard({
  word,
  trialIndex,
  totalTrials,
  onAdvance,
}: {
  word: { text: string; textEn: string | null; imageUrl: string | null; audioUrl: string | null };
  trialIndex: number;
  totalTrials: number;
  onAdvance: () => void;
}) {
  const t = useTranslations('player');

  const playAudio = () => {
    // Prefer pre-recorded audio if uploaded (PR 15 media pipeline). Fall
    // back to Web Speech API so the demo works zero-config.
    if (word.audioUrl && typeof Audio !== 'undefined') {
      const a = new Audio(word.audioUrl);
      a.play().catch(() => {
        void speakSpanish(word.text);
      });
      return;
    }
    void speakSpanish(word.text);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={word.text + trialIndex}
        initial={{ y: 24, opacity: 0, rotateX: -20 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        exit={{ y: -24, opacity: 0, rotateX: 20 }}
        transition={{ type: 'spring', bounce: 0.35, duration: 0.5 }}
        className="bg-card rounded-4xl relative z-10 mx-auto flex w-full max-w-md flex-col items-center gap-6 border-4 border-white p-8 text-center shadow-2xl"
      >
        <p className="text-foreground/40 text-xs font-bold uppercase tracking-[0.3em]">
          {t('trial.label', { current: trialIndex + 1, total: totalTrials })}
        </p>

        {word.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={word.imageUrl}
            alt={word.text}
            className="border-brand-100 mx-auto size-44 rounded-3xl border-4 object-cover"
          />
        ) : (
          <div className="from-sunshine-300 to-coral-300 border-coral-300 bg-linear-to-br grid size-44 place-items-center rounded-3xl border-4 text-6xl">
            🎈
          </div>
        )}

        <div className="flex flex-col items-center gap-1">
          <h2
            className="text-foreground text-5xl font-extrabold tracking-tight sm:text-6xl"
            lang="es"
          >
            {word.text}
          </h2>
          {word.textEn ? (
            <p className="text-foreground/55 text-base font-medium" lang="en">
              {word.textEn}
            </p>
          ) : null}
        </div>

        <DuoButton variant="sky" size="md" onClick={playAudio} aria-label={t('trial.play')}>
          <Volume2 className="size-5" />
          {t('trial.play')}
        </DuoButton>

        <DuoButton variant="primary" size="xl" onClick={onAdvance} className="w-full max-w-xs">
          {t('trial.next')}
        </DuoButton>
      </motion.div>
    </AnimatePresence>
  );
}
