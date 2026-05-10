'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import ToolIcon from '@/components/ToolIcon';
import { tools, toolHref } from '@/lib/tools';

export default function ToolsPage() {
  const categories = useMemo(() => ['All', ...Array.from(new Set(tools.map((tool) => tool.category)))], []);
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : 'All');
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const nextCategory = searchParams.get('category') || 'All';
    setCategory(categories.includes(nextCategory) ? nextCategory : 'All');
    setQuery(searchParams.get('q') || '');
  }, [categories, searchParams]);

  const filtered = useMemo(() => tools.filter((tool) => {
    const matchesCategory = category === 'All' || tool.category === category;
    const haystack = [tool.name, tool.description, tool.category, tool.plan, ...(tool.keywords || [])].join(' ').toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  }), [category, query]);

  return (
    <div className="space-y-8">
      <header className="grid gap-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-6 md:grid-cols-[1fr_280px] md:items-end">
        <div>
          <p className="eyebrow">Tool library</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Find the right tool fast.</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Search by task, category, or plan. Browser tools work immediately; cloud-backed tools need service keys.</p>
        </div>
        <input className="input" placeholder="Search tools..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </header>

      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button key={item} className={item === category ? 'btn' : 'btn-secondary'} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <Link key={tool.slug} href={toolHref(tool.slug)} className="card block hover:border-blue-200 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <ToolIcon tool={tool} size="sm" />
                <span className="badge">{tool.category}</span>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{tool.plan}</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-950">{tool.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && <div className="card text-slate-600">No tools found for this search.</div>}
    </div>
  );
}

