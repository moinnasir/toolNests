'use client';
import { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function ImageToText(){
  const [img, setImg] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [lang, setLang] = useState('eng');

  const doOCR = async () => {
    if(!img) return;
    setText('');
    setProgress(0);
    const worker = await Tesseract.createWorker(lang, 1, { logger: m => {
      if(m.status === 'recognizing text' && m.progress) setProgress(Math.round(m.progress*100));
    }} as any);
    const ret = await worker.recognize(img);
    setText(ret.data.text || '');
    await worker.terminate();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Image to Text (OCR)</h1>
      <div className="card space-y-4">
        <input type="file" accept="image/*" className="input" onChange={e=>{
          const f = e.target.files?.[0]; if(!f) return;
          const url = URL.createObjectURL(f); setImg(url);
        }} />
        <div className="flex items-center gap-3">
          <label className="label">Language</label>
          <select className="input max-w-xs" value={lang} onChange={e=>setLang(e.target.value)}>
            <option value="eng">English</option>
            <option value="ara">Arabic</option>
            <option value="urd">Urdu</option>
          </select>
        </div>
        <button className="btn" onClick={doOCR}>Extract Text</button>
        {progress>0 && progress<100 && <div className="text-sm text-white/70">Processing… {progress}%</div>}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">{img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="preview" className="rounded-xl"/>
        ) : 'No image selected'}</div>
        <div className="card"><h2 className="text-xl font-semibold mb-2">Result</h2><pre className="whitespace-pre-wrap">{text}</pre></div>
      </div>
    </div>
  );
}
