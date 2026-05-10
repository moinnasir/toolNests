'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(s=>s.trim()).filter(Boolean);

export default function NewPost(){
  const [allowed, setAllowed] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{
      setAllowed(!!u && ADMIN_EMAILS.includes(u.email || ''));
    });
    return ()=>unsub();
  },[]);

  const publish = async ()=>{
    setMsg('');
    if(!title || !content) { setMsg('Missing title/content'); return; }
    await addDoc(collection(db, 'posts'), {
      title, content, excerpt, publishedAt: Date.now(), createdAt: serverTimestamp()
    });
    setMsg('Published!');
    setTitle(''); setContent(''); setExcerpt('');
  };

  if(!allowed) return <div>Not authorized</div>;
  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="text-3xl font-bold">New Blog Post</h1>
      <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="input h-24" placeholder="Short excerpt (optional)" value={excerpt} onChange={e=>setExcerpt(e.target.value)} />
      <textarea className="input h-80 font-mono" placeholder="Markdown content" value={content} onChange={e=>setContent(e.target.value)} />
      <button className="btn" onClick={publish}>Publish</button>
      {msg && <div className="text-white/80">{msg}</div>}
    </div>
  );
}
