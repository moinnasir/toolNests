'use client';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
export default function RegisterPage(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState<string|null>(null); const router = useRouter();
  const params = useSearchParams();
  const ref = params.get('ref') || (typeof window!=='undefined' ? localStorage.getItem('ref') : '');
  const onSubmit = async (e:any)=>{ e.preventDefault(); setError(null); try{ const cred = await createUserWithEmailAndPassword(auth,email,password); if(cred.user && name){ await updateProfile(cred.user,{displayName:name}); } if(ref){ try{ await addDoc(collection(db,'referral_events'), { code: ref, newUid: cred.user.uid, createdAt: serverTimestamp() }); }catch{} }
      router.push('/dashboard'); }catch(err:any){ setError(err.message);} };
  return (<div className="max-w-md mx-auto card"><h1 className="text-2xl font-bold mb-4">Create Account</h1><form onSubmit={onSubmit} className="space-y-4"><div><label className="label">Name</label><input className="input" value={name} onChange={e=>setName(e.target.value)} required/></div><div><label className="label">Email</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div><div><label className="label">Password</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>{error && <div className="text-red-400 text-sm">{error}</div>}<button className="btn w-full" type="submit">Register</button></form><p className="mt-4 text-sm text-slate-600">Already have an account? <Link className="text-blue-400" href="/login">Login</Link></p></div>);
}

