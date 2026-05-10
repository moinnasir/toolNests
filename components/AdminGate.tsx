'use client';

import { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map((value) => value.trim()).filter(Boolean);

export default function AdminGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (current) => {
    setUser(current);
    setLoading(false);
  }), []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login.</div>;
  if (!ADMIN_EMAILS.includes(user.email || '')) return <div>Not authorized.</div>;
  return <>{children}</>;
}
