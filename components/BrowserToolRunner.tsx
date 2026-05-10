'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { logToolUsage } from '@/lib/usage';

type Props = {
  slug: string;
  title: string;
  description: string;
};

const sampleText = 'ToolNest helps freelancers and small teams finish everyday web tasks faster.';

export default function BrowserToolRunner({ slug, title, description }: Props) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="section-title">{title}</h1>
        <p className="mt-2 text-slate-600">{description}</p>
      </header>
      {renderTool(slug)}
    </div>
  );
}

function renderTool(slug: string) {
  if (['word-counter', 'character-counter'].includes(slug)) return <CounterTool mode={slug} />;
  if (slug === 'text-case-converter') return <TextCaseTool />;
  if (['remove-extra-spaces', 'duplicate-line-remover', 'text-sorter', 'slug-generator'].includes(slug)) return <TextTransformTool mode={slug} />;
  if (slug === 'json-formatter') return <JsonTool />;
  if (['base64-encoder-decoder', 'url-encoder-decoder', 'html-entity-encoder-decoder'].includes(slug)) return <CodecTool mode={slug} />;
  if (slug === 'regex-tester') return <RegexTool />;
  if (slug === 'jwt-decoder') return <JwtTool />;
  if (slug === 'uuid-generator') return <UuidTool />;
  if (slug === 'hash-generator') return <HashTool />;
  if (['meta-tag-generator', 'open-graph-preview'].includes(slug)) return <MetaTool preview={slug === 'open-graph-preview'} />;
  if (slug === 'keyword-density-checker') return <KeywordTool />;
  if (['robots-txt-generator', 'sitemap-xml-generator', 'schema-markup-generator'].includes(slug)) return <SeoGenerator mode={slug} />;
  if (['image-compressor', 'image-resizer'].includes(slug)) return <ImageCanvasTool mode={slug} />;
  if (['color-picker', 'gradient-generator', 'css-box-shadow-generator'].includes(slug)) return <DesignTool mode={slug} />;
  if (['profit-margin-calculator', 'gst-tax-calculator', 'loan-emi-calculator', 'paypal-stripe-fee-calculator', 'discount-calculator'].includes(slug)) return <BusinessCalculator mode={slug} />;
  if (slug === 'password-generator') return <PasswordTool />;
  if (slug === 'age-calculator') return <AgeTool />;
  if (slug === 'unit-converter') return <UnitTool />;
  if (slug === 'timestamp-converter') return <TimestampTool />;
  return null;
}

function ToolGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">{children}</div>;
}

function CopyButton({ value, slug }: { value: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    await logToolUsage(slug, { copied: true });
    window.setTimeout(() => setCopied(false), 1600);
  };
  return <button className="btn" onClick={copy} disabled={!value}>{copied ? 'Copied' : 'Copy'}</button>;
}

function CounterTool({ mode }: { mode: string }) {
  const [text, setText] = useState(sampleText);
  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const noSpaces = text.replace(/\s/g, '').length;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const sentences = text.split(/[.!?]+/).filter((item) => item.trim()).length;
    const reading = Math.max(1, Math.ceil(words / 225));
    return { words, chars, noSpaces, lines, sentences, reading };
  }, [text]);
  const rows = mode === 'word-counter'
    ? [['Words', stats.words], ['Sentences', stats.sentences], ['Lines', stats.lines], ['Reading time', `${stats.reading} min`]]
    : [['Characters', stats.chars], ['Without spaces', stats.noSpaces], ['Words', stats.words], ['Lines', stats.lines]];
  return (
    <ToolGrid>
      <div className="card space-y-4">
        <textarea className="input h-64" value={text} onChange={(event) => setText(event.target.value)} />
        <button className="btn-secondary" onClick={() => setText('')}>Clear</button>
      </div>
      <div className="card grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => <div key={label} className="surface p-4"><div className="text-sm text-slate-600">{label}</div><div className="mt-1 text-2xl font-black text-slate-950">{value}</div></div>)}
      </div>
    </ToolGrid>
  );
}

