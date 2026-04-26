'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc/client';

export function SendToFamilyDialog({
  wordListId,
  defaultGameId = 1,
}: {
  wordListId: string;
  defaultGameId?: number;
}) {
  const t = useTranslations('assignments');
  const [open, setOpen] = useState(false);
  const [studentLabel, setStudentLabel] = useState('');
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  const createMutation = trpc.assignments.create.useMutation({
    onSuccess: (data) => {
      setCreatedToken((data as { token: string }).token);
    },
    onError: (err) => {
      toast.error(t('errors.create'));
      console.error('[assignments.create]', err);
    },
  });

  const link =
    createdToken && typeof window !== 'undefined'
      ? `${window.location.origin}/play/${createdToken}`
      : null;

  const copy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link).then(
      () => toast.success(t('copied')),
      () => toast.error(t('errors.copy')),
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Send /> {t('sendCta')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dialogTitle')}</DialogTitle>
          <DialogDescription>{t('dialogDescription')}</DialogDescription>
        </DialogHeader>

        {createdToken && link ? (
          <div className="flex flex-col gap-3">
            <Label htmlFor="link">{t('linkLabel')}</Label>
            <div className="flex gap-2">
              <Input id="link" value={link} readOnly className="font-mono text-xs" />
              <Button onClick={copy}>{t('copy')}</Button>
            </div>
            <p className="text-muted-foreground text-xs">{t('linkHelp')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Label htmlFor="studentLabel">{t('studentLabelField')}</Label>
            <Input
              id="studentLabel"
              placeholder={t('studentLabelPlaceholder')}
              value={studentLabel}
              onChange={(e) => setStudentLabel(e.target.value)}
              maxLength={80}
            />
            <p className="text-muted-foreground text-xs">{t('studentLabelHelp')}</p>
          </div>
        )}

        <DialogFooter>
          {createdToken ? (
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('done')}
            </Button>
          ) : (
            <Button
              onClick={() =>
                createMutation.mutate({
                  wordListId,
                  gameId: defaultGameId,
                  studentLabel: studentLabel.trim() || undefined,
                })
              }
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? t('creating') : t('create')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
