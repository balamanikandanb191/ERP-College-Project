import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Search, Filter, GraduationCap, Award, ShieldAlert } from 'lucide-react';

// Mock data for demonstration of eligibility logic moved outside to prevent re-renders
const students = [
  { id: 1, name: 'Arjun Kumar', reg: 'REG001', cgpa: 8.5, arrears: 0, dept: 'CSE', feeStatus: 'Paid' },
  { id: 2, name: 'Priya Singh', reg: 'REG002', cgpa: 7.2, arrears: 0, dept: 'ECE', feeStatus: 'Paid' },
  { id: 3, name: 'Rahul Varma', reg: 'REG003', cgpa: 6.1, arrears: 2, dept: 'MECH', feeStatus: 'Paid' },
  { id: 4, name: 'Sneha Reddy', reg: 'REG004', cgpa: 9.1, arrears: 0, dept: 'IT', feeStatus: 'Pending' },
  { id: 5, name: 'Vikram Das', reg: 'REG005', cgpa: 6.8, arrears: 0, dept: 'CIVIL', feeStatus: 'Paid' },
];

const EligibilityChecker = ({ 
  dashboardStats, 
  setDashboardStats, 
  eligibilityFilters, 
  setEligibilityFilters 
}) => {
  // Use local state for rendering but sync with parent filters
  const [filteredStudents, setFilteredStudents] = useState([]);

  const handleApplyFilters = () => {
    console.log("Apply Filters Running");

    const updatedStudents = (students || []).map((student) => {
      const reasons = [];

      const cgpa = Number(student?.cgpa ?? 0);
      const arrears = Number(student?.arrears ?? 0);

      const minCGPA = Number(eligibilityFilters?.minCGPA ?? 0);
      const maxArrears = Number(eligibilityFilters?.maxArrears ?? 0);

      if (cgpa < minCGPA) {
        reasons.push(`CGPA below ${minCGPA}`);
      }

      if (arrears > maxArrears) {
        reasons.push(`Has ${arrears} arrears`);
      }

      return {
        ...student,
        eligible: reasons.length === 0,
        ineligibilityReasons: reasons
      };
    });

    setFilteredStudents(updatedStudents);

    const eligibleCount = updatedStudents.filter(
      (student) => student.eligible
    ).length;

    if (typeof setDashboardStats === "function") {
      setDashboardStats((prev) => ({
        ...prev,
        eligibleStudents: eligibleCount
      }));
    }

    console.log(updatedStudents);
  };

  // Initial application on mount to restore persisted state
  useEffect(() => {
    handleApplyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync if students data changes
  useEffect(() => {
    setFilteredStudents(students || []);
  }, [students]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Criteria Config */}
      <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-100 flex flex-col md:flex-row gap-8 items-center justify-between border-l-8 border-indigo-500">
        <div>
          <h2 className="text-2xl font-black mb-1">Eligibility Engine</h2>
          <p className="text-slate-400 text-sm font-medium">Set criteria to auto-filter students for active drives</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Min CGPA</label>
              <input 
                type="number" step="0.1" 
                value={eligibilityFilters?.minCGPA ?? 0} 
                onChange={(e) => setEligibilityFilters(prev => ({ ...prev, minCGPA: e.target.value }))}
                className="w-24 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm font-bold focus:bg-white/20 outline-none"
              />
           </div>
           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Max Arrears</label>
              <input 
                type="number" 
                value={eligibilityFilters?.maxArrears ?? 0} 
                onChange={(e) => setEligibilityFilters(prev => ({ ...prev, maxArrears: e.target.value }))}
                className="w-24 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm font-bold focus:bg-white/20 outline-none"
              />
           </div>
           <button 
             type="button"
             onClick={handleApplyFilters}
             className="mt-4 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
           >
             Apply Filters
           </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {(filteredStudents || []).map(student => {
           const eligible = student.eligible;
           const reasons = student.ineligibilityReasons || [];
           
           return (
             <div key={student.id} className={`p-6 rounded-[32px] border transition-all duration-300 ${eligible ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                         <GraduationCap size={24} />
                      </div>
                      <div>
                         <h4 className="font-black text-slate-900">{student.name}</h4>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{student.reg} • {student.dept}</p>
                      </div>
                   </div>
                   {eligible ? (
                     <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg shadow-sm">
                        <CheckCircle size={18} />
                     </div>
                   ) : (
                     <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg shadow-sm">
                        <ShieldAlert size={18} />
                     </div>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                   <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">CGPA</p>
                      <p className={`text-sm font-black ${student.cgpa >= (eligibilityFilters?.minCGPA ?? 0) ? 'text-slate-900' : 'text-rose-600'}`}>{student.cgpa}</p>
                   </div>
                   <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Arrears</p>
                      <p className={`text-sm font-black ${student.arrears <= (eligibilityFilters?.maxArrears ?? 0) ? 'text-slate-900' : 'text-rose-600'}`}>{student.arrears}</p>
                   </div>
                </div>

                {!eligible && reasons.length > 0 && (
                  <div className="space-y-1 mt-2">
                     <p className="text-[9px] font-black text-rose-500 uppercase tracking-wider">Ineligibility Reasons:</p>
                     <div className="flex flex-wrap gap-1">
                        {reasons.map((r, i) => (
                          <span key={i} className="text-[9px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-100">{r}</span>
                        ))}
                     </div>
                  </div>
                )}
             </div>
           );
         })}
      </div>
    </div>
  );
};

export default EligibilityChecker;
