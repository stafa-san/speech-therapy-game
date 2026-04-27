// Seed the three v1 games (§6.6).
import { type Prisma } from '@prisma/client';

export const GAMES: ReadonlyArray<Omit<Prisma.GameUncheckedCreateInput, 'id'> & { id: number }> = [
  {
    id: 1,
    slug: 'feed-the-shark',
    nameEs: 'Alimenta al Tiburón',
    nameEn: 'Feed the Shark',
    minTrials: 8,
    maxTrials: 12,
    isFreeTier: true,
    isEnabled: true,
    sortOrder: 10,
  },
  {
    id: 2,
    slug: 'build-a-monster',
    nameEs: 'Arma el Monstruo',
    nameEn: 'Build a Monster',
    minTrials: 8,
    maxTrials: 12,
    isFreeTier: true,
    isEnabled: true,
    sortOrder: 20,
  },
  {
    id: 3,
    slug: 'spin-the-wheel',
    nameEs: 'La Ruleta',
    nameEn: 'Spin the Wheel',
    minTrials: 6,
    maxTrials: 16,
    isFreeTier: true,
    isEnabled: true,
    sortOrder: 30,
  },
];
