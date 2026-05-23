import React, { useState, useMemo } from 'react';
import { Search, Filter, AlertCircle, CheckCircle2, Info, AlertTriangle, Download, RefreshCw } from 'lucide-react';
import { useMasterData } from '../hooks/useMasterData';

const LOG_LEVELS = ['ALL', 'INFO', 'WARNING', 'ERROR', 'SUCCESS'];
const MODULES = ['ALL', 'Auth', 'Students', 'Staff', 'Fees', 'Attendance', 'Library', 'Timetable', 'Certificates'];
const LEVEL_STYLES = {
  INFO: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Info, dot: 'bg-blue-400' },
  WARNING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: AlertTriangle, dot: 'bg-amber-400' },
  ERROR: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: AlertCircle, dot: 'bg-rose-500' },
  SUCCESS: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2, dot: 'bg-emerald-400' },
};

const SEED_LOGS = [
  { id: 'L001', ts: '2026-05-23 11:55:02', level: 'SUCCESS', module: 'Auth', user: 'admin@edu.in', action: 'Admin logged in successfully', ip: '192.168.1.10' },
  { id: 'L002', ts: '2026-05-23 11:52:18', level: 'INFO', module: 'Students', user: 'amit.sharma@edu.in', action: 'New student record created: Priya Mehta (CS2026-048)', ip: '192.168.1.10' },
  { id: 'L003', ts: '2026-05-23 11:48:44', level: 'INFO', module: 'Fees', user: 'amit.sharma@edu.in', action: 'Fee payment recorded: ₹45,000 for Arjun Nair (Semester 4)', ip: '192.168.1.10' },
  { id: 'L004', ts: '2026-05-23 11:41:20', level: 'WARNING', module: 'Attendance', user: 'sneha.iyer@edu.in', action: 'Attendance sheet submitted late for CS III-A (>2 hours past cutoff)', ip: '192.168.1.25' },
  { id: 'L005', ts: '2026-05-23 11:30:05', level: 'ERROR', module: 'Library', user: 'system', action: 'Book sync failed: 3 barcode mismatches detected in import batch', ip: 'localhost' },
  { id: 'L006', ts: '2026-05-23 11:15:33', level: 'SUCCESS', module: 'Certificates', user: 'amit.sharma@edu.in', action: 'Bonafide certificate generated for Divya Pillai (IT2026-021)', ip: '192.168.1.10' },
  { id: 'L007', ts: '2026-05-23 10:58:19', level: 'INFO', module: 'Timetable', user: 'amit.sharma@edu.in', action: 'Timetable updated for CS Semester 5, Section A', ip: '192.168.1.10' },
  { id: 'L008', ts: '2026-05-23 10:45:02', level: 'WARNING', module: 'Auth', user: 'unknown', action: 'Failed login attempt: 3 consecutive failures for student@edu.in', ip: '10.0.0.45' },
  { id: 'L009', ts: '2026-05-23 10:33:15', level: 'SUCCESS', module: 'Staff', user: 'amit.sharma@edu.in', action: 'Leave request approved for Prof. Rajesh Kumar (23-24 May 2026)', ip: '192.168.1.10' },
  { id: 'L010', ts: '2026-05-23 10:20:44', level: 'INFO', module: 'Students', user: 'sneha.iyer@edu.in', action: 'Student grade entry completed: CS304 Internal 2 (60 students)', ip: '192.168.1.25' },
  { id: 'L011', ts: '2026-05-23 09:58:01', level: 'ERROR', module: 'Fees', user: 'system', action: 'Payment gateway timeout: 2 transactions pending confirmation (IDs: TXN-2291, TXN-2292)', ip: 'localhost' },
  { id: 'L012', ts: '2026-05-23 09:40:22', level: 'SUCCESS', module: 'Auth', user: 'rajesh.kumar@edu.in', action: 'Staff member logged in', ip: '192.168.1.30' },
  { id: 'L013', ts: '2026-05-23 09:21:09', level: 'INFO', module: 'Attendance', user: 'sneha.iyer@edu.in', action: 'Daily attendance marked: IT II-B (48 present, 4 absent)', ip: '192.168.1.25' },
  { id: 'L014', ts: '2026-05-23 08:55:33', level: 'WARNING', module: 'Library', user: 'system', action: 'Book overdue alert: 7 books pending return past 14-day limit', ip: 'localhost' },
  { id: 'L015', ts: '2026-05-23 08:30:00', level: 'INFO', module: 'Auth', user: 'system', action: 'ERP system started. Database sync completed. 2891 records loaded.', ip: 'localhost' },
];

