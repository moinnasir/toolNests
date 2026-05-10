'use client';

import { useMemo, useState } from 'react';
import { CRON_PRESETS } from '@/lib/cron-presets';
import { buildUniversalOutput, isAiDraftSlug } from '@/lib/universal-tool-presets';
import { logToolUsage } from '@/lib/usage';
import { ToolErrorBanner, ToolOutputPanel, ToolTwoColumn } from '@/components/tool-shell';

type Props = { slug: string; title: string; category: string };

export default function UniversalTool({ slug, title, category }: Props) {
  const [topic, setTopic] = useState(category === 'SEO' ? 'https://toolnests.app/' : 'Freelance web design service');
  const [details, setDetails] = useState('');
  const [cronPick, setCronPick] = useState<string>(CRON_PRESETS[0].value);
  const [psiUrl, setPsiUrl] = useState('https://toolnests.app/');
  const [psiBlock, setPsiBlock] = useState('');
  const [psiLoading, setPsiLoading] = useState(false);
  const [psiErr, setPsiErr] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState('');
  const [aiBlock, setAiBlock] = useState('');

  const baseOutput = useMemo(
    () => buildUniversalOutput(slug, title, category, topic, details),
    [category, details, slug, title, topic],
  );

  const output = useMemo(() => {
    let o = baseOutput;
    if (slug.includes('cron')) o += `\n\nSelected cron expression:\n${cronPick}`;
    if (psiBlock) o += `\n\n--- PageSpeed (live) ---\n${psiBlock}`;
    if (aiBlock) o += `\n\n--- AI draft ---\n${aiBlock}`;
    return o;
  }, [aiBlock, baseOutput, cronPick, psiBlock, slug]);

  const runPageSpeed = async () => {
    setPsiErr('');
    setPsiBlock('');
    setPsiLoading(true);
    try {
      const res = await fetch('/api/tools/pagespeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: psiUrl.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; summary?: string };
      if (!res.ok || !data.ok) {
        setPsiErr(data.error || 'Request failed');
        return;
      }
      setPsiBlock(data.summary || '');
      await logToolUsage(slug, { pagespeed: true });
    } catch {
      setPsiErr('Network error');
    } finally {
      setPsiLoading(false);
    }
  };

  const runAi = async () => {
    setAiErr('');
    setAiBlock('');
    setAiLoading(true);
    try {
      const res = await fetch('/api/tools/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, topic, details }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; text?: string };
      if (!res.ok || !data.ok) {
        setAiErr(data.error || 'AI request failed');
        return;
      }
      setAiBlock(data.text || '');
      await logToolUsage(slug, { ai: true });
    } catch {
      setAiErr('Network error');
    } finally {
      setAiLoading(false);
    }
  };

  const showPsi = slug.includes('page-speed');
  const showAi = isAiDraftSlug(slug);
  const showCron = slug.includes('cron');

  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        {showAi ? (
          <div className="rounded-lg border border-blue-100 bg-blue-50/80 px-3 py-2 text-xs text-blue-900">
            Optional: use <strong>Generate with AI</strong> when <code className="rounded bg-white/80 px-1">OPENAI_API_KEY</code> is configured on
            the server. Otherwise templates below still work offline.
          </div>
        ) : null}
        {showPsi ? (
          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-sm font-semibold text-slate-800">Live PageSpeed (optional API)</div>
            <input className="input" value={psiUrl} onChange={(e) => setPsiUrl(e.target.value)} placeholder="https://example.com" />
            <button type="button" className="btn-secondary" disabled={psiLoading} onClick={runPageSpeed}>
              {psiLoading ? 'Fetching…' : 'Run PageSpeed Insights'}
            </button>
            <ToolErrorBanner message={psiErr} />
          </div>
        ) : null}
        {showCron ? (
          <div className="space-y-2">
            <label className="label" htmlFor="cron-preset">
              Cron preset
            </label>
            <select id="cron-preset" className="input" value={cronPick} onChange={(e) => setCronPick(e.target.value)}>
              {CRON_PRESETS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div>
          <label className="label" htmlFor="univ-topic">
            {category === 'SEO' ? 'URL or focus topic' : 'Topic / subject'}
          </label>
          <input id="univ-topic" className="input" value={topic} onChange={(event) => setTopic(event.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="univ-details">
            Details
          </label>
          <textarea
            id="univ-details"
            className="input h-40"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="Add URL, audience, tone, requirements, or source text..."
          />
        </div>
        {showAi ? (
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn" disabled={aiLoading} onClick={runAi}>
              {aiLoading ? 'Generating…' : 'Generate with AI'}
            </button>
          </div>
        ) : null}
        <ToolErrorBanner message={aiErr} />
      </div>
      <ToolOutputPanel value={output} slug={slug} title="Output" rows={20} monospace={false} />
    </ToolTwoColumn>
  );
}
