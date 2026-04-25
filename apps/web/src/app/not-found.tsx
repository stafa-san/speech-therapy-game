import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16 text-center">
      <div>
        <p className="text-primary text-sm font-semibold">{t('label')}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-4">{t('description')}</p>
        <Button asChild className="mt-8">
          <Link href="/">{t('cta')}</Link>
        </Button>
      </div>
    </main>
  );
}
