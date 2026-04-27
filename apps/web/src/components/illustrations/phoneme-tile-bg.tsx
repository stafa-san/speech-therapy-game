// Decorative gradient backgrounds for phoneme/list cards. Returned as
// CSS gradient strings (oklch space) keyed by phoneme id so the lists
// page reads like a Duolingo skill tree, not a spreadsheet.

const PALETTES: Array<{ from: string; to: string; ring: string }> = [
  { from: 'oklch(0.85 0.18 30)', to: 'oklch(0.95 0.10 50)', ring: 'oklch(0.55 0.18 30)' },
  { from: 'oklch(0.82 0.16 90)', to: 'oklch(0.96 0.08 100)', ring: 'oklch(0.7 0.18 90)' },
  { from: 'oklch(0.78 0.16 175)', to: 'oklch(0.95 0.07 175)', ring: 'oklch(0.46 0.16 175)' },
  { from: 'oklch(0.78 0.13 235)', to: 'oklch(0.95 0.06 235)', ring: 'oklch(0.5 0.15 235)' },
  { from: 'oklch(0.78 0.16 290)', to: 'oklch(0.95 0.07 290)', ring: 'oklch(0.45 0.18 290)' },
  { from: 'oklch(0.83 0.16 145)', to: 'oklch(0.96 0.08 145)', ring: 'oklch(0.55 0.18 145)' },
];

export function paletteFor(phonemeId: number) {
  return PALETTES[phonemeId % PALETTES.length]!;
}

export function phonemeTileGradient(phonemeId: number): string {
  const p = paletteFor(phonemeId);
  return `linear-gradient(135deg, ${p.from}, ${p.to})`;
}
