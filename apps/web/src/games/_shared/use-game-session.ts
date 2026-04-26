'use client';

// Tracks an in-progress game session: which trial we're on, when it
// started, and provides the advance() callback. Keeps trial bookkeeping
// out of game implementations so each game just renders its scene.

import { useCallback, useEffect, useRef, useState } from 'react';

import type { GameProps, GameWord } from './game-contract';

export interface UseGameSessionResult {
  currentTrial: number;
  currentWord: GameWord;
  trialsRemaining: number;
  isComplete: boolean;
  advance: () => void;
}

function buildSequence(words: GameWord[], trials: number): GameWord[] {
  const pool = [...words].sort(() => Math.random() - 0.5);
  const want = Math.min(trials, pool.length || trials);
  const out = pool.slice(0, want);
  while (out.length < trials && pool.length > 0) {
    out.push(pool[out.length % pool.length]!);
  }
  return out;
}

export function useGameSession({
  wordList,
  config,
  onTrialComplete,
  onGameComplete,
}: GameProps): UseGameSessionResult {
  // Lazy state initializer — runs once on mount, and is the React-19-blessed
  // place to do impure setup like Math.random() shuffling.
  const [sequence] = useState<GameWord[]>(() => buildSequence(wordList.words, config.trials));
  const startedAtRef = useRef<number>(0);
  const [trial, setTrial] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    startedAtRef.current = performance.now();
  }, []);

  const advance = useCallback(() => {
    setTrial((t) => {
      const next = t + 1;
      const word = sequence[t];
      if (word) onTrialComplete(word.id);
      if (next >= config.trials) {
        setComplete(true);
        onGameComplete({
          trialsCompleted: next,
          durationMs: performance.now() - startedAtRef.current,
        });
      }
      return next;
    });
  }, [config.trials, onGameComplete, onTrialComplete, sequence]);

  const currentWord = sequence[trial] ?? sequence[0]!;

  return {
    currentTrial: trial,
    currentWord,
    trialsRemaining: Math.max(0, config.trials - trial),
    isComplete: complete,
    advance,
  };
}