function TextCaseTool() {
  const [text, setText] = useState('toolNest all tools expansion');
  const title = text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  const output = [
    ['Uppercase', text.toUpperCase()],
    ['Lowercase', text.toLowerCase()],
    ['Title Case', title],
    ['Sentence case', text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : ''],
  ];
  return (
    <ToolGrid>
      <div className="card space-y-4"><textarea className="input h-56" value={text} onChange={(event) => setText(event.target.value)} /><button className="btn-secondary" onClick={() => setText('')}>Clear</button></div>
      <div className="card space-y-3">{output.map(([label, value]) => <ResultBlock key={label} label={label} value={value} slug="text-case-converter" />)}</div>
    </ToolGrid>
  );
}

function TextTransformTool({ mode }: { mode: string }) {
  const [text, setText] = useState(mode === 'slug-generator' ? 'New Blog Post: ToolNest SEO Tools!' : 'apple\nbanana\napple\n  mango   juice\nbanana');
  const [reverse, setReverse] = useState(false);
  const output = useMemo(() => {
    if (mode === 'remove-extra-spaces') return text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    if (mode === 'duplicate-line-remover') return Array.from(new Set(text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))).join('\n');
    if (mode === 'text-sorter') {
      const lines = text.split(/\r?\n/).filter(Boolean).sort((a, b) => a.localeCompare(b));
      return (reverse ? lines.reverse() : lines).join('\n');
    }
    return text.toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }, [mode, reverse, text]);
  return (
    <ToolGrid>
      <div className="card space-y-4">
        <textarea className="input h-56" value={text} onChange={(event) => setText(event.target.value)} />
        {mode === 'text-sorter' && <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={reverse} onChange={(event) => setReverse(event.target.checked)} /> Reverse order</label>}
        <button className="btn-secondary" onClick={() => setText('')}>Clear</button>
      </div>
      <OutputPanel value={output} slug={mode} />
    </ToolGrid>
  );
}

function JsonTool() {
  const [text, setText] = useState('{"name":"ToolNest","tools":40,"free":true}');
  const [minify, setMinify] = useState(false);
  const result = useMemo(() => {
    try {
      return { value: JSON.stringify(JSON.parse(text), null, minify ? 0 : 2), error: '' };
    } catch (error) {
      return { value: '', error: error instanceof Error ? error.message : 'Invalid JSON' };
    }
  }, [minify, text]);
  return (
    <ToolGrid>
      <div className="card space-y-4">
        <textarea className="input h-64 font-mono text-sm" value={text} onChange={(event) => setText(event.target.value)} />
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={minify} onChange={(event) => setMinify(event.target.checked)} /> Minify output</label>
      </div>
      <div className="card space-y-4">{result.error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{result.error}</p> : <OutputPanel value={result.value} slug="json-formatter" />}</div>
    </ToolGrid>
  );
}

function CodecTool({ mode }: { mode: string }) {
  const [text, setText] = useState(mode === 'base64-encoder-decoder' ? 'ToolNest' : 'https://example.com/search?q=tool nest');
  const encode = () => {
    if (mode === 'base64-encoder-decoder') return btoa(unescape(encodeURIComponent(text)));
    if (mode === 'url-encoder-decoder') return encodeURIComponent(text);
    return text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char] || char));
  };
  const decode = () => {
    try {
      if (mode === 'base64-encoder-decoder') return decodeURIComponent(escape(atob(text)));
      if (mode === 'url-encoder-decoder') return decodeURIComponent(text);
      const doc = new DOMParser().parseFromString(text, 'text/html');
      return doc.documentElement.textContent || '';
    } catch {
      return 'Unable to decode this value.';
    }
  };
  const output = `Encoded:\n${encode()}\n\nDecoded:\n${decode()}`;
  return (
    <ToolGrid>
      <div className="card space-y-4"><textarea className="input h-56" value={text} onChange={(event) => setText(event.target.value)} /><button className="btn-secondary" onClick={() => setText('')}>Clear</button></div>
      <OutputPanel value={output} slug={mode} />
    </ToolGrid>
  );
}

