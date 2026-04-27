'use client';

// Lola the parrot — hand-drawn SVG with per-mood pose and gentle ambient
// motion. Used until a real .riv asset lands. Reduced-motion-safe.

import { motion, useReducedMotion } from 'framer-motion';
import type { TargetAndTransition } from 'framer-motion';

import type { MascotMood, RiveMascotProps } from './index';

// Brand-aligned palette — these mirror @habla/config tokens at the value
// level (the SVG is rendered into many surfaces; we don't want it to depend
// on Tailwind being present).
const COLORS = {
  body: '#10b69d', // brand-500-ish
  bodyShade: '#0d8e7a', // brand-700-ish
  belly: '#fde68a',
  bellyShade: '#facc15',
  beak: '#f97316',
  beakShade: '#c2410c',
  eyeWhite: '#ffffff',
  pupil: '#0f172a',
  cheek: '#fb7185',
  feather: '#06b6d4',
  shineSparkle: '#fef08a',
};

const bodyAnim: Record<MascotMood, TargetAndTransition> = {
  idle: { y: [0, -6, 0], rotate: [0, -0.6, 0] },
  happy: { y: [0, -10, 0], rotate: [-2, 2, -2] },
  sleepy: { y: [0, -2, 0], rotate: [0, 0.4, 0] },
  celebrate: { y: [0, -22, 0], rotate: [-8, 8, -8] },
};

const wingAnim: Record<MascotMood, TargetAndTransition> = {
  idle: { rotate: [0, 4, 0] },
  happy: { rotate: [-6, 18, -6] },
  sleepy: { rotate: [0, 1, 0] },
  celebrate: { rotate: [-20, 30, -20] },
};

const TIMINGS: Record<MascotMood, number> = {
  idle: 2.4,
  happy: 1.4,
  sleepy: 3.2,
  celebrate: 0.8,
};

