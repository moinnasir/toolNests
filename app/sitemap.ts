import type { MetadataRoute } from 'next';
import { tools, toolHref } from '@/lib/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const pages = [
    '',
    '/tools',
    '/pricing',
    '/about',
    '/contact',
    '/blog',
    '/dashboard',
    '/settings',
    '/subscription',
    '/referrals',
    ...tools.map((tool) => toolHref(tool.slug)),
  ];
  const staticPages = pages.map(p => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));
  return staticPages;
}

