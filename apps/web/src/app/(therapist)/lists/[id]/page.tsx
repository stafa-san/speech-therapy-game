'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/trpc/client';

interface ListDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ListDetailPage({ params }: ListDetailPageProps) {
  const { id } = use(params);
  const t = useTranslations('wordList');
  const listQuery = trpc.wordLists.byId.useQuery({ id });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="ghost" size="sm">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Link href={'/lists' as any}>
          <ArrowLeft />
          {t('backToLists')}
        </Link>
      </Button>

      {listQuery.isLoading ? (
        <Skeleton className="h-32" />
      ) : listQuery.data ? (
        <>
          <header className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{t(`position.${listQuery.data.position}`)}</Badge>
              <Badge variant="outline">T{listQuery.data.difficultyTier}</Badge>
              {listQuery.data.isDummyData ? (
                <Badge variant="outline" className="text-warning border-warning">
                  {t('previewBadge')}
                </Badge>
              ) : null}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{listQuery.data.name}</h1>
            {listQuery.data.description ? (
              <p className="text-muted-foreground">{listQuery.data.description}</p>
            ) : null}
          </header>

          <Card>
            <CardHeader>
              <CardTitle>{t('wordsTitle', { count: listQuery.data.words.length })}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-3">
              {listQuery.data.words.map((w) => (
                <div
                  key={w.id}
                  className="bg-muted/40 rounded-md px-3 py-2 text-sm"
                  aria-label={w.text}
                >
                  <p className="font-medium">{w.text}</p>
                  {w.textEn ? <p className="text-muted-foreground text-xs">{w.textEn}</p> : null}
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      ) : (
        <p>{t('notFound')}</p>
      )}
    </div>
  );
}
