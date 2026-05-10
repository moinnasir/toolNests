import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET(_req: NextRequest, { params }: { params: { token: string; index: string } }) {
  if (!adminDb) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

  const snap = await adminDb.collection('expiring_links').where('token', '==', params.token).limit(1).get();
  if (snap.empty) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const docRef = snap.docs[0].ref;
  const doc = snap.docs[0].data();
  if (Date.now() > Number(doc.expiresAt)) return NextResponse.json({ error: 'Expired' }, { status: 410 });

  const index = Number(params.index);
  const files = Array.isArray(doc.files) ? doc.files : [{ url: doc.url }];
  const file = files[index];
  if (!file?.url) return NextResponse.json({ error: 'File not found' }, { status: 404 });

  await docRef.update({ downloadCount: admin.firestore.FieldValue.increment(1) }).catch(() => undefined);
  return NextResponse.redirect(file.url, 302);
}
