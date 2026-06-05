import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, BookOpen, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { confirmDelete } from '../utils/confirmToast';

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
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ code: '', name: '', dept: 'Computer Science', year: 'I', sem: '1', credits: 3, type: 'Theory', elective: false });

  const fetchRecords = async () => {
    try {
      const { data } = await api.get('/masters/subject');
      if (data && data.length > 0) {
        setRecords(data.map(r => ({ id: r.id, ...r.data })));
      } else {
        const promises = SEED.map(s => api.post('/masters/subject', { data: s }));
        const results = await Promise.all(promises);
        setRecords(results.map(r => ({ id: r.data.id, ...r.data.data })));
      }
    } catch (error) {
      console.error('Failed to fetch subject records from backend, falling back to localStorage:', error);
      try {
        const c = localStorage.getItem('erp_subject');
        if (c) setRecords(JSON.parse(c));
        else {
          setRecords(SEED);
          localStorage.setItem('erp_subject', JSON.stringify(SEED));
        }
      } catch { }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.name) { toast.error('Subject code and name required'); return; }

    try {
      if (editing) {
        await api.put(`/masters/subject/${editing.id}`, { data: form });
        const u = records.map(r => r.id === editing.id ? { ...r, ...form } : r);
        setRecords(u);
        localStorage.setItem('erp_subject', JSON.stringify(u));
        toast.success('Subject updated!');
      } else {
        const { data } = await api.post('/masters/subject', { data: form });
        const u = [{ id: data.id, ...form }, ...records];
        setRecords(u);
        localStorage.setItem('erp_subject', JSON.stringify(u));
        toast.success('Subject added!');
      }
      setViewMode('list'); setEditing(null);
    } catch (error) {
      console.error(error);
      let u;
      if (editing) {
        u = records.map(r => r.id === editing.id ? { ...r, ...form } : r);
        toast.success('Subject updated locally!');
      } else {
        u = [{ ...form, id: `sub-${Date.now()}` }, ...records];
        toast.success('Subject added locally!');
      }
      setRecords(u);
      localStorage.setItem('erp_subject', JSON.stringify(u));
      setViewMode('list'); setEditing(null);
    }
  };

  const del = async (id) => {
    confirmDelete(async () => {
      try {
        if (id.includes('-') || (id.startsWith('sub') && id.length > 5)) {
          await api.delete(`/masters/subject/${id}`);
        }
        const u = records.filter(r => r.id !== id);
        setRecords(u);
        localStorage.setItem('erp_subject', JSON.stringify(u));
        toast.success('Deleted.');
      } catch (error) {
        console.error(error);
        const u = records.filter(r => r.id !== id);
        setRecords(u);
        localStorage.setItem('erp_subject', JSON.stringify(u));
        toast.success('Deleted locally.');
      }
    }, 'Are you sure you want to delete this subject?');
  };

  const openEdit = r => {
    setEditing(r);
    setForm({
      code: r.code,
      name: r.name,
      dept: r.dept,
      year: r.year || 'I',
      sem: r.sem || '1',
      credits: r.credits || 3,
      type: r.type || 'Theory',
      elective: !!r.elective
    });
    setViewMode('form');
  };

  const filtered = records.filter(r => 
    (r.name.toLowerCase().includes(search.toLowerCase()) || 
     r.code.toLowerCase().includes(search.toLowerCase())) && 
    (!deptFilter || r.dept === deptFilter)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
      {viewMode === 'list' ? (
        <>
          <div className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">Academic Master</span>
                <h1 className="text-3xl font-black mt-2">Subject Dictionary</h1>
                <p className="text-purple-300 text-xs font-semibold mt-1">Manage all course subjects, codes, credits and types</p>
              </div>
              <button 
                onClick={() => { 
                  setEditing(null); 
                  setForm({ code: '', name: '', dept: 'Computer Science', year: 'I', sem: '1', credits: 3, type: 'Theory', elective: false }); 
                  setViewMode('form'); 
                }}
                className="px-5 py-3 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus size={18} /> Add Subject
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['Total Subjects', records.length],
              ['Theory Subjects', records.filter(r => r.type === 'Theory').length],
              ['Practical / Labs', records.filter(r => r.type.includes('Practical')).length]
            ].map(([t, v]) => (
              <div key={t} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t}</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{v}</h3>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-3 text-slate-400" size={15} />
                <input 
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="Search subjects..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                />
              </div>
              <select 
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none" 
                value={deptFilter} 
                onChange={e => setDeptFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
              <span className="text-xs font-bold text-slate-400 ml-auto">{filtered.length} subjects</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {['Code', 'Subject Name', 'Department', 'Year / Sem', 'Credits', 'Type', 'Elective', 'Actions'].map(h => <th key={h} className="px-5 py-4">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-5 py-4">
                        <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg text-xs">{r.code}</span>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-800">{r.name}</td>
                      <td className="px-5 py-4 text-slate-600 font-semibold text-xs">{r.dept}</td>
                      <td className="px-5 py-4 text-slate-600 font-semibold text-xs">Year {r.year} / Sem {r.sem}</td>
                      <td className="px-5 py-4">
                        <span className="font-black text-slate-900">{r.credits}</span> <span className="text-slate-400 text-xs">credits</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${r.type === 'Practical' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : r.type === 'Theory' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>{r.type}</span>
                      </td>
                      <td className="px-5 py-4">
                        {r.elective ? (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Elective</span>
                        ) : (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200">Core</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(r)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => del(r.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-slate-400 font-bold">No subjects found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{editing ? 'Edit Subject' : 'Add Subject'}</h1>
              <div className="flex flex-col mt-1">
                <span className="text-xs font-bold text-purple-600">{editing ? 'Modify Subject Record' : 'Create New Subject Record'}</span>
                <span className="text-xs text-slate-500 font-medium">Fill in the fields below to update the course subject configuration</span>
              </div>
            </div>
            <button
              onClick={() => { setViewMode('list'); setEditing(null); }}
              className="px-4 py-2 border border-purple-200 text-purple-600 bg-purple-50/50 hover:bg-purple-100/70 font-semibold rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              Cancel & Back
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
            <form onSubmit={submit} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Subject Code *</label>
                  <input
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    placeholder="CS301"
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Credits</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    value={form.credits}
                    onChange={e => setForm({ ...form, credits: Number(e.target.value) })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Subject Name *</label>
                  <input
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    placeholder="Data Structures & Algorithms"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Department</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer"
                    value={form.dept}
                    onChange={e => setForm({ ...form, dept: e.target.value })}
                  >
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Type</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer"
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                  >
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Academic Year</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer"
                    value={form.year}
                    onChange={e => setForm({ ...form, year: e.target.value })}
                  >
                    {['I', 'II', 'III', 'IV'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Semester</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer"
                    value={form.sem}
                    onChange={e => setForm({ ...form, sem: e.target.value })}
                  >
                    {['1', '2', '3', '4', '5', '6', '7', '8'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-span-2 flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="elective"
                    className="w-4 h-4 accent-purple-600 cursor-pointer rounded"
                    checked={form.elective}
                    onChange={e => setForm({ ...form, elective: e.target.checked })}
                  />
                  <label htmlFor="elective" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                    Mark as Elective Subject
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => { setViewMode('list'); setEditing(null); }} 
                  className="px-6 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
                >
                  {editing ? 'Update Subject' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subject;
