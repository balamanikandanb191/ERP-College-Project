import React, { useMemo } from 'react';
import { 
  TrendingUp, Award, AlertCircle, CheckCircle, 
  BookOpen, Star, BookMarked, GraduationCap 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, CartesianGrid, 
  XAxis, YAxis, Tooltip, Bar, Cell 
} from 'recharts';

const AcademicIntelligence = ({ student = {} }) => {
  const safeData = student || {};

  // Mock Academic profile variables built safely from central student data
  const cgpa = Number(safeData.cgpa || 7.5);
  const arrears = Number(safeData.arrears || 0);
  const deptRank = cgpa >= 9.0 ? 3 : (cgpa >= 8.0 ? 12 : (cgpa >= 7.0 ? 24 : 45));
  
  // Calculate dynamic status indicators
  const performanceStatus = cgpa >= 9.0 ? 'Elite Scholar' : 
                            (cgpa >= 8.0 ? 'Distinction' : 
                            (cgpa >= 6.0 ? 'First Class' : 'Average'));
  
  const performanceColor = cgpa >= 9.0 ? 'text-indigo-600 bg-indigo-50 border-indigo-200' :
                           (cgpa >= 8.0 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                           (cgpa >= 6.0 ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-rose-600 bg-rose-50 border-rose-200'));

  // Subject Performance Data
  const marksData = useMemo(() => {
    return [
      { name: 'Mathematics', score: Math.round(cgpa * 11) + 5, max: 100 },
      { name: 'Data Struct.', score: Math.round(cgpa * 12) + 2, max: 100 },
      { name: 'Compiler Design', score: Math.round(cgpa * 10) + 8, max: 100 },
      { name: 'Web Tech.', score: Math.round(cgpa * 11.5) + 3, max: 100 },
      { name: 'Mini Project', score: Math.round(cgpa * 12) + 4, max: 100 },
    ].map(sub => ({
      ...sub,
      score: Math.min(100, Math.max(40, sub.score)) // Bound between 40 and 100
    }));
  }, [cgpa]);

  // Weak Subject Indicator
  const weakSubjects = useMemo(() => {
    return marksData.filter(s => s.score < 75);
  }, [marksData]);

  return (
    <div className="space-y-6">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Academic Intelligence</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Comprehensive curricular audits and scores dashboard</p>
        </div>
        
        {/* Performance status badge */}
        <span className={`px-4 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-wider ${performanceColor}`}>
          {performanceStatus}
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
            <GraduationCap size={20} />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Cumulative CGPA</span>
            <span className="text-lg font-black text-slate-800">{cgpa.toFixed(2)} / 10.0</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl">
            <Award size={20} />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Department Rank</span>
            <span className="text-lg font-black text-slate-800">#{deptRank} in {safeData.dept || 'CSE'}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className={`p-3 rounded-xl ${arrears > 0 ? 'bg-rose-50 border border-rose-100 text-rose-600' : 'bg-slate-50 border border-slate-100 text-slate-600'}`}>
            <AlertCircle size={20} />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Backlog History</span>
            <span className={`text-lg font-black ${arrears > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
              {arrears} Active Arrears
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-cyan-50 border border-cyan-100 text-cyan-600 rounded-xl">
            <BookMarked size={20} />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Semester Index</span>
            <span className="text-lg font-black text-slate-800">{safeData.semester || 'Semester VI'}</span>
          </div>
        </div>

      </div>

      {/* Main Charts & Indicators grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-600" />
            Subject-wise Marks Evaluation
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marksData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '10px' }}
                />
                <Bar dataKey="score" name="Score" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={35}>
                  {marksData.map((entry, index) => {
                    const color = entry.score >= 90 ? '#10b981' : (entry.score >= 75 ? '#4f46e5' : '#f59e0b');
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-4 mt-3 text-[9px] font-black uppercase tracking-wider">
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Excellent (90+)</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-indigo-500" /> Distinctions (75+)</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Passing (40+)</div>
          </div>
        </div>

        {/* Warning Indicator / Topper Box */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-600" />
            Remedial & Topper Audits
          </h4>

          {cgpa >= 9.0 && (
            <div className="bg-indigo-50 border border-indigo-100 text-indigo-950 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <Star size={16} fill="#4f46e5" className="text-indigo-600 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">Topper Candidate Flag</span>
              </div>
              <p className="text-[10px] font-bold text-indigo-700 leading-relaxed">
                Ranked in the top 3% of the department registry. Eligible for leadership commendations and high-tier research publications.
              </p>
            </div>
          )}

          {weakSubjects.length > 0 ? (
            <div className="bg-amber-50 border border-amber-100 text-amber-950 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-600" />
                <span className="text-[10px] font-black uppercase tracking-wider">Weak Areas Identified</span>
              </div>
              <p className="text-[10px] font-bold text-amber-700 leading-normal">
                Subject marks are below target 75% in:
              </p>
              <ul className="text-[9px] font-bold space-y-1 pl-4 list-disc text-amber-800">
                {weakSubjects.map((sub, idx) => (
                  <li key={idx} className="uppercase">{sub.name} ({sub.score}/100)</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-950 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600" />
                <span className="text-[10px] font-black uppercase tracking-wider">Perfect Curricular Health</span>
              </div>
              <p className="text-[10px] font-bold text-emerald-700 leading-relaxed">
                All subject performance indicators currently clear the 75% baseline standard. No weak subject remedial training required!
              </p>
            </div>
          )}

          {/* Marks Breakdown Mini Table */}
          <div className="space-y-2 pt-2">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Continuous Evaluation Scores</span>
            <div className="grid grid-cols-2 gap-2 text-[9px] font-bold uppercase">
              <div className="bg-white border border-slate-200/60 p-2 rounded-xl text-center">
                <span className="text-slate-400 block text-[7px] font-black">Internal Assessment</span>
                <span className="text-slate-800 font-black">46 / 50</span>
              </div>
              <div className="bg-white border border-slate-200/60 p-2 rounded-xl text-center">
                <span className="text-slate-400 block text-[7px] font-black">Lab clearing metrics</span>
                <span className="text-slate-800 font-black">18 / 20</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AcademicIntelligence;
