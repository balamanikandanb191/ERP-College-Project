import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';
import { confirmDelete } from '../utils/confirmToast';

const SEED = [
  { id: 'cm1', name: 'I Year', shortCode: 'I', depts: 'CS, IT, EC, ME', maxSections: 4, maxStrength: 60, semType: 'Semester', active: true },
  { id: 'cm2', name: 'II Year', shortCode: 'II', depts: 'CS, IT, EC, ME', maxSections: 4, maxStrength: 60, semType: 'Semester', active: true },
  { id: 'cm3', name: 'III Year', shortCode: 'III', depts: 'CS, IT, EC', maxSections: 3, maxStrength: 60, semType: 'Semester', active: true },
  { id: 'cm4', name: 'IV Year', shortCode: 'IV', depts: 'CS, IT, EC', maxSections: 3, maxStrength: 55, semType: 'Semester', active: true },
];

const ClassMaster = () => {
  const { records, addRecord, updateRecord, deleteRecord } = useMasterData('class_master', SEED);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', shortCode: '', depts: '', maxSections: 4, maxStrength: 60, semType: 'Semester', active: true });

  const submit = async e => {
    e.preventDefault();
    if (!form.name) { toast.error('Class name required'); return; }
    const res = editing 
      ? await updateRecord(editing.id, form) 
      : await addRecord(form);
      
    if (res.success) {
      toast.success(editing ? 'Updated!' : 'Class Master added!');
      setShowModal(false); 
      setEditing(null);
    } else {
      toast.error('Operation failed');
    }
  };
  
  const del = async id => { 
    confirmDelete(async () => {
      const res = await deleteRecord(id);
      if (res.success) toast.success('Deleted');
      else toast.error('Failed to delete');
    }, 'Are you sure you want to delete this class master record?');
  };
  
  const toggle = async id => { 
    const record = records.find(r => r.id === id);
    if (record) {
      const res = await updateRecord(id, { ...record, active: !record.active });
      if (!res.success) toast.error('Failed to update status');
    }
  };
  
  const openEdit = r => { setEditing(r); setForm({ name: r.name, shortCode: r.shortCode, depts: r.depts, maxSections: r.maxSections, maxStrength: r.maxStrength, semType: r.semType, active: r.active }); setShowModal(true); };

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
            <h3 className="text-lg font-black text-slate-800">{editing ? 'Edit Class' : 'Add Class'}</h3>
            <button onClick={() => { setShowModal(false); setEditing(null); }} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button>
          </div>
          <form onSubmit={submit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
              <div className="col-span-2">
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Class Name *</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="I Year" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Short Code</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" placeholder="I" value={form.shortCode} onChange={e => setForm({ ...form, shortCode: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Max Sections</label>
                <input type="number" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.maxSections} onChange={e => setForm({ ...form, maxSections: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Max Strength/Sec</label>
                <input type="number" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.maxStrength} onChange={e => setForm({ ...form, maxStrength: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Sem Type</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.semType} onChange={e => setForm({ ...form, semType: e.target.value })}><option>Semester</option><option>Annual</option></select>
              </div>
              <div className="col-span-2">
                <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Departments (comma)</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" placeholder="CS, IT, EC" value={form.depts} onChange={e => setForm({ ...form, depts: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm">{editing ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-orange-900 to-red-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-300 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">Others Master</span>
            <h1 className="text-3xl font-black mt-2">Class Master</h1>
            <p className="text-orange-300 text-xs font-semibold mt-1">Configure class levels, sections and capacity limits</p>
          </div>
          <button onClick={() => { setEditing(null); setForm({ name: '', shortCode: '', depts: '', maxSections: 4, maxStrength: 60, semType: 'Semester', active: true }); setShowModal(true); }}
            className="px-5 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2"><Plus size={18} /> Add Class</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map(r => (
          <div key={r.id} className={`bg-white rounded-2xl border shadow-sm p-6 space-y-3 hover:shadow-md transition-shadow ${r.active ? 'border-slate-100' : 'border-slate-200 opacity-60'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-lg shadow">{r.shortCode}</div>
                <div><p className="font-black text-slate-900 text-lg">{r.name}</p><p className="text-xs text-slate-400 font-semibold">{r.semType} system</p></div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggle(r.id)} className={`text-[10px] font-black px-3 py-1 rounded-full border transition-colors ${r.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}>{r.active ? 'Active' : 'Inactive'}</button>
                <button onClick={() => openEdit(r)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl"><Edit2 size={15} /></button>
                <button onClick={() => del(r.id)} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl"><Trash2 size={15} /></button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-50">
              <div className="text-center"><p className="text-xl font-black text-slate-900">{r.maxSections}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Max Sections</p></div>
              <div className="text-center"><p className="text-xl font-black text-slate-900">{r.maxStrength}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Strength/Sec</p></div>
              <div className="text-center"><p className="text-xl font-black text-slate-900">{r.depts.split(',').length}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Departments</p></div>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">Departments: {r.depts}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ClassMaster;
