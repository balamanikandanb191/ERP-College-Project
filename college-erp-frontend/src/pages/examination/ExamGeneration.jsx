import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Layers, Check, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { confirmDelete } from '../../utils/confirmToast';

const DEPTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Science & Humanities'];
const ACAD_YEARS = ['2025-2026', '2024-2025'];
const COURSES = ['B.E.', 'B.Tech', 'M.E.', 'MBA', 'MCA'];

const SEED_GENERATED_EXAMS = [
  { id: 'eg1', examName: 'Semester End Theory Examinations', academicYear: '2025-2026', course: 'B.E.', dept: 'Computer Science', sem: '5', maxMarks: 100, passMark: 40, active: true },
  { id: 'eg2', examName: 'Semester End Theory Examinations', academicYear: '2025-2026', course: 'B.E.', dept: 'Computer Science', sem: '3', maxMarks: 100, passMark: 40, active: true },
  { id: 'eg3', examName: 'Model Exams June 2026', academicYear: '2025-2026', course: 'B.Tech', dept: 'Information Technology', sem: '7', maxMarks: 100, passMark: 50, active: true },
  { id: 'eg4', examName: 'Unit Test 1', academicYear: '2025-2026', course: 'B.E.', dept: 'Electronics', sem: '3', maxMarks: 50, passMark: 20, active: true }
];

