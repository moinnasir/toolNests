import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  if (!adminDb) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

  const snap = await adminDb.collection('expiring_links').where('token', '==', params.token).limit(1).get();
  if (snap.empty) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const doc = snap.docs[0].data();
  const expiresAt = Number(doc.expiresAt);
  const expired = Date.now() > expiresAt;
  const files = Array.isArray(doc.files) ? doc.files : [{
    name: doc.fileName || 'Shared file',
    size: doc.size || 0,
    type: doc.type || 'application/octet-stream',
  }];

  return NextResponse.json({
    token: params.token,
    title: doc.title || 'Shared files',
    senderEmail: doc.senderEmail || '',
    recipientEmail: doc.recipientEmail || '',
    message: doc.message || '',
    files: files.map((file: any, index: number) => ({
      name: file.name || `File ${index + 1}`,
      size: Number(file.size || 0),
      type: file.type || 'application/octet-stream',
      downloadUrl: `/api/expiring/${params.token}/file/${index}`,
    })),
    totalSize: Number(doc.totalSize || files.reduce((sum: number, file: any) => sum + Number(file.size || 0), 0)),
    fileCount: Number(doc.fileCount || files.length),
    downloadCount: Number(doc.downloadCount || 0),
    expiresAt,
    expired,
  });
}
