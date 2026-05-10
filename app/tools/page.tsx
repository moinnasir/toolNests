import Link from 'next/link';
import { tools, toolHref } from '@/lib/tools';

export default function ToolsPage() {
  const categories = Array.from(new Set(tools.map((tool) => tool.category)));

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="section-title">Tools</h1>
        <p className="max-w-2xl text-white/70">Choose any ToolNest utility. Browser-based tools work immediately; cloud-backed tools need Firebase or API keys.</p>
      </header>
      {categories.map((category) => (
        <section key={category} className="space-y-3">
          <h2 className="text-xl font-semibold">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tools.filter((tool) => tool.category === category).map((tool) => (
              <Link key={tool.slug} href={toolHref(tool.slug)} className="card block text-white hover:bg-white/10">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{tool.name}</h3>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/75">{tool.plan}</span>
                </div>
                <p className="mt-2 text-sm text-white/70">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
