import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Save, RefreshCw, Calendar, BookOpen, GraduationCap, Hash, FileText, Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const ASSESSMENT_TYPES = [
  'Assignment',
  'Internal Test 1',
  'Internal Test 2',
  'Internal Test 3',
  'Model Exam',
  'Seminar',
  'Presentation',
  'Practical',
  'Record Work',
  'Viva Voce',
  'Project Review'
];

const COURSES = [
  'B.Sc Computer Science',
  'B.Sc Mathematics',
  'B.Com',
  'BCA',
  'BBA',
  'B.Pharm',
  'MBA',
  'MCA',
  'M.Sc Computer Science',
  'M.Sc Mathematics',
  'Diploma in Computer Science',
  'B.E Computer Science',
  'B.E Electronics',
  'B.Tech IT',
  'M.Tech'
];

const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8', 'Year 1', 'Year 2', 'Year 3'];

const emptyForm = {
  academic_year: '',
  course: '',
  semester: '',
  subject_name: '',
  subject_code: '',
  assessment_type: '',
  assessment_date: '',
  max_marks: '',
  staff_id: '',
  staff_name: '',
  experiment_count: ''
};

const AssessmentConfigurationPage = () => {
  const [form, setForm] = useState(emptyForm);
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [staffList, setStaffList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const fetchConfigs = useCallback(async () => {
    try {
      const { data } = await api.get('/assessment/config');
      setConfigs(data);
    } catch {
      const cached = localStorage.getItem('erp_assessment_configs');
      if (cached) setConfigs(JSON.parse(cached));
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
    const loadMasters = async () => {
      try {
        const [staffRes, subjRes, yearRes] = await Promise.allSettled([
          api.get('/masters/staff_master'),
          api.get('/masters/subject'),
          api.get('/masters/acad_year')
        ]);
        if (staffRes.status === 'fulfilled') {
          setStaffList(staffRes.value.data.map(r => ({ id: r.id, ...r.data })));
        }
        if (subjRes.status === 'fulfilled') {
          setSubjectList(subjRes.value.data.map(r => ({ id: r.id, ...r.data })));
        }
        if (yearRes.status === 'fulfilled') {
          setAcademicYears(yearRes.value.data.map(r => r.data?.year || r.data?.name).filter(Boolean));
        }
      } catch { /* ignore */ }
    };
    loadMasters();
  }, [fetchConfigs]);

  const getSemNum = (semStr) => {
    if (!semStr) return '';
    const match = semStr.match(/\d+/);
    return match ? match[0] : '';
  };

  const getDeptFromCourse = (courseName) => {
    if (!courseName) return '';
    const lower = courseName.toLowerCase();
    if (lower.includes('computer science') || lower.includes('bca') || lower.includes('mca') || lower.includes('computer')) {
      return 'Computer Science';
    }
    if (lower.includes('it') || lower.includes('information technology') || lower.includes('tech it')) {
      return 'Information Technology';
    }
    if (lower.includes('electronics') || lower.includes('ece')) {
      return 'Electronics';
    }
    if (lower.includes('mechanical') || lower.includes('mech')) {
      return 'Mechanical';
    }
    if (lower.includes('civil')) {
      return 'Civil';
    }
    if (lower.includes('math') || lower.includes('physics') || lower.includes('chemistry') || lower.includes('science & humanities')) {
      return 'Science & Humanities';
    }
    return '';
  };

  const filteredSubjects = subjectList.filter(s => {
    const semNum = getSemNum(form.semester);
    const dept = getDeptFromCourse(form.course);
    if (!semNum && !dept) return true;
    if (semNum && String(s.sem) !== String(semNum)) return false;
    if (dept && s.dept && s.dept.toLowerCase() !== dept.toLowerCase()) return false;
    return true;
  });

  const handleChange = (field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-fill subject code if subject is selected
      if (field === 'subject_name' && value) {
        const foundSubj = subjectList.find(s => s.name === value || `${s.code} - ${s.name}` === value);
        if (foundSubj) {
          updated.subject_code = foundSubj.code || '';
        }
      }
      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.academic_year || !form.course || !form.semester || !form.subject_name || !form.assessment_type || !form.max_marks) {
      toast.error('Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/assessment/config', {
        ...form,
        max_marks: Number(form.max_marks),
        experiment_count: form.experiment_count ? Number(form.experiment_count) : null
      });
      setConfigs(prev => [data, ...prev]);
      localStorage.setItem('erp_assessment_configs', JSON.stringify([data, ...configs]));
      toast.success('Assessment configuration saved successfully!');
      setForm(emptyForm);
    } catch (err) {
      toast.error('Failed to save: ' + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this configuration?')) return;
    try {
      await api.delete(`/assessment/config/${id}`);
      setConfigs(prev => prev.filter(c => c.id !== id));
      toast.success('Configuration deleted.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const handleReset = () => setForm(emptyForm);

  const isPractical = ['Practical', 'Record Work', 'Viva Voce'].includes(form.assessment_type);

  const filtered = configs.filter(c =>
    !search || [c.course, c.semester, c.subject_name, c.assessment_type, c.academic_year]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const paginated = filtered.slice(0, perPage);

  const exportCSV = () => {
    const headers = ['S.No', 'Academic Year', 'Course', 'Semester', 'Subject Name', 'Subject Code', 'Assessment Type', 'Assessment Date', 'Max Marks', 'Test No', 'Experiment Count'];
    const rows = configs.map((c, i) => [
      i + 1, c.academic_year, c.course, c.semester, c.subject_name, c.subject_code,
      c.assessment_type, c.assessment_date || '-', c.max_marks, c.assessment_number, c.experiment_count || '-'
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'assessment_configs.csv'; a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white rounded-3xl p-8 shadow-2xl overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-64 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/30">
            College ERP · Academic
          </span>
          <h1 className="text-3xl font-black mt-2">Assessment Configuration</h1>
          <p className="text-indigo-200 text-xs font-semibold mt-1">
            Configure assessments for courses, semesters, and subjects — Internal Tests, Assignments, Practicals &amp; more
          </p>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-650 rounded-xl flex items-center justify-center">
            <Settings size={16} className="text-white" />
          </div>
          <div>
            <p className="font-black text-sm text-blue-900">Assessment Configuration Panel</p>
            <p className="text-xs text-blue-600 font-medium">Configure assessment settings including subjects, dates, and marks for academic tracking.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Academic Year */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                <Calendar size={11} className="text-indigo-500" /> Academic Year <span className="text-red-500">*</span>
              </label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-semibold text-slate-700"
                value={form.academic_year} onChange={e => handleChange('academic_year', e.target.value)}>
                <option value="">Select Year</option>
                {(academicYears.length > 0 ? academicYears : ['2024-2025', '2025-2026', '2026-2027']).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Course */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                <GraduationCap size={11} className="text-indigo-500" /> Course / Programme <span className="text-red-500">*</span>
              </label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-semibold text-slate-700"
                value={form.course} onChange={e => handleChange('course', e.target.value)}>
                <option value="">Select Course</option>
                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Semester */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                <BookOpen size={11} className="text-indigo-500" /> Semester / Year / Section <span className="text-red-500">*</span>
              </label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-semibold text-slate-700"
                value={form.semester} onChange={e => handleChange('semester', e.target.value)}>
                <option value="">Select Semester</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Assessment Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                <FileText size={11} className="text-indigo-500" /> Internal Assessment Type <span className="text-red-500">*</span>
              </label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-semibold text-slate-700"
                value={form.assessment_type} onChange={e => handleChange('assessment_type', e.target.value)}>
                <option value="">Select Type</option>
                {ASSESSMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Subject Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                <BookOpen size={11} className="text-indigo-500" /> Subject Name <span className="text-red-500">*</span>
              </label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-semibold text-slate-700"
                value={form.subject_name} onChange={e => handleChange('subject_name', e.target.value)}>
                <option value="">Select Subject</option>
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map(s => (
                    <option key={s.id} value={s.name}>{s.code ? `${s.code} - ${s.name}` : s.name}</option>
                  ))
                ) : (
                  ['Software Engineering', 'Database Systems', 'Computer Networks', 'Theory of Computation', 'Web Technology', 'Data Structures'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))
                )}
              </select>
            </div>

            {/* Subject Code */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                <Hash size={11} className="text-indigo-500" /> Subject Code
              </label>
              <input
                type="text"
                placeholder="Subject Code"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-semibold text-slate-700"
                value={form.subject_code}
                onChange={e => handleChange('subject_code', e.target.value)}
              />
            </div>

            {/* Assessment Date */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                <Calendar size={11} className="text-indigo-500" /> Assessment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-semibold text-slate-700"
                value={form.assessment_date}
                onChange={e => handleChange('assessment_date', e.target.value)}
              />
            </div>

            {/* Max Marks */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                <Hash size={11} className="text-indigo-500" /> Maximum Marks <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter Max Marks"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-bold font-mono"
                value={form.max_marks}
                onChange={e => handleChange('max_marks', e.target.value)}
              />
            </div>

            {/* Assessment Number (Read-only) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Assessment Number</label>
              <input
                readOnly
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-100 text-slate-500 font-bold"
                value="Auto Generated"
              />
            </div>

            {/* Experiment Count (for practicals) */}
            {isPractical && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Experiment Count</label>
                <input
                  type="number"
                  placeholder="No. of experiments"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  value={form.experiment_count}
                  onChange={e => handleChange('experiment_count', e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-colors disabled:opacity-60">
              <Save size={16} /> {loading ? 'Saving...' : 'Save Configuration'}
            </button>
            <button type="button" onClick={handleReset}
              className="px-6 py-3 border-2 border-orange-400 text-orange-600 font-bold rounded-2xl text-sm flex items-center gap-2 hover:bg-orange-50 transition-colors">
              <RefreshCw size={16} /> Reset Form
            </button>
          </div>
        </form>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="font-black text-slate-800 text-base">Assessment Records</h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button onClick={exportCSV}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors">
              <Download size={14} /> CSV
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-3 border-b border-slate-50 bg-slate-50/50">
          <span className="text-xs text-slate-500">Show</span>
          <select className="border border-slate-200 rounded-lg px-2 py-1 text-xs" value={perPage} onChange={e => setPerPage(Number(e.target.value))}>
            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="text-xs text-slate-500">Entries Per Page</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="px-4 py-3.5">S.NO</th>
                <th className="px-4 py-3.5">Academic Year</th>
                <th className="px-4 py-3.5">Course</th>
                <th className="px-4 py-3.5">Semester</th>
                <th className="px-4 py-3.5">Subject Name</th>
                <th className="px-4 py-3.5">Subject Code</th>
                <th className="px-4 py-3.5">Assessment Type</th>
                <th className="px-4 py-3.5">Assessment Date</th>
                <th className="px-4 py-3.5">Max Marks</th>
                <th className="px-4 py-3.5">Test No</th>
                <th className="px-4 py-3.5">Exp Count</th>
                <th className="px-4 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={12} className="px-4 py-10 text-center text-slate-400 text-xs font-semibold">No configurations found. Add one above.</td></tr>
              ) : paginated.map((c, i) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-bold text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-xs text-slate-700">{c.academic_year}</td>
                  <td className="px-4 py-3 font-semibold text-xs text-indigo-700">{c.course}</td>
                  <td className="px-4 py-3 text-xs text-slate-700">{c.semester}</td>
                  <td className="px-4 py-3 font-bold text-xs text-slate-800">{c.subject_name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{c.subject_code || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100">{c.assessment_type}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{c.assessment_date || '-'}</td>
                  <td className="px-4 py-3 font-black text-xs text-emerald-700">{c.max_marks}</td>
                  <td className="px-4 py-3 font-bold text-xs text-slate-700">{c.assessment_number}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{c.experiment_count || '-'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssessmentConfigurationPage;
