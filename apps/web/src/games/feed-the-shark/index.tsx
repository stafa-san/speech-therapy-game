'use client';

// Alimenta al Tiburón — pure React + framer-motion. The school of fish
// shrinks every turn as the shark "eats" them: when advance() fires, the
// next fish swims into the shark's mouth, the shark chomps, and the fish
// pops out. After all trials, the shark is full and waves its tail.

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DuoButton } from '@/components/ui/duo-button';

import type { GameProps } from '../_shared/game-contract';
import { speakSpanish } from '../_shared/speech';
import { useGameSession } from '../_shared/use-game-session';

const FISH_COLORS = ['#facc15', '#fb7185', '#34d4be', '#0891b2', '#a78bfa', '#f97316'];

export function FeedTheSharkGame(props: GameProps) {
  const session = useGameSession(props);
  const t = useTranslations('player');
  const [chomp, setChomp] = useState(false);

  if (session.isComplete) return null;

  const handleAdvance = () => {
    setChomp(true);
    session.advance();
    window.setTimeout(() => setChomp(false), 600);
  };

  return (
    <div className="grid w-full max-w-md gap-6">
      <SharkCanvas
        totalFish={session.sequence.length}
        eatenFish={session.currentTrial}
        chomp={chomp}
      />

      <motion.div
        key={session.currentWord.text + session.currentTrial}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="bg-card rounded-4xl flex flex-col items-center gap-4 border-4 border-white p-6 text-center shadow-2xl"
      >
        <p className="text-foreground/40 text-xs font-bold uppercase tracking-[0.3em]">
          {t('trial.label', {
            current: session.currentTrial + 1,
            total: props.config.trials,
          })}
        </p>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-foreground text-5xl font-extrabold tracking-tight" lang="es">
            {session.currentWord.text}
          </h2>
          {session.currentWord.textEn ? (
            <p className="text-foreground/55 text-base font-medium" lang="en">
              {session.currentWord.textEn}
            </p>
          ) : null}
        </div>
        <DuoButton
          variant="sky"
          size="md"
          onClick={() => void speakSpanish(session.currentWord.text)}
        >
          <Volume2 className="size-5" />
          {t('trial.play')}
        </DuoButton>
        <DuoButton variant="primary" size="xl" onClick={handleAdvance} className="w-full max-w-xs">
          {t('trial.next')}
        </DuoButton>
      </motion.div>
    </div>
  );
}

function SharkCanvas({
  totalFish,
  eatenFish,
  chomp,
}: {
  totalFish: number;
  eatenFish: number;
  chomp: boolean;
}) {
  return (
    <div className="rounded-4xl relative grid h-64 place-items-center overflow-hidden border-4 border-white shadow-xl">
      <svg viewBox="0 0 320 200" className="size-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="fts-water" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>

        <rect width="320" height="200" fill="url(#fts-water)" />
        <Bubbles />

        {/* Fish school — one fish per upcoming trial */}
        <AnimatePresence>
          {Array.from({ length: totalFish }).map((_, i) => {
            const eaten = i < eatenFish;
            // Each fish gets a stable orbit slot
            const slot = i / Math.max(1, totalFish);
            // x position spread across the right half; eaten fish are gone.
            const baseX = 220 + (i % 3) * 22;
            const baseY = 60 + slot * 100;
            const color = FISH_COLORS[i % FISH_COLORS.length]!;
            // Currently-being-eaten fish (i === eatenFish - 1 when chomp fires)
            const isCurrent = i === eatenFish - 1 && chomp;

            return !eaten || isCurrent ? (
              <motion.g
                key={`fish-${i}`}
                initial={{ x: baseX, y: baseY, opacity: 1 }}
                animate={
                  isCurrent
                    ? { x: 130, y: 110, opacity: [1, 1, 0], scale: [1, 1, 0.4] }
                    : { x: [baseX, baseX - 8, baseX], y: [baseY, baseY - 4, baseY] }
                }
                exit={{ opacity: 0, scale: 0 }}
                transition={
                  isCurrent
                    ? { duration: 0.55, times: [0, 0.7, 1] }
                    : {
                        repeat: Infinity,
                        duration: 2.6 + (i % 4) * 0.3,
                        ease: 'easeInOut',
                      }
                }
              >
                <Fish color={color} />
              </motion.g>
            ) : null;
          })}
        </AnimatePresence>

        {/* Shark in the middle-left, swims a tiny idle wobble */}
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <Shark chomp={chomp} />
        </motion.g>

        {/* Splash effect when chomping */}
        {chomp ? (
          <motion.g
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.4, 0.8] }}
            transition={{ duration: 0.55 }}
          >
            <circle cx="138" cy="105" r="10" fill="white" opacity="0.7" />
            <circle cx="148" cy="98" r="6" fill="white" opacity="0.7" />
            <circle cx="128" cy="98" r="5" fill="white" opacity="0.7" />
          </motion.g>
        ) : null}
      </svg>
    </div>
  );
}

