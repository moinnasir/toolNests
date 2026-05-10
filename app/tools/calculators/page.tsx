'use client';

import { useMemo, useState } from 'react';

export default function CalculatorsPage() {
  const [amount, setAmount] = useState(1000);
  const [percent, setPercent] = useState(15);
  const [rate, setRate] = useState(278);
  const [usd, setUsd] = useState(100);

  const percentValue = useMemo(() => amount * (percent / 100), [amount, percent]);
  const pkr = useMemo(() => usd * rate, [usd, rate]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="section-title">Calculators</h1>
        <p className="mt-2 text-slate-600">Quick calculators for freelancers and everyday business work.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-4">
          <h2 className="text-xl font-bold text-slate-950">Percentage Calculator</h2>
          <input className="input" type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
          <input className="input" type="number" value={percent} onChange={(event) => setPercent(Number(event.target.value))} />
          <div className="surface p-4 text-lg font-bold text-slate-950">{percent}% of {amount} = {percentValue.toFixed(2)}</div>
        </div>
        <div className="card space-y-4">
          <h2 className="text-xl font-bold text-slate-950">Currency-style Calculator</h2>
          <input className="input" type="number" value={usd} onChange={(event) => setUsd(Number(event.target.value))} />
          <input className="input" type="number" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
          <div className="surface p-4 text-lg font-bold text-slate-950">${usd} × {rate} = PKR {pkr.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

