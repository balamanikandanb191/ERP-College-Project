import React, { useMemo } from 'react';
import { Award, Star, Compass, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const StaffPerformancePanel = ({ staff = {} }) => {
  const safeData = staff || {};

  // Dynamic feedback and tasks metrics
  const feedbackScore = safeData.studentFeedbackRating || 4.8;
  const taskCompletion = safeData.taskCompletionScore || 96;
  const mentoringScore = safeData.mentoringPerformance || 92;

  const performanceBreakdown = useMemo(() => {
    return [
      { metric: 'Feedback', score: feedbackScore * 20 }, // scale to 100
      { metric: 'Tasks', score: taskCompletion },
      { metric: 'Mentoring', score: mentoringScore },
      { metric: 'Department', score: 90 }
    ];
  }, [feedbackScore, taskCompletion, mentoringScore]);

  return (
    <div className="space-y-6">
      
      {/* Upper summary gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 text-center">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star size={24} fill="currentColor" />
          </div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Student Feedback</span>
          <h3 className="text-2xl font-black text-slate-800 mt-1">{feedbackScore} / 5.0</h3>
          <span className="text-[7px] font-bold text-slate-400 block mt-0.5">Based on 142 student submissions</span>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 text-center">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={24} />
          </div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Task Completion</span>
          <h3 className="text-2xl font-black text-slate-800 mt-1">{taskCompletion}%</h3>
          <span className="text-[7px] font-bold text-slate-400 block mt-0.5">Syllabus coverage & admin duties</span>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Compass size={24} />
          </div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Mentoring Index</span>
          <h3 className="text-2xl font-black text-slate-800 mt-1">{mentoringScore}%</h3>
          <span className="text-[7px] font-bold text-slate-400 block mt-0.5">Student support & projects guidance</span>
        </div>

      </div>

      {/* Recharts Performance Index Bar Chart */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Faculty Score breakdown</h4>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceBreakdown} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="metric" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} stroke="#e2e8f0" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} stroke="#e2e8f0" />
              <Tooltip formatter={(value) => [`${value}%`, 'Score Index']} />
              <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Performance Insights & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AI Performance insights */}
        <div className="bg-indigo-950 text-indigo-50 border border-indigo-900 rounded-3xl p-5 space-y-3 relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          
          <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-indigo-300">
            <Sparkles size={16} /> AI Faculty Intelligence insights
          </h4>
          
          <p className="text-[10px] leading-relaxed text-indigo-200">
            "Candidate demonstrates exceptional lecturing feedback, consistently rating in the top 5% of the Computer Science faculty cohort. Study module syllabus completion is on-schedule. Recommendation: Ideal lead mentor for upcoming research grants and institutional accreditations."
          </p>
          
          <div className="pt-2 flex items-center gap-1.5 text-[8px] font-black uppercase text-indigo-300">
            <TrendingUp size={10} /> Faculty Rank: #4 in department
          </div>
        </div>

        {/* Milestone Badges */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Award size={16} className="text-indigo-500" /> Active Performance Milestones
          </h4>
          
          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="bg-white border border-slate-200/40 rounded-xl p-3 flex flex-col justify-center items-center">
              <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full font-black text-[9px] uppercase tracking-wider">
                Elite Instructor
              </span>
              <span className="text-[8px] font-bold text-slate-400 mt-2 block">Class rating &gt; 4.7/5.0</span>
            </div>

            <div className="bg-white border border-slate-200/40 rounded-xl p-3 flex flex-col justify-center items-center">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-black text-[9px] uppercase tracking-wider">
                Syllabus Pro
              </span>
              <span className="text-[8px] font-bold text-slate-400 mt-2 block">100% On-schedule tasks</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default StaffPerformancePanel;
