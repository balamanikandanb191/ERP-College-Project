import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, Clock, MapPin, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { confirmDelete } from '../../utils/confirmToast';

const LABS = ['DBMS Lab', 'Computer Networks Lab', 'Power Electronics Lab', 'Microprocessor Lab', 'Physics Lab', 'Chemistry Lab'];
const DEPTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Science & Humanities'];

const SEED_PRACTICALS = [
  { id: 'p1', date: '2026-06-20', subjectCode: 'CS351', subjectName: 'Data Structures Lab', labName: 'DBMS Lab', batchName: 'Batch A (CS-001 to CS-030)', timeSlot: '09:30 AM - 12:30 PM', internalStaff: 'Dr. John Doe', externalStaff: 'Prof. Alice Smith' },
  { id: 'p2', date: '2026-06-20', subjectCode: 'CS351', subjectName: 'Data Structures Lab', labName: 'DBMS Lab', batchName: 'Batch B (CS-031 to CS-060)', timeSlot: '01:30 PM - 04:30 PM', internalStaff: 'Dr. John Doe', externalStaff: 'Prof. Alice Smith' },
  { id: 'p3', date: '2026-06-21', subjectCode: 'EC251', subjectName: 'Devices & Circuits Lab', labName: 'Microprocessor Lab', batchName: 'Batch A (EC-001 to EC-028)', timeSlot: '09:30 AM - 12:30 PM', internalStaff: 'Mrs. Jane Cooper', externalStaff: 'Dr. Robert Lee' }
];

