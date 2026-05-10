'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';

export default function BlogPost({ params }: { params: { id: string } }){
  const [post, setPost] = useState<any>(null);

  useEffect(()=>{
    (async ()=>{
      try{
        const ref = doc(db, 'posts', params.id);
        const snap = await getDoc(ref);
        if(snap.exists()) setPost({ id: snap.id, ...snap.data() });
      }catch{}
    })();
  }, [params.id]);

  if(!post) return <div>Loading…</div>;
  return (
    <article className="prose prose-invert max-w-3xl">
      <h1>{post.title}</h1>
      <div className="text-slate-500 text-sm">{new Date(post.publishedAt || Date.now()).toLocaleString()}</div>
      <ReactMarkdown>{post.content || ''}</ReactMarkdown>
    </article>
  );
}

