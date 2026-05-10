'use client';
import { useEffect, useState } from 'react';

export default function VoiceToText(){
  const [file, setFile] = useState<File|null>(null);
  const [statusId, setStatusId] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const start = async () => {
    if(!file) return;
    setLoading(true);
    const form = new FormData();
    form.append('audio', file);
    const res = await fetch('/api/assemblyai/start', { method: 'POST', body: form });
    const data = await res.json();
    setStatusId(data.id || '');
    setLoading(false);
  };

  useEffect(()=>{
    if(!statusId) return;
    const t = setInterval(async ()=>{
      const res = await fetch(`/api/assemblyai/status?id=${statusId}`);
      const data = await res.json();
      if(data.status === 'completed'){
        setText(data.text || '');
        clearInterval(t);
      }
      if(data.status === 'error'){
        clearInterval(t);
      }
    }, 3000);
    return ()=>clearInterval(t);
  }, [statusId]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Voice to Text</h1>
      <div className="card space-y-4">
        <input type="file" accept="audio/*,video/*" className="input" onChange={e=>setFile(e.target.files?.[0] || null)} />
        <button className="btn" onClick={start} disabled={!file || loading}>{loading ? 'Uploading...' : 'Transcribe'}</button>
        {statusId && <div className="text-white/70 text-sm">Job ID: {statusId}</div>}
      </div>
      {text && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Transcript</h2>
          <pre className="whitespace-pre-wrap">{text}</pre>
        </div>
      )}
    </div>
  );
}
