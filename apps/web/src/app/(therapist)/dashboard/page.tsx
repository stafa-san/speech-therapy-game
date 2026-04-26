import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-muted-foreground text-sm">{t('greeting')}</p>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
      </header>

      <Card className="from-brand-100 to-background bg-gradient-to-br">
        <CardHeader>
          <CardTitle className="text-2xl">{t('quickPlay.title')}</CardTitle>
          <CardDescription>{t('quickPlay.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">{t('quickPlay.comingSoon')}</Badge>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('cards.recentAssignments.title')}</CardTitle>
            <CardDescription>{t('cards.recentAssignments.description')}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('cards.savedLists.title')}</CardTitle>
            <CardDescription>{t('cards.savedLists.description')}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('cards.usage.title')}</CardTitle>
            <CardDescription>{t('cards.usage.description')}</CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
