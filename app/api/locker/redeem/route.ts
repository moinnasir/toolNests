import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminStorage } from '@/lib/firebaseAdmin';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  if (!adminDb || !adminStorage) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  const { token, pass } = await req.json();
  if (!token || !pass) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const snap = await adminDb.collection('file_locker').where('token','==',token).limit(1).get();
  if (snap.empty) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const doc = snap.docs[0].data() as any;
  const ok = await bcrypt.compare(String(pass), String(doc.hash));
  if (!ok) return NextResponse.json({ error: 'Invalid passphrase' }, { status: 403 });
  const bucket = adminStorage.bucket();
  const file = bucket.file(doc.path);
  const [url] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 60*60*1000 });
  return NextResponse.json({ url });
}
