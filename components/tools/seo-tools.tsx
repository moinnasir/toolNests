'use client';

import { useMemo, useState } from 'react';
import { ToolOutputPanel, ToolTwoColumn } from '@/components/tool-shell';
import { sampleText } from './utils';

export function MetaTool({ preview, slug }: { preview: boolean; slug: string }) {
  const [title, setTitle] = useState('ToolNest - Online tools for daily work');
  const [description, setDescription] = useState('Convert, calculate, generate, and clean up everyday business assets in one place.');
  const [url, setUrl] = useState('https://toolnests.app');
  const [image, setImage] = useState('https://toolnests.app/og-image.png');
  const html = `<title>${title}</title>\n<meta name="description" content="${description}" />\n<link rel="canonical" href="${url}" />\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${description}" />\n<meta property="og:url" content="${url}" />\n<meta property="og:image" content="${image}" />`;
  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <div>
          <label className="label" htmlFor="meta-title">
            Title
          </label>
          <input id="meta-title" className="input" value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="meta-desc">
            Description
          </label>
          <textarea id="meta-desc" className="input h-28" value={description} onChange={(event) => setDescription(event.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="meta-url">
            Canonical URL
          </label>
          <input id="meta-url" className="input" value={url} onChange={(event) => setUrl(event.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="meta-img">
            OG image URL
          </label>
          <input id="meta-img" className="input" value={image} onChange={(event) => setImage(event.target.value)} />
        </div>
      </div>
      {preview ? (
        <div className="card space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">Snippet preview</h2>
          <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
            <div className="aspect-[1.91/1] bg-slate-100 p-6 text-xs text-slate-500">{image}</div>
            <div className="p-4">
              <div className="text-xs uppercase text-slate-500">{url}</div>
              <h3 className="mt-1 text-lg font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
            </div>
          </div>
        </div>
      ) : (
        <ToolOutputPanel value={html} slug={slug} title="HTML tags" rows={14} />
      )}
    </ToolTwoColumn>
  );
}

export function SeoScoreTool() {
  const [title, setTitle] = useState('ToolNest SEO tools for freelancers');
  const [description, setDescription] = useState('Use free SEO tools to improve titles, descriptions, links, content, and technical checks.');
  const [content, setContent] = useState(sampleText);
  const score = useMemo(() => {
    let value = 0;
    if (title.length >= 30 && title.length <= 60) value += 25;
    if (description.length >= 120 && description.length <= 160) value += 25;
    if (content.split(/\s+/).length >= 80) value += 20;
    if (/https?:\/\//.test(content)) value += 10;
    if (/^#|<h1/i.test(content)) value += 10;
    if (/\b(faq|question|answer)\b/i.test(content)) value += 10;
    return value;
  }, [content, description, title]);
  const output = `SEO Score: ${score}/100\n\nTitle length: ${title.length}\nDescription length: ${description.length}\nContent words: ${content.trim().split(/\s+/).filter(Boolean).length}\n\nRecommendations:\n${score < 25 ? '- Add stronger title and meta description.\n' : ''}${description.length < 120 ? '- Expand meta description toward 120-160 characters.\n' : ''}${content.split(/\s+/).length < 80 ? '- Add more useful page copy and headings.\n' : ''}- Include internal links, FAQs, and clear page intent.`;
  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <div>
          <label className="label" htmlFor="seo-title">
            Page title
          </label>
          <input id="seo-title" className="input" value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="seo-meta">
            Meta description
          </label>
          <textarea id="seo-meta" className="input h-24" value={description} onChange={(event) => setDescription(event.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="seo-body">
            Body copy sample
          </label>
          <textarea id="seo-body" className="input h-44" value={content} onChange={(event) => setContent(event.target.value)} />
        </div>
        <div className="surface p-4 text-center">
          <div className="text-xs font-semibold uppercase text-slate-500">Score</div>
          <div className="text-3xl font-black text-blue-700">{score}/100</div>
        </div>
      </div>
      <ToolOutputPanel value={output} slug="seo-score-checker" title="Report" rows={16} />
    </ToolTwoColumn>
  );
}

export function KeywordTool() {
  const [text, setText] = useState(sampleText);
  const rows = useMemo(() => {
    const words = text.toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || [];
    const total = words.length || 1;
    const counts: Record<string, number> = {};
    words.forEach((word) => {
      counts[word] = (counts[word] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([word, count]) => [word, count, `${((count / total) * 100).toFixed(1)}%`] as const);
  }, [text]);
  return (
    <ToolTwoColumn>
      <div className="card space-y-3">
        <label className="label" htmlFor="kw-text">
          Paste content
        </label>
        <textarea id="kw-text" className="input h-64" value={text} onChange={(event) => setText(event.target.value)} />
      </div>
      <div className="card space-y-2">
        <h2 className="text-sm font-semibold text-slate-800">Top terms</h2>
        {rows.map(([word, count, pct]) => (
          <div className="surface flex items-center justify-between gap-2 p-3" key={`${word}-${count}`}>
            <span className="font-semibold text-slate-900">{word}</span>
            <span className="text-sm text-slate-600">
              {count} · {pct}
            </span>
          </div>
        ))}
      </div>
    </ToolTwoColumn>
  );
}

export function XmlValidatorTool() {
  const [xml, setXml] = useState(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://toolnests.app/</loc></url>\n</urlset>',
  );
  const result = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const error = doc.querySelector('parsererror')?.textContent;
    const urls = Array.from(doc.querySelectorAll('loc')).map((item) => item.textContent || '').filter(Boolean);
    return error ? `Invalid XML:\n${error}` : `Valid XML sitemap\nURLs found: ${urls.length}\n\n${urls.join('\n')}`;
  }, [xml]);
  return (
    <ToolTwoColumn>
      <div className="card space-y-3">
        <label className="label" htmlFor="xml-input">
          XML
        </label>
        <textarea id="xml-input" className="input h-64 font-mono text-sm" value={xml} onChange={(event) => setXml(event.target.value)} spellCheck={false} />
      </div>
      <ToolOutputPanel value={result} slug="xml-sitemap-validator" title="Validation" rows={16} />
    </ToolTwoColumn>
  );
}

export function SeoGenerator({ mode }: { mode: string }) {
  const [domain, setDomain] = useState('https://toolnests.app');
  const [urls, setUrls] = useState('/\n/tools\n/pricing');
  const [name, setName] = useState('ToolNest');
  const output = useMemo(() => {
    if (mode === 'robots-txt-generator') return `User-agent: *\nAllow: /\n\nSitemap: ${domain.replace(/\/$/, '')}/sitemap.xml`;
    if (mode === 'sitemap-xml-generator')
      return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
        .split(/\r?\n/)
        .filter(Boolean)
        .map((url) => `  <url><loc>${url.startsWith('http') ? url : domain.replace(/\/$/, '') + url}</loc></url>`)
        .join('\n')}\n</urlset>`;
    return JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name, url: domain }, null, 2);
  }, [domain, mode, name, urls]);
  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <div>
          <label className="label" htmlFor="seo-domain">
            Site URL
          </label>
          <input id="seo-domain" className="input" value={domain} onChange={(event) => setDomain(event.target.value)} />
        </div>
        {mode === 'sitemap-xml-generator' && (
          <div>
            <label className="label" htmlFor="seo-paths">
              Paths (one per line)
            </label>
            <textarea id="seo-paths" className="input h-36" value={urls} onChange={(event) => setUrls(event.target.value)} />
          </div>
        )}
        {mode === 'schema-markup-generator' && (
          <div>
            <label className="label" htmlFor="org-name">
              Organization name
            </label>
            <input id="org-name" className="input" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
        )}
      </div>
      <ToolOutputPanel value={output} slug={mode} title="Output" rows={18} />
    </ToolTwoColumn>
  );
}
