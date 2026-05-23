import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Calendar, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';

const SEED = [
  { id: 'ay1', year: '2025-2026', startDate: '2025-06-01', endDate: '2026-05-31', admissionStart: '2025-04-01', admissionEnd: '2025-07-31', active: true },
  { id: 'ay2', year: '2024-2025', startDate: '2024-06-01', endDate: '2025-05-31', admissionStart: '2024-04-01', admissionEnd: '2024-07-31', active: false },
  { id: 'ay3', year: '2023-2024', startDate: '2023-06-01', endDate: '2024-05-31', admissionStart: '2023-04-01', admissionEnd: '2023-07-31', active: false },
];

const AcademicYearMaster = () => {
  const { records, addRecord, updateRecord, deleteRecord, setRecords } = useMasterData('acad_year', SEED);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ year: '', startDate: '', endDate: '', admissionStart: '', admissionEnd: '', active: false });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.year || !form.startDate || !form.endDate) { toast.error('Year, start and end dates required'); return; }
    
    let targetActive = form.active;
    let tempRecords = [...records];
    if (targetActive) {
      tempRecords = tempRecords.map(r => r.id === editing?.id ? r : { ...r, active: false });
    }
    
    const res = editing 
      ? await updateRecord(editing.id, form) 
      : await addRecord(form);
      
    if (res.success) {
      toast.success('Academic year saved!');
      
      // Post-sync active flag cleanup
      if (targetActive) {
        const activeId = editing ? editing.id : res.id;
        for (const record of records) {
          if (record.id !== activeId && record.active) {
            await updateRecord(record.id, { ...record, active: false });
          }
        }
      }
      setShowModal(false); 
      setEditing(null);
    } else {
      toast.error('Operation failed');
    }
  };
  const setActive = async (id) => {
    const activeRecord = records.find(r => r.id === id);
    if (activeRecord) {
      const res = await updateRecord(id, { ...activeRecord, active: true });
      if (res.success) {
        for (const record of records) {
          if (record.id !== id && record.active) {
            await updateRecord(record.id, { ...record, active: false });
          }
        }
        toast.success('Active academic year updated!');
      } else {
        toast.error('Failed to update status');
      }
    }
  };
  const del = async (id) => { 
    if (!window.confirm('Delete?')) return; 
    const res = await deleteRecord(id);
    if (res.success) toast.success('Deleted');
    else toast.error('Failed to delete');
  };
  const openEdit = r => { setEditing(r); setForm({ year: r.year, startDate: r.startDate, endDate: r.endDate, admissionStart: r.admissionStart, admissionEnd: r.admissionEnd, active: r.active }); setShowModal(true); };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-sky-900 to-blue-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-300 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-500/30">Others Master</span>
            <h1 className="text-3xl font-black mt-2">Academic Year Master</h1>
            <p className="text-sky-300 text-xs font-semibold mt-1">Manage academic year timelines and admission windows</p>
          </div>
          <button onClick={() => { setEditing(null); setForm({ year: '', startDate: '', endDate: '', admissionStart: '', admissionEnd: '', active: false }); setShowModal(true); }}
            className="px-5 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2"><Plus size={18} /> Add Year</button>
        </div>
      </div>

      <div className="space-y-4">
        {records.map(r => (
          <div key={r.id} className={`bg-white rounded-2xl border shadow-sm p-6 transition-shadow hover:shadow-md ${r.active ? 'border-sky-300 ring-2 ring-sky-200' : 'border-slate-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black shadow ${r.active ? 'bg-sky-600' : 'bg-slate-400'}`}><Calendar size={24} /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 text-xl">{r.year}</h3>
                    {r.active && <span className="flex items-center gap-1 text-[10px] font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200"><Check size={10} />ACTIVE</span>}
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">Academic Period: {r.startDate} to {r.endDate}</p>
                  <p className="text-xs text-slate-400 font-semibold">Admissions: {r.admissionStart} to {r.admissionEnd}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!r.active && <button onClick={() => setActive(r.id)} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors">Set Active</button>}
                <button onClick={() => openEdit(r)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl"><Edit2 size={15} /></button>
                {!r.active && <button onClick={() => del(r.id)} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl"><Trash2 size={15} /></button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between"><h3 className="text-lg font-black text-slate-800">{editing ? 'Edit Year' : 'Add Academic Year'}</h3><button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button></div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Academic Year *</label><input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="2026-2027" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Start Date *</label><input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">End Date *</label><input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Admission Start</label><input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.admissionStart} onChange={e => setForm({ ...form, admissionStart: e.target.value })} /></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Admission End</label><input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.admissionEnd} onChange={e => setForm({ ...form, admissionEnd: e.target.value })} /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm">{editing ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AcademicYearMaster;