export function MascotPlaceholder({
  mood,
  ariaLabel,
  className,
}: Pick<RiveMascotProps, 'mood' | 'ariaLabel' | 'className'>) {
  const prefersReduced = useReducedMotion();
  const duration = TIMINGS[mood];
  const isSleepy = mood === 'sleepy';
  const isCelebrate = mood === 'celebrate';
  const isHappy = mood === 'happy' || mood === 'celebrate';

  return (
    <motion.svg
      role="img"
      aria-label={ariaLabel ?? `Lola — ${mood}`}
      className={className}
      viewBox="0 0 240 240"
      width="100%"
      height="100%"
      initial={false}
    >
      <defs>
        <radialGradient id="lola-body" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#34d4be" />
          <stop offset="100%" stopColor={COLORS.bodyShade} />
        </radialGradient>
        <radialGradient id="lola-belly" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor={COLORS.bellyShade} />
        </radialGradient>
        <linearGradient id="lola-beak" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor={COLORS.beakShade} />
        </linearGradient>
      </defs>

      {/* Floor shadow */}
      <motion.ellipse
        cx="120"
        cy="220"
        rx="60"
        ry="8"
        fill="#0f172a"
        opacity="0.08"
        animate={prefersReduced ? undefined : { rx: [60, 50, 60] }}
        transition={prefersReduced ? undefined : { repeat: Infinity, duration, ease: 'easeInOut' }}
      />

      {/* Body group with bob */}
      <motion.g
        animate={prefersReduced ? undefined : bodyAnim[mood]}
        transition={prefersReduced ? undefined : { repeat: Infinity, duration, ease: 'easeInOut' }}
        style={{ originX: '120px', originY: '180px' }}
      >
        {/* Tail feathers — fanned behind body */}
        <path d="M 60 175 Q 38 180 32 165 Q 50 168 60 158 Z" fill={COLORS.feather} opacity="0.85" />
        <path d="M 56 165 Q 30 158 28 142 Q 50 152 62 142 Z" fill={COLORS.cheek} opacity="0.85" />
        <path
          d="M 60 158 Q 40 138 50 120 Q 62 138 72 130 Z"
          fill={COLORS.shineSparkle}
          opacity="0.9"
        />

        {/* Body — pear-shaped */}
        <ellipse cx="120" cy="155" rx="62" ry="60" fill="url(#lola-body)" />

        {/* Belly */}
        <ellipse cx="120" cy="172" rx="38" ry="36" fill="url(#lola-belly)" />

        {/* Wing on the body's right side, animated */}
        <motion.path
          d="M 76 140 Q 92 116 110 138 Q 108 168 88 168 Q 68 162 76 140 Z"
          fill={COLORS.bodyShade}
          stroke={COLORS.body}
          strokeWidth="1.5"
          animate={prefersReduced ? undefined : wingAnim[mood]}
          transition={
            prefersReduced
              ? undefined
              : { repeat: Infinity, duration: duration * 0.8, ease: 'easeInOut' }
          }
          style={{ originX: '110px', originY: '135px' }}
        />

        {/* Head */}
        <circle cx="120" cy="92" r="46" fill="url(#lola-body)" />

        {/* Cheeks */}
        {isHappy ? (
          <>
            <circle cx="86" cy="105" r="7" fill={COLORS.cheek} opacity="0.55" />
            <circle cx="154" cy="105" r="7" fill={COLORS.cheek} opacity="0.55" />
          </>
        ) : null}

        {/* Eyes */}
        {isSleepy ? (
          <>
            <path
              d="M 100 88 Q 108 84 116 88"
              stroke={COLORS.pupil}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 124 88 Q 132 84 140 88"
              stroke={COLORS.pupil}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <ellipse cx="108" cy="86" rx="8" ry="9" fill={COLORS.eyeWhite} />
            <ellipse cx="132" cy="86" rx="8" ry="9" fill={COLORS.eyeWhite} />
            <circle cx={isCelebrate ? 110 : 109} cy="88" r="4.5" fill={COLORS.pupil} />
            <circle cx={isCelebrate ? 134 : 133} cy="88" r="4.5" fill={COLORS.pupil} />
            <circle cx={isCelebrate ? 111 : 110} cy="86" r="1.6" fill={COLORS.eyeWhite} />
            <circle cx={isCelebrate ? 135 : 134} cy="86" r="1.6" fill={COLORS.eyeWhite} />
          </>
        )}

        {/* Beak */}
        <path
          d="M 116 100 Q 120 116 124 100 Q 128 108 120 114 Q 112 108 116 100 Z"
          fill="url(#lola-beak)"
          stroke={COLORS.beakShade}
          strokeWidth="0.6"
        />

        {/* Crest feathers */}
        <path
          d="M 102 50 Q 110 30 118 50 Q 126 32 134 50 Q 138 36 144 52"
          stroke={COLORS.shineSparkle}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 102 50 Q 110 30 118 50 Q 126 32 134 50 Q 138 36 144 52"
          stroke={COLORS.beak}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Feet */}
        <path
          d="M 100 210 Q 100 214 96 214 M 108 210 Q 108 214 112 214"
          stroke={COLORS.beakShade}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 132 210 Q 132 214 128 214 M 140 210 Q 140 214 144 214"
          stroke={COLORS.beakShade}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </motion.g>

      {/* Sparkles for celebrate */}
      {isCelebrate && !prefersReduced ? (
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
        >
          <path
            d="M 200 60 L 204 70 L 214 74 L 204 78 L 200 88 L 196 78 L 186 74 L 196 70 Z"
            fill={COLORS.shineSparkle}
          />
          <path
            d="M 36 40 L 40 50 L 50 54 L 40 58 L 36 68 L 32 58 L 22 54 L 32 50 Z"
            fill={COLORS.cheek}
          />
          <path
            d="M 30 150 L 33 156 L 39 159 L 33 162 L 30 168 L 27 162 L 21 159 L 27 156 Z"
            fill={COLORS.feather}
          />
        </motion.g>
      ) : null}

      {/* "Z" for sleepy */}
      {isSleepy && !prefersReduced ? (
        <motion.text
          x="172"
          y="64"
          fill={COLORS.pupil}
          fontSize="22"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          initial={{ y: 84, opacity: 0 }}
          animate={{ y: 50, opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: 'easeOut' }}
        >
          z
        </motion.text>
      ) : null}
    </motion.svg>
  );
}
