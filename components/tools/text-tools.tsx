'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { logToolUsage } from '@/lib/usage';
import { FileDropzone, ToolOutputPanel, ToolTwoColumn } from '@/components/tool-shell';
import ToolCopyButton from '@/components/tool-shell/ToolCopyButton';
import { sampleText } from './utils';

export function CounterTool({ mode }: { mode: string }) {
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
  const rows =
    mode === 'word-counter'
      ? [
          ['Words', stats.words],
          ['Sentences', stats.sentences],
          ['Lines', stats.lines],
          ['Reading time', `${stats.reading} min`],
        ]
      : [
          ['Characters', stats.chars],
          ['Without spaces', stats.noSpaces],
          ['Words', stats.words],
          ['Lines', stats.lines],
        ];
  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <label className="label" htmlFor={`counter-${mode}`}>
          Your text
        </label>
        <textarea
          id={`counter-${mode}`}
          className="input h-64"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button type="button" className="btn-secondary" onClick={() => setText('')}>
          Clear
        </button>
      </div>
      <div className="card grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="surface p-4">
            <div className="text-sm text-slate-600">{label}</div>
            <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
          </div>
        ))}
      </div>
    </ToolTwoColumn>
  );
}

export function TextCaseTool() {
  const [text, setText] = useState('toolNest all tools expansion');
  const title = text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  const output = [
    ['Uppercase', text.toUpperCase()],
    ['Lowercase', text.toLowerCase()],
    ['Title Case', title],
    ['Sentence case', text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : ''],
  ];
  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <label className="label" htmlFor="text-case-input">
          Input
        </label>
        <textarea id="text-case-input" className="input h-56" value={text} onChange={(event) => setText(event.target.value)} />
        <button type="button" className="btn-secondary" onClick={() => setText('')}>
          Clear
        </button>
      </div>
      <div className="card space-y-3">
        {output.map(([label, value]) => (
          <div key={label} className="surface space-y-2 p-3">
            <div className="text-sm font-semibold text-slate-700">{label}</div>
            <textarea className="input h-24 font-mono text-sm" readOnly value={value} spellCheck={false} />
            <ToolCopyButton value={value} slug="text-case-converter" className="btn-secondary" />
          </div>
        ))}
      </div>
    </ToolTwoColumn>
  );
}

