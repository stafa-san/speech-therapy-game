'use client';

// La Ruleta — animated SVG wheel divided into N segments. Spin lands
// on a word, child says it, parent advances. Pure React + framer; no
// canvas. Each turn picks the next word from the pre-shuffled session
// sequence (so the wheel is satisfying but the trial set is bounded).

import { useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DuoButton } from '@/components/ui/duo-button';

import type { GameProps, GameWord } from '../_shared/game-contract';
import { speakSpanish } from '../_shared/speech';
import { useGameSession } from '../_shared/use-game-session';

const SEGMENT_COLORS = [
  '#fb7185', // coral-500
  '#facc15', // sunshine-500
  '#10b69d', // brand-500
  '#0891b2', // sky-700
  '#7c3aed', // grape-700
  '#f97316', // orange-500
];

export function SpinTheWheelGame(props: GameProps) {
  const session = useGameSession(props);
  const t = useTranslations('player');
  const controls = useAnimationControls();
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'landed'>('idle');

  // Wheel segments: cap at 8 visually so it doesn't get cluttered.
  const segments = useWheelSegments(session.currentWord, props.config.trials);

  if (session.isComplete) return null;

  const segmentAngle = 360 / segments.length;
  const targetIndex = segments.findIndex((s) => s.id === session.currentWord.id);

  const spin = async () => {
    setPhase('spinning');
    // 4 full rotations + final position so the target is at the top (0deg).
    const final = -((targetIndex + 0.5) * segmentAngle) - 360 * 4;
    await controls.start({
      rotate: final,
      transition: { duration: 2.4, ease: [0.16, 1, 0.3, 1] },
    });
    setPhase('landed');
  };

  const advance = () => {
    setPhase('idle');
    // reset wheel rotation to 0 instantly for the next spin
    controls.set({ rotate: 0 });
    session.advance();
  };

  return (
    <div className="grid w-full max-w-md gap-6">
      <div className="from-sky-soft-100 to-grape-100 rounded-4xl bg-linear-to-br relative grid h-72 place-items-center overflow-hidden border-4 border-white shadow-xl">
        {/* Pointer */}
        <svg viewBox="0 0 40 40" className="absolute left-1/2 top-2 z-10 size-8 -translate-x-1/2">
          <polygon points="20,40 4,4 36,4" fill="#0f172a" />
          <polygon points="20,36 8,8 32,8" fill="#facc15" />
        </svg>
        <motion.svg viewBox="0 0 240 240" className="size-60 drop-shadow-xl" animate={controls}>
          <Wheel segments={segments} angle={segmentAngle} />
        </motion.svg>
      </div>

      <motion.div
        key={session.currentTrial + phase}
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

        {phase === 'idle' ? (
          <>
            <p className="text-foreground/65 max-w-xs">{t('wheel.tapToSpin')}</p>
            <DuoButton variant="sunshine" size="xl" onClick={spin} className="w-full max-w-xs">
              {t('wheel.spin')}
            </DuoButton>
          </>
        ) : phase === 'spinning' ? (
          <p className="text-foreground/65 max-w-xs">{t('wheel.spinning')}</p>
        ) : (
          <>
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
            <DuoButton variant="primary" size="xl" onClick={advance} className="w-full max-w-xs">
              {t('trial.next')}
            </DuoButton>
          </>
        )}
      </motion.div>
    </div>
  );
}

function useWheelSegments(currentWord: GameWord, totalTrials: number): GameWord[] {
  // Always include the current word + a few decoys so the wheel feels real.
  // We can derive decoys from earlier trials in a more sophisticated impl;
  // for now, repeat the current word with synthesized variants.
  void totalTrials;
  // 6 segments: alternates between current word and "filler" labels.
  return [
    currentWord,
    {
      ...currentWord,
      id: currentWord.id + '-a',
      text: '★',
      textEn: null,
      imageUrl: null,
      audioUrl: null,
    },
    currentWord,
    {
      ...currentWord,
      id: currentWord.id + '-b',
      text: '★',
      textEn: null,
      imageUrl: null,
      audioUrl: null,
    },
    currentWord,
    {
      ...currentWord,
      id: currentWord.id + '-c',
      text: '★',
      textEn: null,
      imageUrl: null,
      audioUrl: null,
    },
  ];
}

function Wheel({ segments, angle }: { segments: GameWord[]; angle: number }) {
  // Each segment is a SVG path slice from center 120,120 with radius 110.
  return (
    <g transform="translate(120 120)">
      <circle r="110" fill="white" stroke="#0f172a" strokeWidth="4" />
      {segments.map((seg, i) => {
        const start = i * angle - 90; // shift so 0 is at the top
        const end = start + angle;
        const path = sectorPath(0, 0, 100, start, end);
        const labelAngle = (start + end) / 2;
        const labelX = Math.cos((labelAngle * Math.PI) / 180) * 60;
        const labelY = Math.sin((labelAngle * Math.PI) / 180) * 60;
        const fill = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
        const label = seg.text.length > 8 ? seg.text.slice(0, 8) + '…' : seg.text;
        return (
          <g key={i}>
            <path d={path} fill={fill} stroke="white" strokeWidth="2" />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontWeight="800"
              fontSize="14"
              transform={`rotate(${labelAngle + 90} ${labelX} ${labelY})`}
            >
              {label}
            </text>
          </g>
        );
      })}
      <circle r="14" fill="#0f172a" />
      <circle r="9" fill="#facc15" />
    </g>
  );
}

function sectorPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polarToCartesian(cx, cy, r, endDeg);
  const end = polarToCartesian(cx, cy, r, startDeg);
  const large = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`;
}

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
