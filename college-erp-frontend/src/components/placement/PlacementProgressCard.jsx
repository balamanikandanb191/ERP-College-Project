import React, { useState } from 'react';
import { ShieldAlert, Award, FileText, ChevronRight, User, Settings } from 'lucide-react';
import TimelineStepper from './TimelineStepper';

const PlacementProgressCard = ({ 
  student = null, 
  onOpenStatusModal = () => {} 
}) => {
  // Safe extraction with default fallbacks
  const studentData = student ?? {
    id: null,
    name: '',
    reg: '',
    dept: '',
    photo: '',
    applications: []
  };

  const applications = studentData.applications ?? [];
  
  // Set first company as active initially
  const [activeCompany, setActiveCompany] = useState(
    applications.length > 0 ? applications[0].company : ''
  );

  const activeApp = applications.find(app => app.company === activeCompany) ?? null;

  // Calculate timeline progress percentage safely
  const calculateProgress = (app) => {
    if (!app || !app.timeline || app.timeline.length === 0) return 0;
    const cleared = app.timeline.filter(
      stage => stage.status === 'completed' || stage.status === 'cleared'
    ).length;
    return Math.round((cleared / app.timeline.length) * 100);
  };

  const progressPercentage = activeApp ? calculateProgress(activeApp) : 0;
  const status = activeApp?.status ?? 'Pending';
  
  const getStatusBadge = (statusVal) => {
    switch (statusVal) {
      case 'Placed':
        return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      case 'Rejected':
        return 'bg-rose-50 border-rose-200 text-rose-600';
      case 'In Progress':
        return 'bg-amber-50 border-amber-200 text-amber-600 animate-pulse';
      case 'Applied':
      case 'Pending':
      default:
        return 'bg-slate-50 border-slate-200 text-slate-500';
    }
  };

  const risk = (() => {
    let score = 0;
    const reasons = [];
    
    if ((studentData.arrears ?? 0) > 0) {
      score += 3;
      reasons.push(`${studentData.arrears} Backlogs`);
    }
    const cgpa = Number(studentData.cgpa ?? 0);
    if (cgpa < 6.0) {
      score += 3;
      reasons.push(`Low CGPA (${cgpa})`);
    } else if (cgpa < 7.0) {
      score += 1.5;
      reasons.push(`CGPA ${cgpa}`);
    }
    if (studentData.feeStatus === 'Pending') {
      score += 1;
      reasons.push('Fees Pending');
    }
    const ats = Number(studentData.resumeAts ?? 0);
    if (studentData.resumeStatus === 'Pending') {
      score += 1;
      reasons.push('Resume Draft Pending');
    } else if (ats < 60) {
      score += 2;
      reasons.push(`Low ATS (${ats}%)`);
    }
    if (studentData.mockParticipation === 'No') {
      score += 1;
      reasons.push('Mocks Missed');
    }
    if (studentData.internshipStatus === 'None') {
      score += 0.5;
      reasons.push('No Internship');
    }

    let level = 'Low';
    let color = 'bg-emerald-50 border-emerald-100 text-emerald-600';
    let tip = 'All Clear! Ready for recruitment drives.';
    
    if (score >= 4) {
      level = 'High';
      color = 'bg-rose-50 border-rose-100 text-rose-600';
      tip = `Warning: ${reasons.join(', ')}. Action: Attend TPO revision mocks.`;
    } else if (score >= 2) {
      level = 'Medium';
      color = 'bg-amber-50 border-amber-100 text-amber-600';
      tip = `Attention: ${reasons.join(', ')}. Action: Attend coding webinars.`;
    }

    return { level, color, tip, reasons };
  })();

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-50/40 transition-all duration-300 flex flex-col justify-between space-y-6">
      
      {/* Upper profile and multi-company tabs */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {studentData.photo ? (
              <img 
                src={studentData.photo} 
                alt={studentData.name} 
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black text-lg">
                {studentData.name ? studentData.name.charAt(0) : <User size={20} />}
              </div>
            )}
            <div>
              <h4 className="font-black text-slate-900 leading-tight">{studentData.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{studentData.reg} • {studentData.dept}</p>
            </div>
          </div>

          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusBadge(status)}`}>
            {status}
          </span>
        </div>

        {/* Multi-Company Pill Selectors */}
        {applications.length > 0 && (
          <div className="flex flex-wrap gap-1.5 py-1">
            {applications.map(app => (
              <button
                key={app.company}
                onClick={() => setActiveCompany(app.company)}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                  activeCompany === app.company 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-slate-50 text-slate-400 border-slate-150 hover:bg-slate-100'
                }`}
              >
                {app.company}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Company Details / Stepper */}
      {activeApp ? (
        <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-4 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Company</span>
              <p className="font-black text-slate-800 text-sm mt-0.5">{activeApp.company}</p>
            </div>
            
            {activeApp.packageOffered && (
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Package</span>
                <p className="font-black text-emerald-600 text-sm mt-0.5">{activeApp.packageOffered} LPA</p>
              </div>
            )}
          </div>

          {/* Stepper progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
              <span>Recruitment Journey</span>
              <span className="font-black text-indigo-600">{progressPercentage}% Complete</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Stepper Stages */}
          <TimelineStepper 
            stages={activeApp.timeline} 
            currentCompany=""
          />

          {/* HR Remarks and Interview Date if applicable */}
          {(activeApp.hrRemarks || activeApp.interviewDate) && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-[10px] space-y-2 mt-2">
              {activeApp.interviewDate && (
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400 uppercase tracking-wider">Next Step Date:</span>
                  <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {new Date(activeApp.interviewDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              {activeApp.hrRemarks && (
                <div className="space-y-0.5">
                  <span className="font-black text-slate-400 uppercase tracking-wider">TPO Remarks:</span>
                  <p className="text-slate-600 font-medium italic leading-relaxed">"{activeApp.hrRemarks}"</p>
                </div>
              )}
              {activeApp.offerLetter && (
                <div className="flex justify-between items-center pt-1 border-t border-slate-100 mt-1">
                  <span className="font-black text-slate-400 uppercase tracking-wider">Offer Letter:</span>
                  <span className="flex items-center gap-1 font-bold text-emerald-600 text-[9px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <FileText size={10} /> Verified PDF
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 text-center text-xs font-bold text-slate-400 italic">
          No drive applications configured.
        </div>
      )}

      {/* AI Risk Engine Sub-section */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert size={12} className="text-slate-400" />
            AI Placement Risk Engine
          </span>
          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${risk.color}`}>
            {risk.level} Risk
          </span>
        </div>
        <p className="text-[9px] font-bold text-slate-500 italic leading-snug">
          "{risk.tip}"
        </p>
      </div>

      {/* Admin Action Button */}
      <button 
        onClick={() => onOpenStatusModal(studentData)}
        className="w-full py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-xs shadow-sm"
      >
        <Settings size={14} className="text-slate-400 group-hover:rotate-45 transition-transform" />
        Manage Recruitment status
      </button>
      
    </div>
  );
};

export default PlacementProgressCard;
