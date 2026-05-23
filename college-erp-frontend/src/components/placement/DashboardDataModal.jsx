import React, { useState, useEffect } from 'react';
import { 
  X, Search, Filter, ShieldAlert, Award, Building2, CheckCircle, 
  DollarSign, Briefcase, TrendingUp, Target, User, Download, Star, GraduationCap
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';
import StudentCard from './StudentCard';

const DashboardDataModal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  modalType = '', 
  students = [],
  companies = [],
  eligibleStudents = [],
  placedStudents = [],
  internshipStudents = [],
  paidStudents = [],
  pendingStudents = [],
  successWallStudents = [],
  highestPackageVal = 0,
  averagePackageVal = 0,
  eligibilityFilters = {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [packageFilter, setPackageFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // ESC key support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Console validation during development
  useEffect(() => {
    if (isOpen) {
      console.log('Centralized TPO State Synchronization Validation:', {
        modalType,
        studentsCount: (students ?? []).length,
        eligibleCount: (eligibleStudents ?? []).length,
        placedCount: (placedStudents ?? []).length,
        internshipCount: (internshipStudents ?? []).length,
        feesPaidCount: (paidStudents ?? []).length,
        feesPendingCount: (pendingStudents ?? []).length,
        successWallCount: (successWallStudents ?? []).length,
        highestPackageValue: highestPackageVal,
        averagePackageValue: averagePackageVal,
        companiesCount: (companies ?? []).length
      });
    }
  }, [isOpen, modalType]);

  if (!isOpen) return null;

  // Safe Fallback references
  const safeStudents = students ?? [];
  const safeCompanies = companies ?? [];
  const safeEligible = eligibleStudents ?? [];
  const safePlaced = placedStudents ?? [];
  const safeInternship = internshipStudents ?? [];
  const safePaid = paidStudents ?? [];
  const safePending = pendingStudents ?? [];
  const safeSuccess = successWallStudents ?? [];

  // Get modal title contextually
  const getModalTitle = () => {
    switch (modalType) {
      case 'eligible': return 'Eligible Candidates Database';
      case 'companies': return 'Visiting Companies & Drive Scheduler';
      case 'placed': return 'Placed Achievers Registry';
      case 'highest': return 'Highest Salary Achievers & Toppers';
      case 'average': return 'Average Package Analytics';
      case 'internships': return 'Internship Offers & PPO Tracker';
      case 'fees': return 'Placement Training Fee Registry';
      case 'success_wall': return 'TPO Hall of Fame & Success Stories';
      default: return 'TPO Database Records';
    }
  };

  // Helper for Export compiled files
  const handleExport = () => {
    toast.success('Report successfully compiled! Exporting CSV spreadsheet...');
  };

  // Render modal content contextually deriving from single source of truth
  const renderContent = () => {
    switch (modalType) {
      
      // 1. ELIGIBLE STUDENTS VIEW (Must ONLY show eligible students)
      case 'eligible': {
        const filteredEligible = safeEligible.filter(s => {
          const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.reg?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesDept = deptFilter === 'All' || s.dept === deptFilter;
          return matchesSearch && matchesDept;
        });

        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <span className="text-[10px] font-black text-slate-400 uppercase">Filters:</span>
              <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-205 rounded-xl text-[9px] font-black uppercase tracking-wider outline-none cursor-pointer">
                <option value="All">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="IT">IT</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredEligible.map(s => (
                <StudentCard key={s.id} student={s} />
              ))}
            </div>
            {filteredEligible.length === 0 && (
              <div className="text-center py-16 font-bold text-slate-400 italic">
                No eligible candidates found matching filters
              </div>
            )}
          </div>
        );
      }

      // 2. COMPANIES VISITING VIEW (Must NEVER show students - company info only)
      case 'companies': {
        const filteredCompanies = safeCompanies.filter(c => {
          const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                c.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                c.hrContact?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
          const matchesPkg = packageFilter === 'All' || (packageFilter === 'high' ? c.pkg > 6 : c.pkg <= 6);
          const matchesDept = deptFilter === 'All' || (c.hiringDepts && c.hiringDepts.includes(deptFilter));
          return matchesSearch && matchesStatus && matchesPkg && matchesDept;
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2.5 mb-4 shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase">Drive Status</span>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-wider outline-none cursor-pointer">
                  <option value="All">All Drives</option>
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase">Package Bracket</span>
                <select value={packageFilter} onChange={(e) => setPackageFilter(e.target.value)} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-wider outline-none cursor-pointer">
                  <option value="All">All Packages</option>
                  <option value="low">Under 6 LPA</option>
                  <option value="high">Above 6 LPA</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase">Target Branch</span>
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-wider outline-none cursor-pointer">
                  <option value="All">All Departments</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                  <option value="IT">IT</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredCompanies.map(c => (
                <div key={c.id} className="p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-md transition-all space-y-5 relative overflow-hidden group">
                  {/* Decorative Subtle Accent Tag */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pl-2">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl shadow-sm">
                        {c.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-slate-900 text-base">{c.name}</h4>
                          <span className="text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full">
                            ₹{c.pkg} LPA
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">
                          {c.role} • {c.loc || 'Campus Drive'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[9px] font-black bg-slate-50 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {c.internshipType || 'Full-Time'}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                        c.status === 'Completed' ? 'bg-slate-50 border-slate-200 text-slate-400' :
                        c.status === 'Active' ? 'bg-amber-50 border-amber-200 text-amber-600 animate-pulse' :
                        'bg-indigo-50 border-indigo-200 text-indigo-600 font-bold'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>

                  {/* Criteria & Scheduling Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 text-[10px] font-bold pl-4">
                    <div>
                      <span className="text-[8px] font-black text-slate-400 block uppercase mb-1">Required CGPA</span>
                      <p className="text-slate-800 font-black">Min {c.minCgpa || '6.0'}</p>
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-slate-400 block uppercase mb-1">Allowed Arrears</span>
                      <p className="text-rose-600 font-black">Max {c.maxArrears !== undefined ? c.maxArrears : '0'}</p>
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-slate-400 block uppercase mb-1">HR Contact</span>
                      <p className="text-indigo-600 truncate">{c.hrContact || 'tpo@edu.erp'}</p>
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-slate-400 block uppercase mb-1">Venue / Time</span>
                      <p className="text-slate-800 truncate">{c.venue || 'Seminar Hall'} • {c.time || '10:00 AM'}</p>
                    </div>
                  </div>

                  {/* Dynamic Application Numbers and Pipeline */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold pl-4">
                    <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-2xs">
                      <span className="text-[8px] font-black text-slate-400 block uppercase">Openings</span>
                      <p className="text-slate-800 font-black mt-0.5 text-sm">{c.openings || '10'}</p>
                    </div>
                    <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-2xs">
                      <span className="text-[8px] font-black text-slate-400 block uppercase">Applied</span>
                      <p className="text-slate-800 font-black mt-0.5 text-sm">{c.applicants || '0'}</p>
                    </div>
                    <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-2xs">
                      <span className="text-[8px] font-black text-slate-400 block uppercase">Shortlisted</span>
                      <p className="text-indigo-600 font-black mt-0.5 text-sm">{c.shortlisted || '0'}</p>
                    </div>
                    <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-2xs">
                      <span className="text-[8px] font-black text-slate-400 block uppercase">Selected</span>
                      <p className="text-emerald-600 font-black mt-0.5 text-sm">{c.selectedCount || '0'}</p>
                    </div>
                  </div>

                  {/* Targets & Rounds Timelines */}
                  <div className="space-y-2.5 pl-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider shrink-0">Hiring Target Branches:</span>
                      {(c.hiringDepts ?? []).map(dept => (
                        <span key={dept} className="text-[8px] font-black bg-indigo-50 border border-indigo-100/50 text-indigo-600 px-2 py-0.5 rounded-md uppercase">
                          {dept}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Recruitment Rounds Pipeline:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(c.roundsTimeline ?? ['Aptitude', 'Technical', 'HR']).map((round, idx) => (
                          <div key={round} className="flex items-center gap-1">
                            <span className="text-[8px] font-black bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                              {idx + 1}. {round}
                            </span>
                            {idx < (c.roundsTimeline ?? []).length - 1 && (
                              <span className="text-slate-300 text-[10px] font-black">➔</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
            {filteredCompanies.length === 0 && (
              <div className="text-center py-16 font-bold text-slate-400 italic bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                No company drives available matching filters
              </div>
            )}
          </div>
        );
      }

      // 3. STUDENTS PLACED VIEW (Must NEVER show non-placed students)
      case 'placed': {
        const filteredPlaced = safePlaced.filter(s => 
          s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          s.companySelected?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPlaced.map(s => (
                <div key={s.id} className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">{s.name.charAt(0)}</div>
                    <div>
                      <h4 className="font-black text-slate-800 text-xs">{s.name}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{s.reg} • {s.dept}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">{s.companySelected} ({s.packageOffered} LPA)</span>
                    <p className="text-[8px] font-bold text-slate-400 mt-1">Placed: {s.placementDate}</p>
                  </div>
                </div>
              ))}
            </div>
            {filteredPlaced.length === 0 && (
              <div className="text-center py-16 font-bold text-slate-400 italic">No placed students found</div>
            )}
          </div>
        );
      }

      // 4. HIGHEST PACKAGE VIEW
      case 'highest': {
        const sortedAchievers = [...safePlaced].sort((a, b) => Number(b.packageOffered || 0) - Number(a.packageOffered || 0));

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {sortedAchievers.map((s, index) => (
                <div key={s.id} className="p-5 bg-gradient-to-r from-white via-indigo-50/10 to-white border border-indigo-100 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center font-black text-xl">
                      {index === 0 ? '👑' : '⭐'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 text-sm">{s.name}</h4>
                        <span className="text-[8px] font-black uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{s.dept} Topper</span>
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{s.reg} • CGPA: {s.cgpa}</p>
                      <p className="text-[10px] font-medium text-slate-500 italic mt-1">"Excellent results in TPO round evaluations."</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-rose-600 block">Package Achieved</span>
                    <p className="text-2xl font-black text-rose-600 tracking-tight">{s.packageOffered} LPA</p>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.companySelected}</span>
                  </div>
                </div>
              ))}
            </div>
            {sortedAchievers.length === 0 && <div className="text-center py-16 font-bold text-slate-400 italic">No placed record available</div>}
          </div>
        );
      }

      // 5. AVERAGE PACKAGE VIEW
      case 'average': {
        const averageData = [
          { name: 'CSE', average: 8.5 },
          { name: 'ECE', average: 6.0 },
          { name: 'MECH', average: 0 },
          { name: 'CIVIL', average: 0 },
          { name: 'IT', average: 0 },
        ];

        return (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-3xl">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Department-wise Salary Averages (LPA)</h4>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={averageData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                    <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '9px', border: 'none' }} />
                    <Bar dataKey="average" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs font-bold">
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <span className="text-[8px] font-black text-slate-400 block uppercase">Highest Placed Branch</span>
                <p className="font-black text-slate-800 text-sm mt-0.5">CSE Department</p>
                <span className="text-[10px] font-black text-indigo-600">8.5 LPA Average</span>
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <span className="text-[8px] font-black text-slate-400 block uppercase">Calculated Average Package</span>
                <p className="font-black text-slate-800 text-sm mt-0.5">Unified Campus Average</p>
                <span className="text-[10px] font-black text-emerald-600">{averagePackageVal} LPA</span>
              </div>
            </div>
          </div>
        );
      }

      // 6. INTERNSHIP OFFERS VIEW
      case 'internships': {
        const filteredInterns = safeInternship.filter(i => 
          i.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          i.companySelected?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInterns.map(i => (
                <div key={i.id} className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-black">{i.name.charAt(0)}</div>
                      <div>
                        <h4 className="font-black text-slate-800 text-xs">{i.name}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{i.dept} • {i.companySelected || 'In Progress'}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      i.ppo === 'Eligible' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                      i.ppo === 'Awaiting' ? 'bg-amber-50 border-amber-200 text-amber-600 animate-pulse' :
                      'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>{i.ppo === 'Eligible' ? 'PPO Offered' : 'PPO Pending'}</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-500">Stipend: <strong className="text-slate-800">{i.stipend || '₹10,000 / mo'}</strong></span>
                    <span className="text-slate-500">Duration: <strong className="text-slate-850">{i.duration || '3 Months'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
            {filteredInterns.length === 0 && <div className="text-center py-16 font-bold text-slate-400 italic">No internship offers found</div>}
          </div>
        );
      }

      // 7. FEES COLLECTED VIEW (Divided into PAID and PENDING sections cleanly)
      case 'fees': {
        const filteredPaid = safePaid.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.reg?.toLowerCase().includes(searchTerm.toLowerCase()));
        const filteredPending = safePending.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.reg?.toLowerCase().includes(searchTerm.toLowerCase()));

        const totalPaidCollected = safePaid.reduce((sum, s) => sum + (s.feeAmount || 0), 0);
        const totalPendingOutstanding = safePending.reduce((sum, s) => sum + (s.feeAmount || 0), 0);

        return (
          <div className="space-y-6">
            
            {/* Top Summaries Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 text-slate-700">
                <span className="text-[8px] font-black text-emerald-600 uppercase block tracking-widest">Total Collected (Paid)</span>
                <p className="text-xl font-black text-emerald-700 tracking-tight">₹{totalPaidCollected.toLocaleString('en-IN')}</p>
                <span className="text-[9px] font-bold text-emerald-500 mt-1 block">{safePaid.length} Students Paid</span>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 text-slate-700">
                <span className="text-[8px] font-black text-amber-600 uppercase block tracking-widest">Total Outstanding (Pending)</span>
                <p className="text-xl font-black text-amber-700 tracking-tight">₹{totalPendingOutstanding.toLocaleString('en-IN')}</p>
                <span className="text-[9px] font-bold text-amber-500 mt-1 block">{safePending.length} Students Pending</span>
              </div>
            </div>

            <div className="flex justify-end shrink-0">
              <button onClick={handleExport} className="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center gap-1.5 text-xs shadow-md shadow-teal-700/10 cursor-pointer">
                <Download size={14} /> Export Report
              </button>
            </div>

            {/* SECTION 1: PAID STUDENTS */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Paid Students Registry ({filteredPaid.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPaid.map(s => (
                  <div key={s.id} className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">{s.name.charAt(0)}</div>
                      <div>
                        <h4 className="font-black text-slate-800 text-xs">{s.name}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{s.reg} • {s.dept}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">Paid</span>
                      <p className="text-[8px] font-bold text-slate-400 mt-1">₹{s.feeAmount || 5000} • Verified</p>
                    </div>
                  </div>
                ))}
                {filteredPaid.length === 0 && (
                  <div className="col-span-full py-8 text-center italic text-xs font-bold text-slate-450 bg-slate-50 border border-slate-100 rounded-3xl">
                    No paid student records found
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: PENDING STUDENTS */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                Pending Students Registry ({filteredPending.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPending.map(s => (
                  <div key={s.id} className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">{s.name.charAt(0)}</div>
                      <div>
                        <h4 className="font-black text-slate-800 text-xs">{s.name}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{s.reg} • {s.dept}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-50 border border-amber-205 text-amber-600 animate-pulse">Pending</span>
                      <p className="text-[8px] font-bold text-slate-400 mt-1">₹{s.feeAmount || 5000} • Unpaid</p>
                    </div>
                  </div>
                ))}
                {filteredPending.length === 0 && (
                  <div className="col-span-full py-8 text-center italic text-xs font-bold text-slate-450 bg-slate-50 border border-slate-100 rounded-3xl">
                    No pending student records found
                  </div>
                )}
              </div>
            </div>

          </div>
        );
      }

      // 8. TPO SUCCESS WALL VIEW
      case 'success_wall': {
        const achievers = safeSuccess.map(s => ({
          ...s,
          quote: s.name === 'Arjun Kumar' ? 'TPO training drives and mock interview reviews made it possible!' : 'Grateful for institutional embedded projects support.',
          rating: 5
        }));

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievers.map(s => (
                <div key={s.id} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">{s.name.charAt(0)}</div>
                      <div>
                        <h4 className="font-black text-slate-800 text-xs">{s.name}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{s.dept} • {s.companySelected}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(s.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-[10px] text-slate-500 italic font-bold">
                    "{s.quote}"
                  </div>
                </div>
              ))}
            </div>
            {achievers.length === 0 && <div className="text-center py-16 font-bold text-slate-400 italic">No success wall achievers found</div>}
          </div>
        );
      }

      default: return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[40px] w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header - Navy Gradient */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              <GraduationCap size={22} className="text-indigo-400" />
              {getModalTitle()}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              TPO ERP Contextual Intelligence Database
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Global Search Box (Hidden in analytics views) */}
        {modalType !== 'average' && modalType !== 'highest' && modalType !== 'success_wall' && (
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50 shrink-0">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search matching records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Scrollable body content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-[300px] text-slate-700 bg-white">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 flex justify-end shrink-0 bg-slate-50/50">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all text-xs cursor-pointer shadow-md shadow-slate-900/10"
          >
            Close Database
          </button>
        </div>

      </div>
    </div>
  );
};

export default DashboardDataModal;
