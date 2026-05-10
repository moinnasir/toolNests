'use client';
import { useState } from 'react';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';

export default function ExpiringLinkTool(){
  const [file, setFile] = useState<File | null>(null);
  const [hours, setHours] = useState(24);
  const [link, setLink] = useState<string>('');

  const create = async ()=>{
    if(!file) return;
    const id = uuid();
    const path = `expiring/${id}-${file.name}`;
    const r = ref(storage, path);
    await uploadBytes(r, file);
    const url = await getDownloadURL(r);
    const token = uuid().replace(/-/g,'');
    await addDoc(collection(db, 'expiring_links'), {
      token, url, expiresAt: Date.now() + hours*60*60*1000, createdAt: serverTimestamp(),
    });
    setLink(`${location.origin}/api/expiring/${token}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Expiring Link Generator</h1>
      <div className="card space-y-4">
        <input type="file" className="input" onChange={e=>setFile(e.target.files?.[0] || null)} />
        <div><label className="label">Expires in (hours)</label><input className="input max-w-xs" type="number" value={hours} onChange={e=>setHours(Number(e.target.value) || 1)} /></div>
        <button className="btn" onClick={create}>Create Link</button>
        {link && (<div><label className="label">Share this link</label><input className="input" readOnly value={link} /></div>)}
      </div>
    </div>
  )
}
