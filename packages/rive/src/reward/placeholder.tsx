'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

import type { RiveRewardProps } from './index';

const COLORS = [
  'oklch(0.62 0.2 165)',
  'oklch(0.74 0.18 30)',
  'oklch(0.85 0.16 90)',
  'oklch(0.78 0.13 235)',
];

/** Confetti + "¡Bien hecho!" card placeholder. Reduced-motion-safe. */
export function RewardPlaceholder({
  intensity = 1,
  ariaLabel,
  className,
  onComplete,
}: RiveRewardProps) {
  const prefersReducedMotion = useReducedMotion();
  const pieces = prefersReducedMotion ? 0 : Math.round(20 * Math.min(1, Math.max(0.2, intensity)));

  useEffect(() => {
    if (!onComplete) return;
    const t = window.setTimeout(onComplete, prefersReducedMotion ? 600 : 2200);
    return () => window.clearTimeout(t);
  }, [onComplete, prefersReducedMotion]);

  return (
    <div
      role="img"
      aria-label={ariaLabel ?? '¡Bien hecho!'}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {Array.from({ length: pieces }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ y: -20, x: `${(i / pieces) * 100}%`, opacity: 1, rotate: 0 }}
          animate={{
            y: '120%',
            rotate: 720,
            opacity: 0,
          }}
          transition={{ duration: 1.6 + (i % 5) * 0.1, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: 8,
            height: 12,
            background: COLORS[i % COLORS.length],
            display: 'inline-block',
            borderRadius: 2,
          }}
        />
      ))}
      <motion.div
        initial={{ scale: prefersReducedMotion ? 1 : 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div
          style={{
            background: 'oklch(0.97 0.02 165)',
            color: 'oklch(0.30 0.09 165)',
            padding: '0.75rem 1.5rem',
            borderRadius: '1rem',
            fontWeight: 700,
            fontSize: '1.25rem',
            boxShadow: '0 6px 24px oklch(0 0 0 / 0.12)',
          }}
        >
          ¡Bien hecho!
        </div>
      </motion.div>
    </div>
  );
}
