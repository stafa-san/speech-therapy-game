'use client';

import { Copy, Send, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/trpc/client';

interface AssignmentRow {
  id: string;
  token: string;
  studentLabel: string | null;
  isRevoked: boolean;
  wordList: { name: string };
  game: { nameEs: string };
  _count: { sessions: number };
}

export default function AssignmentsPage() {
  const t = useTranslations('assignments');
  const utils = trpc.useUtils();
  const listQuery = trpc.assignments.list.useQuery();
  const data = listQuery.data as AssignmentRow[] | undefined;
  const revokeMutation = trpc.assignments.revoke.useMutation({
    onSuccess: () => utils.assignments.list.invalidate(),
    onError: () => toast.error(t('errors.revoke')),
  });

  const copy = (token: string) => {
    if (typeof window === 'undefined') return;
    const link = `${window.location.origin}/play/${token}`;
    navigator.clipboard.writeText(link).then(
      () => toast.success(t('copied')),
      () => toast.error(t('errors.copy')),
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t('pageTitle')}</h1>
        <p className="text-muted-foreground mt-1">{t('pageDescription')}</p>
      </header>

      {listQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : listQuery.isError ? (
        <Card className="text-muted-foreground p-6">{t('errors.list')}</Card>
      ) : (data?.length ?? 0) === 0 ? (
        <Card className="text-muted-foreground p-6 text-center">
          <Send className="text-muted-foreground/60 mx-auto size-6" />
          <p className="mt-2">{t('empty')}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {data?.map((a) => (
            <Card key={a.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{a.wordList.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {a.game.nameEs}
                  </Badge>
                  {a.isRevoked ? (
                    <Badge variant="destructive" className="text-xs">
                      {t('revoked')}
                    </Badge>
                  ) : null}
                </div>
                <p className="text-muted-foreground text-xs">
                  {a.studentLabel
                    ? t('rowSubtitle', {
                        student: a.studentLabel,
                        sessions: a._count.sessions,
                      })
                    : t('rowSubtitleAnon', { sessions: a._count.sessions })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copy(a.token)}
                  disabled={a.isRevoked}
                >
                  <Copy />
                  {t('copy')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={a.isRevoked || revokeMutation.isPending}
                  onClick={() => revokeMutation.mutate({ id: a.id })}
                >
                  <Trash2 />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
