import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Plus, Pencil, Trash2, Save, X, GraduationCap, ChevronDown, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';
import api from '../services/api';
import { confirmDelete } from '../utils/confirmToast';

const SEMESTERS = ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'];

const EMPTY_FORM = {
  course: '',
  yearSemester: '',
  subjectName: '',
  subjectCode: '',
  totalHours: '',
};

// ─── Searchable Subject Dropdown ──────────────────────────────────────────────
const SubjectSearchDropdown = ({ subjectMaster, value, onSelect }) => {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Sync when value changes externally (e.g. edit mode)
  useEffect(() => { setQuery(value || ''); }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = subjectMaster.filter(s =>
    (s.name || '').toLowerCase().includes(query.toLowerCase()) ||
    (s.code || '').toLowerCase().includes(query.toLowerCase())
  ).slice(0, 12);

  const handleSelect = (sub) => {
    setQuery(sub.name);
    setOpen(false);
    onSelect(sub);
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search subject name..."
          className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-400 font-semibold text-center">
              {subjectMaster.length === 0
                ? 'No subjects in master. Add via Standard → Subject'
                : 'No match found'}
            </div>
          ) : (
            filtered.map((sub, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(sub)}
                className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors border-b border-slate-50 last:border-0"
              >
                <div className="font-bold text-slate-800 text-sm">{sub.name}</div>
                <div className="text-[10px] text-indigo-500 font-mono font-black">{sub.code}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
// ──────────────────────────────────────────────────────────────────────────────

const AttendanceConfiguration = () => {
  const { records, addRecord, updateRecord, deleteRecord, loading } = useMasterData('attendance_subject_config');
  const [courses, setCourses] = useState([]);
  const [subjectMaster, setSubjectMaster] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load courses from class master
    api.get('/masters/class_master')
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setCourses(data.map(r => r.data?.name || r.name).filter(Boolean));
        }
      })
      .catch(() => {
        setCourses(['B.Pharm', 'M.Pharm', 'B.Sc', 'M.Sc', 'B.Com', 'M.Com', 'BA', 'MA', 'BCA', 'MCA']);
      });

    // Load subject master from /masters/subject
    api.get('/masters/subject')
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          setSubjectMaster(
            data.map(r => ({
              name: r.data?.name || r.data?.subjectName || r.name || '',
              code: r.data?.code || r.data?.subjectCode || r.code || '',
            })).filter(s => s.name)
          );
        }
      })
      .catch(() => setSubjectMaster([]));
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (rec) => {
    setForm({
      course: rec.course || '',
      yearSemester: rec.yearSemester || '',
      subjectName: rec.subjectName || '',
      subjectCode: rec.subjectCode || '',
      totalHours: rec.totalHours || '',
    });
    setEditId(rec.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    confirmDelete(async () => {
      const res = await deleteRecord(id);
      if (res.success) toast.success('Subject configuration deleted');
    }, 'Delete this subject configuration?');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.course || !form.yearSemester || !form.subjectName || !form.subjectCode || !form.totalHours) {
      toast.error('All fields are required');
      return;
    }
    setSaving(true);
    try {
      let res;
      if (editId) {
        res = await updateRecord(editId, form);
        if (res.success) toast.success('Subject configuration updated!');
      } else {
        res = await addRecord(form);
        if (res.success) toast.success('Subject configuration added!');
      }
      resetForm();
    } catch {
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
              Attendance Setup
            </span>
            <h1 className="text-3xl font-black mt-3">Attendance Configuration</h1>
            <p className="text-indigo-200 text-sm font-medium mt-1">
              Configure subjects with total teaching hours per course and semester
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(v => !v); }}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-2xl transition-all backdrop-blur-sm"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'Add Subject'}
          </button>
        </div>
      </div>

      {/* Form Panel */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <GraduationCap size={20} className="text-indigo-600" />
            {editId ? 'Edit Subject Configuration' : 'Add New Subject Configuration'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Course / Programme */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-600 uppercase tracking-wide">
                Course / Programme <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.course}
                  onChange={e => setForm({ ...form, course: e.target.value })}
                  className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                  required
                >
                  <option value="">-- Select Course --</option>
                  {courses.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="__custom">+ Other</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
              </div>
              {form.course === '__custom' && (
                <input
                  className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter course name"
                  onChange={e => setForm({ ...form, course: e.target.value })}
                />
              )}
            </div>

            {/* Year / Semester */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-600 uppercase tracking-wide">
                Year / Semester <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.yearSemester}
                  onChange={e => setForm({ ...form, yearSemester: e.target.value })}
                  className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                  required
                >
                  <option value="">-- Select Semester --</option>
                  {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Subject Name — searchable dropdown from subject master */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-600 uppercase tracking-wide flex items-center gap-1">
                Subject Name <span className="text-red-500">*</span>
                {subjectMaster.length > 0 && (
                  <span className="text-[9px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-black normal-case">
                    {subjectMaster.length} in master
                  </span>
                )}
              </label>
              <SubjectSearchDropdown
                subjectMaster={subjectMaster}
                value={form.subjectName}
                onSelect={(sub) =>
                  setForm(f => ({ ...f, subjectName: sub.name, subjectCode: sub.code }))
                }
              />
            </div>

            {/* Subject Code — auto-filled, still editable */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-600 uppercase tracking-wide flex items-center gap-1">
                Subject Code <span className="text-red-500">*</span>
                {form.subjectCode && (
                  <span className="text-[9px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-black normal-case">
                    Auto-filled
                  </span>
                )}
              </label>
              <input
                type="text"
                value={form.subjectCode}
                onChange={e => setForm({ ...form, subjectCode: e.target.value })}
                placeholder="e.g., BP101T"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono ${
                  form.subjectCode
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-slate-50'
                }`}
                required
              />
            </div>


            {/* Total Hours */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-600 uppercase tracking-wide">
                Total Teaching Hours <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={form.totalHours}
                onChange={e => setForm({ ...form, totalHours: e.target.value })}
                placeholder="e.g., 66"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex items-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors disabled:opacity-60"
              >
                <Save size={15} />
                {saving ? 'Saving…' : editId ? 'Update' : 'Add Subject'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Configured Subjects Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <BookOpen size={17} className="text-indigo-600" />
              Configured Subjects List
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {records.length} subject{records.length !== 1 ? 's' : ''} configured
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">S.No</th>
                <th className="px-6 py-4">Course / Programme</th>
                <th className="px-6 py-4">Year / Semester</th>
                <th className="px-6 py-4">Subject Name</th>
                <th className="px-6 py-4">Subject Code</th>
                <th className="px-6 py-4">Total Hours</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-400 text-sm">
                    Loading configurations…
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-14 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen size={32} className="text-slate-200" />
                      <p className="text-slate-400 font-semibold text-sm">No subjects configured yet</p>
                      <p className="text-slate-300 text-xs">Click "Add Subject" to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((rec, idx) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-lg border border-indigo-100">
                        {rec.course}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-semibold text-xs">{rec.yearSemester}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{rec.subjectName}</td>
                    <td className="px-6 py-4 font-mono text-indigo-600 font-black text-xs">{rec.subjectCode}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-black text-slate-700">{rec.totalHours}</span>
                      <span className="text-slate-400 text-xs ml-1">hrs</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(rec)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceConfiguration;
