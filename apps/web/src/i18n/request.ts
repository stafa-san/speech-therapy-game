import { getRequestConfig } from 'next-intl/server';

import { getLocale } from './locale';

export default getRequestConfig(async () => {
  const locale = await getLocale();

  // Dynamic import keeps un-used locale dictionaries out of the SSR bundle.
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    timeZone: 'America/Mexico_City',
    now: new Date(),
  };
});
