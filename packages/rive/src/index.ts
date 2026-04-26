// Public API for @habla/rive. Always import through the wrapper modules
// — never import @rive-app/react-canvas directly from a feature.
//
// Pattern (Project.md §9.3): wrappers lazy-load the implementation chunk
// and provide a non-Rive placeholder for SSR / no-WASM / reduced-motion.

export { RiveMascot, type RiveMascotProps, type MascotMood } from './mascot';
export { RiveReward, type RiveRewardProps } from './reward';
