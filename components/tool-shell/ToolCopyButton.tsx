'use client';

import { useState } from 'react';
import { logToolUsage } from '@/lib/usage';
import { useToolToast } from './tool-toast';

type Props = {
  value: string;
  slug: string;
  label?: string;
  className?: string;
};

export default function ToolCopyButton({ value, slug, label = 'Copy', className }: Props) {
  const [copied, setCopied] = useState(false);
  const notify = useToolToast();

  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      notify('Copied to clipboard');
      await logToolUsage(slug, { copied: true });
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      notify('Could not copy — try selecting the text manually');
    }
  };

  return (
    <button type="button" className={className ?? 'btn'} onClick={copy} disabled={!value}>
      {copied ? 'Copied' : label}
    </button>
  );
}
