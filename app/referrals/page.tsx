'use client';
import { useEffect, useMemo, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';

function randomCode(len=8){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:len}).map(()=>chars[Math.floor(Math.random()*chars.length)]).join('');
}

export default function Referrals(){
  const [uid, setUid] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  const base = process.env.NEXT_PUBLIC_BASE_URL || '';

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u)=>{
      if(!u){ setUid(''); return; }
      setUid(u.uid);
      // fetch or create code
      const ref = doc(db, 'referral_codes', u.uid);
      const snap = await getDoc(ref);
      if (snap.exists()){
        setCode((snap.data() as any).code);
      } else {
        const newCode = randomCode();
        await setDoc(ref, { uid: u.uid, code: newCode, createdAt: serverTimestamp() });
        setCode(newCode);
      }
    });
    return ()=>unsub();
  }, []);

  useEffect(()=>{
    (async ()=>{
      if(!code) return;
      const q = query(collection(db, 'referral_events'), where('code','==',code));
      const snap = await getDocs(q);
      setCount(snap.size);
    })();
  }, [code]);

  const link = useMemo(()=> code ? `${base || location.origin}/register?ref=${code}` : '', [code, base]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Referrals</h1>
      {!uid ? <div className="card">Please login to get your referral link.</div> : (
        <div className="card space-y-3">
          <div className="text-white/80">Share this link and earn credits (demo):</div>
          <input className="input font-mono" readOnly value={link} />
          <button className="btn" onClick={()=>navigator.clipboard.writeText(link)}>Copy Link</button>
          <div className="text-white/80">Signups via your code: <b>{count}</b></div>
        </div>
      )}
    </div>
  );
}
