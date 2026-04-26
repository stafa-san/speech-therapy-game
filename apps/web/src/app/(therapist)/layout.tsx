// Therapist surface layout — proxy enforces the Clerk gate when Clerk
// keys are configured; without keys (demo mode) the gate no-ops and we
// surface a "Modo demo" badge here so the previewer knows nothing is
// persisted.

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { BookOpen, Home, Send, Settings as SettingsIcon } from 'lucide-react';

import { LocaleSwitch } from '@/components/locale-switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type NavKey = 'home' | 'lists' | 'assignments' | 'settings';
type NavItem = { href: string; icon: typeof Home; key: NavKey };

const NAV: NavItem[] = [
  { href: '/dashboard', icon: Home, key: 'home' },
  { href: '/lists', icon: BookOpen, key: 'lists' },
  { href: '/assignments', icon: Send, key: 'assignments' },
  { href: '/settings', icon: SettingsIcon, key: 'settings' },
];

const isDemoMode = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-cols-[14rem_1fr]">
      <aside className="bg-card flex flex-col gap-2 border-r p-4">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight">
          Habla Juega
        </Link>
        {isDemoMode ? <DemoBadge /> : null}
        <Separator className="my-2" />
        <TherapistNav />
        <div className="mt-auto flex items-center justify-between">
          <LocaleSwitch />
        </div>
      </aside>
      <main className="bg-background overflow-y-auto p-8">{children}</main>
    </div>
  );
}

function DemoBadge() {
  const t = useTranslations('demo');
  return (
    <Badge variant="outline" className="border-warning text-warning w-fit gap-1 text-xs">
      <span className="bg-warning size-1.5 rounded-full" />
      {t('badge')}
    </Badge>
  );
}

function TherapistNav() {
  const t = useTranslations('nav');
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ href, icon: Icon, key }) => (
        <Button key={href} asChild variant="ghost" className="justify-start">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={href as any}>
            <Icon />
            {t(key)}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
