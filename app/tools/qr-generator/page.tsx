'use client';

import { useMemo, useState } from 'react';
import { ToolPageShell } from '@/components/tool-shell';
import { logToolUsage } from '@/lib/usage';

export default function QrGeneratorPage() {
  const [text, setText] = useState('https://toolnests.app');
  const [size, setSize] = useState(300);
  const src = useMemo(() => `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text || 'ToolNests')}`, [text, size]);

  return (
    <ToolPageShell slug="qr-generator" processing="hybrid">
      <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <div className="card space-y-4">
          <div>
            <label className="label">Content</label>
            <textarea className="input h-36" value={text} onChange={(event) => setText(event.target.value)} />
          </div>
          <div>
            <label className="label">Size ({size}px)</label>
            <input className="w-full" type="range" min="160" max="600" step="20" value={size} onChange={(event) => setSize(Number(event.target.value))} />
          </div>
          <button className="btn" onClick={() => logToolUsage('qr-generator', { size })}>Refresh QR</button>
        </div>
        <div className="card flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="Generated QR code" className="rounded-lg border border-slate-200 bg-white p-3" width={size} height={size} />
          <a className="btn" href={src} download="toolnests-qr.png">Download PNG</a>
        </div>
      </div>
    </ToolPageShell>
  );
}

