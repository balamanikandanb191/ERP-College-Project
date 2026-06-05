import React, { useState } from 'react';
import { 
  ShieldAlert, Sparkles, Printer, FileText, 
  Send, AlertOctagon, Trash, UserX, CheckSquare 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { confirmWarning } from '../../utils/confirmToast';

const StudentAdminControls = ({ student = {} }) => {
  const safeData = student || {};

  // Form states
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isSuspended, setIsSuspended] = useState(false);

  // Simulated Disciplinary Logs
  const disciplinaryLogs = [
    { id: 'DIS-1029', infraction: 'Late entry in hostel (>10:30 PM)', date: '12 Mar 2026', action: 'Written warning issued by Warden', status: 'Resolved' },
    { id: 'DIS-0924', infraction: 'Improper attire in examination hall', date: '10 Feb 2026', action: 'Counselled by Department Head', status: 'Closed' }
  ];

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!notificationMsg.trim()) {
      toast.error('Please enter a notification message!');
      return;
    }
    toast.success(`Notification broadcasted successfully to parents and student: "${notificationMsg}"`);
    setNotificationMsg('');
  };

  const handleGenerateBonafide = () => {
    toast.success(`Bonafide Certificate generated successfully for ${safeData.fullName || safeData.name}!`);
  };

  const handleSuspendToggle = () => {
    const action = isSuspended ? 'unsuspend' : 'suspend';
    confirmWarning(() => {
      setIsSuspended(!isSuspended);
      toast.success(`Student status updated successfully: ${action.toUpperCase()}`);
    }, `Are you absolutely sure you want to ${action} this student?`, 'Status Override', `Yes, ${action.charAt(0).toUpperCase() + action.slice(1)}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Administrative Control Center</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Disciplinary locks, bonafide templates, and suspension triggers</p>
        </div>

        {isSuspended ? (
          <span className="px-3 py-1 rounded-full border border-rose-500/20 text-rose-500 bg-rose-500/10 font-black text-[9px] uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
            <AlertOctagon size={10} /> SUSPENDED STATUS
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full border border-emerald-500/20 text-emerald-500 bg-emerald-500/10 font-black text-[9px] uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
            <CheckSquare size={10} /> ACTIVE ENROLLMENT
          </span>
        )}
      </div>

      {/* Grid of Action panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Quick Documents Generator */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <FileText size={16} className="text-indigo-600" />
            Institutional Document Generator
          </h4>
          <p className="text-[10px] font-bold text-slate-500 leading-normal">
            Generate and print pre-formatted college bonafide and recommendation letters on official university letterheads.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <button 
              onClick={handleGenerateBonafide}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-indigo-500/10 flex items-center gap-1.5"
            >
              <Sparkles size={12} /> Bonafide Certificate
            </button>
            <button 
              onClick={() => toast.success('Recommendation letter template generated.')}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Letter of Recommendation
            </button>
          </div>
        </div>

        {/* Send Broadcast Message Box */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <Send size={16} className="text-indigo-600" />
            Send Custom SMS & Email Notice
          </h4>
          
          <form onSubmit={handleSendNotification} className="space-y-3">
            <textarea 
              rows={2}
              className="w-full border border-slate-200 rounded-xl p-3 text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400"
              placeholder="Type message to broadcast to student and parents contact channels..."
              value={notificationMsg}
              onChange={(e) => setNotificationMsg(e.target.value)}
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
            >
              <Send size={12} /> Send Broadcast
            </button>
          </form>
        </div>

      </div>

      {/* Disciplinary Infraction Logs */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-4">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <ShieldAlert size={16} className="text-indigo-600" />
          Disciplinary Infraction & Action Logs
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-2.5">ID</th>
                <th className="py-2.5">Infraction Particulars</th>
                <th className="py-2.5">Date Logged</th>
                <th className="py-2.5">Action Taken</th>
                <th className="py-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[10px] font-semibold text-slate-700">
              {disciplinaryLogs.map((log, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 font-bold text-slate-500 font-mono">{log.id}</td>
                  <td className="py-3 text-slate-800 font-black uppercase">{log.infraction}</td>
                  <td className="py-3 text-slate-500">{log.date}</td>
                  <td className="py-3 text-slate-800 font-bold uppercase">{log.action}</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded-full border border-emerald-500/20 text-emerald-500 bg-emerald-500/10 text-[8px] font-black uppercase tracking-wider">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extreme Disciplinary Toggles (Suspend / Expel) */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 shadow-2xs space-y-3">
        <h4 className="text-xs font-black text-rose-800 uppercase tracking-widest flex items-center gap-2">
          <AlertOctagon size={16} className="text-rose-600 animate-pulse" />
          Critical Administrative Overrides
        </h4>
        <p className="text-[10px] font-bold text-rose-700 leading-normal">
          WARNING: Suspension immediately revokes digital smart ID validity, blocks class biometric logs, and excludes the candidate from recruiters drive schedules.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <button 
            onClick={handleSuspendToggle}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-rose-500/10 flex items-center gap-1.5"
          >
            <UserX size={14} /> {isSuspended ? 'Reactivate Enrollment' : 'Suspend Candidate'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default StudentAdminControls;
