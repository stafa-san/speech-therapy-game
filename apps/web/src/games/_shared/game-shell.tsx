'use client';

// Shared shell every game lives inside. Owns the intro/play/end screens
// and the end-of-game reward. Games slot in as `<children />` rendering
// the actual scene during the play phase.
//
// Project.md §6.6:
//   - Intro: "¡Vamos a practicar la /r/!" + Empezar button.
//   - Each turn: target word + image + 🔊 button → child says it →
//     adult taps to advance → game scene reacts → Rive micro-celebration.
//   - End: full-canvas reward + "¡Otra vez!" / "Otro juego con esta lista".

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { RiveReward } from '@habla/rive';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { GameWordList } from './game-contract';

type Phase = 'intro' | 'play' | 'end';

export interface GameShellProps {
  wordList: GameWordList;
  trials: number;
  onPlayAgain?: () => void;
  children: (args: {
    onTrialComplete: (id: string) => void;
    onGameComplete: () => void;
  }) => React.ReactNode;
}

export function GameShell({ wordList, trials: _trials, onPlayAgain, children }: GameShellProps) {
  const t = useTranslations('player');
  // We key the entire shell on wordList.id from the parent, so this
  // component effectively remounts on a new list — no manual reset needed.
  const [phase, setPhase] = useState<Phase>('intro');
  const [completedTrials, setCompletedTrials] = useState(0);

  if (phase === 'intro') {
    return (
      <main className="grid min-h-dvh place-items-center px-4 py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="bg-card mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border p-8 text-center shadow-sm"
        >
          <Badge variant="secondary" className="text-base">
            {wordList.phonemeSymbol}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('intro.title', { phoneme: wordList.phonemeSymbol })}
          </h1>
          <p className="text-muted-foreground">{t('intro.description')}</p>
          <Button size="lg" onClick={() => setPhase('play')}>
            {t('intro.start')}
          </Button>
        </motion.div>
      </main>
    );
  }

  if (phase === 'end') {
    return (
      <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4">
        <div className="absolute inset-0 -z-10 grid place-items-center">
          <div className="size-full max-w-2xl">
            <RiveReward intensity={0.9} />
          </div>
        </div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4, delay: 1.2 }}
          className="bg-card mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border p-8 text-center shadow-lg"
        >
          <h1 className="text-3xl font-bold tracking-tight">{t('end.title')}</h1>
          <p className="text-muted-foreground">{t('end.summary', { count: completedTrials })}</p>
          <div className="mt-2 flex flex-col gap-2">
            <Button
              size="lg"
              onClick={() => {
                setCompletedTrials(0);
                setPhase('play');
                onPlayAgain?.();
              }}
            >
              {t('end.again')}
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      {children({
        onTrialComplete: () => setCompletedTrials((c) => c + 1),
        onGameComplete: () => setPhase('end'),
      })}
    </main>
  );
}

export function TrialCard({
  word,
  trialIndex,
  totalTrials,
  onAdvance,
}: {
  word: { text: string; imageUrl: string | null; audioUrl: string | null };
  trialIndex: number;
  totalTrials: number;
  onAdvance: () => void;
}) {
  const t = useTranslations('player');
  const playAudio = () => {
    if (!word.audioUrl) return;
    if (typeof Audio === 'undefined') return;
    const a = new Audio(word.audioUrl);
    a.play().catch(() => {
      // User-gesture autoplay restrictions; ignore — child needs to tap manually.
    });
  };

  return (
    <motion.div
      key={word.text}
      initial={{ x: 32, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -32, opacity: 0 }}
      className="bg-card mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border p-6 text-center shadow-sm"
    >
      <p className="text-muted-foreground text-xs uppercase tracking-wide">
        {t('trial.label', { current: trialIndex + 1, total: totalTrials })}
      </p>
      <h2 className="text-5xl font-bold tracking-tight">{word.text}</h2>
      {word.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={word.imageUrl}
          alt={word.text}
          className="mx-auto size-48 rounded-xl object-cover"
        />
      ) : (
        <div className="bg-muted/50 grid size-48 place-items-center rounded-xl text-5xl">✨</div>
      )}
      <Button variant="outline" onClick={playAudio} aria-label={t('trial.play')}>
        <Volume2 />
        {t('trial.play')}
      </Button>
      <Button size="lg" onClick={onAdvance}>
        {t('trial.next')}
      </Button>
    </motion.div>
  );
}
