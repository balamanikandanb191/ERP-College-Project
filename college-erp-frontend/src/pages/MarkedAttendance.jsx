import React, { useState } from 'react';
import { Search, Calendar, Edit2, CheckCircle2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';

const SEED_ATTENDANCE = [
  { id: 'att-1', registerNumber: 'REG20261102', studentName: 'Vikas Krishnan', department: 'Computer Science', conducted: 120, attended: 108, percentage: 90, status: 'Regular' },
  { id: 'att-2', registerNumber: 'REG20268841', studentName: 'Shreya Roy', department: 'Information Technology', conducted: 120, attended: 98, percentage: 81.6, status: 'Regular' },
  { id: 'att-3', registerNumber: 'REG20265201', studentName: 'Ravi Kumar', department: 'Electronics', conducted: 120, attended: 84, percentage: 70, status: 'Shortage Alert' },
  { id: 'att-4', registerNumber: 'REG20269931', studentName: 'Preethi S', department: 'Computer Science', conducted: 120, attended: 114, percentage: 95, status: 'Regular' }
];

const MarkedAttendance = () => {
  const { records: attendance, updateRecord } = useMasterData('marked_attendance', SEED_ATTENDANCE);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ attended: 0 });

  const handleEdit = r => {
    setEditing(r);
    setForm({ attended: r.attended });
  };

  const handleSave = async e => {
    e.preventDefault();
    if (form.attended > editing.conducted) {
      toast.error('Attended hours cannot exceed conducted hours');
      return;
    }
    const pct = Number(((form.attended / editing.conducted) * 100).toFixed(1));
    const status = pct < 75 ? 'Shortage Alert' : 'Regular';
    
    const entry = { ...editing, attended: Number(form.attended), percentage: pct, status };
    const res = await updateRecord(editing.id, entry);
    if (res.success) {
      toast.success('Attendance logs updated!');
      setEditing(null);
    }
  };

  const filtered = (attendance || []).filter(x => (x.studentName || '').toLowerCase().includes(search.toLowerCase()) || (x.registerNumber || '').includes(search));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Attendance Logs</span>
          <h1 className="text-3xl font-black mt-2">Marked Attendance Ledger</h1>
          <p className="text-indigo-200 text-xs font-semibold mt-1">Review cumulative attendance percentages, flag shortages, and perform administrative log overrides</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Override panel */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-fit space-y-4">
          <h3 className="font-black text-slate-800 text-base">Administrative Override</h3>
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 space-y-1">
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Selected Student</div>
                <div className="font-black text-indigo-900">{editing.studentName}</div>
                <div className="text-xs font-mono text-indigo-700 font-bold">{editing.registerNumber}</div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Hours Conducted</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-slate-50 font-bold"
                  value={editing.conducted} disabled />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Hours Attended</label>
                <input type="number" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  value={form.attended} onChange={e => setForm({ attended: Number(e.target.value) })} />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditing(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md">Apply Override</button>
              </div>
            </form>
          ) : (
            <p className="text-xs text-slate-400 font-semibold py-8 text-center">Select edit icon on a row to override student attendance totals.</p>
          )}
        </div>

        {/* Ledger */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-5 border-b border-slate-100 flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-3 text-slate-400" size={15} />
              <input className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search ledger..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-5 py-4">Roll Number</th>
                  <th className="px-5 py-4">Student Name</th>
                  <th className="px-5 py-4">Conducted</th>
                  <th className="px-5 py-4">Attended</th>
                  <th className="px-5 py-4">Percentage</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(x => (
                  <tr key={x.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono font-black text-indigo-700 text-xs">{x.registerNumber}</td>
                    <td className="px-5 py-4 font-black text-slate-800">{x.studentName}</td>
                    <td className="px-5 py-4 font-mono font-bold text-slate-500">{x.conducted} hrs</td>
                    <td className="px-5 py-4 font-mono font-black text-slate-700">{x.attended} hrs</td>
                    <td className="px-5 py-4 font-mono font-black text-slate-900">{x.percentage}%</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 w-fit ${x.status === 'Shortage Alert' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        {x.status === 'Shortage Alert' ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                        {x.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => handleEdit(x)} className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg">
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

export default MarkedAttendance;
