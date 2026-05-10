'use client';

import type { ReactNode } from 'react';
import ToolCopyButton from './ToolCopyButton';

type Props = {
  value: string;
  slug: string;
  title?: string;
  rows?: number;
  monospace?: boolean;
  extraActions?: ReactNode;
};

export default function ToolOutputPanel({
  value,
  slug,
  title = 'Output',
  rows = 14,
  monospace = true,
  extraActions,
}: Props) {
  return (
    <div className="card space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        <div className="flex flex-wrap gap-2">
          {extraActions}
          <ToolCopyButton value={value} slug={slug} />
        </div>
      </div>
      <textarea
        className={`input min-h-[12rem] resize-y ${monospace ? 'font-mono text-sm' : 'text-sm'}`}
        readOnly
        rows={rows}
        value={value}
        spellCheck={false}
        aria-label={title}
      />
    </div>
  );
}
