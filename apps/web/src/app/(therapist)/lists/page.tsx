import { useTranslations } from 'next-intl';

import { WordListBrowser } from '@/features/word-lists/word-list-browser';

export default function ListsPage() {
  const t = useTranslations('lists');
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('description')}</p>
      </header>
      <WordListBrowser />
    </div>
  );
}
