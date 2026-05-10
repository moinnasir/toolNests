'use client';

import ToolShell, { type ToolPlan } from '@/components/tool-shell/ToolShell';
import { isAiDraftSlug } from '@/lib/universal-tool-presets';
import { renderTool } from '@/components/tools/registry';

type Props = {
  slug: string;
  title: string;
  description: string;
  category?: string;
  plan?: ToolPlan;
};

export default function BrowserToolRunner({
  slug,
  title,
  description,
  category = 'Productivity',
  plan = 'Free',
}: Props) {
  const processing = slug.includes('page-speed') || isAiDraftSlug(slug) ? 'hybrid' : 'browser';

  return (
    <ToolShell category={category} title={title} description={description} plan={plan} processing={processing}>
      {renderTool(slug, title, category)}
    </ToolShell>
  );
}
