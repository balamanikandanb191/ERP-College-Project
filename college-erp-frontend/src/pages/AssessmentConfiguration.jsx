import React, { useState, useEffect } from 'react';
import { Settings, Save, Percent, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';

const SEED_CONFIG = [
  { id: 'assess-1', internalOne: 30, internalTwo: 30, assignments: 20, seminar: 20 }
];

const AssessmentConfiguration = () => {
  const { records, addRecord, updateRecord } = useMasterData('assessment_configuration', SEED_CONFIG);
  const [internalOne, setInternalOne] = useState(30);
  const [internalTwo, setInternalTwo] = useState(30);
  const [assignments, setAssignments] = useState(20);
  const [seminar, setSeminar] = useState(20);

  const total = internalOne + internalTwo + assignments + seminar;

  useEffect(() => {
    if (records && records[0]) {
      setInternalOne(records[0].internalOne ?? 30);
      setInternalTwo(records[0].internalTwo ?? 30);
      setAssignments(records[0].assignments ?? 20);
      setSeminar(records[0].seminar ?? 20);
    }
  }, [records]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (total !== 100) {
      toast.error('Total assessment weights must equal 100%');
      return;
    }
    const formFields = { internalOne, internalTwo, assignments, seminar };
    let res;
    if (records && records[0]) {
      res = await updateRecord(records[0].id, formFields);
    } else {
      res = await addRecord(formFields);
    }
    if (res.success) {
      toast.success('Assessment configuration saved successfully!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Assessment Setup</span>
          <h1 className="text-3xl font-black mt-2">Assessment Configuration</h1>
          <p className="text-indigo-200 text-xs font-semibold mt-1">Configure internal assessment grade splits, exam weights, and assignment scales</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Internal Test 1 */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase flex items-center gap-1">
              <Percent size={14} className="text-indigo-500" /> Internal Examination 1 Weight (%)
            </label>
            <p className="text-xs text-slate-400 font-semibold">Weight percentage for Mid-Term / Internal Test 1 in final internal calculation.</p>
            <input type="number" className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-bold font-mono"
              value={internalOne} onChange={e => setInternalOne(Number(e.target.value))} />
          </div>

          {/* Internal Test 2 */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase flex items-center gap-1">
              <Percent size={14} className="text-indigo-500" /> Internal Examination 2 Weight (%)
            </label>
            <p className="text-xs text-slate-400 font-semibold">Weight percentage for final Internal Test 2 / Model Exam in final internal calculation.</p>
            <input type="number" className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-bold font-mono"
              value={internalTwo} onChange={e => setInternalTwo(Number(e.target.value))} />
          </div>

          {/* Assignments */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase flex items-center gap-1">
              <Award size={14} className="text-indigo-500" /> Class Assignments Weight (%)
            </label>
            <p className="text-xs text-slate-400 font-semibold">Weight percentage assigned to classroom continuous submissions and tasks.</p>
            <input type="number" className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-bold font-mono"
              value={assignments} onChange={e => setAssignments(Number(e.target.value))} />
          </div>

          {/* Seminar / Attendance */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase flex items-center gap-1">
              <Award size={14} className="text-indigo-500" /> Seminar & Class Participation (%)
            </label>
            <p className="text-xs text-slate-400 font-semibold">Weight percentage assigned to class presentations, active participation and seminars.</p>
            <input type="number" className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-bold font-mono"
              value={seminar} onChange={e => setSeminar(Number(e.target.value))} />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-sm font-semibold text-slate-650">
            Total Combined Weight: <strong className={`font-mono text-base ${total === 100 ? 'text-emerald-600' : 'text-rose-600 font-black'}`}>{total}%</strong>
          </div>
          <button type="submit"
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-colors">
            <Save size={16} /> Save Setup Weights
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentConfiguration;
