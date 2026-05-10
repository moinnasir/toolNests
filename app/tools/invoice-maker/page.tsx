'use client';

import { useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Logo from '@/components/Logo';
import { ToolPageShell } from '@/components/tool-shell';
import { logToolUsage } from '@/lib/usage';

type Item = { desc: string; qty: number; price: number };

export default function InvoiceMaker() {
  const [meta, setMeta] = useState({
    business: 'ToolNests Studio\nLahore, Pakistan\nhello@toolnests.app',
    client: 'Client Name\nClient Company\nclient@example.com',
    number: 'INV-001',
    date: new Date().toISOString().slice(0, 10),
    dueDate: '',
    currency: 'USD',
    tax: 0,
    discount: 0,
    notes: 'Thank you for your business.',
  });
  const [items, setItems] = useState<Item[]>([{ desc: 'Website design service', qty: 1, price: 250 }]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0);
    const discount = subtotal * (Number(meta.discount || 0) / 100);
    const taxable = subtotal - discount;
    const tax = taxable * (Number(meta.tax || 0) / 100);
    return { subtotal, discount, tax, total: taxable + tax };
  }, [items, meta.discount, meta.tax]);

  const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: meta.currency || 'USD' }).format(value || 0);
  const updateItem = (index: number, patch: Partial<Item>) => setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  const addItem = () => setItems((current) => [...current, { desc: '', qty: 1, price: 0 }]);
  const remove = (index: number) => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));

  const download = async () => {
    const node = document.getElementById('invoice-preview');
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, Math.min(imgHeight, pageHeight));
    pdf.save(`${meta.number || 'invoice'}.pdf`);
    await logToolUsage('invoice-maker', { total: totals.total, items: items.length });
  };

  return (
    <ToolPageShell slug="invoice-maker">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="card space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label">Business details</label><textarea className="input h-28" value={meta.business} onChange={(event) => setMeta({ ...meta, business: event.target.value })} /></div>
            <div><label className="label">Client details</label><textarea className="input h-28" value={meta.client} onChange={(event) => setMeta({ ...meta, client: event.target.value })} /></div>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <div><label className="label">Invoice #</label><input className="input" value={meta.number} onChange={(event) => setMeta({ ...meta, number: event.target.value })} /></div>
            <div><label className="label">Date</label><input className="input" type="date" value={meta.date} onChange={(event) => setMeta({ ...meta, date: event.target.value })} /></div>
            <div><label className="label">Due date</label><input className="input" type="date" value={meta.dueDate} onChange={(event) => setMeta({ ...meta, dueDate: event.target.value })} /></div>
            <div><label className="label">Currency</label><input className="input" value={meta.currency} onChange={(event) => setMeta({ ...meta, currency: event.target.value.toUpperCase().slice(0, 3) })} /></div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">Line items</h2>
              <button className="btn-secondary" onClick={addItem}>Add Item</button>
            </div>
            {items.map((item, index) => (
              <div key={index} className="grid gap-2 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_80px_110px_90px] md:items-end">
                <div><label className="label">Description</label><input className="input" value={item.desc} onChange={(event) => updateItem(index, { desc: event.target.value })} /></div>
                <div><label className="label">Qty</label><input className="input" type="number" value={item.qty} onChange={(event) => updateItem(index, { qty: Number(event.target.value) })} /></div>
                <div><label className="label">Price</label><input className="input" type="number" value={item.price} onChange={(event) => updateItem(index, { price: Number(event.target.value) })} /></div>
                <button className="btn-secondary" onClick={() => remove(index)} disabled={items.length === 1}>Remove</button>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div><label className="label">Discount (%)</label><input className="input" type="number" value={meta.discount} onChange={(event) => setMeta({ ...meta, discount: Number(event.target.value) })} /></div>
            <div><label className="label">Tax (%)</label><input className="input" type="number" value={meta.tax} onChange={(event) => setMeta({ ...meta, tax: Number(event.target.value) })} /></div>
          </div>
          <div><label className="label">Notes</label><textarea className="input h-24" value={meta.notes} onChange={(event) => setMeta({ ...meta, notes: event.target.value })} /></div>
          <button className="btn w-full" onClick={download}>Download PDF</button>
        </div>

        <div className="overflow-auto">
          <div id="invoice-preview" className="mx-auto min-h-[1122px] w-full max-w-[794px] bg-white p-10 text-slate-950 shadow-xl ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-8">
              <Logo href="" />
              <div className="text-right">
                <div className="text-4xl font-black tracking-normal text-slate-950">INVOICE</div>
                <div className="mt-2 text-sm text-slate-500">#{meta.number}</div>
              </div>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-700">From</div>
                <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">{meta.business}</pre>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-700">Bill to</div>
                <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">{meta.client}</pre>
              </div>
            </div>

            <div className="mt-8 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm md:grid-cols-3">
              <div><span className="block text-slate-500">Invoice date</span><b>{meta.date}</b></div>
              <div><span className="block text-slate-500">Due date</span><b>{meta.dueDate || 'On receipt'}</b></div>
              <div><span className="block text-slate-500">Currency</span><b>{meta.currency}</b></div>
            </div>

            <table className="mt-8 w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="rounded-l-lg px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Rate</th>
                  <th className="rounded-r-lg px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-slate-200">
                    <td className="px-4 py-4 text-slate-800">{item.desc || 'Item description'}</td>
                    <td className="px-4 py-4 text-right text-slate-700">{item.qty}</td>
                    <td className="px-4 py-4 text-right text-slate-700">{money(item.price)}</td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-950">{money(item.qty * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ml-auto mt-8 w-full max-w-sm space-y-3 text-sm">
              <Row label="Subtotal" value={money(totals.subtotal)} />
              <Row label={`Discount (${meta.discount || 0}%)`} value={`-${money(totals.discount)}`} />
              <Row label={`Tax (${meta.tax || 0}%)`} value={money(totals.tax)} />
              <div className="flex justify-between border-t border-slate-300 pt-4 text-xl font-black">
                <span>Total</span><span>{money(totals.total)}</span>
              </div>
            </div>

            <div className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700">Notes</div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{meta.notes}</p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-slate-700"><span>{label}</span><span className="font-semibold text-slate-950">{value}</span></div>;
}

