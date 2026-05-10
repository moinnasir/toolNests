import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest){
  const key = process.env.ASSEMBLYAI_API_KEY;
  if(!key) return NextResponse.json({ error: 'Missing ASSEMBLYAI_API_KEY' }, { status: 500 });
  const id = req.nextUrl.searchParams.get('id');
  if(!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const res = await fetch(`https://api.assemblyai.com/v2/transcripts/${id}`, {
    headers: { authorization: key }
  });
  const data = await res.json();
  return NextResponse.json({ status: data.status, text: data.text });
}

