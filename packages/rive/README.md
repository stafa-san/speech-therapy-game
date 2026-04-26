# `@habla/rive`

Wrapper components for Rive animations + Framer-Motion-driven SVG fallbacks. **Always import from here, never directly from `@rive-app/react-canvas`** — that rule is enforced by the ESLint preset on the player surface (see `@habla/config/eslint/next`).

## Pattern (Project.md §9.3)

Each animation has three files:

```
src/<name>/
├── index.tsx        ← public wrapper (lazy-loads impl, provides Suspense fallback)
├── placeholder.tsx  ← Framer-Motion SVG, SSR-safe, reduced-motion-safe
└── impl.tsx         ← Rive-backed implementation, ssr: false dynamic import
```

The wrapper:

- Lazy-loads the impl in a separate JS chunk so the Rive WASM (~78KB) is fetched only when the wrapper actually renders.
- Renders the placeholder during Suspense + when `forcePlaceholder` is true.
- The player route hardcodes `forcePlaceholder` for COPPA — Rive's runtime can phone home, and we want it off the family surface (Project.md §8.2).

## Components

| Component                                                          | Where used                                                 | Mood / inputs                                                                |
| ------------------------------------------------------------------ | ---------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `<RiveMascot mood="idle" \| "happy" \| "sleepy" \| "celebrate" />` | Therapist dashboard ("Lola" the parrot — Project.md §6.2). | `mood` drives the SVG pose / state-machine input.                            |
| `<RiveReward intensity={0..1} onComplete={…} />`                   | End of every game.                                         | `intensity` scales confetti density; `onComplete` fires after the animation. |

## Today

Both impls render the placeholder. Real `.riv` assets land in PR ~16 (founder's call: in-house vs hired vs Rive Community remix — see Project.md §16). Swapping is one file per asset; consumer code doesn't change.
