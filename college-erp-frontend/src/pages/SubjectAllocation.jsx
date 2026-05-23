import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, X, AlertTriangle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';

const DEPTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical'];
const FACULTY = ['Dr. Amit Sharma', 'Prof. Sneha Iyer', 'Dr. Anand Varma', 'Prof. Rajesh Kumar', 'Dr. Meera Nair'];
const SUBJECTS = [
  { code: 'CS301', name: 'Data Structures', dept: 'Computer Science' },
  { code: 'CS302', name: 'Operating Systems', dept: 'Computer Science' },
  { code: 'IT401', name: 'Cloud Computing', dept: 'Information Technology' },
  { code: 'EC201', name: 'Circuit Theory', dept: 'Electronics' },
  { code: 'CS501', name: 'Machine Learning', dept: 'Computer Science' },
];
const SEED = [
  { id: 'sa1', subject: 'CS301', subjectName: 'Data Structures', dept: 'Computer Science', year: 'III', section: 'A', faculty: 'Dr. Amit Sharma', hours: 4 },
  { id: 'sa2', subject: 'CS302', subjectName: 'Operating Systems', dept: 'Computer Science', year: 'III', section: 'B', faculty: 'Prof. Sneha Iyer', hours: 3 },
  { id: 'sa3', subject: 'IT401', subjectName: 'Cloud Computing', dept: 'Information Technology', year: 'IV', section: 'A', faculty: 'Dr. Anand Varma', hours: 3 },
];

const SubjectAllocation = () => {
  const { records, addRecord, updateRecord, deleteRecord } = useMasterData('subj_alloc', SEED);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ subject: 'CS301', subjectName: 'Data Structures', dept: 'Computer Science', year: 'III', section: 'A', faculty: 'Dr. Amit Sharma', hours: 4 });

  const conflicts = useMemo(() => {
    const seen = {};
    records.forEach(r => {
      const key = `${r.faculty}-${r.year}-${r.section}`;
      if (!seen[key]) seen[key] = [];
      seen[key].push(r.id);
    });
    return Object.values(seen).filter(ids => ids.length > 1).flat();
  }, [records]);

  const submit = async e => {
    e.preventDefault();
    const sub = SUBJECTS.find(s => s.code === form.subject);
    const entry = { ...form, subjectName: sub?.name || form.subject };
    if (editing) {
      const res = await updateRecord(editing.id, entry);
      if (res.success) toast.success('Allocation updated!');
    } else {
      const res = await addRecord(entry);
      if (res.success) toast.success('Subject allocated!');
    }
    setShowModal(false);
    setEditing(null);
  };
  const del = async id => {
    if (!window.confirm('Remove allocation?')) return;
    const res = await deleteRecord(id);
    if (res.success) toast.success('Allocation removed!');
  };
  const openEdit = r => { setEditing(r); setForm({ subject: r.subject, subjectName: r.subjectName, dept: r.dept, year: r.year, section: r.section, faculty: r.faculty, hours: r.hours }); setShowModal(true); };
  const filtered = records.filter(r => (r.subjectName || '').toLowerCase().includes(search.toLowerCase()) || (r.faculty || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-teal-900 to-cyan-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-300 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30">Academic Master</span>
            <h1 className="text-3xl font-black mt-2">Subject Allocation</h1>
            <p className="text-teal-300 text-xs font-semibold mt-1">Assign subjects to faculty members per class and section</p>
          </div>
          <div className="flex items-center gap-3">
            {conflicts.length > 0 && <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 px-4 py-2 rounded-2xl text-rose-300 text-xs font-bold"><AlertTriangle size={14} /> {conflicts.length} conflicts</div>}
            <button onClick={() => { setEditing(null); setShowModal(true); }} className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2"><Plus size={18} /> Allocate Subject</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-3 text-slate-400" size={15} /><input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Search allocations..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">{['Subject', 'Department', 'Class / Sec', 'Faculty', 'Hours/Week', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(r => {
                const isConflict = conflicts.includes(r.id);
                return (
                  <tr key={r.id} className={`hover:bg-slate-50/50 transition-colors group ${isConflict ? 'bg-rose-50/30' : ''}`}>
                    <td className="px-5 py-4"><div className="font-bold text-slate-800">{r.subjectName}</div><div className="text-[11px] text-slate-400 font-mono">{r.subject}</div></td>
                    <td className="px-5 py-4 text-slate-600 font-semibold text-xs">{r.dept}</td>
                    <td className="px-5 py-4 font-bold text-slate-700">Year {r.year} – Sec {r.section}</td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{r.faculty}</td>
                    <td className="px-5 py-4"><span className="font-black text-slate-900">{r.hours}</span> <span className="text-slate-400 text-xs">hrs</span></td>
                    <td className="px-5 py-4">{isConflict ? <span className="flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200"><AlertTriangle size={10} />Conflict</span> : <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"><Check size={10} />OK</span>}</td>
                    <td className="px-5 py-4 text-right"><div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100"><button onClick={() => openEdit(r)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg"><Edit2 size={14} /></button><button onClick={() => del(r.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={14} /></button></div></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={7} className="py-16 text-center text-slate-400 font-bold">No allocations found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between"><h3 className="text-lg font-black text-slate-800">{editing ? 'Edit Allocation' : 'Allocate Subject'}</h3><button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button></div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Subject</label><select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>{SUBJECTS.map(s => <option key={s.code} value={s.code}>{s.code} – {s.name}</option>)}</select></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Year</label><select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}>{['I','II','III','IV'].map(y => <option key={y}>{y}</option>)}</select></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Section</label><input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} /></div>
                <div className="col-span-2"><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Faculty</label><select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" value={form.faculty} onChange={e => setForm({ ...form, faculty: e.target.value })}>{FACULTY.map(f => <option key={f}>{f}</option>)}</select></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Hours / Week</label><input type="number" min={1} max={10} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={form.hours} onChange={e => setForm({ ...form, hours: Number(e.target.value) })} /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm">{editing ? 'Update' : 'Allocate'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default SubjectAllocation;
