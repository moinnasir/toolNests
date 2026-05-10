import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  if (!adminDb) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  const token = params.token;
  const snap = await adminDb.collection('expiring_links').where('token','==',token).limit(1).get();
  if (snap.empty) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const doc = snap.docs[0].data() as any;
  if (Date.now() > Number(doc.expiresAt)) return NextResponse.json({ error: 'Expired' }, { status: 410 });
  return NextResponse.redirect(doc.url, 302);
}

