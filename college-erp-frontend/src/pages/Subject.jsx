import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';

const DEPTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Science & Humanities'];
const TYPES = ['Theory', 'Practical', 'Theory + Practical'];
const SEED = [
  { id: 'sub1', code: 'CS301', name: 'Data Structures & Algorithms', dept: 'Computer Science', year: 'III', sem: '5', credits: 4, type: 'Theory + Practical', elective: false },
  { id: 'sub2', code: 'CS302', name: 'Operating Systems', dept: 'Computer Science', year: 'III', sem: '5', credits: 3, type: 'Theory', elective: false },
  { id: 'sub3', code: 'IT401', name: 'Cloud Computing', dept: 'Information Technology', year: 'IV', sem: '7', credits: 3, type: 'Theory', elective: true },
  { id: 'sub4', code: 'EC201', name: 'Circuit Theory', dept: 'Electronics', year: 'II', sem: '3', credits: 4, type: 'Theory + Practical', elective: false },
  { id: 'sub5', code: 'CS501', name: 'Machine Learning', dept: 'Computer Science', year: 'IV', sem: '7', credits: 4, type: 'Theory', elective: true },
];

const Subject = () => {
  const { records, addRecord, updateRecord, deleteRecord } = useMasterData('subject', SEED);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ code: '', name: '', dept: 'Computer Science', year: 'I', sem: '1', credits: 3, type: 'Theory', elective: false });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.name) { toast.error('Subject code and name required'); return; }
    
    if (editing) {
      const res = await updateRecord(editing.id, form);
      if (res.success) {
        toast.success(res.localOnly ? 'Subject updated locally!' : 'Subject updated!');
      } else {
        toast.error('Failed to update subject');
      }
    } else {
      const res = await addRecord(form);
      if (res.success) {
        toast.success(res.localOnly ? 'Subject added locally!' : 'Subject added!');
      } else {
        toast.error('Failed to add subject');
      }
    }
    setShowModal(false); setEditing(null);
  };
  const del = async (id) => {
    if (!window.confirm('Delete subject?')) return;
    const res = await deleteRecord(id);
    if (res.success) {
      toast.success('Deleted.');
    } else {
      toast.error('Failed to delete subject');
    }
  };
  const openEdit = r => { setEditing(r); setForm({ code: r.code, name: r.name, dept: r.dept, year: r.year, sem: r.sem, credits: r.credits, type: r.type, elective: r.elective }); setShowModal(true); };
  const filtered = records.filter(r => (r.name.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase())) && (!deptFilter || r.dept === deptFilter));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">Academic Master</span>
            <h1 className="text-3xl font-black mt-2">Subject Dictionary</h1>
            <p className="text-purple-300 text-xs font-semibold mt-1">Manage all course subjects, codes, credits and types</p>
          </div>
          <button onClick={() => { setEditing(null); setForm({ code: '', name: '', dept: 'Computer Science', year: 'I', sem: '1', credits: 3, type: 'Theory', elective: false }); setShowModal(true); }}
            className="px-5 py-3 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg"><Plus size={18} /> Add Subject</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute left-3 top-3 text-slate-400" size={15} /><input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <select className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}><option value="">All Departments</option>{DEPTS.map(d => <option key={d}>{d}</option>)}</select>
          <span className="text-xs font-bold text-slate-400 ml-auto">{filtered.length} subjects</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">{['Code', 'Subject Name', 'Department', 'Year / Sem', 'Credits', 'Type', 'Elective', 'Actions'].map(h => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-4"><span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg text-xs">{r.code}</span></td>
                  <td className="px-5 py-4 font-bold text-slate-800">{r.name}</td>
                  <td className="px-5 py-4 text-slate-600 font-semibold text-xs">{r.dept}</td>
                  <td className="px-5 py-4 text-slate-600 font-semibold">Year {r.year} / Sem {r.sem}</td>
                  <td className="px-5 py-4"><span className="font-black text-slate-900">{r.credits}</span> <span className="text-slate-400 text-xs">credits</span></td>
                  <td className="px-5 py-4"><span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${r.type === 'Practical' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : r.type === 'Theory' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>{r.type}</span></td>
                  <td className="px-5 py-4">{r.elective ? <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Elective</span> : <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200">Core</span>}</td>
                  <td className="px-5 py-4 text-right"><div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100"><button onClick={() => openEdit(r)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg"><Edit2 size={14} /></button><button onClick={() => del(r.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={14} /></button></div></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="py-16 text-center text-slate-400 font-bold">No subjects found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between"><h3 className="text-lg font-black text-slate-800">{editing ? 'Edit Subject' : 'Add Subject'}</h3><button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button></div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Subject Code *</label><input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="CS301" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Credits</label><input type="number" min={1} max={6} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} /></div>
                <div className="col-span-2"><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Subject Name *</label><input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Data Structures & Algorithms" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Department</label><select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>{DEPTS.map(d => <option key={d}>{d}</option>)}</select></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Type</label><select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
                <div className="col-span-2 flex items-center gap-3"><input type="checkbox" id="elective" className="w-4 h-4 accent-purple-600" checked={form.elective} onChange={e => setForm({ ...form, elective: e.target.checked })} /><label htmlFor="elective" className="text-sm font-bold text-slate-700">Mark as Elective Subject</label></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm">{editing ? 'Update' : 'Add Subject'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Subject;
