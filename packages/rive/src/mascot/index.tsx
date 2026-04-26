'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { MascotPlaceholder } from './placeholder';

/** Mascot mood — drives the Rive state machine input or the placeholder pose. */
export type MascotMood = 'idle' | 'happy' | 'sleepy' | 'celebrate';

export interface RiveMascotProps {
  mood: MascotMood;
  /** Optional aria-label override. Default: `Mascot ${mood}`. */
  ariaLabel?: string;
  className?: string;
  /** Render the SVG placeholder even if WASM is available. Used for the player
   *  route which intentionally avoids the Rive runtime. */
  forcePlaceholder?: boolean;
}

const RiveMascotImpl = dynamic(() => import('./impl').then((m) => m.RiveMascotImpl), {
  ssr: false,
  loading: () => <MascotPlaceholder mood="idle" />,
});

export function RiveMascot(props: RiveMascotProps) {
  if (props.forcePlaceholder) return <MascotPlaceholder {...props} />;

  return (
    <Suspense fallback={<MascotPlaceholder mood={props.mood} />}>
      <RiveMascotImpl {...props} />
    </Suspense>
  );
}
