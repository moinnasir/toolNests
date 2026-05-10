'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="section-title">Contact</h1>
      <p className="text-slate-600">Send a message for support, partnerships, or custom ToolNests deployment help.</p>
      <form
        className="card space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
      >
        <div>
          <label className="label">Name</label>
          <input className="input" required />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required />
        </div>
        <div>
          <label className="label">Message</label>
          <textarea className="input h-36" required />
        </div>
        <button className="btn" type="submit">Send Message</button>
        {sent && <p className="text-sm text-emerald-300">Message captured locally. Connect this form to Resend or your CRM before production launch.</p>}
      </form>
    </div>
  );
}

