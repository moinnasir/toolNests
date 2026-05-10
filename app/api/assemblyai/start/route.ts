import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest){
  const key = process.env.ASSEMBLYAI_API_KEY;
  if(!key) return NextResponse.json({ error: 'Missing ASSEMBLYAI_API_KEY' }, { status: 500 });

  const form = await req.formData();
  const file = form.get('audio') as File | null;
  if(!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  // 1) Upload file to AssemblyAI
  const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: { 'authorization': key, 'transfer-encoding': 'chunked' },
    body: file.stream() as any,
  });
  const uploadData = await uploadRes.json();

  // 2) Create transcript
  const trRes = await fetch('https://api.assemblyai.com/v2/transcripts', {
    method: 'POST',
    headers: { 'authorization': key, 'content-type': 'application/json' },
    body: JSON.stringify({ audio_url: uploadData.upload_url }),
  });
  const trData = await trRes.json();
  return NextResponse.json({ id: trData.id });
}

