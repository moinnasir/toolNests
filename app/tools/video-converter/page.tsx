'use client';

import { useRef, useState } from 'react';
import { ToolPageShell } from '@/components/tool-shell';
import { logToolUsage } from '@/lib/usage';

type OutputFormat = 'mp4' | 'webm';
type Mode = 'upload' | 'link';

export default function VideoConverter() {
  const ffmpegRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [out, setOut] = useState<string>('');
  const [format, setFormat] = useState<OutputFormat>('mp4');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const load = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    setLoading(true);
    setError('');
    try {
      const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
        import('@ffmpeg/ffmpeg'),
        import('@ffmpeg/util'),
      ]);
      const ffmpeg = new FFmpeg();
      ffmpeg.on('progress', ({ progress: ratio }: { progress: number }) => setProgress(Math.round((ratio || 0) * 100)));
      await ffmpeg.load({
        coreURL: await toBlobURL('https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js', 'text/javascript'),
        wasmURL: await toBlobURL('https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm', 'application/wasm'),
      });
      ffmpegRef.current = ffmpeg;
      setReady(true);
      return ffmpeg;
    } catch (err: any) {
      setError(err?.message || 'Unable to load FFmpeg.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resolveInput = async () => {
    if (mode === 'upload') {
      if (!file) throw new Error('Please select a video file.');
      return { source: file, size: file.size };
    }
    if (!videoUrl.trim()) throw new Error('Please paste a direct video URL.');
    const res = await fetch('/api/video/fetch-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: videoUrl.trim() }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Could not fetch video URL.');
    }
    const blob = await res.blob();
    return { source: new File([blob], 'remote-video', { type: blob.type || 'video/mp4' }), size: blob.size };
  };

  const convert = async () => {
    setOut('');
    setError('');
    setProgress(0);
    try {
      const [{ fetchFile }, ffmpeg, input] = await Promise.all([import('@ffmpeg/util'), load(), resolveInput()]);
      const inputName = `input-${Date.now()}`;
      const target = `output.${format}`;
      await ffmpeg.writeFile(inputName, await fetchFile(input.source));
      const args = format === 'mp4'
        ? ['-i', inputName, '-c:v', 'libx264', '-preset', 'veryfast', '-c:a', 'aac', target]
        : ['-i', inputName, '-c:v', 'libvpx-vp9', '-c:a', 'libopus', target];
      await ffmpeg.exec(args);
      const outData = await ffmpeg.readFile(target);
      const url = URL.createObjectURL(new Blob([outData], { type: format === 'mp4' ? 'video/mp4' : 'video/webm' }));
      setOut(url);
      await logToolUsage('video-converter', { format, size: input.size, mode });
    } catch (err: any) {
      setError(err?.message || 'Conversion failed.');
    }
  };

  return (
    <ToolPageShell slug="video-converter" processing="hybrid">
      <div className="card space-y-5">
        <div className="flex flex-wrap gap-2">
          <button className={mode === 'upload' ? 'btn' : 'btn-secondary'} onClick={() => setMode('upload')}>Upload file</button>
          <button className={mode === 'link' ? 'btn' : 'btn-secondary'} onClick={() => setMode('link')}>From link</button>
        </div>
        <div className="grid gap-3 md:grid-cols-[180px_1fr_auto] md:items-end">
          <div>
            <label className="label">Output</label>
            <select className="input" value={format} onChange={(event) => setFormat(event.target.value as OutputFormat)}>
              <option value="mp4">MP4</option>
              <option value="webm">WEBM</option>
            </select>
          </div>
          {mode === 'upload' ? (
            <div>
              <label className="label">Video file</label>
              <input type="file" accept="video/*" className="input" onChange={(event) => setFile(event.target.files?.[0] || null)} />
            </div>
          ) : (
            <div>
              <label className="label">Direct video URL</label>
              <input className="input" placeholder="https://example.com/video.mp4" value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} />
            </div>
          )}
          <button className="btn" onClick={convert} disabled={loading}>{ready ? 'Convert' : loading ? `Loading ${progress}%` : 'Load and Convert'}</button>
        </div>
        {mode === 'link' && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Direct .mp4/.webm/.mov links are supported. YouTube, TikTok, Instagram, Facebook, and Vimeo links are intentionally blocked until a downloader backend is configured.</div>}
        {progress > 0 && progress < 100 && <div className="text-sm text-slate-600">Processing {progress}%</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {out && <a className="btn" href={out} download={`converted.${format}`}>Download</a>}
      </div>
      {out && <video src={out} controls className="w-full rounded-lg border border-slate-200" />}
    </ToolPageShell>
  );
}

