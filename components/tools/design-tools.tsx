'use client';

import { useMemo, useState } from 'react';
import { ToolOutputPanel, ToolTwoColumn } from '@/components/tool-shell';
import { hexToHsl, hexToRgb, shiftHex } from './utils';

export function DesignTool({ mode }: { mode: string }) {
  const [a, setA] = useState('#2563eb');
  const [b, setB] = useState('#14b8a6');
  const [angle, setAngle] = useState(135);
  const [blur, setBlur] = useState(24);
  const blob = `<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg"><path fill="${a}" d="M250 58c39 34 49 99 25 147s-82 79-136 67S34 206 36 151 87 19 145 12s66 12 105 46z"/></svg>`;
  const css = useMemo(() => {
    const palette = [a, shiftHex(a, 35), shiftHex(a, -35), b, '#111827'];
    if (mode === 'gradient-generator') return `background: linear-gradient(${angle}deg, ${a}, ${b});`;
    if (mode === 'css-box-shadow-generator') return `box-shadow: 0 12px ${blur}px rgba(15, 23, 42, 0.22);`;
    if (mode === 'glassmorphism-generator')
      return `background: rgba(255,255,255,0.24);\nbackdrop-filter: blur(${Math.round(blur / 2)}px);\nborder: 1px solid rgba(255,255,255,0.38);`;
    if (mode === 'neumorphism-generator')
      return `background: #eef2f7;\nbox-shadow: ${Math.round(blur / 2)}px ${Math.round(blur / 2)}px ${blur}px #cbd5e1, -${Math.round(blur / 2)}px -${Math.round(blur / 2)}px ${blur}px #ffffff;`;
    if (mode === 'color-palette-generator') return palette.join('\n');
    if (mode === 'svg-blob-generator') return blob;
    if (mode === 'css-animation-generator')
      return `@keyframes toolnest-fade-slide {\n  from { opacity: 0; transform: translateY(12px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n.element { animation: toolnest-fade-slide 420ms ease both; }`;
    return `HEX: ${a}\nRGB: ${hexToRgb(a)}\nHSL: ${hexToHsl(a)}`;
  }, [a, angle, b, blob, blur, mode]);

  const previewStyle =
    mode === 'gradient-generator'
      ? { background: `linear-gradient(${angle}deg, ${a}, ${b})` }
      : mode.includes('shadow') || mode === 'neumorphism-generator'
        ? { boxShadow: `0 12px ${blur}px rgba(15, 23, 42, 0.22)`, background: '#ffffff' }
        : { background: a };

  const downloadSvg = () => {
    if (mode !== 'svg-blob-generator') return;
    const blobUrl = new Blob([blob], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blobUrl);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'toolnest-blob.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <div>
          <label className="label">Primary color</label>
          <input className="h-14 w-full cursor-pointer rounded-lg border border-slate-200" type="color" value={a} onChange={(event) => setA(event.target.value)} />
        </div>
        <div>
          <label className="label">Secondary color</label>
          <input className="h-14 w-full cursor-pointer rounded-lg border border-slate-200" type="color" value={b} onChange={(event) => setB(event.target.value)} />
        </div>
        <div>
          <label className="label">Angle / intensity ({angle}° / blur {blur}px)</label>
          <input className="w-full" type="range" min={0} max={360} value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
          <input className="mt-2 w-full" type="range" min={0} max={60} value={blur} onChange={(event) => setBlur(Number(event.target.value))} />
        </div>
      </div>
      <div className="card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-800">Preview</h2>
          {mode === 'svg-blob-generator' ? (
            <button type="button" className="btn-secondary" onClick={downloadSvg}>
              Download SVG
            </button>
          ) : null}
        </div>
        <div className="h-44 rounded-lg border border-slate-200" style={previewStyle} />
        {mode === 'svg-blob-generator' ? (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-4" dangerouslySetInnerHTML={{ __html: blob }} />
        ) : null}
        <ToolOutputPanel value={css} slug={mode} title="CSS / values" rows={12} />
      </div>
    </ToolTwoColumn>
  );
}
