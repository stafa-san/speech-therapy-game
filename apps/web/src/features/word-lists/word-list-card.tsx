'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CheckCircle2, FlaskConical } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  return (
    <Card className="flex flex-col gap-3 p-5">
      <CardHeader className="px-0">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{list.phonemeSymbol}</Badge>
          <div className="flex gap-2">
            <Badge variant="outline">{t(`position.${list.position}`)}</Badge>
            <Badge variant="outline">T{list.difficultyTier}</Badge>
          </div>
        </div>
        <CardTitle className="mt-2 text-lg">{list.name}</CardTitle>
        {list.description ? <CardDescription>{list.description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t('wordCount', { count: list.wordCount })}</span>
          {list.isReviewed ? (
            <span className="text-success inline-flex items-center gap-1">
              <CheckCircle2 className="size-4" />
              <span>{t('reviewed')}</span>
            </span>
          ) : null}
          {list.isDummyData ? (
            <Badge variant="outline" className="text-warning border-warning gap-1">
              <FlaskConical className="size-3" />
              {t('previewBadge')}
            </Badge>
          ) : null}
        </div>
        <Button asChild variant="outline" size="sm">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={`/lists/${list.id}` as any}>{t('open')}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
