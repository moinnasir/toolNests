'use client';

import { useMemo, useState } from 'react';
import { logToolUsage } from '@/lib/usage';
import { ToolErrorBanner, ToolOutputPanel, ToolTwoColumn } from '@/components/tool-shell';
import { ResultBlock } from './shared-panels';

function RegexHighlighted({ pattern, flags, text }: { pattern: string; flags: string; text: string }) {
  const { error, segments, matchCount } = useMemo(() => {
    if (!pattern) {
      return { error: '', segments: [{ kind: 'text' as const, value: text }], matchCount: 0 };
    }
    try {
      let f = flags.replace(/[^gimsuy]/g, '');
      if (!f.includes('g')) f += 'g';
      const re = new RegExp(pattern, f);
      const segments: { kind: 'text' | 'match'; value: string }[] = [];
      let last = 0;
      let count = 0;
      const copy = new RegExp(pattern, f);
      let guard = 0;
      while (guard < 5000) {
        guard += 1;
        const m = copy.exec(text);
        if (!m) break;
        count += 1;
        segments.push({ kind: 'text', value: text.slice(last, m.index) });
        segments.push({ kind: 'match', value: m[0] });
        last = m.index + m[0].length;
        if (m[0].length === 0) {
          copy.lastIndex += 1;
        }
      }
      segments.push({ kind: 'text', value: text.slice(last) });
      return { error: '', segments, matchCount: count };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : 'Invalid regex',
        segments: [] as { kind: 'text' | 'match'; value: string }[],
        matchCount: 0,
      };
    }
  }, [pattern, flags, text]);

  if (error) return <ToolErrorBanner message={error} />;

  return (
    <div className="card space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
        <span>
          Matches: <strong className="text-slate-900">{matchCount}</strong>
        </span>
      </div>
      <div
        className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-900"
        aria-label="Highlighted matches"
      >
        {segments.map((s, i) =>
          s.kind === 'match' ? (
            <mark key={i} className="rounded bg-amber-200 px-0.5 text-slate-900">
              {s.value}
            </mark>
          ) : (
            <span key={i}>{s.value}</span>
          ),
        )}
      </div>
      {!pattern ? <p className="text-sm text-slate-500">Enter a pattern to highlight matches in the sample text.</p> : null}
    </div>
  );
}

export function JsonTool() {
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
    <ToolTwoColumn>
      <div className="card space-y-4">
        <label className="label" htmlFor="json-input">
          JSON input
        </label>
        <textarea id="json-input" className="input h-64 font-mono text-sm" value={text} onChange={(event) => setText(event.target.value)} spellCheck={false} />
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" checked={minify} onChange={(event) => setMinify(event.target.checked)} />
          Minify output
        </label>
      </div>
      <div className="space-y-4">
        {result.error ? <ToolErrorBanner message={result.error} /> : null}
        {!result.error ? (
          <ToolOutputPanel
            value={result.value}
            slug="json-formatter"
            title={`Formatted (${result.value.length} chars)`}
            rows={18}
          />
        ) : null}
      </div>
    </ToolTwoColumn>
  );
}

export function MinifierTool() {
  const [code, setCode] = useState('<div class="card">\\n  <h1>Hello ToolNest</h1>\\n</div>');
  const output = useMemo(
    () => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').trim(),
    [code],
  );
  return (
    <ToolTwoColumn>
      <div className="card space-y-3">
        <label className="label" htmlFor="min-input">
          HTML / CSS / JS snippet
        </label>
        <textarea id="min-input" className="input h-64 font-mono text-sm" value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} />
      </div>
      <ToolOutputPanel value={output} slug="html-css-js-minifier" title="Minified" rows={16} />
    </ToolTwoColumn>
  );
}

export function SqlFormatterTool() {
  const [sql, setSql] = useState('select id,name,email from users where active=1 order by created_at desc');
  const output = useMemo(
    () =>
      sql
        .replace(/\s+/g, ' ')
        .replace(/\b(select|from|where|and|or|order by|group by|having|limit|join|left join|right join|inner join|values|set)\b/gi, '\n$1')
        .replace(/,/g, ',\n  ')
        .trim(),
    [sql],
  );
  return (
    <ToolTwoColumn>
      <div className="card space-y-3">
        <label className="label" htmlFor="sql-input">
          SQL
        </label>
        <textarea id="sql-input" className="input h-64 font-mono text-sm" value={sql} onChange={(event) => setSql(event.target.value)} spellCheck={false} />
      </div>
      <ToolOutputPanel value={output} slug="sql-formatter" title="Formatted SQL" rows={18} />
    </ToolTwoColumn>
  );
}

