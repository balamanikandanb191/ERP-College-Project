import React from 'react';
import { 
  Shield, CheckCircle, AlertCircle, FileText, 
  TrendingUp, Award, Code, CheckSquare 
} from 'lucide-react';

const PlacementCareerPanel = ({ student = {} }) => {
  const safeData = student || {};

  // Single Source of Truth mapping from parent state
  const placementStatus = safeData.status || 'in_progress';
  const atsScore = Number(safeData.resumeAts || 78);
  const mockGrade = safeData.mockParticipation === 'Yes' ? '92%' : 'Pending';
  const applications = safeData.applications || [];

  const statusColor = placementStatus === 'placed' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                      (placementStatus === 'rejected' ? 'text-rose-600 bg-rose-50 border-rose-200' :
                      'text-indigo-600 bg-indigo-50 border-indigo-200');

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">TPO Career & Placements intelligence</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Recruiters clearance audits, ATS logs, and mock grades</p>
        </div>

        <span className={`px-4 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-wider ${statusColor}`}>
          Status: {placementStatus === 'placed' ? `PLACED AT ${safeData.companySelected || 'COGNIZANT'}` : placementStatus.replace('_', ' ')}
        </span>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
            <FileText size={20} />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">ATS Resume Rating</span>
            <span className="text-lg font-black text-slate-800">{atsScore}% Score</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl">
            <CheckSquare size={20} />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Mock Assessment</span>
            <span className="text-lg font-black text-slate-800">{mockGrade} Grade</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-cyan-50 border border-cyan-100 text-cyan-600 rounded-xl">
            <Code size={20} />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Coding profile</span>
            <span className="text-lg font-black text-slate-800">Advanced Standard</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl">
            <Award size={20} />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Package LPA Max</span>
            <span className="text-lg font-black text-slate-800">
              {safeData.packageOffered ? `₹${safeData.packageOffered} LPA` : 'Awaiting Offers'}
            </span>
          </div>
        </div>

      </div>

      {/* Applied Recruiter Timeline progression list */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-4">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <TrendingUp size={16} className="text-indigo-600" />
          Active Recruiter Applications & Clearing Progressions
        </h4>

        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app, idx) => (
              <div key={idx} className="bg-slate-50/70 border border-slate-200/60 p-4 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                  <div>
                    <h5 className="text-sm font-black text-slate-800 uppercase">{app.company}</h5>
                    <p className="text-[9px] font-bold text-slate-500">Interview Timeline Date: {app.interviewDate || 'Awaiting schedules'}</p>
                  </div>
                  
                  <span className={`px-2.5 py-1 rounded-full border text-[8px] font-black uppercase tracking-wider ${
                    app.status === 'Placed'
                      ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/10'
                      : (app.status === 'Rejected' ? 'border-rose-500/20 text-rose-500 bg-rose-50/10' : 'border-indigo-500/20 text-indigo-500 bg-indigo-50/10')
                  }`}>
                    {app.status}
                  </span>
                </div>

                {app.hrRemarks && (
                  <p className="text-[9px] font-bold text-slate-500 leading-relaxed italic bg-white p-2.5 border border-slate-200/60 rounded-xl">
                    TPO Remarks: {app.hrRemarks}
                  </p>
                )}

                {/* Cleared Round Indicators */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Interview rounds clearance</span>
                  <div className="flex flex-wrap gap-2">
                    {app.timeline?.map((round, rIdx) => {
                      const pillColor = round.status === 'cleared' || round.status === 'completed'
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : (round.status === 'rejected' ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-100 text-slate-500 border-slate-200');
                      return (
                        <div key={rIdx} className={`px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-wider ${pillColor}`}>
                          {round.label}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">
            <Shield size={40} className="mx-auto mb-2 opacity-25" />
            <p className="font-bold text-xs">No active recruitment drive applications logged yet.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default PlacementCareerPanel;
