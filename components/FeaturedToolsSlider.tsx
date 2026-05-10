'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import ToolIcon from './ToolIcon';
import { tools, toolHref } from '@/lib/tools';

export default function FeaturedToolsSlider() {
  const featured = useMemo(() => tools.filter((tool) => tool.featured), []);
  const [index, setIndex] = useState(0);
  const active = featured[index % featured.length];
  const next = () => setIndex((value) => (value + 1) % featured.length);
  const previous = () => setIndex((value) => (value - 1 + featured.length) % featured.length);

  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Featured</p>
            <h2 className="text-xl font-bold text-slate-950">Tool spotlight</h2>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary px-3" onClick={previous} aria-label="Previous tool">‹</button>
            <button className="btn-secondary px-3" onClick={next} aria-label="Next tool">›</button>
          </div>
        </div>
      </div>
      <div className="grid gap-5 p-5 md:grid-cols-[1fr_160px] md:items-center">
        <div>
          <span className="badge">{active.plan}</span>
          <h3 className="mt-3 text-2xl font-black text-slate-950">{active.name}</h3>
          <p className="mt-2 text-slate-600">{active.description}</p>
          <Link href={toolHref(active.slug)} className="btn mt-5">Open Tool</Link>
        </div>
        <div className="surface flex aspect-square items-center justify-center">
          <ToolIcon tool={active} size="lg" />
        </div>
      </div>
      <div className="flex gap-1 px-5 pb-5">
        {featured.map((tool, itemIndex) => (
          <button
            key={tool.slug}
            className={`h-1.5 flex-1 rounded-full ${itemIndex === index ? 'bg-blue-600' : 'bg-slate-200'}`}
            onClick={() => setIndex(itemIndex)}
            aria-label={`Show ${tool.name}`}
          />
        ))}
      </div>
    </div>
  );
}

