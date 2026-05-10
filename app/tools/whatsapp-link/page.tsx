'use client';

import { useMemo, useState } from 'react';
import { logToolUsage } from '@/lib/usage';

function cleanPhone(value: string) {
  return value.replace(/[^\d]/g, '');
}

export default function WhatsAppLinkPage() {
  const [countryCode, setCountryCode] = useState('92');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('Hello, I found you through ToolNests.');
  const [campaign, setCampaign] = useState('');
  const [copied, setCopied] = useState(false);

  const link = useMemo(() => {
    const number = `${cleanPhone(countryCode)}${cleanPhone(phone).replace(/^0+/, '')}`;
    const base = number ? `https://wa.me/${number}` : 'https://wa.me/';
    const params = new URLSearchParams();
    if (message.trim()) params.set('text', message.trim());
    if (campaign.trim()) params.set('utm_campaign', campaign.trim());
    const query = params.toString();
    return query ? `${base}?${query}` : base;
  }, [countryCode, phone, message, campaign]);

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    await logToolUsage('whatsapp-link', { hasMessage: Boolean(message.trim()) });
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="section-title">WhatsApp Link Generator</h1>
        <p className="mt-2 text-slate-600">Create a shareable WhatsApp chat URL with a ready-to-send message.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <div className="card space-y-4">
          <div className="grid grid-cols-[110px_1fr] gap-3">
            <div>
              <label className="label">Code</label>
              <input className="input" value={countryCode} onChange={(event) => setCountryCode(event.target.value)} />
            </div>
            <div>
              <label className="label">Phone number</label>
              <input className="input" placeholder="3001234567" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input h-32" value={message} onChange={(event) => setMessage(event.target.value)} />
          </div>
          <div>
            <label className="label">Campaign tag</label>
            <input className="input" placeholder="eid-offer" value={campaign} onChange={(event) => setCampaign(event.target.value)} />
          </div>
        </div>
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Generated Link</h2>
          <input className="input font-mono text-sm" readOnly value={link} />
          <div className="flex flex-wrap gap-3">
            <button className="btn" onClick={copy} disabled={!phone}>Copy Link</button>
            <a className="btn-secondary" href={link} target="_blank" rel="noreferrer">Open WhatsApp</a>
          </div>
          {copied && <p className="text-sm text-emerald-300">Copied.</p>}
        </div>
      </div>
    </div>
  );
}

