'use client';

// Decorative scene for the marketing hero — clouds, palm fronds,
// cheerful gradient sky, and floating phoneme bubbles. Pure SVG so it
// scales and the player route's bundle scan stays clean.

import { motion, useReducedMotion } from 'framer-motion';

const PHONEMES = ['/r/', '/s/', '/l/', '/ch/'];

export function HeroScene({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();

  return (
    <svg
      className={className}
      viewBox="0 0 720 540"
      width="100%"
      height="100%"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="hero-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#cef0ea" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
        <radialGradient id="hero-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="100%" stopColor="#fde68a" />
        </radialGradient>
        <linearGradient id="hero-grass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d4be" />
          <stop offset="100%" stopColor="#0d8e7a" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="720" height="540" fill="url(#hero-sky)" />

      {/* Sun */}
      <circle cx="600" cy="120" r="80" fill="url(#hero-sun)" opacity="0.95" />
      <circle cx="600" cy="120" r="50" fill="#fde68a" opacity="0.6" />

      {/* Clouds */}
      <CloudGroup prefersReduced={prefersReduced} />

      {/* Distant hills */}
      <path
        d="M 0 360 Q 120 300 240 340 Q 360 380 480 320 Q 600 280 720 340 L 720 540 L 0 540 Z"
        fill="#a7e8db"
        opacity="0.6"
      />

      {/* Front grass */}
      <path
        d="M 0 420 Q 120 400 240 420 Q 360 440 480 410 Q 600 390 720 420 L 720 540 L 0 540 Z"
        fill="url(#hero-grass)"
      />

      {/* Floating phoneme bubbles */}
      {PHONEMES.map((p, i) => (
        <FloatingBubble
          key={p}
          label={p}
          x={120 + i * 150}
          y={220 + (i % 2) * 30}
          delay={i * 0.4}
          prefersReduced={prefersReduced}
        />
      ))}

      {/* Palm tree */}
      <PalmTree x={60} y={420} />
      <PalmTree x={620} y={420} flip />
    </svg>
  );
}

function CloudGroup({ prefersReduced }: { prefersReduced: boolean | null }) {
  return (
    <motion.g
      animate={prefersReduced ? undefined : { x: [0, 20, 0] }}
      transition={
        prefersReduced ? undefined : { repeat: Infinity, duration: 14, ease: 'easeInOut' }
      }
    >
      <Cloud x={80} y={80} scale={1} />
      <Cloud x={300} y={50} scale={0.7} />
      <Cloud x={460} y={100} scale={1.1} />
    </motion.g>
  );
}

function Cloud({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="40" cy="20" rx="40" ry="16" fill="white" opacity="0.9" />
      <ellipse cx="60" cy="14" rx="22" ry="18" fill="white" opacity="0.9" />
      <ellipse cx="22" cy="14" rx="18" ry="16" fill="white" opacity="0.9" />
    </g>
  );
}

function FloatingBubble({
  label,
  x,
  y,
  delay,
  prefersReduced,
}: {
  label: string;
  x: number;
  y: number;
  delay: number;
  prefersReduced: boolean | null;
}) {
  return (
    <motion.g
      animate={prefersReduced ? undefined : { y: [y, y - 12, y], rotate: [-3, 3, -3] }}
      transition={
        prefersReduced ? undefined : { repeat: Infinity, duration: 3.6, delay, ease: 'easeInOut' }
      }
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <circle cx={x} cy={y} r="36" fill="white" opacity="0.92" />
      <circle cx={x} cy={y} r="36" fill="none" stroke="#10b69d" strokeWidth="3" opacity="0.5" />
      <text
        x={x}
        y={y + 6}
        textAnchor="middle"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontWeight="800"
        fontSize="20"
        fill="#0d8e7a"
      >
        {label}
      </text>
    </motion.g>
  );
}

function PalmTree({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x}, ${y}) ${flip ? 'scale(-1, 1)' : ''}`}>
      <path d="M 0 0 Q 4 -60 -8 -100 Q -2 -110 6 -100 Q 14 -60 12 0 Z" fill="#7c4a26" />
      <path d="M -8 -100 Q -50 -110 -80 -90 Q -60 -116 -8 -110 Z" fill="#0d8e7a" opacity="0.95" />
      <path d="M 12 -100 Q 60 -120 90 -100 Q 70 -126 12 -112 Z" fill="#10b69d" opacity="0.95" />
      <path d="M 0 -110 Q 0 -160 -30 -180 Q 6 -170 8 -110 Z" fill="#34d4be" opacity="0.95" />
    </g>
  );
}
