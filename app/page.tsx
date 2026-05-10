import Link from 'next/link';
import { tools, toolHref } from '@/lib/tools';

export default function Home() {
  const featured = tools.slice(0, 6);

  return (
    <div className="space-y-10">
      <section className="grid gap-8 py-8 md:grid-cols-[1.15fr_0.85fr] md:items-center">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">All-in-one SaaS toolkit</p>
          <h1 className="text-4xl font-bold tracking-normal text-white md:text-6xl">ToolNest</h1>
          <p className="max-w-2xl text-lg text-white/75">
            A practical workspace for converters, document tools, secure sharing, AI utilities, referrals, and subscriptions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="btn" href="/tools">Explore Tools</Link>
            <Link className="btn-secondary" href="/pricing">View Pricing</Link>
          </div>
        </div>
        <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          {featured.map((tool) => (
            <Link key={tool.slug} href={toolHref(tool.slug)} className="rounded-lg border border-white/10 bg-white/5 p-3 text-white hover:bg-white/10">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold">{tool.name}</span>
                <span className="rounded-full bg-sky-500/15 px-2 py-1 text-xs text-sky-200">{tool.plan}</span>
              </div>
              <p className="mt-1 text-sm text-white/65">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <h2 className="text-xl font-semibold">Built for freelancers</h2>
          <p className="mt-2 text-white/70">Invoices, CVs, file sharing, and WhatsApp links in one dashboard.</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold">AI-ready utilities</h2>
          <p className="mt-2 text-white/70">OCR and transcription flows are ready for real service keys.</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold">Deployable setup</h2>
          <p className="mt-2 text-white/70">Firebase, Stripe, EasyPaisa, Resend, analytics, ads, and cron are documented.</p>
        </div>
      </section>
    </div>
  );
}
