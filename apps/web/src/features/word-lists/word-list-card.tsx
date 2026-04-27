'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CheckCircle2, FlaskConical } from 'lucide-react';

import { phonemeTileGradient } from '@/components/illustrations/phoneme-tile-bg';
import { Badge } from '@/components/ui/badge';

export interface WordListCardData {
  id: string;
  name: string;
  description: string | null;
  phonemeId: number;
  phonemeSymbol: string;
  position: 'initial' | 'medial' | 'final' | 'mixed';
  difficultyTier: number;
  isReviewed: boolean;
  reviewer: string | null;
  isDummyData: boolean;
  wordCount: number;
}

export function WordListCard({ list }: { list: WordListCardData }) {
  const t = useTranslations('wordList');
  const gradient = phonemeTileGradient(list.phonemeId);

  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      href={`/lists/${list.id}` as any}
      className="ring-border focus-visible:ring-brand-500 rounded-4xl group relative flex flex-col overflow-hidden ring-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4"
    >
      {/* Gradient header with phoneme symbol — like a Duolingo lesson tile */}
      <div
        className="relative grid h-32 place-items-center overflow-hidden"
        style={{ backgroundImage: gradient }}
      >
        <div className="absolute -right-6 -top-6 size-24 rounded-full bg-white/30 blur-md" />
        <div className="absolute -bottom-8 -left-8 size-28 rounded-full bg-black/10 blur-lg" />
        <span className="font-display text-5xl font-extrabold text-white drop-shadow-md">
          {list.phonemeSymbol}
        </span>
      </div>

      <div className="bg-card flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-full border-2 text-xs">
            {t(`position.${list.position}`)}
          </Badge>
          <Badge variant="outline" className="rounded-full border-2 text-xs">
            T{list.difficultyTier}
          </Badge>
          {list.isReviewed ? (
            <Badge
              variant="outline"
              className="border-success text-success rounded-full border-2 text-xs"
            >
              <CheckCircle2 className="mr-1 size-3" />
              {t('reviewed')}
            </Badge>
          ) : null}
          {list.isDummyData ? (
            <Badge
              variant="outline"
              className="border-warning text-warning rounded-full border-2 text-xs"
            >
              <FlaskConical className="mr-1 size-3" />
              {t('previewBadge')}
            </Badge>
          ) : null}
        </div>
        <div>
          <h3 className="text-foreground text-lg font-extrabold leading-tight">{list.name}</h3>
          {list.description ? (
            <p className="text-foreground/60 mt-1 line-clamp-2 text-sm">{list.description}</p>
          ) : null}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-foreground/55 text-xs font-bold uppercase tracking-wide">
            {t('wordCount', { count: list.wordCount })}
          </span>
          <span className="text-brand-700 group-hover:text-brand-500 text-sm font-bold">
            {t('open')} →
          </span>
        </div>
      </div>
    </Link>
  );
}