function RegexTool() {
  const [pattern, setPattern] = useState('\\btool\\w*\\b');
  const [flags, setFlags] = useState('gi');
  const [text, setText] = useState('ToolNest tools make tool workflows faster.');
  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      return { error: '', matches: Array.from(text.matchAll(regex)).map((match) => match[0]) };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Invalid regex', matches: [] };
    }
  }, [flags, pattern, text]);
  return (
    <ToolGrid>
      <div className="card space-y-4"><input className="input font-mono" value={pattern} onChange={(event) => setPattern(event.target.value)} /><input className="input" value={flags} onChange={(event) => setFlags(event.target.value)} /><textarea className="input h-44" value={text} onChange={(event) => setText(event.target.value)} /></div>
      <div className="card space-y-3">{result.error ? <p className="text-sm font-semibold text-red-700">{result.error}</p> : result.matches.map((item, index) => <div className="surface p-3 font-mono text-sm" key={`${item}-${index}`}>{item}</div>)} {!result.error && result.matches.length === 0 && <p className="text-sm text-slate-600">No matches found.</p>}</div>
    </ToolGrid>
  );
}

function JwtTool() {
  const [token, setToken] = useState('');
  const decode = (part: number) => {
    try {
      const value = token.split('.')[part];
      if (!value) return '';
      return JSON.stringify(JSON.parse(atob(value.replace(/-/g, '+').replace(/_/g, '/'))), null, 2);
    } catch {
      return 'Invalid JWT segment.';
    }
  };
  return (
    <ToolGrid>
      <div className="card space-y-4"><textarea className="input h-48 font-mono text-sm" placeholder="Paste JWT here" value={token} onChange={(event) => setToken(event.target.value)} /><button className="btn-secondary" onClick={() => setToken('')}>Clear</button></div>
      <div className="card space-y-4"><ResultBlock label="Header" value={decode(0)} slug="jwt-decoder" /><ResultBlock label="Payload" value={decode(1)} slug="jwt-decoder" /></div>
    </ToolGrid>
  );
}

function UuidTool() {
  const [count, setCount] = useState(5);
  const [items, setItems] = useState<string[]>(() => Array.from({ length: 5 }, () => crypto.randomUUID()));
  const generate = () => setItems(Array.from({ length: count }, () => crypto.randomUUID()));
  return <div className="card space-y-4"><input className="input max-w-xs" type="number" min="1" max="50" value={count} onChange={(event) => setCount(Number(event.target.value))} /><button className="btn" onClick={generate}>Generate UUIDs</button><OutputPanel value={items.join('\n')} slug="uuid-generator" /></div>;
}

function HashTool() {
  const [text, setText] = useState('ToolNest');
  const [hash, setHash] = useState('');
  const generate = async () => {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    setHash(Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join(''));
    await logToolUsage('hash-generator', { algorithm: 'SHA-256' });
  };
  return <ToolGrid><div className="card space-y-4"><textarea className="input h-44" value={text} onChange={(event) => setText(event.target.value)} /><button className="btn" onClick={generate}>Generate SHA-256</button></div><OutputPanel value={hash} slug="hash-generator" /></ToolGrid>;
}

