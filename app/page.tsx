import Link from 'next/link';
import FeaturedToolsSlider from '@/components/FeaturedToolsSlider';
import Logo from '@/components/Logo';
import { tools, toolHref } from '@/lib/tools';

export default function Home() {
  const popular = tools.filter((tool) => tool.popular).slice(0, 6);
  const business = tools.filter((tool) => ['Business', 'Documents', 'Files'].includes(tool.category)).slice(0, 6);
  const ai = tools.filter((tool) => tool.category === 'AI');

  return (
    <div className="space-y-12">
      <section className="grid gap-8 py-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            Professional tools for creators, freelancers, and small teams
          </div>
          <div className="space-y-4">
            <Logo href="" />
            <h1 className="max-w-3xl text-4xl font-black tracking-normal text-slate-950 md:text-6xl">
              One clean dashboard for daily business tools.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Convert files, generate invoices, create QR and WhatsApp links, secure documents, and use AI utilities from a polished SaaS workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn" href="/tools">Explore Tools</Link>
            <Link className="btn-secondary" href="/pricing">View Pricing</Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="surface p-4"><div className="text-2xl font-black text-slate-950">{tools.length}+</div><div className="text-sm text-slate-600">Tools</div></div>
            <div className="surface p-4"><div className="text-2xl font-black text-slate-950">3</div><div className="text-sm text-slate-600">Plans</div></div>
            <div className="surface p-4"><div className="text-2xl font-black text-slate-950">24/7</div><div className="text-sm text-slate-600">Web access</div></div>
          </div>
        </div>
        <FeaturedToolsSlider />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Popular</p>
            <h2 className="section-title">Most-used tools</h2>
          </div>
          <Link href="/tools" className="btn-secondary">All Tools</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {popular.map((tool) => (
            <Link key={tool.slug} href={toolHref(tool.slug)} className="card block hover:border-blue-200 hover:shadow-md">
              <span className="badge">{tool.category}</span>
              <h3 className="mt-4 text-lg font-bold text-slate-950">{tool.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <p className="eyebrow">Business suite</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Invoices, CVs, PDFs, and secure sharing.</h2>
          <div className="mt-5 grid gap-2">
            {business.map((tool) => <Link key={tool.slug} href={toolHref(tool.slug)} className="rounded-lg border border-slate-200 p-3 font-semibold text-slate-800 hover:border-blue-200 hover:bg-blue-50">{tool.name}</Link>)}
          </div>
        </div>
        <div className="card">
          <p className="eyebrow">AI ready</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">OCR and transcription workflows.</h2>
          <p className="mt-3 text-slate-600">Connect service keys when ready, while browser-based tools remain useful immediately.</p>
          <div className="mt-5 grid gap-2">
            {ai.map((tool) => <Link key={tool.slug} href={toolHref(tool.slug)} className="rounded-lg border border-slate-200 p-3 font-semibold text-slate-800 hover:border-blue-200 hover:bg-blue-50">{tool.name}</Link>)}
          </div>
        </div>
      </section>
    </div>
  );
}

