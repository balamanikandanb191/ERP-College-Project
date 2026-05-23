import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, HelpCircle, Save, Calendar, Phone, Mail, Award, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';

const COURSES = [
  'B.E. Computer Science & Engineering',
  'B.Tech Information Technology',
  'B.E. Electronics & Communication',
  'B.E. Mechanical Engineering',
  'B.E. Civil Engineering',
  'MBA Business Administration'
];

const SEED = [
  { id: 'enq-1', name: 'Arun Prasath', email: 'arun@gmail.com', phone: '9876543210', course: 'B.E. Computer Science & Engineering', score: '88.5%', source: 'Website', date: '23 May 2026', status: 'New' },
  { id: 'enq-2', name: 'Kavitha Ram', email: 'kavitha@gmail.com', phone: '9123456789', course: 'B.Tech Information Technology', score: '92.0%', source: 'Walk-in', date: '22 May 2026', status: 'Assigned' },
  { id: 'enq-3', name: 'Deepak Raj', email: 'deepak@gmail.com', phone: '8123456789', course: 'B.E. Electronics & Communication', score: '76.4%', source: 'Referral', date: '20 May 2026', status: 'Converted' },
];

const StudentEnquiry = () => {
  const { records: enquiries, addRecord, updateRecord, deleteRecord } = useMasterData('enquiry', SEED);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', course: COURSES[0], score: '', source: 'Website', status: 'New' });

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.phone) { toast.error('Name and phone number required'); return; }
    if (editing) {
      const res = await updateRecord(editing.id, form);
      if (res.success) toast.success('Enquiry updated!');
    } else {
      const entry = { ...form, date: '23 May 2026' };
      const res = await addRecord(entry);
      if (res.success) toast.success('Enquiry registered!');
    }
    setShowModal(false); setEditing(null);
  };

  const del = async id => {
    if (!window.confirm('Delete enquiry?')) return;
    const res = await deleteRecord(id);
    if (res.success) toast.success('Enquiry deleted');
  };
  const openEdit = r => { setEditing(r); setForm({ name: r.name, email: r.email, phone: r.phone, course: r.course, score: r.score, source: r.source, status: r.status }); setShowModal(true); };

  const filtered = enquiries.filter(r => (r.name || '').toLowerCase().includes(search.toLowerCase()) || (r.phone || '').includes(search));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Admissions & Enquiry</span>
            <h1 className="text-3xl font-black mt-2">Student Enquiry Form</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Capture and manage details of prospective applicants and major preferences</p>
          </div>
          <button onClick={() => { setEditing(null); setForm({ name: '', email: '', phone: '', course: COURSES[0], score: '', source: 'Website', status: 'New' }); setShowModal(true); }}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg"><Plus size={18} /> Register Enquiry</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-3 text-slate-400" size={15} /><input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search enquiries..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {['Date', 'Student Name', 'Contact Info', 'Preferred Course', 'Grade %', 'Source', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-4">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-4 text-xs font-bold text-slate-400 font-mono">{r.date}</td>
                  <td className="px-5 py-4 font-black text-slate-800">{r.name}</td>
                  <td className="px-5 py-4">
                    <div className="text-slate-700 font-semibold">{r.phone}</div>
                    <div className="text-[11px] text-slate-400">{r.email}</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-600 text-xs">{r.course}</td>
                  <td className="px-5 py-4 font-mono font-black text-slate-900">{r.score}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-500">{r.source}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${r.status === 'Converted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : r.status === 'Assigned' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100">
                      <button onClick={() => openEdit(r)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg"><Edit2 size={14} /></button>
                      <button onClick={() => del(r.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="py-16 text-center text-slate-400 font-bold">No enquiries registered</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between"><h3 className="text-lg font-black text-slate-800">{editing ? 'Edit Enquiry' : 'Register Enquiry'}</h3><button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button></div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Student Full Name *</label><input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Arun Prasath" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Email Address</label><input type="email" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" placeholder="arun@gmail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Phone Number *</label><input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" placeholder="9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="col-span-2"><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Preferred Course</label><select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}>{COURSES.map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">12th Grade % / GPA</label><input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" placeholder="88.5%" value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} /></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Enquiry Source</label><select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}><option>Website</option><option>Walk-in</option><option>Referral</option><option>Advertisement</option><option>Social Media</option></select></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm">{editing ? 'Update' : 'Register'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEnquiry;
