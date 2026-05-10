'use client';
import { useState } from 'react';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { v4 as uuid } from 'uuid';

export default function FileLocker(){
  const [file, setFile] = useState<File | null>(null);
  const [pass, setPass] = useState('');
  const [token, setToken] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const lock = async ()=>{
    if(!file || !pass) return;
    const id = uuid();
    const path = `locker/${auth.currentUser?.uid || 'anon'}/${id}-${file.name}`;
    const r = ref(storage, path);
    await uploadBytes(r, file);
    const res = await fetch('/api/locker/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, pass }),
    });
    const data = await res.json();
    setToken(data.token);
  };

  const unlock = async ()=>{
    if(!token || !pass) return;
    const res = await fetch('/api/locker/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, pass }),
    });
    const data = await res.json();
    if (data.url) setDownloadUrl(data.url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">File Locker</h1>
      <div className="card space-y-4">
        <div className="font-semibold">Lock a File</div>
        <input type="file" className="input" onChange={e=>setFile(e.target.files?.[0] || null)} />
        <input className="input" placeholder="Passphrase" value={pass} onChange={e=>setPass(e.target.value)} />
        <button className="btn" onClick={lock}>Upload & Lock</button>
        {token && (<div><label className="label">Share this token</label><input className="input" readOnly value={token} /></div>)}
      </div>
      <div className="card space-y-4">
        <div className="font-semibold">Unlock a File</div>
        <input className="input" placeholder="Token" value={token} onChange={e=>setToken(e.target.value)} />
        <input className="input" placeholder="Passphrase" value={pass} onChange={e=>setPass(e.target.value)} />
        <button className="btn" onClick={unlock}>Unlock</button>
        {downloadUrl && (<a className="btn" href={downloadUrl} target="_blank">Download File</a>)}
      </div>
    </div>
  )
}
