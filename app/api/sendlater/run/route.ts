import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { Resend } from 'resend';

export async function GET(){
  if(!adminDb) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if(!apiKey || !from) return NextResponse.json({ error: 'Missing RESEND config' }, { status: 500 });
  const resend = new Resend(apiKey);

  const now = Date.now();
  const snap = await adminDb.collection('scheduled_emails').where('sent','==',false).where('sendAt','<=',now).limit(10).get();
  const batchPromises = snap.docs.map(async d => {
    const data = d.data() as any;
    await resend.emails.send({ from, to: data.to, subject: data.subject, text: data.body });
    await d.ref.update({ sent: true, sentAt: Date.now() });
  });

  await Promise.all(batchPromises);
  return NextResponse.json({ processed: snap.size });
}

