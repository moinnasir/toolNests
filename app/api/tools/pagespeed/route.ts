import { NextResponse } from 'next/server';

const MAX_URL = 2048;

type Body = { url?: string };

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const raw = typeof body.url === 'string' ? body.url.trim() : '';
  if (!raw || raw.length > MAX_URL) {
    return NextResponse.json({ ok: false, error: 'Provide a valid url string.' }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ ok: false, error: 'URL could not be parsed.' }, { status: 400 });
  }

  if (!['http:', 'https:'].includes(target.protocol)) {
    return NextResponse.json({ ok: false, error: 'Only http(s) URLs are allowed.' }, { status: 400 });
  }

  const key = process.env.GOOGLE_PAGESPEED_API_KEY || process.env.GOOGLE_PAGESPEED_KEY;
  if (!key) {
    return NextResponse.json(
      {
        ok: false,
        error: 'PageSpeed API is not configured. Set GOOGLE_PAGESPEED_API_KEY in the server environment.',
      },
      { status: 503 },
    );
  }

  const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  endpoint.searchParams.set('url', target.toString());
  endpoint.searchParams.set('key', key);
  endpoint.searchParams.set('category', 'performance');
  endpoint.searchParams.set('strategy', 'mobile');

  const upstream = await fetch(endpoint.toString(), { next: { revalidate: 0 } });
  if (!upstream.ok) {
    return NextResponse.json(
      { ok: false, error: `PageSpeed API error (${upstream.status})` },
      { status: 502 },
    );
  }

  const json = (await upstream.json()) as {
    lighthouseResult?: {
      categories?: { performance?: { score?: number | null } };
      audits?: Record<string, { displayValue?: string; numericValue?: number }>;
    };
  };

  const perf = json.lighthouseResult?.categories?.performance?.score;
  const score = typeof perf === 'number' ? Math.round(perf * 100) : null;

  const fcp = json.lighthouseResult?.audits?.['first-contentful-paint']?.displayValue;
  const lcp = json.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue;
  const cls = json.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue;
  const tbt = json.lighthouseResult?.audits?.['total-blocking-time']?.displayValue;

  const lines = [
    `URL: ${target.toString()}`,
    score !== null ? `Performance score (mobile): ${score}/100` : 'Performance score: unavailable',
    fcp ? `FCP: ${fcp}` : null,
    lcp ? `LCP: ${lcp}` : null,
    cls ? `CLS: ${cls}` : null,
    tbt ? `TBT: ${tbt}` : null,
  ].filter(Boolean);

  return NextResponse.json({ ok: true, summary: lines.join('\n') });
}