const ExamGeneration = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [editing, setEditing] = useState(null);
  
  const [form, setForm] = useState({
    examName: '',
    academicYear: '2025-2026',
    course: 'B.E.',
    dept: 'Computer Science',
    sem: '5',
    maxMarks: 100,
    passMark: 40,
    active: true
  });

  const fetchExams = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/masters/exam_generation');
      if (data && data.length > 0) {
        setExams(data.map(r => ({ ...r.data, id: r.id })));
      } else {
        const promises = SEED_GENERATED_EXAMS.map(s => api.post('/masters/exam_generation', { data: s }));
        const results = await Promise.all(promises);
        setExams(results.map(r => ({ ...r.data.data, id: r.data.id })));
      }
    } catch (error) {
      console.error('Failed to fetch generated exams:', error);
      const cached = localStorage.getItem('erp_generated_exams');
      if (cached) setExams(JSON.parse(cached));
      else {
        setExams(SEED_GENERATED_EXAMS);
        localStorage.setItem('erp_generated_exams', JSON.stringify(SEED_GENERATED_EXAMS));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const saveToCache = (updatedList) => {
    localStorage.setItem('erp_generated_exams', JSON.stringify(updatedList));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.examName.trim()) {
      toast.error('Exam name is required');
      return;
    }

    try {
      if (editing) {
        await api.put(`/masters/exam_generation/${editing.id}`, { data: form });
        const updated = exams.map(x => x.id === editing.id ? { ...x, ...form } : x);
        setExams(updated);
        saveToCache(updated);
        toast.success('Exam term updated successfully!');
      } else {
        const { data } = await api.post('/masters/exam_generation', { data: form });
        const updated = [{ id: data.id, ...form }, ...exams];
        setExams(updated);
        saveToCache(updated);
        toast.success('Exam term generated successfully!');
      }
      setViewMode('list');
      setEditing(null);
    } catch (err) {
      console.error(err);
      const mockId = editing ? editing.id : `eg-${Date.now()}`;
      const mockRecord = { id: mockId, ...form };
      let updated;
      if (editing) {
        updated = exams.map(x => x.id === editing.id ? mockRecord : x);
      } else {
        updated = [mockRecord, ...exams];
      }
      setExams(updated);
      saveToCache(updated);
      toast.success(editing ? 'Updated locally' : 'Added locally');
      setViewMode('list');
      setEditing(null);
    }
  };

  const handleEdit = (exam) => {
    setEditing(exam);
    setForm({ ...exam });
    setViewMode('form');
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        if (!id.startsWith('eg-') && id.length > 5) {
          await api.delete(`/masters/exam_generation/${id}`);
        }
        const updated = exams.filter(x => x.id !== id);
        setExams(updated);
        saveToCache(updated);
        toast.success('Exam term deleted.');
      } catch (err) {
        const updated = exams.filter(x => x.id !== id);
        setExams(updated);
        saveToCache(updated);
        toast.success('Deleted locally.');
      }
    }, 'Are you sure you want to delete this Generated Exam?');
  };

  const filteredExams = exams.filter(x =>
    x.examName.toLowerCase().includes(search.toLowerCase()) &&
    (!deptFilter || x.dept === deptFilter)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
      {viewMode === 'list' ? (
        <>
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Exam Process</span>
                <h1 className="text-3xl font-black mt-2">Exam Generation</h1>
                <p className="text-indigo-200 text-xs font-semibold mt-1">Configure active exam sessions, standard mark metrics and program structures</p>
              </div>
              <button
                onClick={() => {
                  setEditing(null);
                  setForm({
                    examName: '',
                    academicYear: '2025-2026',
                    course: 'B.E.',
                    dept: 'Computer Science',
                    sem: '5',
                    maxMarks: 100,
                    passMark: 40,
                    active: true
                  });
                  setViewMode('form');
                }}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus size={18} /> Generate Exam Session
              </button>
            </div>
          </div>

          {/* Search/Filter Bar */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-5 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Search Exam Name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none cursor-pointer"
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <span className="text-xs font-bold text-slate-400 ml-auto">{filteredExams.length} Exams active</span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Exam Name</th>
                    <th className="px-6 py-4">Academic Year</th>
                    <th className="px-6 py-4">Course / Dept / Sem</th>
                    <th className="px-6 py-4">Max / Pass Marks</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredExams.map(exam => (
                    <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        <span className="inline-flex items-center gap-1.5 text-slate-800">
                          <FileText size={16} className="text-slate-400" /> {exam.examName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-semibold text-xs">{exam.academicYear}</td>
                      <td className="px-6 py-4 text-slate-600 font-semibold text-xs">
                        {exam.course} - {exam.dept} (Sem {exam.sem})
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-extrabold text-slate-800">{exam.maxMarks}</span> / <span className="font-bold text-slate-500">{exam.passMark}</span>
                      </td>
                      <td className="px-6 py-4">
                        {exam.active ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Check size={10} /> Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            <X size={10} /> Disabled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(exam)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(exam.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredExams.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400 font-bold">No generated exams found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Form View */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{editing ? 'Edit Exam Term' : 'Generate Exam Term'}</h1>
              <p className="text-slate-500 text-xs font-semibold mt-1 font-medium">Create exam parameters including course mappings, pass marks and grading caps</p>
            </div>
            <button
              onClick={() => { setViewMode('list'); setEditing(null); }}
              className="px-4 py-2 border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              Back to List
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Exam Name *</label>
                  <input
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                    placeholder="Semester End Theory Examinations / Unit Test 1"
                    value={form.examName}
                    onChange={e => setForm({ ...form, examName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Academic Year</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold cursor-pointer"
                    value={form.academicYear}
                    onChange={e => setForm({ ...form, academicYear: e.target.value })}
                  >
                    {ACAD_YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Course</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold cursor-pointer"
                    value={form.course}
                    onChange={e => setForm({ ...form, course: e.target.value })}
                  >
                    {COURSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Department</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold cursor-pointer"
                    value={form.dept}
                    onChange={e => setForm({ ...form, dept: e.target.value })}
                  >
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Semester</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold cursor-pointer"
                    value={form.sem}
                    onChange={e => setForm({ ...form, sem: e.target.value })}
                  >
                    {['1', '2', '3', '4', '5', '6', '7', '8'].map(s => <option key={s}>Semester {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Maximum Marks</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                    value={form.maxMarks}
                    onChange={e => setForm({ ...form, maxMarks: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Pass Mark Cap</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                    value={form.passMark}
                    onChange={e => setForm({ ...form, passMark: Number(e.target.value) })}
                  />
                </div>
                <div className="col-span-2 flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="active"
                    className="w-4 h-4 accent-indigo-600 cursor-pointer rounded"
                    checked={form.active}
                    onChange={e => setForm({ ...form, active: e.target.checked })}
                  />
                  <label htmlFor="active" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                    Exam session is Active and Open for Mark Registration
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setViewMode('list'); setEditing(null); }}
                  className="px-6 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/20 transition-all"
                >
                  {editing ? 'Update Exam' : 'Generate Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamGeneration;
