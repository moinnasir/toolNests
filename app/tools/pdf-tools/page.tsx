'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import { ToolPageShell } from '@/components/tool-shell';
import { logToolUsage } from '@/lib/usage';

export default function PdfToolsPage() {
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState('');

  const imageToPdf = async () => {
    setMessage('');
    if (!images.length) {
      setMessage('Please select at least one image.');
      return;
    }
    const pdf = new jsPDF('p', 'mm', 'a4');
    for (let index = 0; index < images.length; index += 1) {
      const dataUrl = await fileToDataUrl(images[index]);
      const img = await loadImage(dataUrl);
      if (index > 0) pdf.addPage();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
      const width = img.width * ratio;
      const height = img.height * ratio;
      pdf.addImage(dataUrl, 'JPEG', (pageWidth - width) / 2, (pageHeight - height) / 2, width, height);
    }
    pdf.save('toolnests-images.pdf');
    await logToolUsage('pdf-tools', { count: images.length });
  };

  return (
    <ToolPageShell slug="pdf-tools">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card space-y-4 md:col-span-2">
          <h2 className="text-xl font-bold text-slate-950">Image to PDF</h2>
          <input className="input" type="file" accept="image/*" multiple onChange={(event) => setImages(Array.from(event.target.files || []))} />
          <button className="btn" onClick={imageToPdf}>Create PDF</button>
          {message && <p className="text-sm text-slate-600">{message}</p>}
        </div>
        <div className="card space-y-3">
          <h2 className="text-xl font-bold text-slate-950">Coming next</h2>
          <div className="surface p-3 text-sm text-slate-600">Merge PDF</div>
          <div className="surface p-3 text-sm text-slate-600">Compress PDF</div>
          <div className="surface p-3 text-sm text-slate-600">PDF to Images</div>
        </div>
      </div>
    </ToolPageShell>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

