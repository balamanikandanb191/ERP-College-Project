import React, { useState } from 'react';
import { Search, CheckSquare, Square, UserPlus, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';

const COUNSELORS = [
  { id: 'c-1', name: 'Priya Sharma', activeLeads: 24, maxCapacity: 50 },
  { id: 'c-2', name: 'Rohan Verma', activeLeads: 18, maxCapacity: 50 },
  { id: 'c-3', name: 'Neha Gupta', activeLeads: 31, maxCapacity: 50 },
  { id: 'c-4', name: 'Amit Singh', activeLeads: 12, maxCapacity: 50 }
];

const SEED_LEADS = [
  { id: 'l-101', studentName: 'Arun Prasath', phone: '9876543210', course: 'Computer Science', counselor: 'Unassigned', date: '23 May 2026' },
  { id: 'l-102', studentName: 'Kavitha Ram', phone: '9123456789', course: 'Information Technology', counselor: 'Priya Sharma', date: '22 May 2026' },
  { id: 'l-103', studentName: 'Deepak Raj', phone: '8123456789', course: 'Electronics', counselor: 'Unassigned', date: '20 May 2026' },
  { id: 'l-104', studentName: 'Sanjay Kumar', phone: '9444123456', course: 'Mechanical Engineering', counselor: 'Unassigned', date: '23 May 2026' },
  { id: 'l-105', studentName: 'Meera Nair', phone: '9555123456', course: 'Computer Science', counselor: 'Neha Gupta', date: '21 May 2026' }
];

const AssignCall = () => {
  const { records: leads, updateRecord } = useMasterData('leads_assignment', SEED_LEADS);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(COUNSELORS[0].name);
  const [search, setSearch] = useState('');

  const toggleSelect = id => {
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const unassigned = leads.filter(l => l.counselor === 'Unassigned' && (l.studentName || '').toLowerCase().includes(search.toLowerCase()));
    if (selectedLeads.length === unassigned.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(unassigned.map(l => l.id));
    }
  };

  const handleAssign = async () => {
    if (selectedLeads.length === 0) { toast.error('Please select at least one unassigned lead'); return; }
    const promises = selectedLeads.map(async id => {
      const l = leads.find(lead => lead.id === id);
      if (l) {
        await updateRecord(id, { ...l, counselor: selectedCounselor });
      }
    });
    await Promise.all(promises);
    setSelectedLeads([]);
    toast.success(`Assigned leads to ${selectedCounselor}`);
  };

  const handleDeassign = async id => {
    const l = leads.find(lead => lead.id === id);
    if (l) {
      const res = await updateRecord(id, { ...l, counselor: 'Unassigned' });
      if (res.success) toast.success('Lead de-assigned');
    }
  };

  const filtered = leads.filter(l => (l.studentName || '').toLowerCase().includes(search.toLowerCase()) || (l.counselor || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Admissions & Enquiry</span>
          <h1 className="text-3xl font-black mt-2">Assign Call / Counselor allocation</h1>
          <p className="text-indigo-200 text-xs font-semibold mt-1">Assign unallocated applicant enquiries to active tele-callers and counselors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment panel */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 h-fit">
          <h3 className="font-black text-slate-800 text-lg">Batch Assignment</h3>
          <p className="text-xs text-slate-400 font-semibold">Select leads from the table, select a counselor below, and click assign.</p>
          
          <div className="space-y-3 pt-3">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Select Active Counselor</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedCounselor} onChange={e => setSelectedCounselor(e.target.value)}>
                {COUNSELORS.map(c => <option key={c.id} value={c.name}>{c.name} ({c.activeLeads} Active Leads)</option>)}
              </select>
            </div>
            
            <button onClick={handleAssign}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-500/10 transition-colors">
              <UserPlus size={16} /> Assign {selectedLeads.length} Selected Leads
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-3 text-slate-400" size={15} />
              <input className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={toggleSelectAll} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              Select All Unassigned ({leads.filter(l => l.counselor === 'Unassigned').length})
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-5 py-4 w-12"></th>
                  <th className="px-5 py-4">Lead Name</th>
                  <th className="px-5 py-4">Course Preference</th>
                  <th className="px-5 py-4">Assigned Counselor</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      {l.counselor === 'Unassigned' ? (
                        <button onClick={() => toggleSelect(l.id)} className="text-slate-400 hover:text-indigo-600">
                          {selectedLeads.includes(l.id) ? <CheckSquare size={16} className="text-indigo-600" /> : <Square size={16} />}
                        </button>
                      ) : (
                        <CheckSquare size={16} className="text-slate-200 pointer-events-none" />
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">{l.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{l.phone}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-xs font-semibold">{l.course}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${l.counselor === 'Unassigned' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        {l.counselor}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {l.counselor !== 'Unassigned' && (
                        <button onClick={() => handleDeassign(l.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg text-xs font-bold" title="Remove Assignment">
                          De-assign
                        </button>
                      )}
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

export default AssignCall;
