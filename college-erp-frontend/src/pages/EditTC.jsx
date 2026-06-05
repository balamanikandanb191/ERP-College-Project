import React, { useState, useEffect } from 'react';
import { Search, Save, Edit2, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';
import api from '../services/api';

const SEED_TCS = [
  { id: 'tc-201', registerNumber: 'REG20261102', studentName: 'Vikas Krishnan', dateOfLeaving: '2026-05-15', conduct: 'Excellent', feeStatus: 'Cleared', reason: 'Course Completed' },
  { id: 'tc-202', registerNumber: 'REG20268841', studentName: 'Shreya Roy', dateOfLeaving: '2026-05-18', conduct: 'Good', feeStatus: 'Cleared', reason: 'Higher Studies' }
];

const EditTC = () => {
  const { records: tcs, addRecord, updateRecord } = useMasterData('tc_details', SEED_TCS);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ registerNumber: '', studentName: '', dateOfLeaving: '', conduct: 'Excellent', feeStatus: 'Cleared', reason: 'Course Completed' });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await api.get('/students');
        if (data) {
          setStudents(data);
        }
      } catch (err) {
        console.error('Failed to fetch students:', err);
      }
    };
    fetchStudents();
  }, []);

  const handleEdit = (tc) => {
    setEditing(tc);
    setForm({ ...tc });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.registerNumber || !form.studentName || !form.dateOfLeaving) {
      toast.error('Required fields: Reg No, Student Name, Leaving Date.');
      return;
    }
    if (editing) {
      const res = await updateRecord(editing.id, form);
      if (res.success) toast.success('TC details saved!');
    } else {
      const res = await addRecord(form);
      if (res.success) toast.success('TC details saved!');
    }
    setEditing(null);
    setForm({ registerNumber: '', studentName: '', dateOfLeaving: '', conduct: 'Excellent', feeStatus: 'Cleared', reason: 'Course Completed' });
  };

  const filtered = (tcs || []).filter(t => (t.studentName || '').toLowerCase().includes(search.toLowerCase()) || (t.registerNumber || '').includes(search));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Certificates Module</span>
          <h1 className="text-3xl font-black mt-2">Edit Transfer Certificates (TC)</h1>
          <p className="text-indigo-200 text-xs font-semibold mt-1">Specify conduct grading, release reasons, and clearance flags for exiting students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Form */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-fit space-y-4">
          <h3 className="font-black text-slate-800 text-lg">{editing ? 'Edit TC Entry' : 'Prepare TC Entry'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Select Student (Register No)</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white font-semibold text-slate-700"
                value={form.registerNumber}
                onChange={e => {
                  const rNum = e.target.value;
                  const student = students.find(s => s.registerNumber === rNum);
                  if (student) {
                    setForm({
                      ...form,
                      registerNumber: student.registerNumber,
                      studentName: student.fullName
                    });
                    toast.success(`Autofilled details for ${student.fullName}`);
                  } else {
                    setForm({
                      ...form,
                      registerNumber: rNum
                    });
                  }
                }}
              >
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.registerNumber}>
                    {s.registerNumber} - {s.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Register / Roll Number *</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                placeholder="REG20261102" value={form.registerNumber} onChange={e => setForm({ ...form, registerNumber: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Student Full Name *</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                placeholder="Student Name" value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Date of Leaving *</label>
                <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  value={form.dateOfLeaving} onChange={e => setForm({ ...form, dateOfLeaving: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Conduct Character</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  value={form.conduct} onChange={e => setForm({ ...form, conduct: e.target.value })}><option>Excellent</option><option>Good</option><option>Satisfactory</option></select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Ledger Fee Clearance</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  value={form.feeStatus} onChange={e => setForm({ ...form, feeStatus: e.target.value })}><option>Cleared</option><option>Dues Pending</option></select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Reason for Leaving</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  placeholder="Course Completed" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
              </div>
            </div>
            <button type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md">
              <Save size={15} /> Save TC Record
            </button>
          </form>
        </div>

        {/* TC Logs List */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-3 text-slate-400" size={15} />
              <input className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search TC entries..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-5 py-4">Register Number</th>
                  <th className="px-5 py-4">Student Name</th>
                  <th className="px-5 py-4">Leaving Date</th>
                  <th className="px-5 py-4">Conduct</th>
                  <th className="px-5 py-4 text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono font-black text-indigo-700 text-xs">{t.registerNumber}</td>
                    <td className="px-5 py-4 font-black text-slate-800">{t.studentName}</td>
                    <td className="px-5 py-4 text-xs font-mono font-bold text-slate-400">{t.dateOfLeaving}</td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">{t.conduct}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => handleEdit(t)} className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg">
                        <Edit2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTC;
