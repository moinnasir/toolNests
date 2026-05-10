'use client';

import type { ReactNode } from 'react';
import ToolShell, { type ProcessingMode } from '@/components/tool-shell/ToolShell';
import { getToolBySlug } from '@/lib/tool-page-meta';

export default function ToolPageShell({
  slug,
  children,
  processing = 'browser',
}: {
  slug: string;
  children: ReactNode;
  processing?: ProcessingMode;
}) {
  const tool = getToolBySlug(slug);
  if (!tool) {
    return <div className="space-y-6">{children}</div>;
  }
  return (
    <ToolShell
      category={tool.category}
      title={tool.name}
      description={tool.description}
      plan={tool.plan}
      processing={processing}
    >
      {children}
    </ToolShell>
  );
}
