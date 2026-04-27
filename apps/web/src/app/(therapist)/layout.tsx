// Therapist surface layout — Duolingo-aesthetic sidebar with brand logo,
// rounded nav pills, demo badge when Clerk keys aren't set.

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { BookOpen, Home, Send, Settings as SettingsIcon, Sparkles } from 'lucide-react';

import { LocaleSwitch } from '@/components/locale-switch';
import { Badge } from '@/components/ui/badge';

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
    <div className="bg-mesh-soft grid min-h-dvh md:grid-cols-[16rem_1fr]">
      <aside className="bg-card hidden flex-col gap-3 border-r-2 p-5 md:flex">
        <Link
          href="/dashboard"
          className="text-brand-700 flex items-center gap-2 text-lg font-extrabold tracking-tight"
        >
          <span className="bg-brand-500 grid size-9 place-items-center rounded-2xl text-white shadow-[0_3px_0_0_var(--color-brand-700)]">
            <Sparkles className="size-5" />
          </span>
          Habla Juega
        </Link>
        {isDemoMode ? <DemoBadge /> : null}
        <TherapistNav />
        <div className="mt-auto flex items-center justify-between">
          <LocaleSwitch />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="bg-card flex items-center justify-between border-b-2 px-4 py-3 md:hidden">
        <Link
          href="/dashboard"
          className="text-brand-700 flex items-center gap-2 text-base font-extrabold"
        >
          <span className="bg-brand-500 grid size-8 place-items-center rounded-xl text-white">
            <Sparkles className="size-4" />
          </span>
          Habla Juega
        </Link>
        <LocaleSwitch />
      </header>

      <main className="overflow-y-auto p-6 md:p-10">{children}</main>
    </div>
  );
}

function DemoBadge() {
  const t = useTranslations('demo');
  return (
    <Badge
      variant="outline"
      className="border-sunshine-500 bg-sunshine-100 text-coral-700 w-fit gap-1 rounded-full border-2 px-3 py-1 text-xs font-extrabold"
    >
      <span className="bg-coral-500 size-1.5 rounded-full" />
      {t('badge')}
    </Badge>
  );
}

function TherapistNav() {
  const t = useTranslations('nav');
  return (
    <nav className="mt-2 flex flex-col gap-1">
      {NAV.map(({ href, icon: Icon, key }) => (
        <Link
          key={href}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          href={href as any}
          className="text-foreground/75 hover:bg-brand-100 hover:text-brand-700 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-colors"
        >
          <Icon className="size-5" />
          {t(key)}
        </Link>
      ))}
    </nav>
  );
}
