'use client';

// Framer-Motion-animated SVG parrot placeholder. Used until a real
// .riv asset for "Lola the parrot" exists (see Project.md §9.2).
// This is also the SSR + reduced-motion fallback.

import { motion, useReducedMotion } from 'framer-motion';

import type { MascotMood, RiveMascotProps } from './index';

const BODY_COLOR = 'oklch(0.62 0.2 165)';
const ACCENT_COLOR = 'oklch(0.74 0.18 30)';
const BEAK_COLOR = 'oklch(0.85 0.16 90)';

const moodAnim: Record<MascotMood, { rotate?: number[]; y?: number[]; scale?: number[] }> = {
  idle: { y: [0, -2, 0], scale: [1, 1, 1] },
  happy: { rotate: [-3, 3, -3], scale: [1, 1.05, 1] },
  sleepy: { y: [0, 1, 0], scale: [1, 0.99, 1] },
  celebrate: { rotate: [-8, 8, -8], scale: [1, 1.1, 1], y: [0, -8, 0] },
};

export function MascotPlaceholder({
  mood,
  ariaLabel,
  className,
}: Pick<RiveMascotProps, 'mood' | 'ariaLabel' | 'className'>) {
  const prefersReducedMotion = useReducedMotion();
  const animate = prefersReducedMotion ? undefined : moodAnim[mood];
  const transition = prefersReducedMotion
    ? undefined
    : { repeat: Infinity, duration: mood === 'celebrate' ? 0.6 : 2.4, ease: 'easeInOut' as const };

  return (
    <motion.svg
      role="img"
      aria-label={ariaLabel ?? `Mascot ${mood}`}
      className={className}
      viewBox="0 0 120 120"
      width="100%"
      height="100%"
      initial={false}
      animate={animate}
      transition={transition}
    >
      {/* Body */}
      <ellipse cx="60" cy="72" rx="34" ry="32" fill={BODY_COLOR} />
      {/* Belly */}
      <ellipse cx="60" cy="80" rx="20" ry="18" fill={ACCENT_COLOR} opacity="0.85" />
      {/* Head */}
      <circle cx="60" cy="42" r="22" fill={BODY_COLOR} />
      {/* Eye */}
      <circle cx="68" cy="38" r="4" fill="white" />
      <circle cx="69" cy="38" r="2" fill="black" />
      {mood === 'sleepy' ? (
        <path
          d="M 64 38 Q 68 36 72 38"
          stroke="black"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
      ) : null}
      {/* Beak */}
      <polygon points="78,42 92,46 78,50" fill={BEAK_COLOR} />
      {/* Wing */}
      <path
        d="M 36 70 Q 50 60 56 78 Q 48 82 36 70 Z"
        fill={BODY_COLOR}
        stroke={ACCENT_COLOR}
        strokeWidth="0.8"
      />
      {mood === 'celebrate' ? (
        <>
          <circle cx="22" cy="30" r="2" fill={ACCENT_COLOR} />
          <circle cx="100" cy="34" r="2.5" fill={BEAK_COLOR} />
          <circle cx="14" cy="78" r="1.6" fill={BODY_COLOR} />
        </>
      ) : null}
    </motion.svg>
  );
}
