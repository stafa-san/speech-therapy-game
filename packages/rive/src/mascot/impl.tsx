'use client';

// The Rive-backed implementation. Loaded only on the client (ssr: false in
// the wrapper). Until a real `mascot-lola.riv` asset exists, we render the
// SVG placeholder — keeping the wrapper's contract identical.
//
// When the .riv lands:
//   1. Drop it at apps/web/public/rive/mascot-lola.riv.
//   2. Replace the body of this file with `useRive` + state-machine input
//      driven by props.mood.

import { MascotPlaceholder } from './placeholder';
import type { RiveMascotProps } from './index';

export function RiveMascotImpl(props: RiveMascotProps) {
  return <MascotPlaceholder {...props} />;
}