export function TextTransformTool({ mode }: { mode: string }) {
  const [text, setText] = useState(
    mode === 'slug-generator' ? 'New Blog Post: ToolNest SEO Tools!' : 'apple\nbanana\napple\n  mango   juice\nbanana',
  );
  const [reverse, setReverse] = useState(false);
  const output = useMemo(() => {
    if (mode === 'remove-extra-spaces') return text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    if (mode === 'duplicate-line-remover')
      return Array.from(new Set(text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))).join('\n');
    if (mode === 'text-sorter') {
      const lines = text.split(/\r?\n/).filter(Boolean).sort((a, b) => a.localeCompare(b));
      return (reverse ? lines.reverse() : lines).join('\n');
    }
    return text
      .toLowerCase()
      .trim()
      .replace(/['"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }, [mode, reverse, text]);
  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <label className="label" htmlFor={`transform-${mode}`}>
          Input
        </label>
        <textarea id={`transform-${mode}`} className="input h-56" value={text} onChange={(event) => setText(event.target.value)} />
        {mode === 'text-sorter' && (
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={reverse} onChange={(event) => setReverse(event.target.checked)} />
            Reverse order
          </label>
        )}
        <button type="button" className="btn-secondary" onClick={() => setText('')}>
          Clear
        </button>
      </div>
      <ToolOutputPanel value={output} slug={mode} title="Result" />
    </ToolTwoColumn>
  );
}

export function LoremTool() {
  const [paragraphs, setParagraphs] = useState(3);
  const base =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae sem vel justo faucibus aliquet. Praesent non lorem at nibh facilisis luctus.';
  const output = Array.from({ length: paragraphs }, () => base).join('\n\n');
  return (
    <div className="card space-y-4">
      <label className="label" htmlFor="lorem-count">
        Paragraphs
      </label>
      <input
        id="lorem-count"
        className="input max-w-xs"
        type="number"
        min={1}
        max={20}
        value={paragraphs}
        onChange={(event) => setParagraphs(Number(event.target.value))}
      />
      <ToolOutputPanel value={output} slug="lorem-ipsum-generator" title="Generated text" rows={18} monospace={false} />
    </div>
  );
}

export function MarkdownPreviewTool() {
  const [text, setText] = useState('# ToolNest\n\n- Fast tools\n- Clean workflow\n\n**Ready to ship.**\n\n`code()`');
  return (
    <ToolTwoColumn>
      <div className="card space-y-3">
        <label className="label" htmlFor="md-input">
          Markdown
        </label>
        <textarea id="md-input" className="input h-64 font-mono text-sm" value={text} onChange={(event) => setText(event.target.value)} spellCheck={false} />
      </div>
      <div className="card space-y-3">
        <h2 className="text-sm font-semibold text-slate-800">Live preview</h2>
        <div className="prose prose-slate max-w-none rounded-lg border border-slate-100 bg-white p-4 prose-headings:scroll-mt-20 prose-pre:bg-slate-900 prose-pre:text-slate-100">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>
    </ToolTwoColumn>
  );
}

export function TextToSpeechTool() {
  const [text, setText] = useState('Welcome to ToolNest text to speech.');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voiceUri, setVoiceUri] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const refresh = () => setVoices(window.speechSynthesis.getVoices());
    refresh();
    window.speechSynthesis.onvoiceschanged = refresh;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = pitch;
    const v = voices.find((x) => x.voiceURI === voiceUri);
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
    void logToolUsage('text-to-speech', { rate, pitch });
  };
  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <label className="label" htmlFor="tts-text">
          Text to read
        </label>
        <textarea id="tts-text" className="input h-44" value={text} onChange={(event) => setText(event.target.value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Rate ({rate.toFixed(1)}x)</label>
            <input className="w-full" type="range" min={0.5} max={1.5} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Pitch ({pitch.toFixed(1)})</label>
            <input className="w-full" type="range" min={0.5} max={1.5} step={0.1} value={pitch} onChange={(e) => setPitch(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="tts-voice">
            Voice (optional)
          </label>
          <select
            id="tts-voice"
            className="input"
            value={voiceUri}
            onChange={(e) => setVoiceUri(e.target.value)}
          >
            <option value="">Default</option>
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="btn" onClick={speak}>
          Play speech
        </button>
      </div>
      <ToolOutputPanel value={text} slug="text-to-speech" title="Script" monospace={false} />
    </ToolTwoColumn>
  );
}

export function SimilarityTool() {
  const [a, setA] = useState('ToolNest helps creators build faster.');
  const [b, setB] = useState('ToolNest helps freelancers create faster.');
  const score = useMemo(() => {
    const one = new Set(a.toLowerCase().match(/\b\w+\b/g) || []);
    const two = new Set(b.toLowerCase().match(/\b\w+\b/g) || []);
    const overlap = Array.from(one).filter((word) => two.has(word)).length;
    const total = new Set([...Array.from(one), ...Array.from(two)]).size || 1;
    return Math.round((overlap / total) * 100);
  }, [a, b]);
  const output = `Similarity estimate: ${score}%\n\nThis browser check compares shared words only. It does not search the web — use a dedicated plagiarism service for publication-ready review.`;
  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <div>
          <label className="label" htmlFor="sim-a">
            Text A
          </label>
          <textarea id="sim-a" className="input h-32" value={a} onChange={(event) => setA(event.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="sim-b">
            Text B
          </label>
          <textarea id="sim-b" className="input h-32" value={b} onChange={(event) => setB(event.target.value)} />
        </div>
        <div className="surface p-4 text-center">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Overlap score</div>
          <div className="mt-1 text-4xl font-black text-blue-700">{score}%</div>
        </div>
      </div>
      <ToolOutputPanel value={output} slug="plagiarism-checker" title="Report" />
    </ToolTwoColumn>
  );
}

export function ImageToBase64Tool() {
  const [output, setOutput] = useState('');
  const [name, setName] = useState('');
  const convert = (file: File | null) => {
    if (!file) {
      setOutput('');
      setName('');
      return;
    }
    setName(file.name);
    const reader = new FileReader();
    reader.onload = () => setOutput(String(reader.result));
    reader.readAsDataURL(file);
    void logToolUsage('image-to-base64', { size: file.size });
  };
  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <FileDropzone accept="image/*" onFile={convert} hint="Images only" maxSizeMB={15} />
        {name ? <p className="text-xs text-slate-500">Selected: {name}</p> : null}
      </div>
      <ToolOutputPanel value={output} slug="image-to-base64" title="Data URL" rows={12} />
    </ToolTwoColumn>
  );
}