const PracticalTimetable = () => {
  const [practicals, setPracticals] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    date: '',
    subjectCode: '',
    subjectName: '',
    labName: 'DBMS Lab',
    batchName: '',
    timeSlot: '09:30 AM - 12:30 PM',
    internalStaff: '',
    externalStaff: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const resPracticals = await api.get('/masters/practical_timetable');
      if (resPracticals.data && resPracticals.data.length > 0) {
        setPracticals(resPracticals.data.map(r => ({ ...r.data, id: r.id })));
      } else {
        const promises = SEED_PRACTICALS.map(s => api.post('/masters/practical_timetable', { data: s }));
        const results = await Promise.all(promises);
        setPracticals(results.map(r => ({ ...r.data.data, id: r.data.id })));
      }

      const resSubjects = await api.get('/masters/subject');
      if (resSubjects.data && resSubjects.data.length > 0) {
        setSubjects(resSubjects.data.map(r => ({ ...r.data, id: r.id })).filter(s => s.type !== 'Theory'));
      }
    } catch (err) {
      console.error(err);
      const cachedPr = localStorage.getItem('erp_practical_timetable');
      if (cachedPr) setPracticals(JSON.parse(cachedPr));
      else {
        setPracticals(SEED_PRACTICALS);
        localStorage.setItem('erp_practical_timetable', JSON.stringify(SEED_PRACTICALS));
      }

      const cachedSub = localStorage.getItem('erp_subject');
      if (cachedSub) setSubjects(JSON.parse(cachedSub).filter(s => s.type !== 'Theory'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveToCache = (updatedList) => {
    localStorage.setItem('erp_practical_timetable', JSON.stringify(updatedList));
  };

  const handleSubjectChange = (e) => {
    const code = e.target.value;
    const sub = subjects.find(s => s.code === code);
    setForm(prev => ({
      ...prev,
      subjectCode: code,
      subjectName: sub ? sub.name : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.subjectCode || !form.batchName) {
      toast.error('Date, Subject and Batch name are required');
      return;
    }

    try {
      if (editing) {
        await api.put(`/masters/practical_timetable/${editing.id}`, { data: form });
        const updated = practicals.map(p => p.id === editing.id ? { ...p, ...form } : p);
        setPracticals(updated);
        saveToCache(updated);
        toast.success('Practical exam updated successfully!');
      } else {
        const { data } = await api.post('/masters/practical_timetable', { data: form });
        const updated = [{ id: data.id, ...form }, ...practicals];
        setPracticals(updated);
        saveToCache(updated);
        toast.success('Practical exam scheduled successfully!');
      }
      setViewMode('list');
      setEditing(null);
    } catch (err) {
      console.error(err);
      const mockId = editing ? editing.id : `prac-${Date.now()}`;
      const mockRecord = { id: mockId, ...form };
      let updated;
      if (editing) {
        updated = practicals.map(p => p.id === editing.id ? mockRecord : p);
      } else {
        updated = [mockRecord, ...practicals];
      }
      setPracticals(updated);
      saveToCache(updated);
      toast.success(editing ? 'Updated locally' : 'Scheduled locally');
      setViewMode('list');
      setEditing(null);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({ ...item });
    setViewMode('form');
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        if (!id.startsWith('prac-') && id.length > 5) {
          await api.delete(`/masters/practical_timetable/${id}`);
        }
        const updated = practicals.filter(p => p.id !== id);
        setPracticals(updated);
        saveToCache(updated);
        toast.success('Practical schedule deleted.');
      } catch (err) {
        const updated = practicals.filter(p => p.id !== id);
        setPracticals(updated);
        saveToCache(updated);
        toast.success('Deleted locally.');
      }
    }, 'Are you sure you want to delete this practical exam schedule?');
  };

  const filteredPracticals = practicals.filter(p =>
    p.subjectName.toLowerCase().includes(search.toLowerCase()) ||
    p.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
    p.batchName.toLowerCase().includes(search.toLowerCase())
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
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Practical/Model</span>
                <h1 className="text-3xl font-black mt-2">Practical Exam Time Table</h1>
                <p className="text-indigo-200 text-xs font-semibold mt-1">Schedule laboratory examinations, laboratory venues, examiner panels and batches</p>
              </div>
              <button
                onClick={() => {
                  setEditing(null);
                  setForm({
                    date: '',
                    subjectCode: '',
                    subjectName: '',
                    labName: 'DBMS Lab',
                    batchName: '',
                    timeSlot: '09:30 AM - 12:30 PM',
                    internalStaff: '',
                    externalStaff: ''
                  });
                  setViewMode('form');
                }}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus size={18} /> Schedule Lab Exam
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                placeholder="Search Subject or Batch Name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <span className="text-xs font-bold text-slate-400">{filteredPracticals.length} Schedules active</span>
          </div>

          {/* Table List */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Exam Date</th>
                    <th className="px-6 py-4">Lab Location</th>
                    <th className="px-6 py-4">Subject details</th>
                    <th className="px-6 py-4">Batch details</th>
                    <th className="px-6 py-4">Examiner Panel</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPracticals.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        <span className="inline-flex items-center gap-1 text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          <Calendar size={12} /> {p.date}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-bold">
                          <MapPin size={12} className="text-slate-400" /> {p.labName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{p.subjectName}</span>
                          <span className="text-[10px] font-black font-mono text-indigo-500">{p.subjectCode}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{p.batchName}</span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-slate-400 mt-0.5">
                            <Clock size={10} /> {p.timeSlot}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                        <div className="flex flex-col gap-0.5">
                          <span className="block text-slate-800"><span className="text-[9px] font-black text-slate-400 mr-1 uppercase">INT:</span> {p.internalStaff || 'TBA'}</span>
                          <span className="block text-slate-600"><span className="text-[9px] font-black text-slate-400 mr-1 uppercase">EXT:</span> {p.externalStaff || 'TBA'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPracticals.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400 font-bold">No practical timetables scheduled</td>
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
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{editing ? 'Edit Practical Exam' : 'Schedule Practical Exam'}</h1>
              <p className="text-slate-500 text-xs font-semibold mt-1">Configure lab room, batch intervals and internal/external evaluation panels</p>
            </div>
            <button
              onClick={() => { setViewMode('list'); setEditing(null); }}
              className="px-4 py-2 border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              Back to List
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Exam Date *</label>
                  <input
                    type="date"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Lab Venue Room</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold cursor-pointer"
                    value={form.labName}
                    onChange={e => setForm({ ...form, labName: e.target.value })}
                  >
                    {LABS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Select Practical Subject</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold cursor-pointer"
                    value={form.subjectCode}
                    onChange={handleSubjectChange}
                  >
                    <option value="">-- Choose Subject --</option>
                    {subjects.map((s, idx) => (
                      <option key={s.id || `${s.code}-${idx}`} value={s.code}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Batch Name (e.g. Batch A)</label>
                  <input
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                    placeholder="Batch A (CS-001 to CS-030)"
                    value={form.batchName}
                    onChange={e => setForm({ ...form, batchName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-2">Session Timings Slot</label>
                  <input
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                    placeholder="09:30 AM - 12:30 PM"
                    value={form.timeSlot}
                    onChange={e => setForm({ ...form, timeSlot: e.target.value })}
                  />
                </div>
                <div className="border border-dashed border-slate-200 rounded-2xl p-4 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-2">Evaluators panel configuration</span>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase block mb-2">Internal Staff Examiner</label>
                    <input
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                      placeholder="Dr. John Doe"
                      value={form.internalStaff}
                      onChange={e => setForm({ ...form, internalStaff: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase block mb-2">External Staff Examiner</label>
                    <input
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                      placeholder="Prof. Alice Smith"
                      value={form.externalStaff}
                      onChange={e => setForm({ ...form, externalStaff: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setViewMode('list'); setEditing(null); }}
                  className="px-6 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/20 transition-all"
                >
                  {editing ? 'Update Schedule' : 'Schedule Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticalTimetable;
