import React from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend
} from 'recharts';
import { PieChart as ChartIcon, BarChart2, TrendingUp, Award, Users } from 'lucide-react';

const PlacementAnalytics = ({ students = [] }) => {
  // Safe extraction with fallback array
  const studentList = students ?? [];

  // 1. Process Department Selection Data
  const deptDataMap = {};
  studentList.forEach(student => {
    const dept = student.dept ?? 'Unknown';
    const isPlaced = student.applications?.some(app => app.status === 'Placed');
    
    if (!deptDataMap[dept]) {
      deptDataMap[dept] = { name: dept, placed: 0, total: 0 };
    }
    deptDataMap[dept].total += 1;
    if (isPlaced) {
      deptDataMap[dept].placed += 1;
    }
  });
  
  const deptChartData = Object.values(deptDataMap);

  // 2. Process Company Hiring Count
  const companyDataMap = {};
  studentList.forEach(student => {
    student.applications?.forEach(app => {
      if (app.status === 'Placed') {
        const company = app.company ?? 'Other';
        if (!companyDataMap[company]) {
          companyDataMap[company] = { name: company, count: 0 };
        }
        companyDataMap[company].count += 1;
      }
    });
  });
  const companyChartData = Object.values(companyDataMap);

  // 3. Process Round-wise Elimination Data
  // (Calculate total cleared at each stage across all active applications)
  const roundCounts = {
    Registered: 0,
    Eligible: 0,
    Aptitude: 0,
    GD: 0,
    Technical: 0,
    HR: 0,
    Selected: 0
  };

  studentList.forEach(student => {
    student.applications?.forEach(app => {
      app.timeline?.forEach(stage => {
        if (stage.status === 'completed' || stage.status === 'cleared') {
          if (stage.id === 'registered') roundCounts.Registered += 1;
          if (stage.id === 'eligible') roundCounts.Eligible += 1;
          if (stage.id === 'aptitude') roundCounts.Aptitude += 1;
          if (stage.id === 'gd') roundCounts.GD += 1;
          if (stage.id === 'technical') roundCounts.Technical += 1;
          if (stage.id === 'hr') roundCounts.HR += 1;
          if (stage.id === 'selected') roundCounts.Selected += 1;
        }
      });
    });
  });

  const roundChartData = [
    { name: 'Register', count: roundCounts.Registered },
    { name: 'Eligible', count: roundCounts.Eligible },
    { name: 'Aptitude', count: roundCounts.Aptitude },
    { name: 'GD', count: roundCounts.GD },
    { name: 'Technical', count: roundCounts.Technical },
    { name: 'HR', count: roundCounts.HR },
    { name: 'Selected', count: roundCounts.Selected }
  ];

  // 4. Process Package Distribution (e.g. 3-5LPA, 5-8LPA, 8-12LPA, 12LPA+)
  const packageRanges = {
    '3 - 5 LPA': 0,
    '5 - 8 LPA': 0,
    '8 - 12 LPA': 0,
    '12+ LPA': 0
  };

  studentList.forEach(student => {
    student.applications?.forEach(app => {
      if (app.status === 'Placed' && app.packageOffered) {
        const pkg = Number(app.packageOffered);
        if (pkg >= 3 && pkg < 5) packageRanges['3 - 5 LPA'] += 1;
        else if (pkg >= 5 && pkg < 8) packageRanges['5 - 8 LPA'] += 1;
        else if (pkg >= 8 && pkg < 12) packageRanges['8 - 12 LPA'] += 1;
        else if (pkg >= 12) packageRanges['12+ LPA'] += 1;
      }
    });
  });

  const packageChartData = Object.keys(packageRanges).map(key => ({
    name: key,
    students: packageRanges[key]
  }));

  // 5. Dynamic Monthly Placements Progression
  const monthlyCounts = { 'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0, 'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0 };
  studentList.forEach(student => {
    if (student.placementDate) {
      const match = student.placementDate.match(/[A-Za-z]+/);
      if (match) {
        const month = match[0].substring(0, 3);
        if (monthlyCounts[month] !== undefined) {
          monthlyCounts[month]++;
        }
      }
    }
  });
  const monthlyChartData = Object.keys(monthlyCounts).map(month => ({
    name: month,
    placements: monthlyCounts[month]
  })).filter(item => item.placements > 0 || ['May', 'Jun', 'Jul'].includes(item.name));

  // 6. Dynamic Internship Conversion PPO Rates
  let internshipCount = 0;
  let ppoCount = 0;
  studentList.forEach(student => {
    if (student.internshipStatus === 'Active' || student.internshipStatus === 'Completed') {
      internshipCount++;
    }
    if (student.ppoStatus === 'Offered' || student.applications?.some(a => a.ppo === 'Eligible')) {
      ppoCount++;
    }
  });
  const internshipChartData = [
    { name: 'Total Interns', count: internshipCount || 1 },
    { name: 'PPO Offers', count: ppoCount }
  ];

  // 5. Success Percentage Calculator
  const totalStudents = studentList.length;
  const totalPlaced = studentList.filter(s => s.applications?.some(a => a.status === 'Placed')).length;
  const successRate = totalStudents > 0 ? Math.round((totalPlaced / totalStudents) * 100) : 0;

  const successPieData = [
    { name: 'Placed', value: totalPlaced },
    { name: 'Unplaced', value: Math.max(0, totalStudents - totalPlaced) }
  ];

  const PIE_COLORS = ['#10b981', '#cbd5e1'];
  const GRADIENT_COLORS = ['#4f46e5', '#a855f7', '#ec4899', '#f43f5e', '#3b82f6'];

  if (studentList.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-[32px] p-8 text-center text-slate-400">
        <ChartIcon size={48} className="mx-auto mb-2 opacity-35" />
        <p className="font-bold text-sm">No timeline data available to generate placement analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-[24px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Tracked</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalStudents}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-[24px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Students Placed</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{totalPlaced}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-[24px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Placement Rate</span>
            <h3 className="text-2xl font-black text-indigo-600 mt-1">{successRate}%</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-[24px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Drives</span>
            <h3 className="text-2xl font-black text-amber-600 mt-1">
              {new Set(studentList.flatMap(s => s.applications?.map(a => a.company) ?? [])).size}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <BarChart2 size={20} />
          </div>
        </div>
      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Funnel Round-wise progress */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-600" />
            Recruitment Funnel (Round Clearances)
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roundChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Company Wise Hires */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart2 size={16} className="text-indigo-600" />
            Hiring Distribution by Company
          </h4>
          <div className="h-64">
            {companyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '10px' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} maxBarSize={40}>
                    {companyChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400 italic">
                No active hiring recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Department Selection Rate */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ChartIcon size={16} className="text-indigo-600" />
            Selection Metrics by Department
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '10px' }}
                />
                <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                <Bar dataKey="placed" name="Placed Students" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="total" name="Total Candidates" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Package Range Allocation */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-600" />
            Salary Package Distribution
          </h4>
          <div className="h-64">
            {Object.values(packageRanges).some(v => v > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={packageChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPkg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="students" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPkg)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400 italic">
                No active packages recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Chart 5: Monthly Placement Trend */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-600" />
            Monthly Placements Timeline Trend
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMonth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="placements" name="Placements" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMonth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Internship & PPO Rates */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award size={16} className="text-indigo-600" />
            Internship Conversion & PPO Evaluation
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={internshipChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '10px' }}
                />
                <Bar dataKey="count" name="Count" fill="#06b6d4" radius={[8, 8, 0, 0]} maxBarSize={40}>
                  <Cell fill="#06b6d4" />
                  <Cell fill="#10b981" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlacementAnalytics;
