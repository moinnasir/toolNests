import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

export async function POST(req: NextRequest) {
  if (!adminDb) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  const { path, pass } = await req.json();
  if (!path || !pass) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const token = uuid().replace(/-/g, '');
  const hash = await bcrypt.hash(String(pass), 10);
  await adminDb.collection('file_locker').add({ token, path, hash, createdAt: Date.now() });
  return NextResponse.json({ token });
}
