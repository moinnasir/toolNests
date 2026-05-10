'use client';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function CVMaker(){
  const [info, setInfo] = useState({ name: '', role: '', email: '', phone: '', location: '', summary: '' });
  const [edu, setEdu] = useState([{ school: '', degree: '', year: '' }]);
  const [exp, setExp] = useState([{ company: '', title: '', start: '', end: '', details: '' }]);
  const [skills, setSkills] = useState('');

  const addEdu = ()=> setEdu([...edu, { school:'', degree:'', year:'' }]);
  const addExp = ()=> setExp([...exp, { company:'', title:'', start:'', end:'', details:'' }]);

  const download = async ()=>{
    const node = document.getElementById('cv-preview');
    if(!node) return;
    const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff' });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p','mm','a4');
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, 'PNG', 0, 0, w, h);
    pdf.save(`${info.name || 'resume'}.pdf`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">CV / Resume Maker</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <input className="input" placeholder="Full Name" value={info.name} onChange={e=>setInfo({...info, name:e.target.value})} />
            <input className="input" placeholder="Role / Title" value={info.role} onChange={e=>setInfo({...info, role:e.target.value})} />
            <input className="input" placeholder="Email" value={info.email} onChange={e=>setInfo({...info, email:e.target.value})} />
            <input className="input" placeholder="Phone" value={info.phone} onChange={e=>setInfo({...info, phone:e.target.value})} />
            <input className="input md:col-span-2" placeholder="Location" value={info.location} onChange={e=>setInfo({...info, location:e.target.value})} />
          </div>
          <textarea className="input h-28" placeholder="Professional Summary" value={info.summary} onChange={e=>setInfo({...info, summary:e.target.value})} />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="label">Education</div><button className="btn" onClick={addEdu}>Add</button>
            </div>
            {edu.map((e,i)=> (
              <div key={i} className="grid md:grid-cols-3 gap-3">
                <input className="input" placeholder="School" value={e.school} onChange={ev=>{ const v=[...edu]; v[i].school=ev.target.value; setEdu(v); }} />
                <input className="input" placeholder="Degree" value={e.degree} onChange={ev=>{ const v=[...edu]; v[i].degree=ev.target.value; setEdu(v); }} />
                <input className="input" placeholder="Year" value={e.year} onChange={ev=>{ const v=[...edu]; v[i].year=ev.target.value; setEdu(v); }} />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="label">Experience</div><button className="btn" onClick={addExp}>Add</button>
            </div>
            {exp.map((x,i)=> (
              <div key={i} className="space-y-2">
                <div className="grid md:grid-cols-2 gap-3">
                  <input className="input" placeholder="Company" value={x.company} onChange={ev=>{ const v=[...exp]; v[i].company=ev.target.value; setExp(v); }} />
                  <input className="input" placeholder="Title" value={x.title} onChange={ev=>{ const v=[...exp]; v[i].title=ev.target.value; setExp(v); }} />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <input className="input" type="month" placeholder="Start" value={x.start} onChange={ev=>{ const v=[...exp]; v[i].start=ev.target.value; setExp(v); }} />
                  <input className="input" type="month" placeholder="End" value={x.end} onChange={ev=>{ const v=[...exp]; v[i].end=ev.target.value; setExp(v); }} />
                </div>
                <textarea className="input h-24" placeholder="Details / Achievements" value={x.details} onChange={ev=>{ const v=[...exp]; v[i].details=ev.target.value; setExp(v); }} />
              </div>
            ))}
          </div>
          <textarea className="input h-20" placeholder="Skills (comma separated)" value={skills} onChange={e=>setSkills(e.target.value)} />
          <button className="btn w-full" onClick={download}>Download PDF</button>
        </div>

        <div id="cv-preview" className="card bg-white text-black">
          <div className="border-b pb-3">
            <div className="text-3xl font-bold">{info.name}</div>
            <div className="text-sm text-gray-700">{info.role}</div>
            <div className="text-xs text-gray-600">{info.email} • {info.phone} • {info.location}</div>
          </div>
          <div className="mt-3">
            <div className="font-semibold">Summary</div>
            <p className="text-sm">{info.summary}</p>
          </div>
          <div className="mt-3">
            <div className="font-semibold">Experience</div>
            <ul className="list-disc ml-5">
              {exp.map((x,i)=> (<li key={i}><b>{x.title}</b> — {x.company} ({x.start} - {x.end})<div className="text-sm">{x.details}</div></li>))}
            </ul>
          </div>
          <div className="mt-3">
            <div className="font-semibold">Education</div>
            <ul className="list-disc ml-5">
              {edu.map((e,i)=> (<li key={i}><b>{e.degree}</b> — {e.school} ({e.year})</li>))}
            </ul>
          </div>
          <div className="mt-3">
            <div className="font-semibold">Skills</div>
            <div className="text-sm">{skills}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
