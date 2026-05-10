'use client';

import { useMemo, useState } from 'react';
import { logToolUsage } from '@/lib/usage';

const outputTypes = [
  { label: 'PNG', value: 'image/png', extension: 'png' },
  { label: 'JPG', value: 'image/jpeg', extension: 'jpg' },
  { label: 'WebP', value: 'image/webp', extension: 'webp' },
];

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState(outputTypes[0].value);
  const [quality, setQuality] = useState(0.92);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const selected = useMemo(() => outputTypes.find((type) => type.value === format) || outputTypes[0], [format]);

  const convert = async () => {
    setError('');
    setResult('');
    if (!file) {
      setError('Please select an image first.');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) {
        setError('Canvas is not supported in this browser.');
        URL.revokeObjectURL(imageUrl);
        return;
      }

      if (format === 'image/jpeg') {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.drawImage(image, 0, 0);
      const dataUrl = canvas.toDataURL(format, quality);
      setResult(dataUrl);
      URL.revokeObjectURL(imageUrl);
      await logToolUsage('image-converter', { format: selected.extension, size: file.size });
    };
    image.onerror = () => {
      setError('Could not read this image.');
      URL.revokeObjectURL(imageUrl);
    };
    image.src = imageUrl;
  };

  const name = file ? file.name.replace(/\.[^.]+$/, '') : 'converted-image';

  return (
    <div className="space-y-6">
      <header>
        <h1 className="section-title">Image Converter</h1>
        <p className="mt-2 text-white/70">Convert PNG, JPG, and WebP files locally in your browser.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <div className="card space-y-4">
          <div>
            <label className="label">Image file</label>
            <input className="input" type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </div>
          <div>
            <label className="label">Output format</label>
            <select className="input" value={format} onChange={(event) => setFormat(event.target.value)}>
              {outputTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Quality ({Math.round(quality * 100)}%)</label>
            <input className="w-full" type="range" min="0.4" max="1" step="0.01" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
          </div>
          <button className="btn" onClick={convert}>Convert Image</button>
          {error && <p className="text-sm text-red-300">{error}</p>}
        </div>
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Preview</h2>
          {result ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result} alt="Converted preview" className="max-h-[420px] w-full rounded-lg object-contain" />
              <a className="btn" href={result} download={`${name}.${selected.extension}`}>Download {selected.label}</a>
            </>
          ) : (
            <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-white/20 text-white/50">No converted image yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
