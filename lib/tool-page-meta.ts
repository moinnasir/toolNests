import { tools } from '@/lib/tools';

export function getToolBySlug(slug: string) {
  return tools.find((t) => t.slug === slug);
}
