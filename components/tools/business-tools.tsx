'use client';

import { useMemo, useState } from 'react';
import { ToolOutputPanel, ToolTwoColumn } from '@/components/tool-shell';
import { NumberInput } from './shared-panels';

export function BusinessCalculator({ mode }: { mode: string }) {
  const [a, setA] = useState(1000);
  const [b, setB] = useState(mode === 'loan-emi-calculator' ? 12 : 20);
  const [c, setC] = useState(mode === 'loan-emi-calculator' ? 12 : 2.9);
  const output = useMemo(() => {
    if (mode === 'profit-margin-calculator')
      return `Profit: ${(a - b).toFixed(2)}\nMargin: ${(((a - b) / a) * 100).toFixed(2)}%\nMarkup: ${(((a - b) / b) * 100).toFixed(2)}%`;
    if (mode === 'gst-tax-calculator')
      return `Tax: ${((a * b) / 100).toFixed(2)}\nTotal with tax: ${(a + (a * b) / 100).toFixed(2)}\nBase from tax-inclusive: ${(a / (1 + b / 100)).toFixed(2)}`;
    if (mode === 'loan-emi-calculator') {
      const r = b / 12 / 100;
      const n = c;
      const emi = r ? (a * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : a / n;
      return `Monthly EMI: ${emi.toFixed(2)}\nTotal payment: ${(emi * n).toFixed(2)}\nTotal interest: ${(emi * n - a).toFixed(2)}`;
    }
    if (mode === 'paypal-stripe-fee-calculator') {
      const fee = a * (b / 100) + c;
      return `Fee: ${fee.toFixed(2)}\nYou receive: ${(a - fee).toFixed(2)}\nCharge to receive target: ${((a + c) / (1 - b / 100)).toFixed(2)}`;
    }
    if (mode === 'currency-converter') return `${a} × ${b} = ${(a * b).toFixed(2)}`;
    if (mode === 'subscription-calculator')
      return `Monthly: ${a.toFixed(2)}\nAnnual: ${(a * 12).toFixed(2)}\nSeats: ${b}\nAnnual team value: ${(a * 12 * b).toFixed(2)}`;
    return `Discount: ${((a * b) / 100).toFixed(2)}\nSale price: ${(a - (a * b) / 100).toFixed(2)}\nYou save: ${b.toFixed(2)}%`;
  }, [a, b, c, mode]);
  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <NumberInput label={mode === 'loan-emi-calculator' ? 'Loan amount' : 'Amount / price'} value={a} setValue={setA} />
        <NumberInput
          label={mode === 'loan-emi-calculator' ? 'Annual interest %' : mode === 'profit-margin-calculator' ? 'Cost' : 'Percent / rate'}
          value={b}
          setValue={setB}
        />
        {['loan-emi-calculator', 'paypal-stripe-fee-calculator'].includes(mode) && (
          <NumberInput label={mode === 'loan-emi-calculator' ? 'Months' : 'Fixed fee'} value={c} setValue={setC} />
        )}
      </div>
      <ToolOutputPanel value={output} slug={mode} title="Summary" rows={12} monospace={false} />
    </ToolTwoColumn>
  );
}
