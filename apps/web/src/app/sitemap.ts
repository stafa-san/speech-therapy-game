import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://hablajuega.com';
  return [{ url: `${base}/`, changeFrequency: 'weekly', priority: 1 }];
}
