'use client';

import { useEffect, useRef, useState } from 'react';
import { logToolUsage } from '@/lib/usage';

function downloadCanvas(canvas: HTMLCanvasElement, name: string) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = name;
  a.click();
}

export default function StampSignature() {
  const [tab, setTab] = useState<'signature' | 'stamp'>('signature');

  return (
    <div className="space-y-6">
      <header>
        <h1 className="section-title">Stamp and Signature Generator</h1>
        <p className="mt-2 text-slate-600">Draw a signature or generate a round stamp, then export as PNG.</p>
      </header>
      <div className="flex gap-3">
        <button className={tab === 'signature' ? 'btn' : 'btn-secondary'} onClick={() => setTab('signature')}>Signature</button>
        <button className={tab === 'stamp' ? 'btn' : 'btn-secondary'} onClick={() => setTab('stamp')}>Stamp</button>
      </div>
      {tab === 'signature' ? <SignatureTool /> : <StampTool />}
    </div>
  );
}

function SignatureTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 800 * dpr;
    canvas.height = 300 * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, 800, 300);
  }, []);

  const draw = (event: React.PointerEvent<HTMLCanvasElement>, start: boolean) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 300 / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    const ctx = canvas.getContext('2d')!;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111827';
    if (start) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  return (
    <div className="card space-y-4">
      <canvas
        ref={canvasRef}
        className="aspect-[8/3] w-full touch-none rounded-lg bg-white"
        onPointerDown={(event) => { setDrawing(true); draw(event, true); }}
        onPointerUp={() => setDrawing(false)}
        onPointerLeave={() => setDrawing(false)}
        onPointerMove={(event) => drawing && draw(event, false)}
      />
      <div className="flex gap-3">
        <button className="btn-secondary" onClick={() => {
          const canvas = canvasRef.current!;
          const ctx = canvas.getContext('2d')!;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }}>Clear</button>
        <button className="btn" onClick={async () => {
          downloadCanvas(canvasRef.current!, 'signature.png');
          await logToolUsage('stamp-signature', { type: 'signature' });
        }}>Download PNG</button>
      </div>
    </div>
  );
}

function StampTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textTop, setTextTop] = useState('ToolNests');
  const [textBottom, setTextBottom] = useState('APPROVED');
  const [center, setCenter] = useState('2026');

  useEffect(() => {
    const canvas = canvasRef.current!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 600 * dpr;
    canvas.height = 600 * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawStamp(ctx, textTop, textBottom, center);
  }, [textTop, textBottom, center]);

  return (
    <div className="card space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <div><label className="label">Top Text</label><input className="input" value={textTop} onChange={(event) => setTextTop(event.target.value)} /></div>
        <div><label className="label">Bottom Text</label><input className="input" value={textBottom} onChange={(event) => setTextBottom(event.target.value)} /></div>
        <div><label className="label">Center</label><input className="input" value={center} onChange={(event) => setCenter(event.target.value)} /></div>
      </div>
      <canvas ref={canvasRef} className="mx-auto aspect-square w-full max-w-[420px] rounded-lg border border-slate-200 bg-transparent" />
      <button className="btn" onClick={async () => {
        downloadCanvas(canvasRef.current!, 'stamp.png');
        await logToolUsage('stamp-signature', { type: 'stamp' });
      }}>Download PNG</button>
    </div>
  );
}

function drawStamp(ctx: CanvasRenderingContext2D, top: string, bottom: string, center: string) {
  const w = 600;
  const h = 600;
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 250, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 200, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#e11d48';
  ctx.textAlign = 'center';
  arcText(ctx, top.toUpperCase(), w / 2, h / 2, 230, Math.PI * 1.1, Math.PI * 1.9);
  arcText(ctx, bottom.toUpperCase(), w / 2, h / 2, 230, Math.PI * 0.1, Math.PI * 0.9);
  ctx.font = 'bold 72px sans-serif';
  ctx.fillText(center, w / 2, h / 2 + 25);
  ctx.restore();
}

function arcText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const chars = text.split('');
  const angle = (endAngle - startAngle) / Math.max(chars.length, 1);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(startAngle - Math.PI / 2);
  chars.forEach((char) => {
    ctx.rotate(angle);
    ctx.save();
    ctx.translate(0, -radius);
    ctx.rotate(Math.PI / 2);
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(char, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}

