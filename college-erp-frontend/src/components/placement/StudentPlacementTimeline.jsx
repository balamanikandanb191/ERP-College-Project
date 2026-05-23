import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, PieChart, ShieldAlert, Award, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import PlacementProgressCard from './PlacementProgressCard';
import PlacementStatusModal from './PlacementStatusModal';
import PlacementAnalytics from './PlacementAnalytics';

// Helper to generate initial standard timeline steps
const generateInitialTimeline = () => [
  { id: 'registered', label: 'Registered', status: 'completed', date: '02 May' },
  { id: 'eligible', label: 'Eligible', status: 'completed', date: '04 May' },
  { id: 'aptitude', label: 'Aptitude', status: 'pending', date: '' },
  { id: 'gd', label: 'GD Round', status: 'pending', date: '' },
  { id: 'technical', label: 'Technical', status: 'pending', date: '' },
  { id: 'hr', label: 'HR Interview', status: 'pending', date: '' },
  { id: 'selected', label: 'Selection', status: 'pending', date: '' },
  { id: 'offer_letter', label: 'Offer Letter', status: 'pending', date: '' }
];

const StudentPlacementTimeline = ({ 
  dashboardStats = {}, 
  setDashboardStats = () => {},
  students = [],
  setStudents = () => {}
}) => {
  const studentsTimeline = students;
  const setStudentsTimeline = setStudents;

  // Expandable Dashboard Toggle state
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Search and Advanced Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPackage, setSelectedPackage] = useState('All');

  // Modal active states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStudent, setModalStudent] = useState(null);

  // Sync state changes with Placement Dashboard Stats
  useEffect(() => {
    // Perform dynamic recalculations
    const allPlacedStudents = studentsTimeline.filter(s => 
      s.applications?.some(a => a.status === 'Placed')
    );

    const packages = allPlacedStudents.flatMap(s => 
      s.applications?.filter(a => a.status === 'Placed').map(a => Number(a.packageOffered)) ?? []
    ).filter(p => !isNaN(p) && p > 0);

    const totalPlaced = allPlacedStudents.length;
    const highestPkg = packages.length > 0 ? Math.max(...packages) : 0;
    const avgPkg = packages.length > 0 
      ? Number((packages.reduce((sum, val) => sum + val, 0) / packages.length).toFixed(2)) 
      : 0;

    const totalRejections = studentsTimeline.filter(s => 
      s.applications?.every(a => a.status === 'Rejected')
    ).length;

    const placementPct = studentsTimeline.length > 0 
      ? Math.round((totalPlaced / studentsTimeline.length) * 100) 
      : 0;

    // Safely update parent context stats
    if (typeof setDashboardStats === 'function') {
      setDashboardStats(prev => ({
        ...prev,
        studentsPlaced: totalPlaced,
        highestPackage: highestPkg,
        averagePackage: avgPkg,
        successPercentage: placementPct
      }));
    }
  }, [studentsTimeline]);

  // Search & Filter Execution
  const filteredStudents = (studentsTimeline ?? []).filter(student => {
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.reg?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'All' || student.dept === selectedDept;

    const matchesCompany = selectedCompany === 'All' || 
      student.applications?.some(a => a.company === selectedCompany);

    const matchesStatus = selectedStatus === 'All' || 
      student.applications?.some(a => a.status === selectedStatus);

    const matchesPackage = selectedPackage === 'All' || (() => {
      const placedApp = student.applications?.find(a => a.status === 'Placed');
      if (!placedApp || !placedApp.packageOffered) return false;
      const pkg = Number(placedApp.packageOffered);
      if (selectedPackage === 'low') return pkg < 5;
      if (selectedPackage === 'mid') return pkg >= 5 && pkg <= 10;
      if (selectedPackage === 'high') return pkg > 10;
      return true;
    })();

    return matchesSearch && matchesDept && matchesCompany && matchesStatus && matchesPackage;
  });

  const handleOpenStatusModal = (studentObj) => {
    setModalStudent(studentObj);
    setIsModalOpen(true);
  };

  const handleSaveTimelineStatus = (studentId, companyName, updatedDetails) => {
    const studentObj = studentsTimeline.find(s => s.id === studentId);
    if (!studentObj) return;

    const updatedStudents = studentsTimeline.map(student => {
      if (student.id === studentId) {
        const updatedApps = (student.applications ?? []).map(app => {
          if (app.company === companyName) {
            return {
              ...app,
              ...updatedDetails
            };
          }
          return app;
        });

        // Determine if they were placed
        const isPlacedNow = updatedDetails.status === 'Placed';

        return {
          ...student,
          applications: updatedApps,
          status: isPlacedNow ? 'placed' : updatedDetails.status === 'Rejected' ? 'rejected' : 'in_progress',
          companySelected: isPlacedNow ? companyName : student.companySelected,
          packageOffered: isPlacedNow ? Number(updatedDetails.packageOffered || student.packageOffered || 0) : student.packageOffered,
          placementDate: isPlacedNow ? new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : student.placementDate
        };
      }
      return student;
    });

    setStudentsTimeline(updatedStudents);

    // Check if status transitioned to placed, and trigger automatic broadcast announcement!
    const wasPlaced = studentObj.status === 'placed';
    const isPlaced = updatedStudents.find(s => s.id === studentId)?.status === 'placed';

    if (!wasPlaced && isPlaced) {
      const pOffered = updatedDetails.packageOffered || studentObj.packageOffered || '8.0';
      
      // 1. Add announcement inside the central Communications local storage cache
      const newAnnouncement = {
        id: Date.now(),
        title: `🎉 Congratulations: ${studentObj.name} placed at ${companyName}!`,
        cat: 'Placement',
        date: 'Just now',
        priority: 'Important',
        author: 'Training & Placement Office',
        content: `🎉 Placement Achievement Announcement\n\nCongratulations to:\n${studentObj.name}\n\nDepartment:\n${studentObj.dept}\n\nPlaced At:\n${companyName}\n\nPackage:\n₹${pOffered} LPA\n\nPlacement Type:\nFull Time / PPO\n\nDate:\n${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}\n\nStatus:\nSuccessfully placed through campus recruitment drive.`
      };
      
      const currentAnnouncements = (() => {
        try { return JSON.parse(localStorage.getItem('edu_erp_placement_announcements')) || []; } catch (e) { return []; }
      })();
      localStorage.setItem('edu_erp_placement_announcements', JSON.stringify([newAnnouncement, ...currentAnnouncements]));

      // 2. Add dynamic feed activity notification
      const newNotification = {
        id: Date.now(),
        message: `${studentObj.name} successfully placed at ${companyName} for ₹${pOffered} LPA!`,
        timestamp: 'Just now',
        priority: 'high',
        type: 'placed'
      };
      const currentNotifications = (() => {
        try { return JSON.parse(localStorage.getItem('edu_erp_placement_notifications')) || []; } catch (e) { return []; }
      })();
      localStorage.setItem('edu_erp_placement_notifications', JSON.stringify([newNotification, ...currentNotifications]));

      toast.success(`🎉 Automatic broadcast announcement created for ${studentObj.name}!`);
      window.dispatchEvent(new Event('storage'));
    }
  };

  // Safe unique lists for Filter Dropdowns
  const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT'];
  const companies = ['Zoho', 'TCS', 'Cognizant', 'Wipro', 'Infosys'];
  const statuses = ['Placed', 'In Progress', 'Rejected', 'Applied'];

  return (
    <div className="space-y-8 animate-fade-in text-slate-700">
      
      {/* Sleek expandable Placement Intelligence bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[35px] text-white p-6 shadow-2xl flex flex-col gap-6 transition-all duration-300">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-black flex items-center gap-2">
              <Clock className="text-indigo-400" size={20} />
              Placement Analytics & Journeys
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Visualize recruitment stages and candidate placement intelligence
            </p>
          </div>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-all font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
          >
            {showAnalytics ? (
              <>Hide Charts <ChevronUp size={16} /></>
            ) : (
              <>Show Analytics Dashboard <ChevronDown size={16} /></>
            )}
          </button>
        </div>

        {/* Expandable Chart Module */}
        {showAnalytics && (
          <div className="pt-4 border-t border-white/10 animate-fade-in">
            <PlacementAnalytics students={studentsTimeline} />
          </div>
        )}
      </div>

      {/* Advanced Filter Panel */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Searching */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search student or register no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Filtering Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            
            {/* Dept */}
            <div className="space-y-0.5">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none focus:bg-white cursor-pointer"
              >
                <option value="All">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Company */}
            <div className="space-y-0.5">
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none focus:bg-white cursor-pointer"
              >
                <option value="All">All Companies</option>
                {companies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-0.5">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none focus:bg-white cursor-pointer"
              >
                <option value="All">All Statuses</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Salary Package */}
            <div className="space-y-0.5">
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none focus:bg-white cursor-pointer"
              >
                <option value="All">All Package Ranges</option>
                <option value="low">&lt; 5 LPA</option>
                <option value="mid">5 - 10 LPA</option>
                <option value="high">&gt; 10 LPA</option>
              </select>
            </div>

          </div>
        </div>

        {/* Active Filters count summary */}
        {(searchTerm || selectedDept !== 'All' || selectedCompany !== 'All' || selectedStatus !== 'All' || selectedPackage !== 'All') && (
          <div className="flex justify-between items-center pt-2 border-t border-slate-100/60">
            <span className="text-[10px] font-bold text-slate-400">
              Found <strong className="text-slate-700">{filteredStudents.length}</strong> matching candidates
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('All');
                setSelectedCompany('All');
                setSelectedStatus('All');
                setSelectedPackage('All');
              }}
              className="text-[9px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Candidates Progress Journey Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStudents.map(student => (
          <PlacementProgressCard 
            key={student.id} 
            student={student} 
            onOpenStatusModal={handleOpenStatusModal}
          />
        ))}

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="col-span-full bg-slate-50 border border-slate-200 border-dashed rounded-[35px] py-16 text-center text-slate-400">
            <ShieldAlert size={48} className="mx-auto mb-2 opacity-35" />
            <h4 className="font-black text-sm text-slate-700">No candidates match your search</h4>
            <p className="text-xs mt-1 max-w-sm mx-auto">Try resetting filters or adjusting search terms to view student recruitment timelines.</p>
          </div>
        )}
      </div>

      {/* Single shared TPO Status Manager Modal */}
      <PlacementStatusModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalStudent(null);
        }}
        student={modalStudent}
        onSave={handleSaveTimelineStatus}
      />

    </div>
  );
};

export default StudentPlacementTimeline;
