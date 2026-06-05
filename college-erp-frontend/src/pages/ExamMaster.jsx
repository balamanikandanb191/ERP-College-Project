import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';
import { confirmDelete } from '../utils/confirmToast';

const SEED = [
  { id: 'em1', name: 'Internal Assessment 1', shortName: 'IA1', type: 'Internal', maxMarks: 50, passMark: 20, month: 'August', year: '2026', gpaWeight: 20, active: true },
  { id: 'em2', name: 'Internal Assessment 2', shortName: 'IA2', type: 'Internal', maxMarks: 50, passMark: 20, month: 'November', year: '2026', gpaWeight: 20, active: true },
  { id: 'em3', name: 'End Semester Examination', shortName: 'ESE', type: 'External', maxMarks: 100, passMark: 40, month: 'December', year: '2026', gpaWeight: 60, active: true },
  { id: 'em4', name: 'Lab Practical Exam', shortName: 'LAB', type: 'Practical', maxMarks: 75, passMark: 30, month: 'November', year: '2026', gpaWeight: 0, active: true },
];
const TYPES = ['Internal', 'External', 'Practical', 'Assignment'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const ExamMaster = () => {
  const { records, addRecord, updateRecord, deleteRecord } = useMasterData('exam_master', SEED);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', shortName: '', type: 'Internal', maxMarks: 100, passMark: 40, month: 'August', year: '2026', gpaWeight: 20, active: true });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Exam name required'); return; }
    const totalWeight = records.filter(r => r.id !== editing?.id).reduce((s, r) => s + Number(r.gpaWeight), 0) + Number(form.gpaWeight);
    if (totalWeight > 100) { toast.error(`Total GPA weight exceeds 100% (currently ${totalWeight}%)`); return; }
    
    const res = editing 
      ? await updateRecord(editing.id, form) 
      : await addRecord(form);
      
    if (res.success) {
      toast.success(editing ? 'Exam updated!' : 'Exam type created!');
      setShowModal(false); 
      setEditing(null);
    } else {
      toast.error('Operation failed');
    }
  };
  const del = async (id) => { 
    confirmDelete(async () => {
      const res = await deleteRecord(id);
      if (res.success) toast.success('Deleted');
      else toast.error('Failed to delete');
    }, 'Are you sure you want to delete this exam master record?');
  };
  const openEdit = r => { setEditing(r); setForm({ name: r.name, shortName: r.shortName, type: r.type, maxMarks: r.maxMarks, passMark: r.passMark, month: r.month, year: r.year, gpaWeight: r.gpaWeight, active: r.active }); setShowModal(true); };
  const totalWeight = records.reduce((s, r) => s + Number(r.gpaWeight), 0);

  const TYPE_COLORS = { 'Internal': 'bg-blue-50 text-blue-700 border-blue-200', 'External': 'bg-violet-50 text-violet-700 border-violet-200', 'Practical': 'bg-emerald-50 text-emerald-700 border-emerald-200', 'Assignment': 'bg-amber-50 text-amber-700 border-amber-200' };

  if (showModal) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-fade-in">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setShowModal(false); setEditing(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-xs uppercase tracking-wider text-slate-600 cursor-pointer shadow-sm"
          >
            ← Back to List
          </button>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-slide-in">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800">{editing ? 'Edit Exam Type' : 'Add Exam Type'}</h3>
            <button onClick={() => { setShowModal(false); setEditing(null); }} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button>
          </div>
          <form onSubmit={submit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Exam Name *</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="End Semester Exam" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Short Name</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" placeholder="ESE" value={form.shortName} onChange={e => setForm({ ...form, shortName: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Type</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Max Marks</label>
                <input type="number" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.maxMarks} onChange={e => setForm({ ...form, maxMarks: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Pass Mark</label>
                <input type="number" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.passMark} onChange={e => setForm({ ...form, passMark: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Month</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })}>{MONTHS.map(m => <option key={m}>{m}</option>)}</select>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">GPA Weight %</label>
                <input type="number" min={0} max={100} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.gpaWeight} onChange={e => setForm({ ...form, gpaWeight: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm">{editing ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-violet-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-violet-300 bg-violet-500/20 px-3 py-1 rounded-full border border-violet-500/30">Others Master</span>
            <h1 className="text-3xl font-black mt-2">Exam Master</h1>
            <p className="text-violet-300 text-xs font-semibold mt-1">Configure exam types, marks and GPA weightage</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-2xl border text-sm font-bold ${totalWeight === 100 ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/20 border-amber-500/30 text-amber-300'}`}>GPA Weight: {totalWeight}%</div>
            <button onClick={() => { setEditing(null); setForm({ name: '', shortName: '', type: 'Internal', maxMarks: 100, passMark: 40, month: 'August', year: '2026', gpaWeight: 20, active: true }); setShowModal(true); }} className="px-5 py-3 bg-violet-500 hover:bg-violet-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2"><Plus size={18} /> Add Exam Type</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-black text-violet-700 bg-violet-50 px-2 py-0.5 rounded-lg text-xs border border-violet-200">{r.shortName}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${TYPE_COLORS[r.type]}`}>{r.type}</span>
                </div>
                <h3 className="font-black text-slate-900 text-lg">{r.name}</h3>
                <p className="text-xs text-slate-400 font-semibold">{r.month} {r.year}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(r)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl"><Edit2 size={15} /></button>
                <button onClick={() => del(r.id)} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl"><Trash2 size={15} /></button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-slate-50 pt-4">
              <div className="text-center"><p className="text-2xl font-black text-slate-900">{r.maxMarks}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Max Marks</p></div>
              <div className="text-center"><p className="text-2xl font-black text-slate-900">{r.passMark}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Pass Mark</p></div>
              <div className="text-center"><p className="text-2xl font-black text-violet-700">{r.gpaWeight}%</p><p className="text-[10px] font-bold text-slate-400 uppercase">GPA Weight</p></div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="h-full bg-violet-600 rounded-full" style={{ width: `${r.gpaWeight}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ExamMaster;
