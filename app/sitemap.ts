import type { MetadataRoute } from 'next';

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
    '/tools/image-converter',
    '/tools/whatsapp-link',
    '/tools/invoice-maker',
    '/tools/expiring-link',
    '/tools/file-locker',
    '/tools/voice-to-text',
    '/tools/image-to-text',
    '/tools/stamp-signature',
    '/tools/send-later',
    '/tools/cv-maker',
    '/tools/video-converter',
  ];
  const staticPages = pages.map(p => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));
  return staticPages;
}
