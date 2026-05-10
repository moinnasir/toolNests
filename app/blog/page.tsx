'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';

export default function BlogList(){
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(()=>{
    (async ()=>{
      try{
        const q = query(collection(db,'posts'), orderBy('publishedAt','desc'));
        const snap = await getDocs(q);
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }catch{}
    })();
  },[]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Blog</h1>
      <div className="grid gap-4">
        {posts.map(p => (
          <Link key={p.id} href={`/blog/${p.id}`} className="card block">
            <div className="text-xl font-semibold">{p.title}</div>
            <div className="text-slate-600 text-sm">{new Date(p.publishedAt || Date.now()).toLocaleString()}</div>
            <p className="text-slate-600 mt-2 line-clamp-2">{p.excerpt || ''}</p>
          </Link>
        ))}
        {posts.length===0 && <div className="text-slate-500">No posts yet.</div>}
      </div>
    </div>
  );
}

