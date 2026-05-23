import React from 'react';
import {
  Plus,
  Users,
  Building2,
  CheckCircle,
  TrendingUp,
  Award,
  Briefcase,
  DollarSign,
  Target,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import UpcomingDrivesWidget from './UpcomingDrivesWidget';
import ActivityFeedWidget from './ActivityFeedWidget';
import AIRiskEngine from './AIRiskEngine';

const StatCard = ({ title, value, subValue, icon: Icon, colorClass, delay, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up ${onClick ? 'cursor-pointer' : ''}`} 
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${colorClass} text-white shadow-lg`}>
        {Icon ? <Icon size={24} /> : <div className="w-6 h-6 bg-white/20 rounded" />}
      </div>
      <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
        <ArrowUpRight size={14} />
        <span className="text-[10px] font-black">Live</span>
      </div>
    </div>
    <div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1">{title || 'STAT'}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-slate-900">{value ?? '0'}</span>
        {subValue && <span className="text-xs font-bold text-slate-500">{subValue}</span>}
      </div>
    </div>
  </div>
);

const PlacementInchargeCard = ({ onOpenDriveModal, onOpenOfficerModal, onOpenOfficerDrawer }) => (
  <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100 border-l-8 border-indigo-500 animate-fade-in-up">
    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
      <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 p-1 shrink-0 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" alt="TPO" className="w-full h-full object-cover rounded-2xl" />
      </div>
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-2xl font-black mb-1 tracking-tight">Dr. Anand K. Varma</h3>
        <p className="text-indigo-400 font-bold uppercase text-[10px] tracking-widest mb-4">Head of Training & Placement (TPO)</p>
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] font-black text-slate-400 uppercase">Room:</span>
              <span className="text-xs font-bold">Admin Block, Room 204</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] font-black text-slate-400 uppercase">Exp:</span>
              <span className="text-xs font-bold">12+ Years</span>
           </div>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
         <button 
           onClick={() => {
             console.log('Opening officer details drawer');
             onOpenOfficerDrawer?.();
           }}
           className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer"
         >
           <Users size={20}/>
         </button>
         <button 
           onClick={() => {
             console.log('Opening add officer modal');
             onOpenOfficerModal?.();
           }}
           className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl border border-indigo-400 shadow-lg shadow-indigo-500/20 transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
         >
           <Plus size={20}/>
         </button>
      </div>
    </div>
    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
  </div>
);

const PlacementDashboard = ({ 
  dashboardStats, 
  loading, 
  onOpenDriveModal, 
  onOpenOfficerModal, 
  onOpenOfficerDrawer,
  onOpenEligibleStudentsModal,
  onCardClick,
  students = [],
  companies = []
}) => {
  // Fix safeData reference error and add crash-proof fallbacks
  const safeData = dashboardStats || {
     eligibleStudents: 0,
     companiesVisiting: 0,
     studentsPlaced: 0,
     highestPackage: 0,
     averagePackage: 0,
     internshipOffers: 0,
     feesCollected: 0,
     successWall: 0,
     feesPaidStudents: 0,
     feesPendingStudents: 0,
     successPercentage: 0
  };

  const deptData = [
    { name: 'CSE', placed: 85, total: 120 },
    { name: 'ECE', placed: 75, total: 110 },
    { name: 'MECH', placed: 45, total: 90 },
    { name: 'CIVIL', placed: 35, total: 80 },
    { name: 'IT', placed: 72, total: 90 },
  ];

  // Prevent divide by zero
  const feeTotal = (Number(safeData?.feesPaidStudents) || 0) + (Number(safeData?.feesPendingStudents) || 0);
  const feePercentage = feeTotal > 0 ? Math.round(((Number(safeData?.feesPaidStudents) || 0) / feeTotal) * 100) : 0;
  const pieData = [
    { name: 'Paid', value: Number(safeData?.feesPaidStudents) || 0 },
    { name: 'Pending', value: Number(safeData?.feesPendingStudents) || 0 },
  ];

  if (loading) return (
    <div className="space-y-6">
       <div className="h-40 bg-slate-100 rounded-[40px] animate-pulse"></div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
         {[...Array(8)].map((_, i) => <div key={i} className="h-32 bg-slate-100 rounded-[32px]"></div>)}
       </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PlacementInchargeCard 
        onOpenDriveModal={onOpenDriveModal} 
        onOpenOfficerModal={onOpenOfficerModal}
        onOpenOfficerDrawer={onOpenOfficerDrawer}
      />
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Eligible Students" value={safeData?.eligibleStudents ?? 0} subValue="Students" icon={Users} colorClass="bg-blue-600" delay={0} onClick={() => onCardClick?.('eligible')} />
        <StatCard title="Companies Visiting" value={safeData?.companiesVisiting ?? 0} subValue="Active" icon={Building2} colorClass="bg-purple-600" delay={100} onClick={() => onCardClick?.('companies')} />
        <StatCard title="Students Placed" value={safeData?.studentsPlaced ?? 0} subValue={`${safeData?.successPercentage ?? 0}%`} icon={CheckCircle} colorClass="bg-emerald-600" delay={200} onClick={() => onCardClick?.('placed')} />
        <StatCard title="Highest Package" value={`₹${(Number(safeData?.highestPackage) || 0).toFixed(1)} LPA`} subValue="Max LPA" icon={TrendingUp} colorClass="bg-rose-600" delay={300} onClick={() => onCardClick?.('highest')} />
        <StatCard title="Average Package" value={`₹${(Number(safeData?.averagePackage) || 0).toFixed(2)} LPA`} subValue="Avg LPA" icon={Target} colorClass="bg-indigo-600" delay={400} onClick={() => onCardClick?.('average')} />
        <StatCard title="Internship Offers" value={safeData?.internshipOffers ?? 0} subValue="Verified" icon={Briefcase} colorClass="bg-cyan-600" delay={500} onClick={() => onCardClick?.('internships')} />
        <StatCard title="Fees Collected" value={`₹${(Number(safeData?.feesCollected) || 0).toLocaleString('en-IN')}`} subValue={`${safeData?.feesPaidStudents || 0} Paid • ${safeData?.feesPendingStudents || 0} Pending`} icon={DollarSign} colorClass="bg-teal-600" delay={600} onClick={() => onCardClick?.('fees')} />
        <StatCard title="TPO Success Wall" value={safeData?.successWall ?? 0} subValue="Offers" icon={Award} colorClass="bg-amber-600" delay={700} onClick={() => onCardClick?.('success_wall')} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Department-wise Success</h3>
              <p className="text-sm text-slate-500 font-medium">Placement percentage by engineering branch</p>
            </div>
          </div>
          <div className="h-80 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="placed" fill="#4f46e5" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 text-center">Fee Collection</h3>
          <p className="text-sm text-slate-500 font-medium text-center mb-6">Placement training fee status</p>
          <div className="h-64 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData || []}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={10}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f1f5f9" />
                  </Pie>
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-800">{feePercentage}%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase">Collected</span>
             </div>
          </div>
          <div className="mt-6 space-y-3 w-full">
             <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-2xl">
                <span className="text-xs font-bold text-emerald-700">Paid Students</span>
                <span className="text-sm font-black text-emerald-900">{safeData?.feesPaidStudents ?? 0}</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                <span className="text-xs font-bold text-slate-500">Pending Students</span>
                <span className="text-sm font-black text-slate-800">{safeData?.feesPendingStudents ?? 0}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid for Upgraded Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UpcomingDrivesWidget companies={companies} />
        <ActivityFeedWidget />
        <AIRiskEngine students={students} />
      </div>
    </div>
  );
};

export default PlacementDashboard;
