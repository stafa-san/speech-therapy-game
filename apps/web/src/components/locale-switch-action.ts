'use server';

import { revalidatePath } from 'next/cache';

import { setLocale } from '@/i18n/locale';
import { type Locale } from '@/i18n/config';

export async function switchLocaleAction(next: Locale) {
  await setLocale(next);
  revalidatePath('/', 'layout');
}
