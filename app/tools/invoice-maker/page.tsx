'use client';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function InvoiceMaker(){
  const [meta, setMeta] = useState({ from: '', to: '', number: 'INV-001', date: new Date().toISOString().slice(0,10) });
  const [items, setItems] = useState([{ desc: 'Service', qty: 1, price: 100 } as any]);
  const total = items.reduce((s, i)=> s + Number(i.qty)*Number(i.price), 0);
  const addItem = ()=> setItems([...items, { desc: '', qty: 1, price: 0 }]);
  const remove = (idx:number)=> setItems(items.filter((_,i)=>i!==idx));
  const download = async ()=>{
    const node = document.getElementById('invoice-preview');
    if(!node) return;
    const canvas = await html2canvas(node, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p','mm','a4');
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, w, h);
    pdf.save(`${meta.number}.pdf`);
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Invoice Maker</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <div><label className="label">From</label><textarea className="input h-24" value={meta.from} onChange={e=>setMeta({...meta, from:e.target.value})}/></div>
          <div><label className="label">To</label><textarea className="input h-24" value={meta.to} onChange={e=>setMeta({...meta, to:e.target.value})}/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Invoice #</label><input className="input" value={meta.number} onChange={e=>setMeta({...meta, number:e.target.value})}/></div>
            <div><label className="label">Date</label><input className="input" type="date" value={meta.date} onChange={e=>setMeta({...meta, date:e.target.value})}/></div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><div className="label">Items</div><button className="btn" onClick={addItem}>Add Item</button></div>
            {items.map((it, idx)=> (
              <div key={idx} className="grid grid-cols-7 gap-2 items-end">
                <div className="col-span-4"><label className="label">Description</label><input className="input" value={it.desc} onChange={e=>{ const v=[...items]; v[idx].desc=e.target.value; setItems(v); }}/></div>
                <div><label className="label">Qty</label><input className="input" type="number" value={it.qty} onChange={e=>{ const v=[...items]; v[idx].qty=Number(e.target.value); setItems(v); }}/></div>
                <div><label className="label">Price</label><input className="input" type="number" value={it.price} onChange={e=>{ const v=[...items]; v[idx].price=Number(e.target.value); setItems(v); }}/></div>
                <button className="btn" onClick={()=>remove(idx)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center"><div className="text-xl font-semibold">Total</div><div className="text-2xl font-bold">${total.toFixed(2)}</div></div>
          <button className="btn w-full" onClick={download}>Download PDF</button>
        </div>
        <div id="invoice-preview" className="card bg-white text-black">
          <div className="flex justify-between items-center">
            <div><div className="font-bold text-xl">INVOICE</div><div className="text-sm">#{meta.number} • {meta.date}</div></div>
            <div className="text-right text-sm"><div className="font-semibold">From</div><pre className="whitespace-pre-wrap">{meta.from}</pre></div>
          </div>
          <div className="mt-4 text-sm"><div className="font-semibold">Bill To</div><pre className="whitespace-pre-wrap">{meta.to}</pre></div>
          <table className="w-full mt-4 text-sm"><thead><tr className="[&>th]:text-left border-b"><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>{items.map((it,i)=> (<tr key={i} className="border-b"><td>{it.desc}</td><td>{it.qty}</td><td>${Number(it.price).toFixed(2)}</td><td>${(Number(it.qty)*Number(it.price)).toFixed(2)}</td></tr>))}</tbody></table>
          <div className="text-right mt-4 text-lg font-bold">Grand Total: ${total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}
