export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

// English by default — Duolingo model. The therapist + parent UI is in
// the user's understanding language; the Spanish vocabulary practiced is
// content (lives in the word lists, not in the UI strings).
export const DEFAULT_LOCALE: Locale = 'en';

/** Cookie name used by next-intl to persist a user's locale choice. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}
