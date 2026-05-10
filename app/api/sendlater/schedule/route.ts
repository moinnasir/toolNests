import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest){
  if(!adminDb) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  const { to, subject, body, sendAt } = await req.json();
  if(!to || !subject || !body || !sendAt) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const target = new Date(sendAt).getTime();
  if(!target || isNaN(target)) return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
  await adminDb.collection('scheduled_emails').add({ to, subject, body, sendAt: target, sent: false, createdAt: Date.now() });
  return NextResponse.json({ ok: true });
}

