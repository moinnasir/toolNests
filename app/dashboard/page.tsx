'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { tools, toolHref } from '@/lib/tools';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const popular = useMemo(() => tools.filter((tool) => tool.popular).slice(0, 6), []);
  const recent = useMemo(() => tools.slice(0, 4), []);

  useEffect(() => onAuthStateChanged(auth, (current) => {
    setUser(current);
    if (!current) router.push('/login');
  }), [router]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">Welcome, {user.displayName || user.email}</h1>
            <p className="mt-2 text-slate-600">Launch popular tools, manage account settings, and keep work moving.</p>
          </div>
          <div className="flex gap-2">
            <Link className="btn-secondary" href="/settings">Settings</Link>
            <Link className="btn" href="/tools">All Tools</Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card"><div className="text-sm text-slate-500">Account</div><div className="mt-1 text-lg font-bold text-slate-950">{user.email}</div></div>
        <div className="card"><div className="text-sm text-slate-500">Plan</div><div className="mt-1 text-lg font-bold text-slate-950">Free</div></div>
        <div className="card"><div className="text-sm text-slate-500">Tools available</div><div className="mt-1 text-lg font-bold text-slate-950">{tools.length}</div></div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-950">Popular Tools</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {popular.map((tool) => (
            <Link key={tool.slug} className="card block hover:border-blue-200 hover:shadow-md" href={toolHref(tool.slug)}>
              <span className="badge">{tool.category}</span>
              <div className="mt-3 font-bold text-slate-950">{tool.name}</div>
              <p className="mt-1 text-sm text-slate-600">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-950">Recent Tools</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {recent.map((tool) => <Link key={tool.slug} className="surface p-4 font-semibold text-slate-800 hover:border-blue-200 hover:bg-blue-50" href={toolHref(tool.slug)}>{tool.name}</Link>)}
        </div>
      </section>
    </div>
  );
}

