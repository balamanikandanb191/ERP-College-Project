import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, BookOpen, Users, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const DEPTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Business Administration'];
const SEED = [
  { id: 's1', standard: 'I', dept: 'Computer Science', sections: 'A, B', capacity: 60, advisor: 'Dr. Amit Sharma', semCount: 2 },
  { id: 's2', standard: 'II', dept: 'Information Technology', sections: 'A', capacity: 55, advisor: 'Prof. Sneha Iyer', semCount: 2 },
  { id: 's3', standard: 'III', dept: 'Computer Science', sections: 'A, B, C', capacity: 60, advisor: 'Dr. Anand Varma', semCount: 2 },
  { id: 's4', standard: 'IV', dept: 'Electronics', sections: 'A', capacity: 45, advisor: 'Prof. Rajesh Kumar', semCount: 2 },
];

const Standard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ standard: 'I', dept: 'Computer Science', sections: 'A', capacity: 60, advisor: '', semCount: 2 });

  const fetchRecords = async () => {
    try {
      const { data } = await api.get('/masters/standard');
      if (data && data.length > 0) {
        setRecords(data.map(r => ({ id: r.id, ...r.data })));
      } else {
        const promises = SEED.map(s => api.post('/masters/standard', { data: s }));
        const results = await Promise.all(promises);
        setRecords(results.map(r => ({ id: r.data.id, ...r.data.data })));
      }
    } catch (error) {
      console.error('Failed to fetch standard records from backend, falling back to localStorage:', error);
      try {
        const c = localStorage.getItem('erp_standard');
        if (c) setRecords(JSON.parse(c));
        else {
          setRecords(SEED);
          localStorage.setItem('erp_standard', JSON.stringify(SEED));
        }
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.advisor) { toast.error('Class advisor required'); return; }
    
    try {
      if (editing) {
        await api.put(`/masters/standard/${editing.id}`, { data: form });
        const u = records.map(r => r.id === editing.id ? { ...r, ...form } : r);
        setRecords(u);
        localStorage.setItem('erp_standard', JSON.stringify(u));
        toast.success('Standard updated!');
      } else {
        const { data } = await api.post('/masters/standard', { data: form });
        const u = [{ id: data.id, ...form }, ...records];
        setRecords(u);
        localStorage.setItem('erp_standard', JSON.stringify(u));
        toast.success('Standard added!');
      }
      setShowModal(false); setEditing(null);
    } catch (error) {
      console.error(error);
      let u;
      if (editing) {
        u = records.map(r => r.id === editing.id ? { ...r, ...form } : r);
        toast.success('Standard updated locally!');
      } else {
        u = [{ ...form, id: `s${Date.now()}` }, ...records];
        toast.success('Standard added locally!');
      }
      setRecords(u);
      localStorage.setItem('erp_standard', JSON.stringify(u));
      setShowModal(false); setEditing(null);
    }
  };

  const del = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      if (id.includes('-')) {
        await api.delete(`/masters/standard/${id}`);
      }
      const u = records.filter(r => r.id !== id);
      setRecords(u);
      localStorage.setItem('erp_standard', JSON.stringify(u));
      toast.success('Deleted.');
    } catch (error) {
      console.error(error);
      const u = records.filter(r => r.id !== id);
      setRecords(u);
      localStorage.setItem('erp_standard', JSON.stringify(u));
      toast.success('Deleted locally.');
    }
  };

  const openEdit = r => { setEditing(r); setForm({ standard: r.standard, dept: r.dept, sections: r.sections, capacity: r.capacity, advisor: r.advisor, semCount: r.semCount }); setShowModal(true); };
  const filtered = records.filter(r => r.dept.toLowerCase().includes(search.toLowerCase()) || r.advisor.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">Academic Master</span>
            <h1 className="text-3xl font-black mt-2">Standard / Class Registry</h1>
            <p className="text-blue-300 text-xs font-semibold mt-1">Manage class standards, sections, advisors and capacities</p>
          </div>
          <button onClick={() => { setEditing(null); setForm({ standard: 'I', dept: 'Computer Science', sections: 'A', capacity: 60, advisor: '', semCount: 2 }); setShowModal(true); }}
            className="px-5 py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg"><Plus size={18} /> Add Standard</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[['Total Standards', records.length, 'bg-blue-600'], ['Total Sections', records.reduce((a, r) => a + (r.sections.split(',').length), 0), 'bg-emerald-600'], ['Total Capacity', records.reduce((a, r) => a + Number(r.capacity) * r.sections.split(',').length, 0), 'bg-violet-600']].map(([t, v, bg]) => (
          <div key={t} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{v}</h3>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-3 text-slate-400" size={15} /><input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search standards..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">{['Standard', 'Department', 'Sections', 'Capacity/Sec', 'Class Advisor', 'Semesters', 'Actions'].map(h => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-4"><div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">{r.standard}</div></td>
                  <td className="px-5 py-4 font-bold text-slate-800">{r.dept}</td>
                  <td className="px-5 py-4">{r.sections.split(',').map(s => <span key={s} className="inline-block mr-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-black rounded-full border border-indigo-200">{s.trim()}</span>)}</td>
                  <td className="px-5 py-4 font-bold text-slate-700">{r.capacity} students</td>
                  <td className="px-5 py-4 text-slate-600 font-semibold">{r.advisor}</td>
                  <td className="px-5 py-4 text-slate-600 font-semibold">{r.semCount}</td>
                  <td className="px-5 py-4 text-right"><div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100"><button onClick={() => openEdit(r)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg"><Edit2 size={14} /></button><button onClick={() => del(r.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={14} /></button></div></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-5 py-16 text-center text-slate-400 font-bold">No records found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between"><h3 className="text-lg font-black text-slate-800">{editing ? 'Edit Standard' : 'Add Standard'}</h3><button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button></div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Standard *</label><select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.standard} onChange={e => setForm({ ...form, standard: e.target.value })}>{['I','II','III','IV'].map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Department *</label><select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>{DEPTS.map(d => <option key={d}>{d}</option>)}</select></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Sections (comma sep)</label><input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="A, B, C" value={form.sections} onChange={e => setForm({ ...form, sections: e.target.value })} /></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Capacity / Section</label><input type="number" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} /></div>
                <div className="col-span-2"><label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Class Advisor *</label><input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Dr. Name" value={form.advisor} onChange={e => setForm({ ...form, advisor: e.target.value })} /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm">{editing ? 'Update' : 'Add Standard'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Standard;