function Fish({ color }: { color: string }) {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="14" ry="9" fill={color} />
      <polygon points="-12,0 -22,-8 -22,8" fill={color} />
      {/* belly highlight */}
      <ellipse cx="2" cy="2" rx="9" ry="4" fill="white" opacity="0.4" />
      {/* eye */}
      <circle cx="7" cy="-2" r="2" fill="white" />
      <circle cx="7" cy="-2" r="1" fill="#0f172a" />
      {/* fin */}
      <polygon points="0,-5 -4,-12 4,-9" fill={color} opacity="0.85" />
    </g>
  );
}

function Shark({ chomp }: { chomp: boolean }) {
  // Shark anchored around (90, 110); "chomp" rotates lower jaw open.
  return (
    <g transform="translate(90 110)">
      {/* Tail */}
      <motion.polygon
        points="-30,0 -56,-22 -56,22"
        fill="#475569"
        animate={{ rotate: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        style={{ transformOrigin: '-30px 0px' }}
      />
      {/* Body */}
      <ellipse cx="0" cy="0" rx="40" ry="18" fill="#475569" />
      <ellipse cx="0" cy="-6" rx="36" ry="9" fill="#94a3b8" />
      {/* Top fin */}
      <polygon points="-2,-22 16,0 -22,0" fill="#475569" />
      {/* Eye */}
      <circle cx="22" cy="-3" r="3.4" fill="white" />
      <circle cx="23" cy="-3" r="1.8" fill="#0f172a" />
      {/* Upper jaw */}
      <path d="M 30 -2 Q 46 0 46 2 Q 38 6 30 8 Z" fill="#1e293b" />
      <polygon points="30,2 34,-2 38,2" fill="white" />
      <polygon points="38,2 42,-2 46,2" fill="white" />
      {/* Lower jaw — opens on chomp */}
      <motion.g
        animate={chomp ? { rotate: [0, 24, 0] } : undefined}
        transition={chomp ? { duration: 0.55 } : undefined}
        style={{ transformOrigin: '30px 4px' }}
      >
        <path d="M 30 4 Q 46 4 46 8 Q 38 14 30 12 Z" fill="#1e293b" />
        <polygon points="30,8 34,12 38,8" fill="white" />
        <polygon points="38,8 42,12 46,8" fill="white" />
      </motion.g>
    </g>
  );
}

function Bubbles() {
  return (
    <g opacity="0.7">
      <motion.circle
        cx="40"
        cy="160"
        r="3"
        fill="white"
        animate={{ y: [-0, -120], opacity: [0.7, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
      />
      <motion.circle
        cx="60"
        cy="160"
        r="2"
        fill="white"
        animate={{ y: [-0, -120], opacity: [0.7, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'linear', delay: 1 }}
      />
      <motion.circle
        cx="280"
        cy="160"
        r="2"
        fill="white"
        animate={{ y: [-0, -120], opacity: [0.7, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'linear', delay: 2 }}
      />
    </g>
  );
}
