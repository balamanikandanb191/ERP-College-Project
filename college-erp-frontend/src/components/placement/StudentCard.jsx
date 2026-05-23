import React from 'react';
import { User, CheckCircle, XCircle, DollarSign, Award } from 'lucide-react';

const StudentCard = ({ student = null }) => {
  // Safe extraction with fallbacks
  const data = student ?? {
    id: null,
    name: '',
    reg: '',
    dept: '',
    cgpa: 0,
    arrears: 0,
    eligible: false,
    feeStatus: 'Pending',
    applicationsCount: 0
  };

  const isEligible = data.eligible;
  const isPaid = data.feeStatus === 'Paid';

  return (
    <div className={`p-5 rounded-3xl border transition-all duration-300 ${
      isEligible 
        ? 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200' 
        : 'bg-slate-50 border-slate-200 opacity-80'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
            {data.name ? data.name.charAt(0) : <User size={18} />}
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm leading-tight">{data.name}</h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              {data.reg} • {data.dept}
            </p>
          </div>
        </div>

        {isEligible ? (
          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full">
            <CheckCircle size={10} /> Eligible
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full">
            <XCircle size={10} /> Ineligible
          </span>
        )}
      </div>

      {/* CGPA and Arrears Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-bold">
        <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[8px] font-black text-slate-400 uppercase block mb-0.5">CGPA</span>
          <span className={isEligible ? 'text-slate-900' : 'text-rose-600'}>{data.cgpa}</span>
        </div>
        <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[8px] font-black text-slate-400 uppercase block mb-0.5">Arrears</span>
          <span className={data.arrears === 0 ? 'text-slate-900' : 'text-rose-600'}>{data.arrears}</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] font-bold border-t border-slate-100 pt-3">
        {/* Fee status */}
        <span className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full border ${
          isPaid 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-amber-50 text-amber-600 border-amber-100'
        }`}>
          <DollarSign size={10} /> {isPaid ? 'Fees Paid' : 'Fee Pending'}
        </span>

        {/* Selected companies count */}
        <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
          <Award size={10} /> {data.applicationsCount ?? 0} {data.applicationsCount === 1 ? 'Drive' : 'Drives'}
        </span>
      </div>
    </div>
  );
};

export default StudentCard;
