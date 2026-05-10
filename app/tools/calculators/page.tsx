'use client';

import { useMemo, useState } from 'react';

export default function CalculatorsPage() {
  const [amount, setAmount] = useState(1000);
  const [percent, setPercent] = useState(15);
  const [rate, setRate] = useState(278);
  const [usd, setUsd] = useState(100);
  const [cost, setCost] = useState(650);
  const [revenue, setRevenue] = useState(1000);
  const [loan, setLoan] = useState(250000);
  const [interest, setInterest] = useState(18);
  const [months, setMonths] = useState(12);

  const percentValue = useMemo(() => amount * (percent / 100), [amount, percent]);
  const pkr = useMemo(() => usd * rate, [usd, rate]);
  const profit = useMemo(() => revenue - cost, [cost, revenue]);
  const margin = useMemo(() => revenue ? (profit / revenue) * 100 : 0, [profit, revenue]);
  const emi = useMemo(() => {
    const monthlyRate = interest / 12 / 100;
    if (!monthlyRate) return loan / months;
    return (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }, [interest, loan, months]);

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
          <div className="surface p-4 text-lg font-bold text-slate-950">${usd} x {rate} = PKR {pkr.toFixed(2)}</div>
        </div>
        <div className="card space-y-4">
          <h2 className="text-xl font-bold text-slate-950">Profit Margin Calculator</h2>
          <input className="input" type="number" value={revenue} onChange={(event) => setRevenue(Number(event.target.value))} />
          <input className="input" type="number" value={cost} onChange={(event) => setCost(Number(event.target.value))} />
          <div className="surface p-4 text-lg font-bold text-slate-950">Profit {profit.toFixed(2)} - Margin {margin.toFixed(2)}%</div>
        </div>
        <div className="card space-y-4">
          <h2 className="text-xl font-bold text-slate-950">Loan EMI Calculator</h2>
          <input className="input" type="number" value={loan} onChange={(event) => setLoan(Number(event.target.value))} />
          <input className="input" type="number" value={interest} onChange={(event) => setInterest(Number(event.target.value))} />
          <input className="input" type="number" value={months} onChange={(event) => setMonths(Number(event.target.value))} />
          <div className="surface p-4 text-lg font-bold text-slate-950">Monthly EMI {emi.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
