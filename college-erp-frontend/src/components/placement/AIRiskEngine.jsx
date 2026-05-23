import React from 'react';
import { ShieldAlert, Compass, User, RefreshCw, Star, Info } from 'lucide-react';

const AIRiskEngine = ({ students = [] }) => {
  const safeStudents = students ?? [];

  const getCohortRiskMetrics = () => {
    let highRiskCount = 0;
    let medRiskCount = 0;
    let lowRiskCount = 0;
    const recommendations = [];

    safeStudents.forEach(s => {
      let score = 0;
      const reasons = [];

      if ((s.arrears ?? 0) > 0) {
        score += 3;
        reasons.push(`${s.arrears} arrears active`);
      }
      const cgpa = Number(s.cgpa ?? 0);
      if (cgpa < 6.0) {
        score += 3;
        reasons.push(`low CGPA (${cgpa})`);
      } else if (cgpa < 7.0) {
        score += 1.5;
        reasons.push(`sub-optimal CGPA (${cgpa})`);
      }
      if (s.feeStatus === 'Pending') {
        score += 1;
        reasons.push('fee pending');
      }
      const ats = Number(s.resumeAts ?? 0);
      if (s.resumeStatus === 'Pending') {
        score += 1;
        reasons.push('resume draft pending');
      } else if (ats < 60) {
        score += 2;
        reasons.push(`low ATS resume (${ats}%)`);
      }
      if (s.mockParticipation === 'No') {
        score += 1;
        reasons.push('mock evaluation missed');
      }

      if (score >= 4) {
        highRiskCount++;
        recommendations.push({
          name: s.name,
          dept: s.dept,
          level: 'High',
          color: 'text-rose-500 bg-rose-50 border-rose-100',
          reasons: reasons,
          action: `Prescription: Schedule direct TPO remedial classes. Required: Attend daily coding practice mocks.`
        });
      } else if (score >= 2) {
        medRiskCount++;
        recommendations.push({
          name: s.name,
          dept: s.dept,
          level: 'Medium',
          color: 'text-amber-500 bg-amber-50 border-amber-100',
          reasons: reasons,
          action: `Prescription: Attend resume revision cycles. Required: Clear technical evaluations.`
        });
      } else {
        lowRiskCount++;
      }
    });

    return { highRiskCount, medRiskCount, lowRiskCount, recommendations };
  };

  const metrics = getCohortRiskMetrics();

  return (
    <div className="w-full bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Compass size={16} className="text-indigo-600" />
            AI Placement Risk Engine
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Cohort risk classifications and prescriptions</p>
        </div>
        <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100 animate-pulse">
          Powered by EduAI
        </span>
      </div>

      {/* Cohort Risk Breakdown Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
          <span>COHORT RISK DISTRIBUTION</span>
          <span className="text-slate-600">
            {metrics.highRiskCount} High • {metrics.medRiskCount} Med • {metrics.lowRiskCount} Low
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100">
          {safeStudents.length > 0 ? (
            <>
              <div 
                className="bg-rose-500 h-full transition-all" 
                style={{ width: `${(metrics.highRiskCount / safeStudents.length) * 100}%` }}
                title="High Risk"
              />
              <div 
                className="bg-amber-500 h-full transition-all" 
                style={{ width: `${(metrics.medRiskCount / safeStudents.length) * 100}%` }}
                title="Medium Risk"
              />
              <div 
                className="bg-emerald-500 h-full transition-all" 
                style={{ width: `${(metrics.lowRiskCount / safeStudents.length) * 100}%` }}
                title="Low Risk"
              />
            </>
          ) : (
            <div className="w-full h-full bg-slate-100" />
          )}
        </div>
      </div>

      {/* Prescriptions and Recommendations Ticker List */}
      <div className="space-y-4.5 max-h-[300px] overflow-y-auto pr-1 hide-scrollbar">
        {metrics.recommendations.map((rec, idx) => (
          <div key={idx} className={`p-4 border rounded-2xl transition-all space-y-2 bg-slate-50/50`}>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black text-slate-800">{rec.name} ({rec.dept})</span>
              <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${rec.color}`}>
                {rec.level} Risk
              </span>
            </div>
            
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1.5 flex-wrap">
              <span>Risk Factors:</span>
              {rec.reasons.map((r, rIdx) => (
                <span key={rIdx} className="text-[9px] text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100/50 normal-case font-bold">
                  {r}
                </span>
              ))}
            </div>

            <p className="text-[10px] font-bold text-indigo-600 leading-relaxed bg-white border border-slate-100 rounded-xl p-2.5 shadow-2xs">
              💡 {rec.action}
            </p>
          </div>
        ))}
        {metrics.recommendations.length === 0 && (
          <div className="text-center py-8 font-bold text-slate-400 italic text-[10px] bg-slate-50 rounded-2xl border border-slate-100">
            🎉 All Clear! Zero students high/medium risk profiles.
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRiskEngine;
