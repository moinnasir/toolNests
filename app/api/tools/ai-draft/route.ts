import { NextResponse } from 'next/server';
import { AI_DRAFT_SLUGS } from '@/lib/universal-tool-presets';

type Body = { slug?: string; topic?: string; details?: string };

const MAX_TOPIC = 4000;
const MAX_DETAILS = 12000;

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
  const topic = typeof body.topic === 'string' ? body.topic.slice(0, MAX_TOPIC) : '';
  const details = typeof body.details === 'string' ? body.details.slice(0, MAX_DETAILS) : '';

  if (!slug || !AI_DRAFT_SLUGS.has(slug)) {
    return NextResponse.json({ ok: false, error: 'This slug is not enabled for AI drafts.' }, { status: 400 });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { ok: false, error: 'OPENAI_API_KEY is not set on the server. Use template output in the tool UI instead.' },
      { status: 503 },
    );
  }

  const system = `You help users of an online toolkit. Tool id: ${slug}. Write practical, concise output they can copy. No markdown code fences unless the tool is explicitly for code. Stay under 900 words.`;

  const user = `Topic / input:\n${topic || '(none)'}\n\nExtra instructions / context:\n${details || '(none)'}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: 'Upstream AI request failed.' }, { status: 502 });
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    return NextResponse.json({ ok: false, error: 'Empty AI response.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, text });
}
