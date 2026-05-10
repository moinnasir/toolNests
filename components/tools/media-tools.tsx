'use client';

import { useState } from 'react';
import { logToolUsage } from '@/lib/usage';
import { FileDropzone, ToolErrorBanner, ToolTwoColumn } from '@/components/tool-shell';
import { loadImage } from './utils';

export function ImageCanvasTool({ mode }: { mode: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [quality, setQuality] = useState(0.75);
  const [output, setOutput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState('');

  const process = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    setOutput('');
    const objectUrl = URL.createObjectURL(file);
    try {
      const img = await loadImage(objectUrl);
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setMeta(`Source ${w}×${h}px`);
      const maxDim = 8192;
      if (w > maxDim || h > maxDim) {
        setError(`Very large image (${w}×${h}). Browsers may fail above ~${maxDim}px — resize externally first.`);
        setBusy(false);
        URL.revokeObjectURL(objectUrl);
        return;
      }
      const canvas = document.createElement('canvas');
      const ratio = mode === 'image-resizer' ? 1 : Math.min(1, width / img.width);
      canvas.width = mode === 'image-resizer' ? width : Math.round(img.width * ratio);
      canvas.height = mode === 'image-resizer' ? height : Math.round(img.height * ratio);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Canvas is not available.');
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setOutput(canvas.toDataURL('image/jpeg', quality));
      await logToolUsage(mode, { hasFile: true, outW: canvas.width, outH: canvas.height });
    } catch {
      setError('Could not read this image.');
    } finally {
      setBusy(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <FileDropzone accept="image/*" onFile={setFile} maxSizeMB={30} hint="JPEG/PNG/WebP" />
        {meta ? <p className="text-xs text-slate-500">{meta}</p> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">{mode === 'image-resizer' ? 'Target width (px)' : 'Max width (px)'}</label>
            <input className="input" type="number" value={width} min={1} onChange={(event) => setWidth(Number(event.target.value))} />
          </div>
          {mode === 'image-resizer' && (
            <div>
              <label className="label">Target height (px)</label>
              <input className="input" type="number" value={height} min={1} onChange={(event) => setHeight(Number(event.target.value))} />
            </div>
          )}
        </div>
        <div>
          <label className="label">JPEG quality ({Math.round(quality * 100)}%)</label>
          <input className="w-full" type="range" min={0.2} max={1} step={0.05} value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
        </div>
        <ToolErrorBanner message={error} />
        <button type="button" className="btn" onClick={process} disabled={!file || busy}>
          {busy ? 'Processing…' : 'Process image'}
        </button>
      </div>
      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-slate-800">Result</h2>
        {output ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="max-h-80 rounded-lg border border-slate-200 object-contain" src={output} alt="Processed output" />
            <a className="btn" href={output} download="toolnest-image.jpg">
              Download JPEG
            </a>
          </>
        ) : (
          <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-500">
            Output preview appears here.
          </div>
        )}
      </div>
    </ToolTwoColumn>
  );
}
