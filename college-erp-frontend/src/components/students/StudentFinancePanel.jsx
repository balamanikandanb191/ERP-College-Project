import React, { useMemo } from 'react';
import { 
  DollarSign, CheckCircle2, AlertCircle, Calendar, 
  ArrowUpRight, Download, Sparkles, ShieldCheck 
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentFinancePanel = ({ student = {} }) => {
  const safeData = student || {};

  // Single Source of Truth mapping from parent state
  const isPaid = safeData.feeStatus === 'Paid';
  const pendingAmount = isPaid ? 0 : (safeData.feeAmount || 5000);
  const paidAmount = isPaid ? 85000 : (85000 - pendingAmount);
  const totalFee = 85000;
  const scholarshipAmount = safeData.cgpa >= 8.5 ? 15000 : 0;
  
  // Installment progression calculation
  const paymentProgressPct = Math.round((paidAmount / totalFee) * 100);

  // Installment Log Entries
  const paymentHistory = useMemo(() => [
    { id: 'TXN-90234', title: 'Semester Tuition Fee', date: '05 May 2026', amount: paidAmount - 15000, status: 'Completed', method: 'Net Banking' },
    { id: 'TXN-89312', title: 'Admission & Exam Charges', date: '02 May 2026', amount: 15000, status: 'Completed', method: 'UPI Pay' },
    ...(isPaid ? [] : [
      { id: 'TXN-PENDING', title: 'Pending Tuition Balance', date: 'Due: 30 June 2026', amount: pendingAmount, status: 'Pending', method: 'Awaiting Bank Transfer' }
    ])
  ], [isPaid, paidAmount, pendingAmount]);

  const handleDownloadInvoice = (txnId) => {
    toast.success(`Transaction Receipt ${txnId} downloaded successfully!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Finance & Fees Control Panel</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Billing logs, dues, and institutional scholarship meters</p>
        </div>
        
        {isPaid ? (
          <span className="px-3 py-1 rounded-full border border-emerald-500/20 text-emerald-500 bg-emerald-500/10 font-black text-[9px] uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
            <CheckCircle2 size={10} /> Fully Paid
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full border border-amber-500/20 text-amber-500 bg-amber-500/10 font-black text-[9px] uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
            <AlertCircle size={10} /> Dues Outstanding
          </span>
        )}
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-2">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Total Curricular Fee</span>
          <h3 className="text-2xl font-black text-slate-800">₹{totalFee.toLocaleString('en-IN')}</h3>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-2">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Fees Paid to Date</span>
          <h3 className="text-2xl font-black text-emerald-600">₹{paidAmount.toLocaleString('en-IN')}</h3>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${paymentProgressPct}%` }} />
          </div>
          <span className="text-[8px] font-bold text-slate-400 block">{paymentProgressPct}% of yearly quota paid</span>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-2">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Dues Outstanding</span>
          <h3 className={`text-2xl font-black ${isPaid ? 'text-slate-500' : 'text-rose-600'}`}>
            ₹{pendingAmount.toLocaleString('en-IN')}
          </h3>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className={`h-1.5 rounded-full ${isPaid ? 'bg-slate-300' : 'bg-rose-500'}`} style={{ width: `${100 - paymentProgressPct}%` }} />
          </div>
          <span className="text-[8px] font-bold text-slate-400 block">
            {isPaid ? 'Clear balance' : 'Tuition billing due: 30 Jun'}
          </span>
        </div>

      </div>

      {/* Scholarship Box if Eligible */}
      {scholarshipAmount > 0 && (
        <div className="bg-indigo-900 text-white rounded-2xl p-4 flex items-center justify-between border border-indigo-950 relative overflow-hidden shadow-lg">
          <div className="space-y-1 relative z-10">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
              <Sparkles size={12} className="animate-spin-slow" /> Merit Scholarship Confirmed
            </span>
            <p className="text-xs font-bold leading-normal">
              Awarded ₹{scholarshipAmount.toLocaleString('en-IN')} Academic discount based on top CGPA standard.
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl border border-white/10 relative z-10 shrink-0 text-indigo-200">
            <ShieldCheck size={24} />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        </div>
      )}

      {/* Transaction History Log */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-4">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <DollarSign size={16} className="text-indigo-600" />
          Receipt & Payment Timeline logs
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-2.5">TXN ID</th>
                <th className="py-2.5">Billing Particulars</th>
                <th className="py-2.5">Date</th>
                <th className="py-2.5 text-right">Amount</th>
                <th className="py-2.5 text-center">Status</th>
                <th className="py-2.5 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[10px] font-semibold text-slate-700">
              {paymentHistory.map((txn, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 font-bold text-slate-500 font-mono">{txn.id}</td>
                  <td className="py-3 font-black text-slate-800 uppercase">{txn.title}</td>
                  <td className="py-3 text-slate-500 flex items-center gap-1">
                    <Calendar size={10} /> {txn.date}
                  </td>
                  <td className="py-3 text-right font-black text-slate-800">
                    ₹{txn.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wider ${
                      txn.status === 'Completed'
                        ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/10'
                        : 'border-amber-500/20 text-amber-500 bg-amber-500/10'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {txn.status === 'Completed' ? (
                      <button 
                        onClick={() => handleDownloadInvoice(txn.id)}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all inline-flex"
                      >
                        <Download size={12} />
                      </button>
                    ) : (
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">DUE</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StudentFinancePanel;
