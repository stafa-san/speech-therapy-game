'use client';

// Arma el Monstruo — each correct trial grows a piece of the monster.
// SVG-only; no canvas/WASM. Body parts pop in with a spring animation;
// when all 8 parts are in, the monster does a happy bounce.

import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DuoButton } from '@/components/ui/duo-button';

import type { GameProps } from '../_shared/game-contract';
import { speakSpanish } from '../_shared/speech';
import { useGameSession } from '../_shared/use-game-session';

const PART_ORDER = [
  'body',
  'eyeLeft',
  'mouth',
  'hornLeft',
  'armLeft',
  'armRight',
  'eyeRight',
  'hornRight',
  'spots',
  'legs',
] as const;
type Part = (typeof PART_ORDER)[number];

export function BuildAMonsterGame(props: GameProps) {
  const session = useGameSession(props);
  const t = useTranslations('player');

  const partsVisible = session.currentTrial; // grows every advance
  const showAll = session.currentTrial >= PART_ORDER.length;

  if (session.isComplete) return null;

  return (
    <div className="grid w-full max-w-md gap-6">
      <MonsterCanvas visibleCount={partsVisible} bouncing={showAll} />

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
        <DuoButton
          variant="primary"
          size="xl"
          onClick={session.advance}
          className="w-full max-w-xs"
        >
          {t('trial.next')}
        </DuoButton>
      </motion.div>
    </div>
  );
}

function MonsterCanvas({ visibleCount, bouncing }: { visibleCount: number; bouncing: boolean }) {
  const visible = (part: Part) => PART_ORDER.indexOf(part) < visibleCount;

  return (
    <div className="from-grape-100 to-sunshine-100 rounded-4xl bg-linear-to-br relative grid h-64 place-items-center overflow-hidden border-4 border-white shadow-xl">
      <motion.svg
        viewBox="0 0 240 240"
        className="size-56"
        animate={bouncing ? { y: [0, -10, 0], rotate: [-2, 2, -2] } : undefined}
        transition={bouncing ? { repeat: Infinity, duration: 0.8 } : undefined}
      >
        <defs>
          <linearGradient id="monster-body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <radialGradient id="monster-belly" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </radialGradient>
        </defs>

        <Part show={visible('body')}>
          {/* Body */}
          <path
            d="M 60 120 Q 60 60 120 60 Q 180 60 180 120 Q 180 200 120 200 Q 60 200 60 120 Z"
            fill="url(#monster-body)"
          />
          {/* Belly */}
          <ellipse cx="120" cy="148" rx="44" ry="40" fill="url(#monster-belly)" />
        </Part>

        <Part show={visible('eyeLeft')}>
          <circle cx="98" cy="108" r="14" fill="white" />
          <circle cx="100" cy="108" r="6" fill="#0f172a" />
          <circle cx="102" cy="106" r="2" fill="white" />
        </Part>

        <Part show={visible('mouth')}>
          <path
            d="M 96 154 Q 120 174 144 154"
            stroke="#0f172a"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 100 156 L 100 162 L 110 162 L 110 158"
            fill="white"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
        </Part>

        <Part show={visible('hornLeft')}>
          <path
            d="M 80 60 Q 70 32 86 24 Q 92 44 92 60 Z"
            fill="#facc15"
            stroke="#c2410c"
            strokeWidth="2"
          />
        </Part>

        <Part show={visible('armLeft')}>
          <path d="M 60 124 Q 36 132 30 156 Q 28 162 36 162 Q 38 152 56 148 Z" fill="#7c3aed" />
          <circle cx="32" cy="158" r="8" fill="#a78bfa" />
        </Part>

        <Part show={visible('armRight')}>
          <path
            d="M 180 124 Q 204 132 210 156 Q 212 162 204 162 Q 202 152 184 148 Z"
            fill="#7c3aed"
          />
          <circle cx="208" cy="158" r="8" fill="#a78bfa" />
        </Part>

        <Part show={visible('eyeRight')}>
          <circle cx="142" cy="108" r="14" fill="white" />
          <circle cx="144" cy="108" r="6" fill="#0f172a" />
          <circle cx="146" cy="106" r="2" fill="white" />
        </Part>

        <Part show={visible('hornRight')}>
          <path
            d="M 160 60 Q 170 32 154 24 Q 148 44 148 60 Z"
            fill="#facc15"
            stroke="#c2410c"
            strokeWidth="2"
          />
        </Part>

        <Part show={visible('spots')}>
          <circle cx="80" cy="170" r="6" fill="#7c3aed" opacity="0.6" />
          <circle cx="160" cy="180" r="5" fill="#7c3aed" opacity="0.6" />
          <circle cx="100" cy="80" r="4" fill="#a78bfa" />
          <circle cx="148" cy="78" r="4" fill="#a78bfa" />
        </Part>

        <Part show={visible('legs')}>
          <ellipse cx="92" cy="206" rx="18" ry="10" fill="#7c3aed" />
          <ellipse cx="148" cy="206" rx="18" ry="10" fill="#7c3aed" />
          <ellipse cx="92" cy="206" rx="10" ry="6" fill="#fef3c7" />
          <ellipse cx="148" cy="206" rx="10" ry="6" fill="#fef3c7" />
        </Part>
      </motion.svg>

      {/* Decorative sparkles */}
      <div className="bg-sunshine-300 absolute -right-6 -top-6 size-20 rounded-full opacity-50 blur-xl" />
      <div className="bg-coral-300 absolute -bottom-6 -left-6 size-24 rounded-full opacity-40 blur-xl" />
    </div>
  );
}

function Part({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <motion.g
      initial={{ scale: 0, rotate: -10, opacity: 0 }}
      animate={show ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: -10, opacity: 0 }}
      transition={{ type: 'spring', bounce: 0.6, duration: 0.6 }}
      style={{ transformOrigin: 'center' }}
    >
      {children}
    </motion.g>
  );
}
