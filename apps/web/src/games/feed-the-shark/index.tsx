'use client';

// Alimenta al Tiburón — the reference v1 game (§6.6.1).
//
// Today: trial-card driven (React + framer). Each turn shows the target
// word; tapping "Next" feeds the shark and advances.
//
// Phaser canvas integration (animated shark eating food per turn) lands
// as a stretch PR — the contract is identical so the swap is local to
// this file. Until then we render an SVG shark that opens its mouth on tap.

import { motion } from 'framer-motion';

import { TrialCard } from '../_shared/game-shell';
import { useGameSession } from '../_shared/use-game-session';
import type { GameProps } from '../_shared/game-contract';

export function FeedTheSharkGame(props: GameProps) {
  const session = useGameSession(props);

  if (session.isComplete) return null;

  return (
    <div className="grid w-full max-w-md gap-6">
      <FeedingAnimation onTap={session.advance} />
      <TrialCard
        word={session.currentWord}
        trialIndex={session.currentTrial}
        totalTrials={props.config.trials}
        onAdvance={session.advance}
      />
    </div>
  );
}

function FeedingAnimation({ onTap }: { onTap: () => void }) {
  return (
    <motion.button
      onClick={onTap}
      whileTap={{ scale: 0.96 }}
      className="bg-accent-sky/20 mx-auto h-32 w-full overflow-hidden rounded-2xl border"
      aria-label="Feed the shark"
      type="button"
    >
      <svg viewBox="0 0 320 128" className="size-full">
        {/* Water */}
        <rect width="320" height="128" fill="oklch(0.78 0.13 235 / 0.3)" />
        {/* Shark body */}
        <motion.g
          initial={false}
          animate={{ x: [0, 220, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <ellipse cx="50" cy="80" rx="40" ry="16" fill="oklch(0.46 0.15 165)" />
          <polygon points="0,80 30,68 30,92" fill="oklch(0.46 0.15 165)" />
          <polygon points="60,55 70,80 50,80" fill="oklch(0.46 0.15 165)" />
          <circle cx="68" cy="76" r="2.5" fill="white" />
        </motion.g>
      </svg>
    </motion.button>
  );
}
