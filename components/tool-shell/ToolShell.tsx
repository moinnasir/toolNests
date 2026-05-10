'use client';

import type { ReactNode } from 'react';
import { ToolToastProvider } from './tool-toast';

export type ToolPlan = 'Free' | 'Pro' | 'Premium';

export type ProcessingMode = 'browser' | 'server' | 'hybrid';

const processingCopy: Record<ProcessingMode, string> = {
  browser: 'Runs in your browser. Your files and text stay on this device unless you explicitly use a server feature.',
  server: 'This tool may send your input to our servers for processing. Do not paste secrets.',
  hybrid: 'Runs in your browser by default. Optional server features (when enabled) send only what you submit in that step.',
};

export type ToolShellProps = {
  category: string;
  title: string;
  description: string;
  plan?: ToolPlan;
  processing?: ProcessingMode;
  children: ReactNode;
  /** Extra actions beside title row */
  actions?: ReactNode;
};

function planBadgeClass(plan: ToolPlan) {
  if (plan === 'Free') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  if (plan === 'Pro') return 'border-amber-200 bg-amber-50 text-amber-900';
  return 'border-violet-200 bg-violet-50 text-violet-900';
}

export default function ToolShell({
  category,
  title,
  description,
  plan = 'Free',
  processing = 'browser',
  children,
  actions,
}: ToolShellProps) {
  return (
    <ToolToastProvider>
      <div className="space-y-6">
        <header className="border-b border-slate-200 pb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow">{category}</span>
                <span className={`badge border ${planBadgeClass(plan)}`}>{plan}</span>
              </div>
              <h1 className="section-title">{title}</h1>
              <p className="max-w-3xl text-base text-slate-600">{description}</p>
            </div>
            {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">{processingCopy[processing]}</p>
        </header>
        {children}
      </div>
    </ToolToastProvider>
  );
}
