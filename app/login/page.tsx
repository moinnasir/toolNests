'use client';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function LoginPage(){
  const [email,setEmail] = useState(''); const [password,setPassword] = useState(''); const [error,setError] = useState<string|null>(null);
  const router = useRouter();
  const onSubmit = async (e: any)=>{ e.preventDefault(); setError(null); try{ await signInWithEmailAndPassword(auth,email,password); router.push('/dashboard'); }catch(err:any){ setError(err.message);} };
  return (<div className="max-w-md mx-auto card"><h1 className="text-2xl font-bold mb-4">Login</h1><form onSubmit={onSubmit} className="space-y-4"><div><label className="label">Email</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div><div><label className="label">Password</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>{error && <div className="text-red-400 text-sm">{error}</div>}<button className="btn w-full" type="submit">Login</button></form><p className="mt-4 text-sm text-white/80">No account? <Link className="text-blue-400" href="/register">Register</Link></p></div>);
}
