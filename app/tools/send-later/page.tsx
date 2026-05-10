'use client';

import { useState } from 'react';
import { ToolPageShell } from '@/components/tool-shell';

export default function SendLater() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendAt, setSendAt] = useState<string>('');
  const [msg, setMsg] = useState('');

  const schedule = async () => {
    setMsg('');
    const res = await fetch('/api/sendlater/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, body, sendAt }),
    });
    const data = await res.json();
    setMsg(data.error ? `Error: ${data.error}` : 'Scheduled!');
  };

  return (
    <ToolPageShell slug="send-later" processing="server">
      <div className="card space-y-4">
        <input className="input" placeholder="To email" value={to} onChange={e=>setTo(e.target.value)} />
        <input className="input" placeholder="Subject" value={subject} onChange={e=>setSubject(e.target.value)} />
        <textarea className="input h-40" placeholder="Body" value={body} onChange={e=>setBody(e.target.value)} />
        <div>
          <label className="label">Send at (local time)</label>
          <input className="input max-w-xs" type="datetime-local" value={sendAt} onChange={e=>setSendAt(e.target.value)} />
        </div>
        <button className="btn" onClick={schedule}>Schedule Email</button>
        {msg && <div className="text-slate-600">{msg}</div>}
        <p className="text-xs text-slate-500">
          Tip: Vercel cron ko <code className="rounded bg-slate-100 px-1">/api/sendlater/run</code> par har 5–10 min hit karne ke liye configure karein.
        </p>
      </div>
    </ToolPageShell>
  );
}

