// Read-only WordList endpoints backed by static dummy data until the
// DB is wired up (PR 7). Mutating endpoints (create/update/delete) are
// stubbed with NOT_IMPLEMENTED — they'll land with the auth/DB connection.

import { TRPCError } from '@trpc/server';

import { DUMMY_WORD_LISTS } from '@habla/db/seed/data';

import {
  createWordListSchema,
  updateWordListSchema,
  wordListFiltersSchema,
  wordListIdSchema,
} from '../schemas';
import { proProcedure, publicProcedure, router } from '../trpc';

interface WordListSummary {
  id: string;
  name: string;
  description: string | null;
  phonemeId: number;
  position: 'initial' | 'medial' | 'final' | 'mixed';
  difficultyTier: number;
  isSeed: boolean;
  isReviewed: boolean;
  reviewer: string | null;
  isDummyData: boolean;
  wordCount: number;
}

function dummyToSummary(d: (typeof DUMMY_WORD_LISTS)[number]): WordListSummary {
  return {
    id: d.slug,
    name: d.name,
    description: d.description,
    phonemeId: d.phonemeId,
    position: d.position,
    difficultyTier: d.difficultyTier,
    isSeed: true,
    isReviewed: false,
    reviewer: null,
    isDummyData: true,
    wordCount: d.words.length,
  };
}

export const wordListsRouter = router({
  list: publicProcedure.input(wordListFiltersSchema.optional()).query(async ({ input }) => {
    const filters = input ?? {};
    return DUMMY_WORD_LISTS.filter((l) => {
      if (filters.phonemeId && l.phonemeId !== filters.phonemeId) return false;
      if (filters.position && l.position !== filters.position) return false;
      if (filters.difficulty && l.difficultyTier !== filters.difficulty) return false;
      return true;
    })
      .map(dummyToSummary)
      .sort((a, b) => a.phonemeId - b.phonemeId || a.difficultyTier - b.difficultyTier);
  }),

  byId: publicProcedure.input(wordListIdSchema).query(async ({ input }) => {
    const list = DUMMY_WORD_LISTS.find((l) => l.slug === input.id);
    if (!list) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Word list not found.' });
    }
    return {
      ...dummyToSummary(list),
      words: list.words.map((w, i) => ({
        id: `${list.slug}-w-${i + 1}`,
        text: w.text,
        textEn: w.textEn,
        ipa: w.ipa,
        position: w.position,
        imageUrl: null,
        audioUrl: null,
        dialectNotes: w.dialectNotes,
        sortOrder: i + 1,
      })),
    };
  }),

  create: proProcedure.input(createWordListSchema).mutation(async () => {
    throw new TRPCError({
      code: 'METHOD_NOT_SUPPORTED',
      message: 'wordLists.create lands in PR 7 once Clerk + DB are wired.',
    });
  }),

  update: proProcedure.input(updateWordListSchema).mutation(async () => {
    throw new TRPCError({
      code: 'METHOD_NOT_SUPPORTED',
      message: 'wordLists.update lands in PR 7.',
    });
  }),

  delete: proProcedure.input(wordListIdSchema).mutation(async () => {
    throw new TRPCError({
      code: 'METHOD_NOT_SUPPORTED',
      message: 'wordLists.delete lands in PR 7.',
    });
  }),

  duplicate: proProcedure.input(wordListIdSchema).mutation(async () => {
    throw new TRPCError({
      code: 'METHOD_NOT_SUPPORTED',
      message: 'wordLists.duplicate lands in PR 7.',
    });
  }),
});
