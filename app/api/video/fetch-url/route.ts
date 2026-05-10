import { NextRequest, NextResponse } from 'next/server';

const socialHosts = ['youtube.com', 'youtu.be', 'tiktok.com', 'instagram.com', 'facebook.com', 'vimeo.com'];
const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v', '.avi', '.mkv'];
const maxBytes = 50 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url || typeof url !== 'string') return NextResponse.json({ error: 'Missing URL' }, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Please enter a valid HTTP or HTTPS URL.' }, { status: 400 });
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return NextResponse.json({ error: 'Only HTTP and HTTPS URLs are supported.' }, { status: 400 });
  }

  if (socialHosts.some((host) => parsed.hostname.includes(host))) {
    return NextResponse.json({ error: 'YouTube/social links need a dedicated downloader backend. Please use a direct video file URL.' }, { status: 400 });
  }

  const hasVideoExtension = videoExtensions.some((extension) => parsed.pathname.toLowerCase().endsWith(extension));
  const upstream = await fetch(parsed.toString(), { redirect: 'follow' });
  if (!upstream.ok || !upstream.body) return NextResponse.json({ error: 'Could not fetch this video URL.' }, { status: 400 });

  const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
  const contentLength = Number(upstream.headers.get('content-length') || 0);
  if (!contentType.startsWith('video/') && !hasVideoExtension) {
    return NextResponse.json({ error: 'This does not look like a direct video file URL.' }, { status: 400 });
  }
  if (contentLength > maxBytes) {
    return NextResponse.json({ error: 'Remote video is too large for link conversion. Please use a file under 50 MB.' }, { status: 400 });
  }

  const bytes = await upstream.arrayBuffer();
  if (bytes.byteLength > maxBytes) {
    return NextResponse.json({ error: 'Remote video is too large for link conversion. Please use a file under 50 MB.' }, { status: 400 });
  }

  const filename = parsed.pathname.split('/').pop() || 'remote-video';
  return new NextResponse(bytes, {
    headers: {
      'content-type': contentType,
      'content-disposition': `attachment; filename="${filename.replace(/"/g, '')}"`,
    },
  });
}

