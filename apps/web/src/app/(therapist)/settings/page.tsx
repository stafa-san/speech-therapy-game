'use client';

import { Globe, Sparkles, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LocaleSwitch } from '@/components/locale-switch';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const t = useTranslations('settings');
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-col gap-1">
        <p className="text-foreground/55 text-sm font-bold uppercase tracking-wider">
          {t('eyebrow')}
        </p>
        <h1 className="text-foreground text-4xl font-extrabold tracking-tight">{t('title')}</h1>
      </header>

      <SettingRow icon={Globe} title={t('language.title')} description={t('language.description')}>
        <LocaleSwitch />
      </SettingRow>

      <SettingRow icon={User} title={t('account.title')} description={t('account.description')}>
        <Badge variant="outline" className="rounded-full border-2 px-3 py-1 text-xs font-bold">
          {t('account.placeholder')}
        </Badge>
      </SettingRow>

      <SettingRow icon={Sparkles} title={t('plan.title')} description={t('plan.description')}>
        <Badge
          variant="outline"
          className="border-grape-500 bg-grape-100 text-grape-700 rounded-full border-2 px-3 py-1 text-xs font-extrabold"
        >
          {t('plan.free')}
        </Badge>
      </SettingRow>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Globe;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card flex items-center justify-between gap-4 rounded-3xl border-2 p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="bg-brand-100 text-brand-700 grid size-12 place-items-center rounded-2xl">
          <Icon className="size-6" />
        </div>
        <div>
          <p className="text-foreground font-extrabold">{title}</p>
          <p className="text-foreground/55 text-sm">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
