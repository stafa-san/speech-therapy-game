'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { trpc } from '@/lib/trpc/client';
import { Skeleton } from '@/components/ui/skeleton';

import { WordListCard, type WordListCardData } from './word-list-card';
import { WordListFilters, type FilterState } from './word-list-filters';

export function WordListBrowser() {
  const t = useTranslations('wordList');
  const [filters, setFilters] = useState<FilterState>({
    phonemeId: null,
    position: null,
    difficulty: null,
  });

  const phonemesQuery = trpc.phonemes.list.useQuery();
  const listsQuery = trpc.wordLists.list.useQuery({
    phonemeId: filters.phonemeId ?? undefined,
    position: filters.position ?? undefined,
    difficulty: filters.difficulty ?? undefined,
  });

  const symbolByPhonemeId = useMemo(() => {
    const map = new Map<number, string>();
    for (const p of phonemesQuery.data ?? []) map.set(p.id, p.symbol);
    return map;
  }, [phonemesQuery.data]);

  const cards: WordListCardData[] = useMemo(
    () =>
      (listsQuery.data ?? []).map((l) => ({
        id: l.id,
        name: l.name,
        description: l.description,
        phonemeId: l.phonemeId,
        phonemeSymbol: symbolByPhonemeId.get(l.phonemeId) ?? `#${l.phonemeId}`,
        position: l.position,
        difficultyTier: l.difficultyTier,
        isReviewed: l.isReviewed,
        reviewer: l.reviewer,
        isDummyData: l.isDummyData,
        wordCount: l.wordCount,
      })),
    [listsQuery.data, symbolByPhonemeId],
  );

  return (
    <div className="grid gap-8 md:grid-cols-[16rem_1fr]">
      <aside className="md:sticky md:top-8 md:self-start">
        <WordListFilters
          phonemes={phonemesQuery.data ?? []}
          state={filters}
          onChange={setFilters}
        />
      </aside>
      <section>
        {listsQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <p className="text-muted-foreground text-center text-sm">{t('empty')}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((c) => (
              <WordListCard key={c.id} list={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
