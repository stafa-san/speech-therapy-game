## Summary

<!-- One or two sentences. What and why. -->

## Section(s) of Project.md touched

<!-- e.g., §6.7 (assignments), §8 (COPPA). -->

## COPPA checklist (required — see Project.md §8)

- [ ] Does this change touch `/play/[token]` or anything used by it? If yes, explain mitigation below.
- [ ] Does this change collect, store, or transmit any data that could come from a child? If yes, explain mitigation.
- [ ] Does this change add a third-party SDK, script, pixel, or analytics call to any route reachable from `/play/[token]`?
- [ ] If a Rive component is added, is it lazy-loaded through `packages/rive` and gated by `prefers-reduced-motion`?

## Test plan

- [ ] Local `pnpm typecheck` passes
- [ ] Local `pnpm lint` passes
- [ ] Local `pnpm test` passes
- [ ] Manually verified the affected flows
- [ ] If touching the play route: ran the COPPA bundle scan (`pnpm test:coppa`)

## Screenshots / video

<!-- For UI changes. -->
