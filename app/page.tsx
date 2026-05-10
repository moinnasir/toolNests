import Link from 'next/link';
import Logo from '@/components/Logo';
import ToolIcon from '@/components/ToolIcon';
import { Tool, tools, toolHref } from '@/lib/tools';

const categoryBriefs = [
  {
    name: 'SEO',
    title: 'SEO Tools',
    description: 'Keyword research, meta tags, backlink checks, rank tracking, and search snippets.',
  },
  {
    name: 'Design',
    title: 'Design Tools',
    description: 'Logo prompts, color palettes, image compression, gradients, and font pairing.',
  },
  {
    name: 'Media',
    title: 'Website Tools',
    description: 'Speed prep, image conversion, QR codes, PDF workflows, and website assets.',
  },
  {
    name: 'AI',
    title: 'AI Tools',
    description: 'Content generators, OCR, voice tools, code explainers, and chatbot workflows.',
  },
  {
    name: 'Developer',
    title: 'Developer Tools',
    description: 'JSON formatter, code minifier, encoders, regex tester, JWT tools, and API helpers.',
  },
  {
    name: 'Growth',
    title: 'Marketing Tools',
    description: 'UTM-style links, social sharing, campaign utilities, and creator growth helpers.',
  },
];

const categoryTabs = ['SEO', 'Design', 'AI', 'Media', 'Growth', 'Developer'];

const preferredFeatured = [
  'meta-tag-generator',
  'keyword-research-tool',
  'color-palette-generator',
  'json-formatter',
  'ai-article-writer',
  'page-speed-analyzer',
];

const featuredTools = preferredFeatured
  .map((slug) => tools.find((tool) => tool.slug === slug))
  .filter(Boolean) as Tool[];

const searchExamples = ['SEO score', 'AI writer', 'JSON formatter', 'color palette'];

