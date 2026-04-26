// Seed list of Spanish phonemes targeted in v1. See Project.md §2.1.
// Order is therapy-priority, not alphabetical — most-worked sounds first.

import { type Prisma } from '@prisma/client';

export const PHONEMES: ReadonlyArray<
  Omit<Prisma.PhonemeUncheckedCreateInput, 'id'> & { id: number }
> = [
  {
    id: 1,
    symbol: '/r/',
    ipa: 'ɾ',
    displayNameEs: 'erre suave (tap)',
    displayNameEn: 'r (tap)',
    sortOrder: 10,
  },
  {
    id: 2,
    symbol: '/rr/',
    ipa: 'r',
    displayNameEs: 'erre fuerte (trill)',
    displayNameEn: 'rr (trill)',
    sortOrder: 20,
  },
  {
    id: 3,
    symbol: '/s/',
    ipa: 's',
    displayNameEs: 'ese',
    displayNameEn: 's',
    sortOrder: 30,
  },
  {
    id: 4,
    symbol: '/l/',
    ipa: 'l',
    displayNameEs: 'ele',
    displayNameEn: 'l',
    sortOrder: 40,
  },
  {
    id: 5,
    symbol: '/k/',
    ipa: 'k',
    displayNameEs: 'ka (c/qu)',
    displayNameEn: 'k (c/qu)',
    sortOrder: 50,
  },
  {
    id: 6,
    symbol: '/g/',
    ipa: 'g',
    displayNameEs: 'ge',
    displayNameEn: 'g',
    sortOrder: 60,
  },
  {
    id: 7,
    symbol: '/f/',
    ipa: 'f',
    displayNameEs: 'efe',
    displayNameEn: 'f',
    sortOrder: 70,
  },
  {
    id: 8,
    symbol: '/ch/',
    ipa: 'tʃ',
    displayNameEs: 'che',
    displayNameEn: 'ch',
    sortOrder: 80,
  },
  {
    id: 9,
    symbol: '/ñ/',
    ipa: 'ɲ',
    displayNameEs: 'eñe',
    displayNameEn: 'ñ',
    sortOrder: 90,
  },
  {
    id: 10,
    symbol: '/j/',
    ipa: 'x',
    displayNameEs: 'jota (j/g)',
    displayNameEn: 'j (j/g)',
    sortOrder: 100,
  },
  {
    id: 11,
    symbol: 'L-blends',
    ipa: 'Cl',
    displayNameEs: 'mezclas con L',
    displayNameEn: 'L-blends',
    sortOrder: 200,
  },
  {
    id: 12,
    symbol: 'R-blends',
    ipa: 'Cɾ',
    displayNameEs: 'mezclas con R',
    displayNameEn: 'R-blends',
    sortOrder: 210,
  },
];