function MetaTool({ preview }: { preview: boolean }) {
  const [title, setTitle] = useState('ToolNest - Online tools for daily work');
  const [description, setDescription] = useState('Convert, calculate, generate, and clean up everyday business assets in one place.');
  const [url, setUrl] = useState('https://toolnests.app');
  const [image, setImage] = useState('https://toolnests.app/og-image.png');
  const html = `<title>${title}</title>\n<meta name="description" content="${description}" />\n<link rel="canonical" href="${url}" />\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${description}" />\n<meta property="og:url" content="${url}" />\n<meta property="og:image" content="${image}" />`;
  return (
    <ToolGrid>
      <div className="card space-y-4"><input className="input" value={title} onChange={(event) => setTitle(event.target.value)} /><textarea className="input h-28" value={description} onChange={(event) => setDescription(event.target.value)} /><input className="input" value={url} onChange={(event) => setUrl(event.target.value)} /><input className="input" value={image} onChange={(event) => setImage(event.target.value)} /></div>
      {preview ? <div className="card"><div className="overflow-hidden rounded-lg border border-slate-200"><div className="aspect-[1.91/1] bg-slate-100 p-8 text-sm text-slate-500">{image}</div><div className="p-4"><div className="text-xs uppercase text-slate-500">{url}</div><h2 className="mt-1 text-lg font-bold text-slate-950">{title}</h2><p className="mt-2 text-sm text-slate-600">{description}</p></div></div></div> : <OutputPanel value={html} slug="meta-tag-generator" />}
    </ToolGrid>
  );
}

