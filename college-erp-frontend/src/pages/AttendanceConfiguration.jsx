import React, { useState, useEffect } from 'react';
import { Settings, Save, Clock, Percent, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';

const SEED_CONFIG = [
  { id: 'config-1', sessionMode: 'Hourly (Subject Wise)', minPercentage: 75, gracePeriod: 15, biometricEnabled: true }
];

const AttendanceConfiguration = () => {
  const { records, addRecord, updateRecord } = useMasterData('attendance_configuration', SEED_CONFIG);
  const [sessionMode, setSessionMode] = useState('Hourly (Subject Wise)');
  const [minPercentage, setMinPercentage] = useState(75);
  const [gracePeriod, setGracePeriod] = useState(15);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  useEffect(() => {
    if (records && records[0]) {
      setSessionMode(records[0].sessionMode || 'Hourly (Subject Wise)');
      setMinPercentage(records[0].minPercentage ?? 75);
      setGracePeriod(records[0].gracePeriod ?? 15);
      setBiometricEnabled(records[0].biometricEnabled ?? true);
    }
  }, [records]);

  const handleSave = async (e) => {
    e.preventDefault();
    const formFields = { sessionMode, minPercentage, gracePeriod, biometricEnabled };
    let res;
    if (records && records[0]) {
      res = await updateRecord(records[0].id, formFields);
    } else {
      res = await addRecord(formFields);
    }
    if (res.success) {
      toast.success('Attendance configurations saved successfully!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Attendance Setup</span>
          <h1 className="text-3xl font-black mt-2">Attendance Configuration</h1>
          <p className="text-indigo-200 text-xs font-semibold mt-1">Configure session mapping structures, minimum percentage thresholds, and biometric links</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tracking Mode */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase flex items-center gap-1">
              <Clock size={14} className="text-indigo-500" /> Tracking System Structure
            </label>
            <p className="text-xs text-slate-400 font-semibold">Choose how attendance periods are grouped and registered in student profiles.</p>
            <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-semibold"
              value={sessionMode} onChange={e => setSessionMode(e.target.value)}>
              <option>Hourly (Subject Wise)</option>
              <option>Daily (Forenoon / Afternoon)</option>
              <option>Once Daily (Mornings Only)</option>
            </select>
          </div>

          {/* Minimum Percentage */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase flex items-center gap-1">
              <Percent size={14} className="text-indigo-500" /> Minimum Eligibility Threshold (%)
            </label>
            <p className="text-xs text-slate-400 font-semibold">Minimum attendance required to sit for examinations without condonation.</p>
            <input type="number" className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-bold font-mono"
              value={minPercentage} onChange={e => setMinPercentage(Number(e.target.value))} />
          </div>

          {/* Grace Period */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase flex items-center gap-1">
              <Clock size={14} className="text-indigo-500" /> Grace Period Duration (Minutes)
            </label>
            <p className="text-xs text-slate-400 font-semibold">Allowable time elapsed after class starts before registering a candidate as late/absent.</p>
            <input type="number" className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-bold font-mono"
              value={gracePeriod} onChange={e => setGracePeriod(Number(e.target.value))} />
          </div>

          {/* Biometric Link */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase flex items-center gap-1">
              <Settings size={14} className="text-indigo-500" /> Biometric RFID Terminal Integration
            </label>
            <p className="text-xs text-slate-400 font-semibold">Toggle automatic logging from campus gate scanners and classroom RFID registers.</p>
            <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-semibold"
              value={biometricEnabled.toString()} onChange={e => setBiometricEnabled(e.target.value === 'true')}>
              <option value="true">RFID & Biometric Terminals Enabled</option>
              <option value="false">Manual Classroom Logs Only</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-colors">
            <Save size={16} /> Save Configurations
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceConfiguration;
