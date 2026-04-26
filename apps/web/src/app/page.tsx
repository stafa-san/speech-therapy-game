import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { LocaleSwitch } from '@/components/locale-switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Home() {
  const t = useTranslations('landing');

  return (
    <main className="relative grid min-h-dvh place-items-center px-6 py-16">
      <div className="absolute right-4 top-4">
        <LocaleSwitch />
      </div>
      <div className="max-w-2xl text-center">
        <Badge variant="secondary" className="mb-4">
          <span className="bg-primary mr-1 size-1.5 rounded-full" />
          {t('preLaunchBadge')}
        </Badge>
        <h1 className="text-foreground text-balance text-5xl font-bold tracking-tight sm:text-6xl">
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-6 text-lg sm:text-xl">{t('tagline')}</p>
        <p className="text-muted-foreground/70 mt-2 text-sm">{t('subTagline')}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" disabled>
            <span aria-disabled="true" className="cursor-not-allowed opacity-70">
              {t('ctaSignIn')} <ArrowRight />
            </span>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="https://github.com/stafa-san/speech-therapy-game">
              <Github /> {t('ctaRepo')}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
