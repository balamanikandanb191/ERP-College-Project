import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, Clock, BookOpen, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { confirmDelete } from '../../utils/confirmToast';

const DEPTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Science & Humanities'];
const SESSIONS = [
  { code: 'FN', label: 'Forenoon (09:30 AM - 12:30 PM)' },
  { code: 'AN', label: 'Afternoon (01:30 PM - 04:30 PM)' }
];
const COURSES = ['B.E.', 'B.Tech', 'M.E.', 'MBA', 'MCA'];
const ACAD_YEARS = ['2025-2026', '2024-2025'];

const SEED_TIMETABLE = [
  { id: 'et1', academicYear: '2025-2026', course: 'B.E.', dept: 'Computer Science', sem: '5', date: '2026-06-15', session: 'FN', subjectCode: 'CS301', subjectName: 'Data Structures & Algorithms', type: 'Theory' },
  { id: 'et2', academicYear: '2025-2026', course: 'B.E.', dept: 'Computer Science', sem: '5', date: '2026-06-17', session: 'FN', subjectCode: 'CS302', subjectName: 'Operating Systems', type: 'Theory' },
  { id: 'et3', academicYear: '2025-2026', course: 'B.Tech', dept: 'Information Technology', sem: '7', date: '2026-06-15', session: 'AN', subjectCode: 'IT401', subjectName: 'Cloud Computing', type: 'Theory' },
  { id: 'et4', academicYear: '2025-2026', course: 'B.E.', dept: 'Electronics', sem: '3', date: '2026-06-16', session: 'FN', subjectCode: 'EC201', subjectName: 'Circuit Theory', type: 'Theory' },
];

const ExamTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [editing, setEditing] = useState(null);
  
  const [form, setForm] = useState({
    academicYear: '2025-2026',
    course: 'B.E.',
    dept: 'Computer Science',
    sem: '5',
    date: '',
    session: 'FN',
    subjectCode: '',
    subjectName: '',
    type: 'Theory'
  });

  const fetchTimetableAndSubjects = async () => {
    try {
      setLoading(true);
      // Fetch timetable
      const resTimetable = await api.get('/masters/exam_timetable');
      if (resTimetable.data && resTimetable.data.length > 0) {
        setTimetable(resTimetable.data.map(r => ({ ...r.data, id: r.id })));
      } else {
        const promises = SEED_TIMETABLE.map(s => api.post('/masters/exam_timetable', { data: s }));
        const results = await Promise.all(promises);
        setTimetable(results.map(r => ({ ...r.data.data, id: r.data.id })));
      }

      // Fetch subjects for dropdown selection
      const resSubjects = await api.get('/masters/subject');
      if (resSubjects.data && resSubjects.data.length > 0) {
        setSubjects(resSubjects.data.map(r => ({ ...r.data, id: r.id })));
      }
    } catch (error) {
      console.error('Failed to fetch data, loading cached states:', error);
      const cachedTime = localStorage.getItem('erp_exam_timetable');
      if (cachedTime) setTimetable(JSON.parse(cachedTime));
      else {
        setTimetable(SEED_TIMETABLE);
        localStorage.setItem('erp_exam_timetable', JSON.stringify(SEED_TIMETABLE));
      }

      const cachedSub = localStorage.getItem('erp_subject');
      if (cachedSub) setSubjects(JSON.parse(cachedSub));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetableAndSubjects();
  }, []);

  const saveToCache = (updatedList) => {
    localStorage.setItem('erp_exam_timetable', JSON.stringify(updatedList));
  };

  const handleSubjectChange = (e) => {
    const selectedCode = e.target.value;
    const subObj = subjects.find(s => s.code === selectedCode);
    setForm(prev => ({
      ...prev,
      subjectCode: selectedCode,
      subjectName: subObj ? subObj.name : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.subjectCode) {
      toast.error('Date and Subject Selection are required');
      return;
    }

    try {
      if (editing) {
        await api.put(`/masters/exam_timetable/${editing.id}`, { data: form });
        const updated = timetable.map(t => t.id === editing.id ? { ...t, ...form } : t);
        setTimetable(updated);
        saveToCache(updated);
        toast.success('Exam schedule updated successfully!');
      } else {
        const { data } = await api.post('/masters/exam_timetable', { data: form });
        const updated = [{ id: data.id, ...form }, ...timetable];
        setTimetable(updated);
        saveToCache(updated);
        toast.success('Exam schedule added successfully!');
      }
      setViewMode('list');
      setEditing(null);
    } catch (err) {
      console.error(err);
      const mockId = editing ? editing.id : `et-${Date.now()}`;
      const mockRecord = { id: mockId, ...form };
      let updated;
      if (editing) {
        updated = timetable.map(t => t.id === editing.id ? mockRecord : t);
      } else {
        updated = [mockRecord, ...timetable];
      }
      setTimetable(updated);
      saveToCache(updated);
      toast.success(editing ? 'Updated locally' : 'Added locally');
      setViewMode('list');
      setEditing(null);
    }
  };

  const handleEdit = (schedule) => {
    setEditing(schedule);
    setForm({ ...schedule });
    setViewMode('form');
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        if (!id.startsWith('et-') && id.length > 5) {
          await api.delete(`/masters/exam_timetable/${id}`);
        }
        const updated = timetable.filter(t => t.id !== id);
        setTimetable(updated);
        saveToCache(updated);
        toast.success('Exam schedule deleted successfully.');
      } catch (err) {
        const updated = timetable.filter(t => t.id !== id);
        setTimetable(updated);
        saveToCache(updated);
        toast.success('Deleted locally.');
      }
    }, 'Are you sure you want to delete this Exam schedule?');
  };

  const filteredTimetable = timetable.filter(t =>
    (t.subjectName.toLowerCase().includes(search.toLowerCase()) ||
     t.subjectCode.toLowerCase().includes(search.toLowerCase())) &&
    (!deptFilter || t.dept === deptFilter)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
      {viewMode === 'list' ? (
        <>
          {/* Header */}
          <div className="bg-gradient-to-br from-violet-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-violet-300 bg-violet-500/20 px-3 py-1 rounded-full border border-violet-500/30">Data Submission</span>
                <h1 className="text-3xl font-black mt-2">Exam Schedule / Time Table</h1>
                <p className="text-violet-200 text-xs font-semibold mt-1">Manage exam dates, morning/afternoon sessions and subject mapping</p>
              </div>
              <button
                onClick={() => {
                  setEditing(null);
                  setForm({
                    academicYear: '2025-2026',
                    course: 'B.E.',
                    dept: 'Computer Science',
                    sem: '1',
                    date: '',
                    session: 'FN',
                    subjectCode: '',
                    subjectName: '',
                    type: 'Theory'
                  });
                  setViewMode('form');
                }}
                className="px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus size={18} /> Schedule Exam
              </button>
            </div>
          </div>

          {/* Search/Filter Bar */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-5 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                placeholder="Search Subjects..."
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
            <span className="text-xs font-bold text-slate-400 ml-auto">{filteredTimetable.length} Exams scheduled</span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Session</th>
                    <th className="px-6 py-4">Course / Dept / Sem</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTimetable.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        <span className="inline-flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                          <Calendar size={12} /> {item.date}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded border ${
                          item.session === 'FN' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          <Clock size={12} /> {item.session === 'FN' ? 'Forenoon (FN)' : 'Afternoon (AN)'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-semibold text-xs">
                        {item.course} - {item.dept} (Sem {item.sem})
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{item.subjectName}</span>
                          <span className="text-[10px] font-mono text-indigo-500 font-extrabold">{item.subjectCode}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          item.type === 'Practical' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>{item.type}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTimetable.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400 font-bold">No exam timetables scheduled</td>
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
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{editing ? 'Edit Exam Timetable' : 'Schedule New Exam'}</h1>
              <p className="text-slate-500 text-xs font-semibold mt-1 font-medium">Add dates, session slots, course levels and subject mapping details</p>
            </div>
            <button
              onClick={() => { setViewMode('list'); setEditing(null); }}
              className="px-4 py-2 border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              Back to Timetables
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Academic Year</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold cursor-pointer"
                    value={form.academicYear}
                    onChange={e => setForm({ ...form, academicYear: e.target.value })}
                  >
                    {ACAD_YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Course Name</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold cursor-pointer"
                    value={form.course}
                    onChange={e => setForm({ ...form, course: e.target.value })}
                  >
                    {COURSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Department</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold cursor-pointer"
                    value={form.dept}
                    onChange={e => setForm({ ...form, dept: e.target.value })}
                  >
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Semester</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold cursor-pointer"
                    value={form.sem}
                    onChange={e => setForm({ ...form, sem: e.target.value })}
                  >
                    {['1', '2', '3', '4', '5', '6', '7', '8'].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Exam Date *</label>
                  <input
                    type="date"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Exam Session Slot</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold cursor-pointer"
                    value={form.session}
                    onChange={e => setForm({ ...form, session: e.target.value })}
                  >
                    {SESSIONS.map(s => <option key={s.code} value={s.code}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Exam Type</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold cursor-pointer"
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value, subjectCode: '', subjectName: '' })}
                  >
                    <option value="Theory">Theory Exam</option>
                    <option value="Practical">Practical Exam</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Select Subject (Code - Name)</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold cursor-pointer"
                    value={form.subjectCode}
                    onChange={handleSubjectChange}
                  >
                    <option value="">-- Choose Subject --</option>
                    {subjects
                      .filter(s => {
                        const semMatch = String(s.sem) === String(form.sem);
                        const typeMatch = form.type === 'Theory'
                          ? (s.type === 'Theory' || s.type === 'Theory + Practical')
                          : (s.type === 'Practical' || s.type === 'Theory + Practical');
                        return semMatch && typeMatch;
                      })
                      .map((s, idx) => (
                        <option key={s.id || `${s.code}-${idx}`} value={s.code}>{s.code} - {s.name}</option>
                      ))
                    }
                  </select>
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
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-violet-500/20 transition-all"
                >
                  {editing ? 'Update Timetable' : 'Add to Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTimetable;