export default function Home() {
  const totalCategories = new Set(tools.map((tool) => tool.category)).size;

  return (
    <div className="space-y-14">
      <section className="grid gap-10 py-6 md:grid-cols-[1.02fr_0.98fr] md:items-center">
        <div className="space-y-7">
          <div className="inline-flex rounded-full border border-blue-100 bg-white px-3 py-1 text-sm font-semibold text-blue-700 shadow-sm">
            Smart Digital Tools Hub
          </div>
          <div className="space-y-5">
            <Logo href="" />
            <h1 className="max-w-3xl text-4xl font-black tracking-normal text-slate-950 md:text-6xl">
              All Essential Website, SEO & Design Tools in One Place
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              ToolNest helps creators, marketers, developers, and business owners access powerful tools for SEO, design, content, speed testing, and website growth.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn px-5 py-3" href="/tools">Explore Tools</Link>
            <Link className="btn-secondary px-5 py-3" href="/contact">Submit Your Tool</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="surface bg-white p-4">
              <div className="text-2xl font-black text-slate-950">{tools.length}+</div>
              <div className="text-sm text-slate-600">Ready tools</div>
            </div>
            <div className="surface bg-white p-4">
              <div className="text-2xl font-black text-slate-950">{totalCategories}</div>
              <div className="text-sm text-slate-600">Categories</div>
            </div>
            <div className="surface bg-white p-4">
              <div className="text-2xl font-black text-green-600">Fast</div>
              <div className="text-sm text-slate-600">Browser workflows</div>
            </div>
          </div>
        </div>

        <DashboardIllustration />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <form action="/tools" className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <label className="sr-only" htmlFor="home-search">Search tools</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
              <SearchIcon />
            </span>
            <input
              id="home-search"
              name="q"
              className="input h-14 pl-12 text-base"
              placeholder="Search SEO tools, design tools, AI tools..."
            />
          </div>
          <button className="btn h-14 px-6" type="submit">Search</button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {categoryTabs.map((category) => (
            <Link key={category} className="btn-secondary" href={`/tools?category=${encodeURIComponent(category)}`}>
              {category === 'Media' ? 'Website' : category}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="eyebrow">Categories</p>
          <h2 className="section-title">Find tools by workflow</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoryBriefs.map((category) => {
            const sampleTool = tools.find((tool) => tool.category === category.name) || tools[0];
            const count = tools.filter((tool) => tool.category === category.name).length;
            return (
              <Link
                key={category.name}
                href={`/tools?category=${encodeURIComponent(category.name)}`}
                className="card block transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <ToolIcon tool={sampleTool} size="sm" />
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{count} tools</span>
                </div>
                <h3 className="mt-5 text-xl font-black text-slate-950">{category.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Featured tools</p>
            <h2 className="section-title">Popular tools to start with</h2>
          </div>
          <Link className="btn-secondary" href="/tools">All Tools</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => (
            <Link key={tool.slug} href={toolHref(tool.slug)} className="card block transition hover:border-blue-200 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <ToolIcon tool={tool} size="sm" />
                <div className="flex items-center gap-2">
                  <span className="badge">{tool.category}</span>
                  <span className="text-sm font-bold text-amber-500" aria-label="Rated 4.8 out of 5">4.8</span>
                </div>
              </div>
              <h3 className="mt-5 text-lg font-black text-slate-950">{tool.name}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{tool.description}</p>
              <span className="btn mt-5 w-full">Open Tool</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[0.9fr_1.1fr] md:items-center md:p-8">
        <div>
          <p className="eyebrow">Why choose ToolNest</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">A clean professional interface for daily digital work.</h2>
          <p className="mt-4 leading-7 text-slate-600">
            Keep research, design, content, website checks, and developer utilities in one fast workspace.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            'Fast & easy to use',
            'All tools in one place',
            'Free and premium tools',
            'Built for marketers, designers, developers, and agencies',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                <CheckIcon />
              </span>
              <span className="font-semibold text-slate-800">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg bg-slate-950 p-6 text-white shadow-sm md:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-300">Ready when you are</p>
            <h2 className="mt-2 text-3xl font-black">Search, compare, and open the right tool in seconds.</h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Start with a category, search a task, or explore the full directory of digital tools.
            </p>
          </div>
          <Link className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-blue-50" href="/tools">
            Explore ToolNest
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8">
        <div className="grid gap-5 text-sm text-slate-600 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <Logo compact />
            <p className="mt-3 max-w-xl">ToolNest is a premium tools directory for SEO, design, AI, website, marketing, and developer workflows.</p>
          </div>
          <div className="flex flex-wrap gap-4 font-semibold">
            <Link href="/tools">Tools</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DashboardIllustration() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-blue-100/60">
      <div className="rounded-lg bg-slate-950 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-400">ToolNest dashboard</div>
            <div className="mt-1 text-2xl font-black text-white">87 SEO Score</div>
          </div>
          <div className="rounded-lg bg-green-500 px-3 py-2 text-sm font-black text-white">Live</div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {['SEO', 'Design', 'AI'].map((item, index) => (
            <div key={item} className="rounded-lg bg-white/10 p-3">
              <div className="text-xs font-semibold text-slate-300">{item}</div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-blue-400" style={{ width: `${72 + index * 8}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-950">Analytics</span>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">+22%</span>
            </div>
            <div className="mt-5 flex h-32 items-end gap-2">
              {[42, 64, 52, 76, 68, 92, 86].map((height) => (
                <div key={height} className="flex-1 rounded-t-md bg-blue-600" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg bg-white p-4">
              <div className="text-sm font-bold text-slate-950">Color palette</div>
              <div className="mt-3 flex gap-2">
                {['#2563EB', '#111827', '#22C55E', '#F8FAFC'].map((color) => (
                  <span key={color} className="h-8 flex-1 rounded-md border border-slate-200" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-white p-4">
              <div className="text-sm font-bold text-slate-950">Quick search</div>
              <div className="mt-3 grid gap-2">
                {searchExamples.map((item) => (
                  <span key={item} className="rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M10.8 18.2a7.4 7.4 0 1 1 0-14.8 7.4 7.4 0 0 1 0 14.8Zm5.4-2 4.4 4.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
      <path d="m4 10 4 4 8-9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