export function CodecTool({ mode }: { mode: string }) {
  const [text, setText] = useState(
    mode === 'base64-encoder-decoder' ? 'ToolNest' : 'https://example.com/search?q=tool nest',
  );
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
    <ToolTwoColumn>
      <div className="card space-y-4">
        <label className="label" htmlFor={`codec-${mode}`}>
          Input
        </label>
        <textarea id={`codec-${mode}`} className="input h-56" value={text} onChange={(event) => setText(event.target.value)} />
        <button type="button" className="btn-secondary" onClick={() => setText('')}>
          Clear
        </button>
      </div>
      <ToolOutputPanel value={output} slug={mode} title="Result" rows={14} />
    </ToolTwoColumn>
  );
}

export function RegexTool() {
  const [pattern, setPattern] = useState('\\btool\\w*\\b');
  const [flags, setFlags] = useState('gi');
  const [text, setText] = useState('ToolNest tools make tool workflows faster.');
  const patternError = useMemo(() => {
    try {
      new RegExp(pattern, flags.replace(/[^gimsuy]/g, ''));
      return '';
    } catch (error) {
      return error instanceof Error ? error.message : 'Invalid regex';
    }
  }, [flags, pattern]);

  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <div>
          <label className="label" htmlFor="regex-pattern">
            Pattern
          </label>
          <input id="regex-pattern" className="input font-mono" value={pattern} onChange={(event) => setPattern(event.target.value)} spellCheck={false} />
        </div>
        <div>
          <label className="label" htmlFor="regex-flags">
            Flags (e.g. g, i, m, s, u)
          </label>
          <input id="regex-flags" className="input font-mono" value={flags} onChange={(event) => setFlags(event.target.value)} maxLength={8} />
        </div>
        <div>
          <label className="label" htmlFor="regex-haystack">
            Sample text
          </label>
          <textarea id="regex-haystack" className="input h-44" value={text} onChange={(event) => setText(event.target.value)} />
        </div>
      </div>
      <div className="space-y-4">
        {patternError ? <ToolErrorBanner message={patternError} /> : <RegexHighlighted pattern={pattern} flags={flags} text={text} />}
      </div>
    </ToolTwoColumn>
  );
}

export function JwtTool() {
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
    <ToolTwoColumn>
      <div className="card space-y-4">
        <label className="label" htmlFor="jwt-token">
          JWT
        </label>
        <textarea
          id="jwt-token"
          className="input h-48 font-mono text-sm"
          placeholder="Paste JWT here"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          spellCheck={false}
        />
        <button type="button" className="btn-secondary" onClick={() => setToken('')}>
          Clear
        </button>
      </div>
      <div className="card space-y-4">
        <ResultBlock label="Header" value={decode(0)} slug="jwt-decoder" />
        <ResultBlock label="Payload" value={decode(1)} slug="jwt-decoder" />
      </div>
    </ToolTwoColumn>
  );
}

export function UuidTool() {
  const [count, setCount] = useState(5);
  const [items, setItems] = useState<string[]>(() => Array.from({ length: 5 }, () => crypto.randomUUID()));
  const generate = () => {
    const next = Array.from({ length: count }, () => crypto.randomUUID());
    setItems(next);
    void logToolUsage('uuid-generator', { count });
  };
  return (
    <div className="card space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="label" htmlFor="uuid-count">
            Count
          </label>
          <input id="uuid-count" className="input max-w-xs" type="number" min={1} max={50} value={count} onChange={(event) => setCount(Number(event.target.value))} />
        </div>
        <button type="button" className="btn" onClick={generate}>
          Generate UUIDs
        </button>
      </div>
      <ToolOutputPanel value={items.join('\n')} slug="uuid-generator" title="UUIDs" rows={12} />
    </div>
  );
}

export function HashTool() {
  const [text, setText] = useState('ToolNest');
  const [hash, setHash] = useState('');
  const generate = async () => {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    setHash(Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join(''));
    await logToolUsage('hash-generator', { algorithm: 'SHA-256' });
  };
  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <label className="label" htmlFor="hash-input">
          Text
        </label>
        <textarea id="hash-input" className="input h-44" value={text} onChange={(event) => setText(event.target.value)} />
        <button type="button" className="btn" onClick={generate}>
          Generate SHA-256
        </button>
      </div>
      <ToolOutputPanel value={hash} slug="hash-generator" title="Hex digest" rows={4} />
    </ToolTwoColumn>
  );
}
