'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { switchLocaleAction } from './locale-switch-action';

export function LocaleSwitch() {
  const t = useTranslations('locale');
  const current = useLocale();
  const [pending, startTransition] = useTransition();

  const next = current === 'es' ? 'en' : 'es';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={() => startTransition(() => switchLocaleAction(next))}
            aria-label={t('switch')}
          >
            <Globe />
            <span className="ml-1 text-xs uppercase">{next}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('switch')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
