'use client';

// La Ruleta — animated SVG wheel. Segments are the next N words in the
// session sequence (capped at 8 so each segment stays readable). On spin,
// the wheel rotates so the *current* trial's segment lands at the top
// pointer. Each turn the wheel rebuilds with a new "current" segment, so
// the player sees the wheel evolve as the session progresses.

import { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DuoButton } from '@/components/ui/duo-button';

import type { GameProps, GameWord } from '../_shared/game-contract';
import { speakSpanish } from '../_shared/speech';
import { useGameSession } from '../_shared/use-game-session';

const SEGMENT_COLORS = [
  '#fb7185', // coral
  '#facc15', // sunshine
  '#34d4be', // brand
  '#0891b2', // sky
  '#a78bfa', // grape
  '#f97316', // orange
  '#fda4af', // rose
  '#5eead4', // teal
];

const MAX_SEGMENTS = 8;

export function SpinTheWheelGame(props: GameProps) {
  const session = useGameSession(props);
  const t = useTranslations('player');
  const controls = useAnimationControls();
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'landed'>('idle');

  // Build segments from the upcoming + current word. We rotate the
  // sequence so `currentWord` is at index 0, then take up to MAX_SEGMENTS.
  // (Index 0 in segment array == "next slice up", angularly placed below.)
  const segments = buildSegments(session.sequence, session.currentTrial);
  const segmentAngle = 360 / segments.length;
  // We always build with currentWord at segment 0. To land on it we
  // rotate so segment 0 is at the top (12 o'clock).
  const targetIndex = 0;

  // Reset wheel rotation when the trial changes (new currentWord).
  useEffect(() => {
    if (phase === 'idle') controls.set({ rotate: 0 });
  }, [session.currentTrial, phase, controls]);

  if (session.isComplete) return null;

  const spin = async () => {
    setPhase('spinning');
    const final = -((targetIndex + 0.5) * segmentAngle) - 360 * 4;
    await controls.start({
      rotate: final,
      transition: { duration: 2.4, ease: [0.16, 1, 0.3, 1] },
    });
    setPhase('landed');
  };

  const advance = () => {
    setPhase('idle');
    session.advance();
  };

  return (
    <div className="grid w-full max-w-md gap-6">
      <div className="from-sky-soft-100 to-grape-100 rounded-4xl bg-linear-to-br relative grid h-72 place-items-center overflow-hidden border-4 border-white shadow-xl">
        {/* Pointer */}
        <svg viewBox="0 0 40 40" className="absolute left-1/2 top-2 z-10 size-10 -translate-x-1/2">
          <polygon points="20,40 4,4 36,4" fill="#0f172a" />
          <polygon points="20,36 8,8 32,8" fill="#facc15" />
        </svg>
        <motion.svg
          viewBox="0 0 240 240"
          className="size-60 drop-shadow-xl"
          animate={controls}
          initial={{ rotate: 0 }}
        >
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

/**
 * Pick which words appear on the wheel right now. Index 0 is the
 * current trial (the one the spin will land on); the remaining slots
 * are filled with upcoming trials, then earlier ones (so the wheel
 * stays full at the end of the session).
 */
function buildSegments(sequence: readonly GameWord[], currentTrial: number): GameWord[] {
  if (sequence.length === 0) return [];
  const segCount = Math.min(MAX_SEGMENTS, Math.max(4, sequence.length));
  const out: GameWord[] = [];
  for (let i = 0; i < segCount; i++) {
    const idx = (currentTrial + i) % sequence.length;
    out.push(sequence[idx]!);
  }
  return out;
}

function Wheel({ segments, angle }: { segments: GameWord[]; angle: number }) {
  return (
    <g transform="translate(120 120)">
      <circle r="110" fill="white" stroke="#0f172a" strokeWidth="4" />
      {segments.map((seg, i) => {
        const start = i * angle - 90 - angle / 2; // shift so segment center is at top
        const end = start + angle;
        const path = sectorPath(0, 0, 100, start, end);
        const labelAngle = (start + end) / 2;
        const labelX = Math.cos((labelAngle * Math.PI) / 180) * 62;
        const labelY = Math.sin((labelAngle * Math.PI) / 180) * 62;
        const fill = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
        const label = seg.text.length > 7 ? seg.text.slice(0, 7) + '…' : seg.text;
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
              fontSize="13"
              transform={`rotate(${labelAngle + 90} ${labelX} ${labelY})`}
            >
              {label}
            </text>
          </g>
        );
      })}
      {/* Hub */}
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
