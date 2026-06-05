import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';
import { confirmDelete } from '../utils/confirmToast';

const SEED = [
  { id: 'd1', title: 'Professor', shortCode: 'Prof.', dept: 'All', gradePay: 'AGP-10000', level: 'Senior', active: true },
  { id: 'd2', title: 'Associate Professor', shortCode: 'Assoc. Prof.', dept: 'All', gradePay: 'AGP-8000', level: 'Senior', active: true },
  { id: 'd3', title: 'Assistant Professor', shortCode: 'Asst. Prof.', dept: 'All', gradePay: 'AGP-6000', level: 'Junior', active: true },
  { id: 'd4', title: 'Head of Department', shortCode: 'HOD', dept: 'All', gradePay: 'AGP-10000', level: 'Senior', active: true },
  { id: 'd5', title: 'Registrar', shortCode: 'Reg.', dept: 'Administration', gradePay: 'AGP-7600', level: 'Administrative', active: true },
  { id: 'd6', title: 'Lab Instructor', shortCode: 'Lab Instr.', dept: 'Technical', gradePay: 'AGP-4200', level: 'Technical', active: true },
];
const LEVELS = ['Senior', 'Junior', 'Administrative', 'Technical', 'Support'];

const DesignationMaster = () => {
  const { records, addRecord, updateRecord, deleteRecord } = useMasterData('designation', SEED);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', shortCode: '', dept: 'All', gradePay: '', level: 'Junior', active: true });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error('Designation title required'); return; }
    
    const res = editing 
      ? await updateRecord(editing.id, form) 
      : await addRecord(form);
      
    if (res.success) {
      toast.success(editing ? 'Designation updated!' : 'Designation added!');
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
    }, 'Are you sure you want to delete this designation record?');
  };
  const openEdit = r => { setEditing(r); setForm({ title: r.title, shortCode: r.shortCode, dept: r.dept, gradePay: r.gradePay, level: r.level, active: r.active }); setShowModal(true); };

  const LEVEL_COLORS = { Senior: 'bg-violet-100 text-violet-700 border-violet-200', Junior: 'bg-blue-100 text-blue-700 border-blue-200', Administrative: 'bg-amber-100 text-amber-700 border-amber-200', Technical: 'bg-teal-100 text-teal-700 border-teal-200', Support: 'bg-slate-100 text-slate-700 border-slate-200' };

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
            <h3 className="text-lg font-black text-slate-800">{editing ? 'Edit Designation' : 'Add Designation'}</h3>
            <button onClick={() => { setShowModal(false); setEditing(null); }} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button>
          </div>
          <form onSubmit={submit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
              <div className="col-span-2">
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Title *</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Professor" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Short Code</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" placeholder="Prof." value={form.shortCode} onChange={e => setForm({ ...form, shortCode: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Level</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Grade Pay</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" placeholder="AGP-8000" value={form.gradePay} onChange={e => setForm({ ...form, gradePay: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Department</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" placeholder="All" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm">{editing ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-rose-900 to-pink-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30">Others Master</span>
            <h1 className="text-3xl font-black mt-2">Designation Master</h1>
            <p className="text-rose-300 text-xs font-semibold mt-1">Configure staff designations, grade pay and levels</p>
          </div>
          <button onClick={() => { setEditing(null); setForm({ title: '', shortCode: '', dept: 'All', gradePay: '', level: 'Junior', active: true }); setShowModal(true); }}
            className="px-5 py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2"><Plus size={18} /> Add Designation</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {records.map(r => (
          <div key={r.id} className={`bg-white rounded-2xl border shadow-sm p-5 space-y-3 hover:shadow-md transition-shadow ${r.active ? 'border-slate-100' : 'opacity-60 border-slate-200'}`}>
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-black text-xs shadow shrink-0">{r.shortCode}</div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(r)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl"><Edit2 size={14} /></button>
                <button onClick={() => del(r.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl"><Trash2 size={14} /></button>
              </div>
            </div>
            <div>
              <h3 className="font-black text-slate-900">{r.title}</h3>
              <p className="text-xs text-slate-400 font-semibold">{r.dept}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${LEVEL_COLORS[r.level]}`}>{r.level}</span>
              <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{r.gradePay}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DesignationMaster;
