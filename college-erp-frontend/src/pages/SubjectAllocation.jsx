import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, X, AlertTriangle, Check, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { confirmDelete } from '../utils/confirmToast';

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
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [editing, setEditing] = useState(null);
  
  const [subjectsList, setSubjectsList] = useState(SUBJECTS);
  const [facultyList, setFacultyList] = useState(FACULTY);
  
  const [form, setForm] = useState({ 
    subject: 'CS301', 
    subjectName: 'Data Structures', 
    dept: 'Computer Science', 
    year: 'III', 
    section: 'A', 
    faculty: 'Dr. Amit Sharma', 
    hours: 4 
  });

  const fetchRecords = async () => {
    try {
      const { data } = await api.get('/masters/subj_alloc');
      if (data && data.length > 0) {
        setRecords(data.map(r => ({ id: r.id, ...r.data })));
      } else {
        const promises = SEED.map(s => api.post('/masters/subj_alloc', { data: s }));
        const results = await Promise.all(promises);
        setRecords(results.map(r => ({ id: r.data.id, ...r.data.data })));
      }
    } catch (error) {
      console.error('Failed to fetch subject allocations, falling back to localStorage:', error);
      try {
        const c = localStorage.getItem('erp_subj_alloc');
        if (c) setRecords(JSON.parse(c));
        else {
          setRecords(SEED);
          localStorage.setItem('erp_subj_alloc', JSON.stringify(SEED));
        }
      } catch { }
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [subjectsRes, staffRes] = await Promise.all([
        api.get('/masters/subject').catch(() => ({ data: [] })),
        api.get('/staff').catch(() => ({ data: [] }))
      ]);
      
      const subData = subjectsRes.data && subjectsRes.data.length > 0
        ? subjectsRes.data.map(r => ({ code: r.data?.code || r.code, name: r.data?.name || r.name, dept: r.data?.dept || r.dept }))
        : SUBJECTS;
      
      const facData = staffRes.data && staffRes.data.length > 0
        ? staffRes.data.map(s => s.fullName)
        : FACULTY;
        
      setSubjectsList(subData);
      setFacultyList(facData);
      
      // Update form defaults to match actual data
      setForm(prev => ({
        ...prev,
        subject: subData[0]?.code || 'CS301',
        subjectName: subData[0]?.name || 'Data Structures',
        dept: subData[0]?.dept || 'Computer Science',
        faculty: facData[0] || 'Dr. Amit Sharma'
      }));
    } catch (error) {
      console.error('Failed to fetch dependencies:', error);
      setSubjectsList(SUBJECTS);
      setFacultyList(FACULTY);
    }
  };

  useEffect(() => {
    fetchDependencies();
    fetchRecords();
  }, []);

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
    const sub = subjectsList.find(s => s.code === form.subject);
    const entry = { ...form, subjectName: sub?.name || form.subjectName, dept: sub?.dept || form.dept };
    
    try {
      if (editing) {
        await api.put(`/masters/subj_alloc/${editing.id}`, { data: entry });
        const u = records.map(r => r.id === editing.id ? { ...r, ...entry } : r);
        setRecords(u);
        localStorage.setItem('erp_subj_alloc', JSON.stringify(u));
        toast.success('Allocation updated!');
      } else {
        const { data } = await api.post('/masters/subj_alloc', { data: entry });
        const u = [{ id: data.id, ...entry }, ...records];
        setRecords(u);
        localStorage.setItem('erp_subj_alloc', JSON.stringify(u));
        toast.success('Subject allocated!');
      }
      setViewMode('list'); setEditing(null);
    } catch (error) {
      console.error(error);
      let u;
      if (editing) {
        u = records.map(r => r.id === editing.id ? { ...r, ...entry } : r);
        toast.success('Allocation updated locally!');
      } else {
        u = [{ ...entry, id: `sa-${Date.now()}` }, ...records];
        toast.success('Subject allocated locally!');
      }
      setRecords(u);
      localStorage.setItem('erp_subj_alloc', JSON.stringify(u));
      setViewMode('list'); setEditing(null);
    }
  };

  const del = async id => {
    confirmDelete(async () => {
      try {
        if (id.includes('-') || (id.startsWith('sa') && id.length > 3)) {
          await api.delete(`/masters/subj_alloc/${id}`);
        }
        const u = records.filter(r => r.id !== id);
        setRecords(u);
        localStorage.setItem('erp_subj_alloc', JSON.stringify(u));
        toast.success('Allocation removed!');
      } catch (error) {
        console.error(error);
        const u = records.filter(r => r.id !== id);
        setRecords(u);
        localStorage.setItem('erp_subj_alloc', JSON.stringify(u));
        toast.success('Deleted locally.');
      }
    }, 'Are you sure you want to delete this subject allocation?');
  };

  const openEdit = r => { 
    setEditing(r); 
    setForm({ 
      subject: r.subject, 
      subjectName: r.subjectName, 
      dept: r.dept, 
      year: r.year, 
      section: r.section, 
      faculty: r.faculty, 
      hours: Number(r.hours) || 4 
    }); 
    setViewMode('form'); 
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      subject: subjectsList[0]?.code || 'CS301',
      subjectName: subjectsList[0]?.name || 'Data Structures',
      dept: subjectsList[0]?.dept || 'Computer Science',
      year: 'III',
      section: 'A',
      faculty: facultyList[0] || 'Dr. Amit Sharma',
      hours: 4
    });
    setViewMode('form');
  };

  const handleSubjectChange = (code) => {
    const sub = subjectsList.find(s => s.code === code);
    setForm({
      ...form,
      subject: code,
      subjectName: sub?.name || '',
      dept: sub?.dept || ''
    });
  };

  const filtered = records.filter(r => 
    (r.subjectName || '').toLowerCase().includes(search.toLowerCase()) || 
    (r.faculty || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
      {viewMode === 'list' ? (
        <>
          <div className="bg-gradient-to-br from-teal-900 to-cyan-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-300 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30">Academic Master</span>
                <h1 className="text-3xl font-black mt-2">Subject Allocation</h1>
                <p className="text-teal-300 text-xs font-semibold mt-1">Assign subjects to faculty members per class and section</p>
              </div>
              <div className="flex items-center gap-3">
                {conflicts.length > 0 && (
                  <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 px-4 py-2 rounded-2xl text-rose-300 text-xs font-bold">
                    <AlertTriangle size={14} /> {conflicts.length} conflicts
                  </div>
                )}
                <button 
                  onClick={openAdd} 
                  className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-all"
                >
                  <Plus size={18} /> Allocate Subject
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['Allocated Subjects', records.length],
              ['Total Credit Hours', records.reduce((a, r) => a + Number(r.hours || 0), 0)],
              ['Allocation Conflicts', conflicts.length]
            ].map(([t, v]) => (
              <div key={t} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t}</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{v}</h3>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 text-slate-400" size={15} />
                <input 
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                  placeholder="Search allocations..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                />
              </div>
              <span className="text-xs font-bold text-slate-400 ml-auto">{filtered.length} allocations</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {['Subject', 'Department', 'Class / Sec', 'Faculty', 'Hours/Week', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-4">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(r => {
                    const isConflict = conflicts.includes(r.id);
                    return (
                      <tr key={r.id} className={`hover:bg-slate-50/50 transition-colors group ${isConflict ? 'bg-rose-50/30' : ''}`}>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-800">{r.subjectName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{r.subject}</div>
                        </td>
                        <td className="px-5 py-4 text-slate-600 font-semibold text-xs">{r.dept}</td>
                        <td className="px-5 py-4 font-bold text-slate-700">Year {r.year} – Sec {r.section}</td>
                        <td className="px-5 py-4 font-semibold text-slate-700">{r.faculty}</td>
                        <td className="px-5 py-4">
                          <span className="font-black text-slate-900">{r.hours}</span> <span className="text-slate-400 text-xs">hrs</span>
                        </td>
                        <td className="px-5 py-4">
                          {isConflict ? (
                            <span className="flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              <AlertTriangle size={10} />Conflict
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <Check size={10} />OK
                            </span>
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
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-slate-400 font-bold">No allocations found</td>
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
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{editing ? 'Edit Allocation' : 'Allocate Subject'}</h1>
              <div className="flex flex-col mt-1">
                <span className="text-xs font-bold text-teal-600">{editing ? 'Modify Subject Allocation Record' : 'Create New Subject Allocation Record'}</span>
                <span className="text-xs text-slate-500 font-medium">Fill in the fields below to assign subjects to faculty members</span>
              </div>
            </div>
            <button
              onClick={() => { setViewMode('list'); setEditing(null); }}
              className="px-4 py-2 border border-teal-200 text-teal-600 bg-teal-50/50 hover:bg-teal-100/70 font-semibold rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              Cancel & Back
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
            <form onSubmit={submit} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Subject *</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer"
                    value={form.subject}
                    onChange={e => handleSubjectChange(e.target.value)}
                  >
                    {subjectsList.map(s => (
                      <option key={s.code} value={s.code}>{s.code} – {s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Year *</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer"
                    value={form.year}
                    onChange={e => setForm({ ...form, year: e.target.value })}
                  >
                    {['I', 'II', 'III', 'IV'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Section *</label>
                  <input
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    placeholder="A"
                    value={form.section}
                    onChange={e => setForm({ ...form, section: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Faculty *</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer"
                    value={form.faculty}
                    onChange={e => setForm({ ...form, faculty: e.target.value })}
                  >
                    {facultyList.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Hours / Week *</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    value={form.hours}
                    onChange={e => setForm({ ...form, hours: Number(e.target.value) })}
                  />
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
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
                >
                  {editing ? 'Update Allocation' : 'Allocate Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectAllocation;
