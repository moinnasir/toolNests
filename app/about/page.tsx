export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="section-title">About ToolNests</h1>
      <p className="text-slate-600">
        ToolNests combines everyday productivity utilities into one SaaS dashboard for freelancers, creators, students, and small teams.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="font-semibold">What it includes</h2>
          <p className="mt-2 text-sm text-slate-600">Converters, WhatsApp links, invoices, CVs, file lockers, expiring links, email scheduling, OCR, transcription, and referrals.</p>
        </div>
        <div className="card">
          <h2 className="font-semibold">How it scales</h2>
          <p className="mt-2 text-sm text-slate-600">Firebase handles auth, data, and storage while Stripe and EasyPaisa support paid plans.</p>
        </div>
      </div>
    </div>
  );
}

