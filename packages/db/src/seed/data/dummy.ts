// Dummy word-list data for development. See Project.md §2.4.
// Every entry below MUST stay marked _dummyData=true so the seeder refuses
// to load it into production. Replaced by SLP-curated content in Phase 9.

import { Position } from '@prisma/client';

export interface DummyWord {
  text: string;
  textEn: string | null;
  ipa: string | null;
  position: Position;
  dialectNotes: string | null;
}

export interface DummyWordList {
  /** Stable slug used to upsert during seeding. */
  slug: string;
  name: string;
  description: string;
  phonemeId: number;
  position: Position;
  difficultyTier: number;
  isReviewed: false;
  reviewer: null;
  locale: 'es';
  /** Always true — production seed checks this. */
  _dummyData: true;
  words: DummyWord[];
}

function placeholderWords(prefix: string, position: Position, count: number): DummyWord[] {
  return Array.from({ length: count }, (_, i) => ({
    text: `${prefix}-${i + 1}`,
    textEn: `placeholder-${prefix}-${i + 1}`,
    ipa: null,
    position,
    dialectNotes: null,
  }));
}

/** Twelve dummy lists across the highest-priority phonemes. */
export const DUMMY_WORD_LISTS: ReadonlyArray<DummyWordList> = [
  // /r/ — single tap (phonemeId: 1)
  {
    slug: 'dummy-r-initial-t1',
    name: '[DUMMY] /r/ inicial · nivel 1',
    description: 'Lista de muestra para desarrollo. Reemplazar antes del lanzamiento.',
    phonemeId: 1,
    position: Position.initial,
    difficultyTier: 1,
    isReviewed: false,
    reviewer: null,
    locale: 'es',
    _dummyData: true,
    words: placeholderWords('r-inicial', Position.initial, 24),
  },
  {
    slug: 'dummy-r-medial-t2',
    name: '[DUMMY] /r/ medial · nivel 2',
    description: 'Lista de muestra para desarrollo.',
    phonemeId: 1,
    position: Position.medial,
    difficultyTier: 2,
    isReviewed: false,
    reviewer: null,
    locale: 'es',
    _dummyData: true,
    words: placeholderWords('r-medial', Position.medial, 22),
  },
  // /rr/ — trill (phonemeId: 2)
  {
    slug: 'dummy-rr-initial-t1',
    name: '[DUMMY] /rr/ inicial · nivel 1',
    description: 'Lista de muestra para desarrollo.',
    phonemeId: 2,
    position: Position.initial,
    difficultyTier: 1,
    isReviewed: false,
    reviewer: null,
    locale: 'es',
    _dummyData: true,
    words: placeholderWords('rr-inicial', Position.initial, 20),
  },
  {
    slug: 'dummy-rr-medial-t2',
    name: '[DUMMY] /rr/ medial · nivel 2',
    description: 'Lista de muestra para desarrollo.',
    phonemeId: 2,
    position: Position.medial,
    difficultyTier: 2,
    isReviewed: false,
    reviewer: null,
    locale: 'es',
    _dummyData: true,
    words: placeholderWords('rr-medial', Position.medial, 20),
  },
  // /s/ (phonemeId: 3)
  {
    slug: 'dummy-s-initial-t1',
    name: '[DUMMY] /s/ inicial · nivel 1',
    description: 'Lista de muestra para desarrollo.',
    phonemeId: 3,
    position: Position.initial,
    difficultyTier: 1,
    isReviewed: false,
    reviewer: null,
    locale: 'es',
    _dummyData: true,
    words: placeholderWords('s-inicial', Position.initial, 24),
  },
  {
    slug: 'dummy-s-final-t2',
    name: '[DUMMY] /s/ final · nivel 2',
    description: 'Lista de muestra para desarrollo.',
    phonemeId: 3,
    position: Position.final,
    difficultyTier: 2,
    isReviewed: false,
    reviewer: null,
    locale: 'es',
    _dummyData: true,
    words: placeholderWords('s-final', Position.final, 22),
  },
  // /l/ (phonemeId: 4)
  {
    slug: 'dummy-l-initial-t1',
    name: '[DUMMY] /l/ inicial · nivel 1',
    description: 'Lista de muestra para desarrollo.',
    phonemeId: 4,
    position: Position.initial,
    difficultyTier: 1,
    isReviewed: false,
    reviewer: null,
    locale: 'es',
    _dummyData: true,
    words: placeholderWords('l-inicial', Position.initial, 24),
  },
  {
    slug: 'dummy-l-medial-t1',
    name: '[DUMMY] /l/ medial · nivel 1',
    description: 'Lista de muestra para desarrollo.',
    phonemeId: 4,
    position: Position.medial,
    difficultyTier: 1,
    isReviewed: false,
    reviewer: null,
    locale: 'es',
    _dummyData: true,
    words: placeholderWords('l-medial', Position.medial, 24),
  },
  // /k/ (phonemeId: 5)
  {
    slug: 'dummy-k-initial-t1',
    name: '[DUMMY] /k/ inicial · nivel 1',
    description: 'Lista de muestra para desarrollo.',
    phonemeId: 5,
    position: Position.initial,
    difficultyTier: 1,
    isReviewed: false,
    reviewer: null,
    locale: 'es',
    _dummyData: true,
    words: placeholderWords('k-inicial', Position.initial, 24),
  },
  // /ch/ (phonemeId: 8)
  {
    slug: 'dummy-ch-initial-t1',
    name: '[DUMMY] /ch/ inicial · nivel 1',
    description: 'Lista de muestra para desarrollo.',
    phonemeId: 8,
    position: Position.initial,
    difficultyTier: 1,
    isReviewed: false,
    reviewer: null,
    locale: 'es',
    _dummyData: true,
    words: placeholderWords('ch-inicial', Position.initial, 22),
  },
  {
    slug: 'dummy-ch-medial-t2',
    name: '[DUMMY] /ch/ medial · nivel 2',
    description: 'Lista de muestra para desarrollo.',
    phonemeId: 8,
    position: Position.medial,
    difficultyTier: 2,
    isReviewed: false,
    reviewer: null,
    locale: 'es',
    _dummyData: true,
    words: placeholderWords('ch-medial', Position.medial, 20),
  },
  // L-blends (phonemeId: 11)
  {
    slug: 'dummy-l-blends-initial-t3',
    name: '[DUMMY] mezclas con L · nivel 3',
    description: 'Lista de muestra para desarrollo.',
    phonemeId: 11,
    position: Position.initial,
    difficultyTier: 3,
    isReviewed: false,
    reviewer: null,
    locale: 'es',
    _dummyData: true,
    words: placeholderWords('lblends-inicial', Position.initial, 20),
  },
];
