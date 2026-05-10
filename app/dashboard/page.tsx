'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { tools, toolHref } from '@/lib/tools';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => onAuthStateChanged(auth, (current) => {
    setUser(current);
    if (!current) router.push('/login');
  }), [router]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="text-white/80">Welcome, {user.displayName || user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link className="btn-secondary" href="/settings">Settings</Link>
          <Link className="btn" href="/tools">All Tools</Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <div className="text-sm text-white/60">Account</div>
          <div className="mt-1 text-lg font-semibold">{user.email}</div>
        </div>
        <div className="card">
          <div className="text-sm text-white/60">Plan</div>
          <div className="mt-1 text-lg font-semibold">Free</div>
        </div>
        <div className="card">
          <div className="text-sm text-white/60">Tools available</div>
          <div className="mt-1 text-lg font-semibold">{tools.length}</div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Quick Launch</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.slug} className="card block text-white hover:bg-white/10" href={toolHref(tool.slug)}>
              <div className="font-semibold">{tool.name}</div>
              <p className="mt-1 text-sm text-white/65">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
