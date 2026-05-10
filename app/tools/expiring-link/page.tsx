'use client';

import { useMemo, useRef, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable, type StorageReference, type UploadTaskSnapshot } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import { db, firebaseConfigured, storage } from '@/lib/firebase';
import { logToolUsage } from '@/lib/usage';

const expiryOptions = [
  { label: '1 day', hours: 24 },
  { label: '3 days', hours: 72 },
  { label: '7 days', hours: 168 },
  { label: '14 days', hours: 336 },
];

type UploadFile = {
  file: File;
  id: string;
};

export default function ExpiringLinkTool() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [hours, setHours] = useState(72);
  const [senderEmail, setSenderEmail] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('Project files');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const totalSize = useMemo(() => files.reduce((sum, item) => sum + item.file.size, 0), [files]);
  const expiryDate = useMemo(() => new Date(Date.now() + hours * 60 * 60 * 1000), [hours]);

  const addFiles = (selected: FileList | null) => {
    const next = Array.from(selected || []).map((file) => ({ file, id: uuid() }));
    setFiles((current) => [...current, ...next]);
    setLink('');
    setStatus('');
  };

  const removeFile = (id: string) => {
    setFiles((current) => current.filter((item) => item.id !== id));
  };

  const create = async () => {
    if (!firebaseConfigured) {
      setStatus('Firebase is not configured. Add Firebase keys before creating live transfer links.');
      return;
    }
    if (!files.length) {
      setStatus('Add at least one file to create a transfer.');
      return;
    }

    setBusy(true);
    setStatus('Uploading files...');
    setProgress(0);
    setCopied(false);

    try {
      const token = uuid().replace(/-/g, '');
      let uploadedBytes = 0;
      const uploaded = [];

      for (const item of files) {
        const path = `expiring/${token}/${item.id}-${item.file.name}`;
        const fileRef = ref(storage, path);
        const snapshot = await uploadWithProgress(fileRef, item.file, (bytes) => {
          const current = uploadedBytes + bytes;
          setProgress(Math.min(99, Math.round((current / totalSize) * 100)));
        });
        uploadedBytes += item.file.size;
        const url = await getDownloadURL(snapshot.ref);
        uploaded.push({
          name: item.file.name,
          size: item.file.size,
          type: item.file.type || 'application/octet-stream',
          path,
          url,
        });
      }

      const expiresAt = Date.now() + hours * 60 * 60 * 1000;
      await addDoc(collection(db, 'expiring_links'), {
        token,
        title: title.trim() || 'Shared files',
        senderEmail: senderEmail.trim(),
        recipientEmail: recipientEmail.trim(),
        message: message.trim(),
        files: uploaded,
        url: uploaded[0]?.url,
        fileName: uploaded[0]?.name,
        fileCount: uploaded.length,
        totalSize,
        expiresAt,
        downloadCount: 0,
        createdAt: serverTimestamp(),
      });

      const shareLink = `${location.origin}/share/${token}`;
      setLink(shareLink);
      setProgress(100);
      setStatus('Transfer link is ready.');
      await logToolUsage('expiring-link', { fileCount: uploaded.length, hours });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to create transfer link.');
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="-mx-4 -my-6 min-h-[calc(100vh-73px)] bg-[#eef3f0] px-4 py-6 md:-my-8 md:py-8">
      <section className="mx-auto grid min-h-[calc(100vh-120px)] max-w-6xl gap-6 lg:grid-cols-[390px_minmax(0,1fr)] lg:items-stretch">
        <div className="card flex flex-col gap-5 self-start p-0 lg:sticky lg:top-24">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-blue-700">ToolNest Transfer</p>
                <h1 className="mt-1 text-2xl font-black text-slate-950">Upload files</h1>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-2xl font-black text-white">+</div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">Create one clean expiring link for clients, friends, or your team.</p>
          </div>

          <div className="space-y-5 p-5 pt-0">
            <div
              className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/80 p-5 text-center transition hover:border-blue-300 hover:bg-blue-50"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                addFiles(event.dataTransfer.files);
              }}
            >
              <input ref={inputRef} className="hidden" type="file" multiple onChange={(event) => addFiles(event.target.files)} />
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-blue-200 bg-white text-2xl font-black text-blue-700">+</div>
              <h2 className="mt-4 text-lg font-black text-slate-950">Add files or folders</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Drag files here or browse from your computer.</p>
            </div>

            {files.length > 0 && (
              <div className="max-h-44 space-y-2 overflow-auto pr-1">
                {files.map((item) => (
                  <div key={item.id} className="surface flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-slate-950">{item.file.name}</div>
                      <div className="text-xs text-slate-500">{formatBytes(item.file.size)}</div>
                    </div>
                    <button className="btn-secondary px-3 py-1" type="button" onClick={() => removeFile(item.id)}>Remove</button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <MiniStat label="Files" value={String(files.length)} />
              <MiniStat label="Size" value={formatBytes(totalSize)} />
              <MiniStat label="Expiry" value={expiryOptions.find((option) => option.hours === hours)?.label || 'Custom'} />
            </div>

            <div className="grid gap-3">
              <div>
                <label className="label">Your email</label>
                <input className="input" type="email" value={senderEmail} onChange={(event) => setSenderEmail(event.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label className="label">Recipient email</label>
                <input className="input" type="email" value={recipientEmail} onChange={(event) => setRecipientEmail(event.target.value)} placeholder="client@example.com" />
              </div>
            </div>

            <div>
              <label className="label">Transfer title</label>
              <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>

            <div>
              <label className="label">Message</label>
              <textarea className="input h-24" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Add a note for the receiver." />
            </div>

            <div>
              <label className="label">Expires after</label>
              <div className="grid grid-cols-4 gap-2">
                {expiryOptions.map((option) => (
                  <button
                    key={option.hours}
                    className={hours === option.hours ? 'btn px-2' : 'btn-secondary px-2'}
                    type="button"
                    onClick={() => setHours(option.hours)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {busy && (
              <div className="space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-sm font-semibold text-slate-600">{progress}% uploaded</p>
              </div>
            )}

            <button className="btn w-full py-3" onClick={create} disabled={busy || !files.length}>
              {busy ? 'Creating transfer...' : 'Get transfer link'}
            </button>

            {status && <p className="rounded-lg bg-slate-50 p-3 text-sm font-semibold text-slate-700">{status}</p>}

            {link && (
              <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <label className="label">Share link</label>
                <input className="input font-mono text-sm" readOnly value={link} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <button className="btn" onClick={copy}>{copied ? 'Copied' : 'Copy link'}</button>
                  <a className="btn-secondary" href={link} target="_blank" rel="noreferrer">Open page</a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative flex min-h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-[#dce7e2] p-6 md:p-10">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#cbdcd6]" />
          <div className="relative z-10 flex w-full flex-col justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-wider text-slate-700">Private link transfer</p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-6xl">Send it once. Let the link expire.</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
                A focused transfer workspace for client files, project folders, proofs, invoices, and quick handoffs.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-[1fr_260px] md:items-end">
              <div className="rounded-lg border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                <div className="text-sm font-bold text-slate-600">Transfer preview</div>
                <div className="mt-4 space-y-3">
                  <PreviewRow label={title || 'Shared files'} value={`${files.length || 0} files - ${formatBytes(totalSize)}`} />
                  <PreviewRow label="Recipient" value={recipientEmail || 'client@example.com'} />
                  <PreviewRow label="Expires" value={expiryDate.toLocaleString()} />
                </div>
              </div>

              <div className="rounded-lg border border-slate-900 bg-slate-950 p-5 text-white shadow-sm">
                <div className="text-sm font-semibold text-slate-300">Status</div>
                <div className="mt-2 text-3xl font-black">{link ? 'Ready' : files.length ? 'Prepared' : 'Waiting'}</div>
                <div className="mt-4 h-2 rounded-full bg-white/20">
                  <div className="h-2 rounded-full bg-blue-400" style={{ width: `${link ? 100 : files.length ? 60 : 18}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 truncate text-sm font-black text-slate-950">{value}</div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <span className="truncate text-right text-sm font-black text-slate-950">{value}</span>
    </div>
  );
}

function uploadWithProgress(fileRef: StorageReference, file: File, onProgress: (bytes: number) => void) {
  return new Promise<UploadTaskSnapshot>((resolve, reject) => {
    const task = uploadBytesResumable(fileRef, file);
    task.on('state_changed', (snapshot) => onProgress(snapshot.bytesTransferred), reject, () => resolve(task.snapshot));
  });
}

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
