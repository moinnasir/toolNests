'use client';
import { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { const unsub = onAuthStateChanged(auth, (u)=>{ setUser(u); setLoading(false); }); return ()=>unsub(); }, []);
  if (loading) { return <div className="mx-auto max-w-6xl px-4 py-16">Loading...</div>; }
  return <>{children}</>;
}

