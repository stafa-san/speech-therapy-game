'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { PHONEMES } from '@habla/db/seed/data';

import { Badge } from '@/components/ui/badge';
import { DuoButton } from '@/components/ui/duo-button';
import { Skeleton } from '@/components/ui/skeleton';
import { phonemeTileGradient } from '@/components/illustrations/phoneme-tile-bg';
import { SendToFamilyDialog } from '@/features/assignments/send-to-family-dialog';
import { trpc } from '@/lib/trpc/client';

function phonemeSymbolFor(id: number): string {
  return PHONEMES.find((p) => p.id === id)?.symbol ?? `#${id}`;
}

interface ListDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ListDetailPage({ params }: ListDetailPageProps) {
  const { id } = use(params);
  const t = useTranslations('wordList');
  const listQuery = trpc.wordLists.byId.useQuery({ id });
  const list = listQuery.data;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <DuoButton asChild size="sm" variant="ghost">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Link href={'/lists' as any}>
          <ArrowLeft className="size-4" />
          {t('backToLists')}
        </Link>
      </DuoButton>

      {listQuery.isLoading ? (
        <Skeleton className="h-48 rounded-3xl" />
      ) : list ? (
        <>
          <header
            className="rounded-4xl relative overflow-hidden border-4 border-white p-8 text-white shadow-xl"
            style={{ backgroundImage: phonemeTileGradient(list.phonemeId) }}
          >
            <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/30 blur-md" />
            <div className="relative flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="rounded-full bg-white/20 text-base font-extrabold text-white"
                >
                  {phonemeSymbolFor(list.phonemeId)}
                </Badge>
                <Badge variant="secondary" className="rounded-full bg-white/20 text-white">
                  {t(`position.${list.position}`)}
                </Badge>
                <Badge variant="secondary" className="rounded-full bg-white/20 text-white">
                  T{list.difficultyTier}
                </Badge>
                {list.isDummyData ? (
                  <Badge variant="secondary" className="rounded-full bg-white/20 text-white">
                    {t('previewBadge')}
                  </Badge>
                ) : null}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">{list.name}</h1>
              {list.description ? (
                <p className="max-w-2xl text-white/90">{list.description}</p>
              ) : null}
              <div className="mt-2">
                <SendToFamilyDialog wordListId={list.id} />
              </div>
            </div>
          </header>

          <section className="bg-card rounded-4xl border-2 p-6 shadow-sm">
            <h2 className="text-foreground mb-4 text-lg font-extrabold">
              {t('wordsTitle', { count: list.words.length })}
            </h2>
            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
              {list.words.map((w) => (
                <div
                  key={w.id}
                  className="border-border bg-background flex flex-col gap-1 rounded-2xl border-2 px-4 py-3 text-center"
                  aria-label={w.text}
                >
                  <p className="text-foreground text-base font-extrabold" lang="es">
                    {w.text}
                  </p>
                  {w.textEn ? (
                    <p className="text-foreground/55 text-xs" lang="en">
                      {w.textEn}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <p className="text-foreground/55">{t('notFound')}</p>
      )}
    </div>
  );
}
