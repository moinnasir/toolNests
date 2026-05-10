'use client';

import { useRef, useState } from 'react';
import { logToolUsage } from '@/lib/usage';

type OutputFormat = 'mp4' | 'webm';

export default function VideoConverter() {
  const ffmpegRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
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

  const convert = async () => {
    if (!file) return;
    setOut('');
    setError('');
    setProgress(0);
    try {
      const [{ fetchFile }, ffmpeg] = await Promise.all([import('@ffmpeg/util'), load()]);
      const inputName = `input-${Date.now()}`;
      const target = `output.${format}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      const args = format === 'mp4'
        ? ['-i', inputName, '-c:v', 'libx264', '-preset', 'veryfast', '-c:a', 'aac', target]
        : ['-i', inputName, '-c:v', 'libvpx-vp9', '-c:a', 'libopus', target];
      await ffmpeg.exec(args);
      const outData = await ffmpeg.readFile(target);
      const url = URL.createObjectURL(new Blob([outData], { type: format === 'mp4' ? 'video/mp4' : 'video/webm' }));
      setOut(url);
      await logToolUsage('video-converter', { format, size: file.size });
    } catch (err: any) {
      setError(err?.message || 'Conversion failed.');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="section-title">Video Converter</h1>
        <p className="mt-2 text-white/70">Convert videos in-browser with FFmpeg WebAssembly. Large files can take time.</p>
      </header>
      <div className="card space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="md:w-56">
            <label className="label">Output</label>
            <select className="input" value={format} onChange={(event) => setFormat(event.target.value as OutputFormat)}>
              <option value="mp4">MP4</option>
              <option value="webm">WEBM</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="label">Video file</label>
            <input type="file" accept="video/*" className="input" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </div>
          <button className="btn" onClick={convert} disabled={!file || loading}>{ready ? 'Convert' : loading ? `Loading ${progress}%` : 'Load and Convert'}</button>
        </div>
        {progress > 0 && progress < 100 && <div className="text-sm text-white/70">Processing {progress}%</div>}
        {error && <div className="text-sm text-red-300">{error}</div>}
        {out && <a className="btn" href={out} download={`converted.${format}`}>Download</a>}
      </div>
      {out && <video src={out} controls className="w-full rounded-lg" />}
    </div>
  );
}