function KeywordTool() {
  const [text, setText] = useState(sampleText);
  const rows = useMemo(() => {
    const words = text.toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || [];
    const total = words.length || 1;
    const counts: Record<string, number> = {};
    words.forEach((word) => {
      counts[word] = (counts[word] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([word, count]) => [word, count, `${((count / total) * 100).toFixed(1)}%`]);
  }, [text]);
  return <ToolGrid><div className="card"><textarea className="input h-64" value={text} onChange={(event) => setText(event.target.value)} /></div><div className="card space-y-2">{rows.map(([word, count, pct]) => <div className="surface flex items-center justify-between p-3" key={word}><span className="font-semibold">{word}</span><span className="text-sm text-slate-600">{count} - {pct}</span></div>)}</div></ToolGrid>;
}

function SeoGenerator({ mode }: { mode: string }) {
  const [domain, setDomain] = useState('https://toolnests.app');
  const [urls, setUrls] = useState('/\n/tools\n/pricing');
  const [name, setName] = useState('ToolNest');
  const output = useMemo(() => {
    if (mode === 'robots-txt-generator') return `User-agent: *\nAllow: /\n\nSitemap: ${domain.replace(/\/$/, '')}/sitemap.xml`;
    if (mode === 'sitemap-xml-generator') return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.split(/\r?\n/).filter(Boolean).map((url) => `  <url><loc>${url.startsWith('http') ? url : domain.replace(/\/$/, '') + url}</loc></url>`).join('\n')}\n</urlset>`;
    return JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name, url: domain }, null, 2);
  }, [domain, mode, name, urls]);
  return <ToolGrid><div className="card space-y-4"><input className="input" value={domain} onChange={(event) => setDomain(event.target.value)} />{mode === 'sitemap-xml-generator' && <textarea className="input h-36" value={urls} onChange={(event) => setUrls(event.target.value)} />}{mode === 'schema-markup-generator' && <input className="input" value={name} onChange={(event) => setName(event.target.value)} />}</div><OutputPanel value={output} slug={mode} /></ToolGrid>;
}

function ImageCanvasTool({ mode }: { mode: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [quality, setQuality] = useState(0.75);
  const [output, setOutput] = useState('');
  const process = async () => {
    if (!file) return;
    const img = await loadImage(URL.createObjectURL(file));
    const canvas = document.createElement('canvas');
    const ratio = mode === 'image-resizer' ? 1 : Math.min(1, width / img.width);
    canvas.width = mode === 'image-resizer' ? width : Math.round(img.width * ratio);
    canvas.height = mode === 'image-resizer' ? height : Math.round(img.height * ratio);
    canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
    setOutput(canvas.toDataURL('image/jpeg', quality));
    await logToolUsage(mode, { hasFile: true });
  };
  return (
    <ToolGrid>
      <div className="card space-y-4"><input className="input" type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} /><input className="input" type="number" value={width} onChange={(event) => setWidth(Number(event.target.value))} />{mode === 'image-resizer' && <input className="input" type="number" value={height} onChange={(event) => setHeight(Number(event.target.value))} />}<input className="w-full" type="range" min="0.2" max="1" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} /><button className="btn" onClick={process} disabled={!file}>Process Image</button></div>
      <div className="card space-y-4">
        {output ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="max-h-80 rounded-lg border border-slate-200 object-contain" src={output} alt="Processed output" />
            <a className="btn" href={output} download="toolnest-image.jpg">Download</a>
          </>
        ) : <p className="text-sm text-slate-600">Choose an image to preview the result.</p>}
      </div>
    </ToolGrid>
  );
}

function DesignTool({ mode }: { mode: string }) {
  const [a, setA] = useState('#2563eb');
  const [b, setB] = useState('#14b8a6');
  const [angle, setAngle] = useState(135);
  const [blur, setBlur] = useState(24);
  const css = mode === 'gradient-generator' ? `background: linear-gradient(${angle}deg, ${a}, ${b});` : mode === 'css-box-shadow-generator' ? `box-shadow: 0 12px ${blur}px rgba(15, 23, 42, 0.22);` : `HEX: ${a}\nRGB: ${hexToRgb(a)}\nHSL: ${hexToHsl(a)}`;
  return <ToolGrid><div className="card space-y-4"><input className="h-14 w-full rounded-lg border border-slate-200" type="color" value={a} onChange={(event) => setA(event.target.value)} />{mode === 'gradient-generator' && <><input className="h-14 w-full rounded-lg border border-slate-200" type="color" value={b} onChange={(event) => setB(event.target.value)} /><input className="w-full" type="range" min="0" max="360" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></>}{mode === 'css-box-shadow-generator' && <input className="w-full" type="range" min="0" max="60" value={blur} onChange={(event) => setBlur(Number(event.target.value))} />}</div><div className="card space-y-4"><div className="h-44 rounded-lg border border-slate-200" style={mode === 'gradient-generator' ? { background: `linear-gradient(${angle}deg, ${a}, ${b})` } : mode === 'css-box-shadow-generator' ? { boxShadow: `0 12px ${blur}px rgba(15, 23, 42, 0.22)` } : { background: a }} /><OutputPanel value={css} slug={mode} /></div></ToolGrid>;
}

function BusinessCalculator({ mode }: { mode: string }) {
  const [a, setA] = useState(1000);
  const [b, setB] = useState(mode === 'loan-emi-calculator' ? 12 : 20);
  const [c, setC] = useState(mode === 'loan-emi-calculator' ? 12 : 2.9);
  const output = useMemo(() => {
    if (mode === 'profit-margin-calculator') return `Profit: ${(a - b).toFixed(2)}\nMargin: ${(((a - b) / a) * 100).toFixed(2)}%\nMarkup: ${(((a - b) / b) * 100).toFixed(2)}%`;
    if (mode === 'gst-tax-calculator') return `Tax: ${((a * b) / 100).toFixed(2)}\nTotal with tax: ${(a + (a * b) / 100).toFixed(2)}\nBase from tax-inclusive: ${(a / (1 + b / 100)).toFixed(2)}`;
    if (mode === 'loan-emi-calculator') { const r = b / 12 / 100; const n = c; const emi = r ? (a * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : a / n; return `Monthly EMI: ${emi.toFixed(2)}\nTotal payment: ${(emi * n).toFixed(2)}\nTotal interest: ${(emi * n - a).toFixed(2)}`; }
    if (mode === 'paypal-stripe-fee-calculator') { const fee = a * (b / 100) + c; return `Fee: ${fee.toFixed(2)}\nYou receive: ${(a - fee).toFixed(2)}\nCharge to receive target: ${((a + c) / (1 - b / 100)).toFixed(2)}`; }
    return `Discount: ${((a * b) / 100).toFixed(2)}\nSale price: ${(a - (a * b) / 100).toFixed(2)}\nYou save: ${b.toFixed(2)}%`;
  }, [a, b, c, mode]);
  return <ToolGrid><div className="card space-y-4"><NumberInput label={mode === 'loan-emi-calculator' ? 'Loan amount' : 'Amount / price'} value={a} setValue={setA} /><NumberInput label={mode === 'loan-emi-calculator' ? 'Annual interest %' : mode === 'profit-margin-calculator' ? 'Cost' : 'Percent'} value={b} setValue={setB} />{['loan-emi-calculator', 'paypal-stripe-fee-calculator'].includes(mode) && <NumberInput label={mode === 'loan-emi-calculator' ? 'Months' : 'Fixed fee'} value={c} setValue={setC} />}</div><OutputPanel value={output} slug={mode} /></ToolGrid>;
}

function PasswordTool() {
  const [length, setLength] = useState(16);
  const [symbols, setSymbols] = useState(true);
  const chars = `ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789${symbols ? '!@#$%^&*?' : ''}`;
  const password = useMemo(() => Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join(''), [chars, length]);
  return <div className="card space-y-4"><input className="w-full" type="range" min="8" max="64" value={length} onChange={(event) => setLength(Number(event.target.value))} /><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={symbols} onChange={(event) => setSymbols(event.target.checked)} /> Include symbols</label><OutputPanel value={password} slug="password-generator" /></div>;
}

function AgeTool() {
  const [date, setDate] = useState('2000-01-01');
  const age = useMemo(() => {
    const start = new Date(date);
    const now = new Date();
    const days = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return `Years: ${Math.floor(days / 365.25)}\nMonths approx: ${Math.floor(days / 30.44)}\nDays: ${days}`;
  }, [date]);
  return <ToolGrid><div className="card"><input className="input" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></div><OutputPanel value={age} slug="age-calculator" /></ToolGrid>;
}

function UnitTool() {
  const [type, setType] = useState('km-mi');
  const [value, setValue] = useState(10);
  const result = type === 'km-mi' ? value * 0.621371 : type === 'kg-lb' ? value * 2.20462 : (value * 9) / 5 + 32;
  return <ToolGrid><div className="card space-y-4"><select className="input" value={type} onChange={(event) => setType(event.target.value)}><option value="km-mi">Kilometers to miles</option><option value="kg-lb">Kilograms to pounds</option><option value="c-f">Celsius to Fahrenheit</option></select><input className="input" type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} /></div><OutputPanel value={result.toFixed(4)} slug="unit-converter" /></ToolGrid>;
}

function TimestampTool() {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const readable = new Date(timestamp * 1000).toLocaleString();
  const fromDate = Math.floor(new Date(date).getTime() / 1000);
  return <ToolGrid><div className="card space-y-4"><input className="input" type="number" value={timestamp} onChange={(event) => setTimestamp(Number(event.target.value))} /><input className="input" type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} /></div><OutputPanel value={`Timestamp to date: ${readable}\nDate to timestamp: ${fromDate}`} slug="timestamp-converter" /></ToolGrid>;
}

function NumberInput({ label, value, setValue }: { label: string; value: number; setValue: (value: number) => void }) {
  return <div><label className="label">{label}</label><input className="input" type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} /></div>;
}

function OutputPanel({ value, slug }: { value: string; slug: string }) {
  return <div className="card space-y-4"><textarea className="input h-64 font-mono text-sm" readOnly value={value} /><CopyButton value={value} slug={slug} /></div>;
}

function ResultBlock({ label, value, slug }: { label: string; value: string; slug: string }) {
  return <div className="surface space-y-2 p-3"><div className="text-sm font-semibold text-slate-700">{label}</div><textarea className="input h-24 font-mono text-sm" readOnly value={value} /><CopyButton value={value} slug={slug} /></div>;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function hexToRgb(hex: string) {
  const value = parseInt(hex.slice(1), 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

function hexToHsl(hex: string) {
  const [r, g, b] = hexToRgb(hex).split(', ').map((item) => Number(item) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}
