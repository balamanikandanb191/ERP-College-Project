import React, { useState } from 'react';
import { ShieldAlert, Send, FileText, CheckSquare, Trash2, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

const StaffAdminControls = ({ staff = {}, onUpdate }) => {
  const safeData = staff || {};
  const [smsMessage, setSmsMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Dynamic values
  const [isSuspended, setIsSuspended] = useState(safeData.employeeStatus === 'Suspended');

  const handleBroadcastSMS = (e) => {
    e.preventDefault();
    if (!smsMessage.trim()) {
      toast.error('Please enter a notification message');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      toast.success(`Broadcasting Notification: "${smsMessage.slice(0, 30)}..." sent successfully!`);
      setSmsMessage('');
      setIsSending(false);
    }, 1000);
  };

  const handleToggleSuspension = () => {
    const nextSuspensionState = !isSuspended;
    setIsSuspended(nextSuspensionState);
    
    // Trigger callback if defined to maintain absolute synchronization
    if (onUpdate) {
      onUpdate({ 
        ...safeData, 
        employeeStatus: nextSuspensionState ? 'Suspended' : 'Active' 
      });
    }

    if (nextSuspensionState) {
      toast.error(`Staff Member ${safeData.fullName || safeData.name} has been SUSPENDED.`);
    } else {
      toast.success(`Staff Member ${safeData.fullName || safeData.name} is now ACTIVE.`);
    }
  };

  const handleDownloadExperienceReport = () => {
    toast.success(`Official Experience Brief report downloaded successfully!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Status Flags */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Institutional Authorization status</span>
          <h4 className="text-sm font-black text-slate-800 uppercase mt-1">
            Status: {isSuspended ? (
              <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-md border border-red-100/50">SUSPENDED</span>
            ) : (
              <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">ACTIVE ENROLLED</span>
            )}
          </h4>
        </div>

        <button 
          onClick={handleToggleSuspension}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all flex items-center gap-2 shadow-xs ${
            isSuspended 
              ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
          }`}
        >
          <ShieldAlert size={14} />
          {isSuspended ? 'Reactivate Staff Member' : 'Suspend Staff Member'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SMS Broadcast System */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Send size={16} className="text-indigo-500" /> Institution Broadcast System
          </h4>
          
          <form onSubmit={handleBroadcastSMS} className="space-y-3">
            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase block tracking-wider mb-1">
                Custom Broadcast Notification Message (SMS/Feed)
              </label>
              <textarea
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Enter formal notice details or emergency broadcast SMS text..."
                rows={4}
                className="w-full text-xs border border-slate-200 rounded-xl p-3 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isSending}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send size={12} />
              {isSending ? 'Transmitting Broadcast...' : 'Broadcast Notice Message'}
            </button>
          </form>
        </div>

        {/* Official Document generation & printing */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <FileText size={16} className="text-indigo-500" /> Official institutional generation
          </h4>
          
          <div className="space-y-2.5">
            <button 
              onClick={() => window.print()}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 p-3 rounded-xl flex justify-between items-center text-left transition-colors"
            >
              <div>
                <span className="text-[10px] font-black block">Generate Official Faculty Smart ID Card</span>
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Prints layout formats to PDF/Printers</span>
              </div>
              <Printer size={16} className="text-slate-400" />
            </button>

            <button 
              onClick={handleDownloadExperienceReport}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 p-3 rounded-xl flex justify-between items-center text-left transition-colors"
            >
              <div>
                <span className="text-[10px] font-black block">Generate Professional Experience Letter</span>
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Formal verification dossier</span>
              </div>
              <FileText size={16} className="text-slate-400" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default StaffAdminControls;
