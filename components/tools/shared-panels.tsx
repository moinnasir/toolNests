'use client';

import ToolCopyButton from '@/components/tool-shell/ToolCopyButton';

export function NumberInput({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} />
    </div>
  );
}

export function ResultBlock({ label, value, slug }: { label: string; value: string; slug: string }) {
  return (
    <div className="surface space-y-2 p-3">
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <textarea className="input h-24 font-mono text-sm" readOnly value={value} spellCheck={false} />
      <ToolCopyButton value={value} slug={slug} className="btn-secondary w-full sm:w-auto" />
    </div>
  );
}
