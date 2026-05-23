import React, { useState } from 'react';
import { Search, Phone, MessageSquare, AlertCircle, Plus, Flame, Clock, Check, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';

const SEED_CALL_LOGS = [
  { id: 'log-1', studentName: 'Arun Prasath', phone: '9876543210', date: '23 May 2026', callStatus: 'Call Back', notes: 'Asked to call back on Monday evening after 5 PM.' },
  { id: 'log-2', studentName: 'Kavitha Ram', phone: '9123456789', date: '22 May 2026', callStatus: 'Hot Lead', notes: 'Extremely interested. Parents want to visit campus tomorrow.' },
  { id: 'log-3', studentName: 'Deepak Raj', phone: '8123456789', date: '20 May 2026', callStatus: 'Interested', notes: 'Inquired about hostel availability and fee structure.' }
];

const CallerDetails = () => {
  const { records: logs, addRecord } = useMasterData('caller_logs', SEED_CALL_LOGS);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ studentName: '', phone: '', callStatus: 'Call Back', notes: '' });

  const submitLog = async e => {
    e.preventDefault();
    if (!form.studentName || !form.phone || !form.notes) { toast.error('All fields are required to log call details'); return; }
    const newLog = { ...form, date: '23 May 2026' };
    const res = await addRecord(newLog);
    if (res.success) {
      toast.success('Call log details saved!');
      setShowForm(false);
      setForm({ studentName: '', phone: '', callStatus: 'Call Back', notes: '' });
    }
  };

  const filtered = logs.filter(l => (l.studentName || '').toLowerCase().includes(search.toLowerCase()) || (l.phone || '').includes(search));

  const STATUS_COLORS = {
    'Hot Lead': 'bg-rose-50 text-rose-700 border-rose-200',
    'Call Back': 'bg-amber-50 text-amber-700 border-amber-200',
    'Interested': 'bg-blue-50 text-blue-700 border-blue-200',
    'Not Interested': 'bg-slate-50 text-slate-500 border-slate-200'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Admissions & Enquiry</span>
            <h1 className="text-3xl font-black mt-2">Caller Details & Logs</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Review active counselor dials, set follow-up schedules and log responses</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg">
            <Phone size={18} /> Log Call Activity
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-800 text-lg">Log Call Details</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">Close</button>
          </div>
          <form onSubmit={submitLog} className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Student Name *</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Student Name" value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Phone Number *</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Call Response Status</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                value={form.callStatus} onChange={e => setForm({ ...form, callStatus: e.target.value })}>
                <option>Call Back</option>
                <option>Hot Lead</option>
                <option>Interested</option>
                <option>Not Interested</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Dialing Notes / Call Summary *</label>
              <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                placeholder="Summarize the applicant's response..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm">Save Log</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 text-slate-400" size={15} />
            <input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search call logs..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {filtered.map(l => (
            <div key={l.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-slate-800 text-base">{l.studentName}</h3>
                  <span className="text-xs text-slate-400 font-semibold font-mono">{l.phone}</span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[l.callStatus] || 'bg-slate-100 border-slate-200'}`}>
                    {l.callStatus}
                  </span>
                </div>
                <p className="text-sm text-slate-600 font-semibold leading-relaxed">{l.notes}</p>
                <div className="text-[11px] text-slate-400 font-bold font-mono">Logged on {l.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 flex items-center gap-1">
                  <MessageSquare size={13} /> SMS / WA
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-1">
                  <Phone size={13} /> Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallerDetails;
