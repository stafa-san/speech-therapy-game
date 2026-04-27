// Therapist surface layout. Two responsive shapes:
//   - md+ : left sidebar with brand logo, nav pills, locale switch.
//   - < md: top bar (logo + locale) + bottom tab bar (4 icons).
// The brand logo always navigates to "/" (the main marketing page) so the
// therapist can exit the app surface from anywhere; "Home" in the nav is
// the dashboard, which is the therapist app's home base.

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
      {/* Desktop sidebar */}
      <aside className="bg-card hidden flex-col gap-3 border-r-2 p-5 md:flex">
        <BrandLogo />
        {isDemoMode ? <DemoBadge /> : null}
        <DesktopNav />
        <div className="mt-auto flex items-center justify-between">
          <LocaleSwitch />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="bg-card sticky top-0 z-30 flex items-center justify-between border-b-2 px-4 py-3 md:hidden">
        <BrandLogo compact />
        <div className="flex items-center gap-2">
          {isDemoMode ? <DemoBadge /> : null}
          <LocaleSwitch />
        </div>
      </header>

      <main className="overflow-y-auto p-6 pb-24 md:p-10 md:pb-10">{children}</main>

      {/* Mobile bottom tab nav */}
      <MobileTabNav />
    </div>
  );
}

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="text-brand-700 flex items-center gap-2 font-extrabold tracking-tight">
      <span
        className={`bg-brand-500 grid place-items-center rounded-2xl text-white shadow-[0_3px_0_0_var(--color-brand-700)] ${
          compact ? 'size-8' : 'size-9'
        }`}
      >
        <Sparkles className={compact ? 'size-4' : 'size-5'} />
      </span>
      <span className={compact ? 'text-base' : 'text-lg'}>Habla Juega</span>
    </Link>
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

function DesktopNav() {
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

function MobileTabNav() {
  const t = useTranslations('nav');
  return (
    <nav className="bg-card fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t-2 md:hidden">
      {NAV.map(({ href, icon: Icon, key }) => (
        <Link
          key={href}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          href={href as any}
          className="text-foreground/65 hover:text-brand-700 flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-extrabold transition-colors"
        >
          <Icon className="size-5" />
          {t(key)}
        </Link>
      ))}
    </nav>
  );
}