const LogDetails = () => {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('ALL');
  const [module, setModule] = useState('ALL');
  const { records: logs } = useMasterData('log_details', SEED_LOGS);

  const filtered = useMemo(() => logs.filter(l => {
    const matchSearch = (l.action || '').toLowerCase().includes(search.toLowerCase()) || (l.user || '').toLowerCase().includes(search.toLowerCase());
    const matchLevel = level === 'ALL' || l.level === level;
    const matchModule = module === 'ALL' || l.module === module;
    return matchSearch && matchLevel && matchModule;
  }), [logs, search, level, module]);

  const counts = { INFO: logs.filter(l => l.level === 'INFO').length, WARNING: logs.filter(l => l.level === 'WARNING').length, ERROR: logs.filter(l => l.level === 'ERROR').length, SUCCESS: logs.filter(l => l.level === 'SUCCESS').length };

  const exportCSV = () => {
    const rows = filtered.map(l => `"${l.ts}","${l.level}","${l.module}","${l.user}","${l.action}","${l.ip}"`);
    const csv = ['Timestamp,Level,Module,User,Action,IP', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'ERP_System_Logs.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-600/30 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600">File Module</span>
          <h1 className="text-3xl font-black mt-3 tracking-tight">System Log Details</h1>
          <p className="text-slate-400 text-xs font-semibold mt-1">Audit trail of all ERP system events, user actions, and errors</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(counts).map(([lvl, count]) => {
          const style = LEVEL_STYLES[lvl];
          const Icon = style.icon;
          return (
            <button key={lvl} onClick={() => setLevel(level === lvl ? 'ALL' : lvl)}
              className={`bg-white rounded-2xl border p-5 hover:shadow-md transition-all text-left ${level === lvl ? `${style.border} ring-2 ring-offset-1 ring-current` : 'border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={style.text} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${style.text}`}>{lvl}</span>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{count}</h3>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 text-slate-400" size={15} />
          <input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
            placeholder="Search actions or users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400" />
          <select className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none" value={level} onChange={e => setLevel(e.target.value)}>
            {LOG_LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
          <select className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none" value={module} onChange={e => setModule(e.target.value)}>
            {MODULES.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => { setSearch(''); setLevel('ALL'); setModule('ALL'); }} className="px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50 flex items-center gap-1.5">
            <RefreshCw size={13} /> Reset
          </button>
          <button onClick={exportCSV} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5">
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{filtered.length} log entries</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400">Live Audit Trail</span>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {filtered.map(log => {
            const style = LEVEL_STYLES[log.level] || LEVEL_STYLES.INFO;
            const Icon = style.icon;
            return (
              <div key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors">
                <div className={`mt-0.5 p-2 rounded-xl ${style.bg} border ${style.border} shrink-0`}>
                  <Icon size={14} className={style.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-normal">{log.action}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-[11px] text-slate-400 font-mono">{log.ts}</span>
                    <span className="text-[11px] font-bold text-slate-500">by <span className="text-slate-700">{log.user}</span></span>
                    <span className="text-[11px] text-slate-400 font-mono">from {log.ip}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>{log.level}</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{log.module}</span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="py-20 text-center text-slate-400 font-bold">No matching log entries found</div>}
        </div>
      </div>
    </div>
  );
};

export default LogDetails;
