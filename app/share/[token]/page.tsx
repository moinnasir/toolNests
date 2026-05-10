'use client';

import { useEffect, useState } from 'react';

type TransferInfo = {
  token: string;
  title: string;
  senderEmail: string;
  message: string;
  files: Array<{ name: string; size: number; type: string; downloadUrl: string }>;
  totalSize: number;
  fileCount: number;
  downloadCount: number;
  expiresAt: number;
  expired: boolean;
  error?: string;
};

export default function SharePage({ params }: { params: { token: string } }) {
  const [transfer, setTransfer] = useState<TransferInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/expiring/${params.token}/info`)
      .then((response) => response.json())
      .then(setTransfer)
      .catch(() => setTransfer({ error: 'Unable to load this transfer.' } as TransferInfo))
      .finally(() => setLoading(false));
  }, [params.token]);

  if (loading) {
    return <div className="card p-8 text-slate-600">Loading transfer...</div>;
  }

  if (!transfer || transfer.error) {
    return <TransferShell title="Transfer unavailable" message={transfer?.error || 'This transfer could not be found.'} />;
  }

  if (transfer.expired) {
    return <TransferShell title="Transfer expired" message="The expiry time for this shared link has passed." />;
  }

  return (
    <div className="grid min-h-[calc(100vh-190px)] gap-6 py-6 lg:grid-cols-[1fr_420px] lg:items-center">
      <section className="space-y-5">
        <p className="eyebrow">ToolNest transfer</p>
        <h1 className="max-w-3xl text-4xl font-black text-slate-950 md:text-5xl">{transfer.title}</h1>
        {transfer.senderEmail && <p className="text-lg text-slate-600">Shared by {transfer.senderEmail}</p>}
        {transfer.message && <p className="max-w-2xl rounded-lg border border-slate-200 bg-white p-4 leading-7 text-slate-700">{transfer.message}</p>}
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Files" value={String(transfer.fileCount)} />
          <Stat label="Size" value={formatBytes(transfer.totalSize)} />
          <Stat label="Expires" value={new Date(transfer.expiresAt).toLocaleDateString()} />
        </div>
      </section>

      <aside className="card space-y-4">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Ready to download</h2>
          <p className="mt-2 text-sm text-slate-600">Files open through secure Firebase download URLs until the link expires.</p>
        </div>
        <div className="space-y-2">
          {transfer.files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="surface flex items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-950">{file.name}</div>
                <div className="text-xs text-slate-500">{formatBytes(file.size)}</div>
              </div>
              <a className="btn-secondary px-3 py-1" href={file.downloadUrl}>Download</a>
            </div>
          ))}
        </div>
        {transfer.files[0] && <a className="btn w-full py-3" href={transfer.files[0].downloadUrl}>Download first file</a>}
        <p className="text-center text-xs font-semibold text-slate-500">{transfer.downloadCount} downloads recorded</p>
      </aside>
    </div>
  );
}

function TransferShell({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-[calc(100vh-190px)] items-center justify-center py-10">
      <div className="card max-w-lg space-y-3 p-8 text-center">
        <h1 className="text-3xl font-black text-slate-950">{title}</h1>
        <p className="text-slate-600">{message}</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface p-4">
      <div className="text-sm font-semibold text-slate-600">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
