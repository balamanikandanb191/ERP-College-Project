import React, { useState } from 'react';
import { Search, Plus, Trash2, ArrowRight, Star, AlertCircle, Phone, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';
import { confirmDelete } from '../utils/confirmToast';

const STAGES = ['New Lead', 'Contacted', 'Applied', 'Admitted'];
const STAGE_COLORS = {
  'New Lead': 'border-t-indigo-500 bg-indigo-50/50',
  'Contacted': 'border-t-amber-500 bg-amber-50/50',
  'Applied': 'border-t-blue-500 bg-blue-50/50',
  'Admitted': 'border-t-emerald-500 bg-emerald-50/50'
};

const SEED_LEADS = [
  { id: 'lead-1', name: 'Arun Prasath', phone: '9876543210', course: 'B.E. Computer Science', stage: 'New Lead', score: '88.5%', priority: 'High' },
  { id: 'lead-2', name: 'Kavitha Ram', phone: '9123456789', course: 'B.Tech Information Tech', stage: 'Contacted', score: '92.0%', priority: 'Medium' },
  { id: 'lead-3', name: 'Deepak Raj', phone: '8123456789', course: 'B.E. Electronics', stage: 'Applied', score: '76.4%', priority: 'Low' },
  { id: 'lead-4', name: 'Sanjay Kumar', phone: '9444123456', course: 'B.E. Mechanical', stage: 'New Lead', score: '82.1%', priority: 'Medium' },
  { id: 'lead-5', name: 'Meera Nair', phone: '9555123456', course: 'B.E. Computer Science', stage: 'Admitted', score: '95.0%', priority: 'High' }
];

const LeadManagement = () => {
  const { records: leads, updateRecord, deleteRecord } = useMasterData('leads_kanban', SEED_LEADS);
  const [search, setSearch] = useState('');

  const moveStage = async (id, newStage) => {
    const l = leads.find(lead => lead.id === id);
    if (l) {
      const res = await updateRecord(id, { ...l, stage: newStage });
      if (res.success) toast.success(`Lead moved to ${newStage}`);
    }
  };

  const deleteLead = async id => {
    confirmDelete(async () => {
      const res = await deleteRecord(id);
      if (res.success) toast.success('Lead deleted');
    }, 'Are you sure you want to delete this lead?');
  };

  const getPriorityColor = p => {
    if (p === 'High') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (p === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  const filtered = leads.filter(l => (l.name || '').toLowerCase().includes(search.toLowerCase()) || (l.course || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Admissions & Enquiry</span>
            <h1 className="text-3xl font-black mt-2">Lead Pipeline Management</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Review, qualify, and promote applicant leads through the admissions pipeline stages</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 text-indigo-300" size={15} />
            <input className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-indigo-300"
              placeholder="Filter leads by name..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {STAGES.map(stage => {
          const stageLeads = filtered.filter(l => l.stage === stage);
          return (
            <div key={stage} className={`rounded-3xl border border-slate-100 shadow-sm p-4 flex flex-col h-[600px] border-t-4 ${STAGE_COLORS[stage]}`}>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/50">
                <span className="font-black text-slate-800 text-sm tracking-wide">{stage}</span>
                <span className="bg-white/80 border border-slate-200 shadow-sm text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">{stageLeads.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {stageLeads.map(l => (
                  <div key={l.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${getPriorityColor(l.priority)}`}>
                        {l.priority} Priority
                      </span>
                      <button onClick={() => deleteLead(l.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all">
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h4 className="font-black text-slate-800 text-sm mt-2">{l.name}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{l.course}</p>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 text-[11px]">
                      <span className="font-mono text-slate-400 font-bold">{l.phone}</span>
                      <span className="font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-mono">{l.score}</span>
                    </div>

                    <div className="mt-3 flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {stage !== 'Admitted' && (
                        <button onClick={() => moveStage(l.id, STAGES[STAGES.indexOf(stage) + 1])}
                          className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black rounded-lg hover:bg-indigo-100 flex items-center gap-1 transition-colors">
                          Next Stage <ArrowRight size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="py-20 text-center text-slate-400 font-semibold text-xs">No leads in this stage</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadManagement;
