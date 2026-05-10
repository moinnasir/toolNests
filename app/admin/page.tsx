'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map((value) => value.trim()).filter(Boolean);

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [allowed, setAllowed] = useState(false);
  const [usageDocs, setUsageDocs] = useState<number>(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (current) => {
      setUser(current);
      const isAllowed = !!current && ADMIN_EMAILS.includes(current.email || '');
      setAllowed(isAllowed);
      if (isAllowed) {
        try {
          const snap = await getDocs(query(collection(db, 'tool_usage'), limit(25)));
          setUsageDocs(snap.size);
        } catch {
          setUsageDocs(0);
        }
      }
    });
    return () => unsub();
  }, []);

  if (!user) return <div>Please login.</div>;
  if (!allowed) return <div>Not authorized.</div>;

  return (
    <div className="space-y-6">
      <h1 className="section-title">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Link className="card block text-white hover:bg-white/10" href="/admin/users">Users</Link>
        <Link className="card block text-white hover:bg-white/10" href="/admin/tools">Tool Stats</Link>
        <Link className="card block text-white hover:bg-white/10" href="/admin/files">File Logs</Link>
        <Link className="card block text-white hover:bg-white/10" href="/admin/payments">Payments</Link>
      </div>
      <div className="card">
        <h2 className="mb-2 text-xl font-semibold">Tool Stats</h2>
        <p className="text-white/80">Recent usage docs: {usageDocs}</p>
      </div>
    </div>
  );
}
