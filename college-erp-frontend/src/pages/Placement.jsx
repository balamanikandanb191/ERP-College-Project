import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, Building2, Users, GraduationCap, 
  TrendingUp, DollarSign, Award, Calendar, 
  PieChart, Search, Plus, Filter, Download,
  CheckCircle, Clock, AlertCircle, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import SafeErrorBoundary from '../components/SafeErrorBoundary';

// Sub-components
import PlacementDashboard from '../components/placement/PlacementDashboard';
import CompanyManagement from '../components/placement/CompanyManagement';
import PlacementFees from '../components/placement/PlacementFees';
import EligibilityChecker from '../components/placement/EligibilityChecker';
import InternshipTracking from '../components/placement/InternshipTracking';
import NewDriveModal from '../components/placement/NewDriveModal';
import AddOfficerModal from '../components/placement/AddOfficerModal';
import OfficerDetailsDrawer from '../components/placement/OfficerDetailsDrawer';
import StudentPlacementTimeline from '../components/placement/StudentPlacementTimeline';
import DashboardDataModal from '../components/placement/DashboardDataModal';

const Placement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [showOfficerDrawer, setShowOfficerDrawer] = useState(false);
  
  // Eligible Candidates State
  const [showEligibleStudents, setShowEligibleStudents] = useState(false);
  const [eligibleStudentsList, setEligibleStudentsList] = useState([]);
  
  // Dashboard Contextual Drill-Down Modal State
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [dashboardModalType, setDashboardModalType] = useState('');

  // Base list of candidates with unified placement status, internship details, and fees status.
  const [students, setStudentsState] = useState(() => {
    const cached = localStorage.getItem('edu_erp_placement_students');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { console.error('Cache parse failed:', e); }
    }
    const initial = [
      { id: 1, name: 'Arjun Kumar', reg: 'REG001', cgpa: 8.5, arrears: 0, dept: 'CSE', feeStatus: 'Paid', feeAmount: 5000, resumeStatus: 'Approved', resumeAts: 88, mockParticipation: 'Yes', internshipStatus: 'Active', applicationsCount: 2, status: 'placed', companySelected: 'Zoho', packageOffered: 8.5, placementDate: '10 May 2026', stipend: '₹25,000 / mo', duration: '6 Months', ppo: 'Eligible', applications: [
        {
          company: 'Zoho',
          status: 'Placed',
          packageOffered: '8.5',
          hrRemarks: 'Outstanding skills in DSA and problem-solving rounds. Accepted role.',
          interviewDate: '2026-05-10',
          timeline: [
            { id: 'registered', label: 'Registered', status: 'completed', date: '02 May' },
            { id: 'eligible', label: 'Eligible', status: 'completed', date: '04 May' },
            { id: 'aptitude', label: 'Aptitude', status: 'cleared', date: '05 May' },
            { id: 'gd', label: 'GD Round', status: 'cleared', date: '06 May' },
            { id: 'technical', label: 'Technical', status: 'cleared', date: '08 May' },
            { id: 'hr', label: 'HR Interview', status: 'cleared', date: '09 May' },
            { id: 'selected', label: 'Selection', status: 'cleared', date: '10 May' },
            { id: 'offer_letter', label: 'Offer Letter', status: 'completed', date: '12 May' }
          ],
          offerLetter: {
            fileName: 'Arjun_Zoho_Offer.pdf',
            fileSize: '1.42 MB',
            uploadedAt: '12 May 2026',
            verificationStatus: 'Verified',
            acceptanceStatus: 'Accepted'
          }
        },
        {
          company: 'TCS',
          status: 'In Progress',
          packageOffered: '',
          hrRemarks: 'Cleared aptitude test and group discussion, awaiting technical interview dates.',
          interviewDate: '2026-05-24',
          timeline: [
            { id: 'registered', label: 'Registered', status: 'completed', date: '01 May' },
            { id: 'eligible', label: 'Eligible', status: 'completed', date: '03 May' },
            { id: 'aptitude', label: 'Aptitude', status: 'cleared', date: '05 May' },
            { id: 'gd', label: 'GD Round', status: 'cleared', date: '07 May' },
            { id: 'technical', label: 'Technical', status: 'in_progress', date: '' },
            { id: 'hr', label: 'HR Interview', status: 'pending', date: '' },
            { id: 'selected', label: 'Selection', status: 'pending', date: '' },
            { id: 'offer_letter', label: 'Offer Letter', status: 'pending', date: '' }
          ]
        }
      ]},
      { id: 2, name: 'Priya Singh', reg: 'REG002', cgpa: 7.2, arrears: 0, dept: 'ECE', feeStatus: 'Paid', feeAmount: 5000, resumeStatus: 'Approved', resumeAts: 81, mockParticipation: 'Yes', internshipStatus: 'Active', applicationsCount: 1, status: 'placed', companySelected: 'Cognizant', packageOffered: 6.0, placementDate: '11 May 2026', stipend: '₹20,000 / mo', duration: '3 Months', ppo: 'Eligible', applications: [
        {
          company: 'Cognizant',
          status: 'Placed',
          packageOffered: '6.0',
          hrRemarks: 'Impressed in embedded systems interview. Offer letter verified.',
          interviewDate: '2026-05-11',
          timeline: [
            { id: 'registered', label: 'Registered', status: 'completed', date: '03 May' },
            { id: 'eligible', label: 'Eligible', status: 'completed', date: '04 May' },
            { id: 'aptitude', label: 'Aptitude', status: 'cleared', date: '05 May' },
            { id: 'gd', label: 'GD Round', status: 'cleared', date: '06 May' },
            { id: 'technical', label: 'Technical', status: 'cleared', date: '08 May' },
            { id: 'hr', label: 'HR Interview', status: 'cleared', date: '10 May' },
            { id: 'selected', label: 'Selection', status: 'cleared', date: '11 May' },
            { id: 'offer_letter', label: 'Offer Letter', status: 'completed', date: '13 May' }
          ],
          offerLetter: {
            fileName: 'Priya_Cognizant_Offer.pdf',
            fileSize: '890 KB',
            uploadedAt: '13 May 2026',
            verificationStatus: 'Verified',
            acceptanceStatus: 'Accepted'
          }
        }
      ]},
      { id: 3, name: 'Rahul Varma', reg: 'REG003', cgpa: 6.1, arrears: 2, dept: 'MECH', feeStatus: 'Paid', feeAmount: 5000, resumeStatus: 'Pending', resumeAts: 65, mockParticipation: 'No', internshipStatus: 'None', applicationsCount: 1, status: 'rejected', applications: [
        {
          company: 'Wipro',
          status: 'Rejected',
          packageOffered: '',
          hrRemarks: 'Rejected in Technical Round. Found lacking in core mechanical concept applications.',
          interviewDate: '2026-05-15',
          timeline: [
            { id: 'registered', label: 'Registered', status: 'completed', date: '02 May' },
            { id: 'eligible', label: 'Eligible', status: 'completed', date: '03 May' },
            { id: 'aptitude', label: 'Aptitude', status: 'cleared', date: '05 May' },
            { id: 'gd', label: 'GD Round', status: 'cleared', date: '07 May' },
            { id: 'technical', label: 'Technical', status: 'rejected', date: '15 May' },
            { id: 'hr', label: 'HR Interview', status: 'pending', date: '' },
            { id: 'selected', label: 'Selection', status: 'pending', date: '' },
            { id: 'offer_letter', label: 'Offer Letter', status: 'pending', date: '' }
          ]
        }
      ]},
      { id: 4, name: 'Sneha Reddy', reg: 'REG004', cgpa: 9.1, arrears: 0, dept: 'IT', feeStatus: 'Pending', feeAmount: 5000, resumeStatus: 'Approved', resumeAts: 92, mockParticipation: 'Yes', internshipStatus: 'Active', applicationsCount: 1, status: 'in_progress', stipend: '₹30,000 / mo', duration: '6 Months', ppo: 'Awaiting', applications: [
        {
          company: 'Infosys',
          status: 'In Progress',
          packageOffered: '',
          hrRemarks: 'Scheduled for HR Interview after clear evaluation in GD and Tech.',
          interviewDate: '2026-05-25',
          timeline: [
            { id: 'registered', label: 'Registered', status: 'completed', date: '01 May' },
            { id: 'eligible', label: 'Eligible', status: 'completed', date: '04 May' },
            { id: 'aptitude', label: 'Aptitude', status: 'cleared', date: '06 May' },
            { id: 'gd', label: 'GD Round', status: 'cleared', date: '08 May' },
            { id: 'technical', label: 'Technical', status: 'cleared', date: '12 May' },
            { id: 'hr', label: 'HR Interview', status: 'in_progress', date: '' },
            { id: 'selected', label: 'Selection', status: 'pending', date: '' },
            { id: 'offer_letter', label: 'Offer Letter', status: 'pending', date: '' }
          ]
        }
      ]},
      { id: 5, name: 'Vikram Das', reg: 'REG005', cgpa: 6.8, arrears: 0, dept: 'CIVIL', feeStatus: 'Paid', feeAmount: 5000, resumeStatus: 'Rejected', resumeRejectionReason: 'Format must be single column, black & white only.', resumeAts: 52, mockParticipation: 'No', internshipStatus: 'Active', applicationsCount: 1, status: 'in_progress', stipend: '₹15,000 / mo', duration: '3 Months', ppo: 'Not Eligible', applications: [
        {
          company: 'Zoho',
          status: 'In Progress',
          packageOffered: '',
          hrRemarks: 'Cleared Aptitude. Scheduled for GD Round.',
          interviewDate: '2026-05-22',
          timeline: [
            { id: 'registered', label: 'Registered', status: 'completed', date: '04 May' },
            { id: 'eligible', label: 'Eligible', status: 'completed', date: '05 May' },
            { id: 'aptitude', label: 'Aptitude', status: 'cleared', date: '08 May' },
            { id: 'gd', label: 'GD Round', status: 'in_progress', date: '' },
            { id: 'technical', label: 'Technical', status: 'pending', date: '' },
            { id: 'hr', label: 'HR Interview', status: 'pending', date: '' },
            { id: 'selected', label: 'Selection', status: 'pending', date: '' },
            { id: 'offer_letter', label: 'Offer Letter', status: 'pending', date: '' }
          ]
        }
      ]},
    ];
    localStorage.setItem('edu_erp_placement_students', JSON.stringify(initial));
    return initial;
  });

  const setStudents = (newVal) => {
    setStudentsState(newVal);
    localStorage.setItem('edu_erp_placement_students', JSON.stringify(newVal));
    window.dispatchEvent(new Event('storage'));
  };

  // Base list of company drives
  const [companies, setCompaniesState] = useState(() => {
    const cached = localStorage.getItem('edu_erp_placement_companies');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { console.error('Company cache failed:', e); }
    }
    const initial = [
      { id: 1, logo: 'Z', name: 'Zoho', role: 'System Engineer', pkg: 8.5, date: '2026-05-10', deadline: '2026-05-08', type: 'On-Campus', loc: 'Chennai', minCgpa: 7.0, maxArrears: 0, hrContact: 'hr@zoho.com', hiringDepts: ['CSE', 'ECE', 'IT'], internshipType: 'Intern + PPO', applicants: 45, shortlisted: 12, selectedCount: 2, roundsTimeline: ['Aptitude', 'Coding', 'GD', 'Technical', 'HR'], hrStatus: 'Completed', status: 'Completed', venue: 'Convention Hall - A', openings: 15, time: '09:00 AM' },
      { id: 2, logo: 'T', name: 'TCS', role: 'Ninja Developer', pkg: 3.6, date: '2026-05-24', deadline: '2026-05-20', type: 'On-Campus', loc: 'Chennai', minCgpa: 6.0, maxArrears: 2, hrContact: 'careers@tcs.com', hiringDepts: ['CSE', 'ECE', 'IT', 'MECH'], internshipType: 'Full-Time Only', applicants: 80, shortlisted: 30, selectedCount: 0, roundsTimeline: ['Aptitude', 'Technical', 'HR'], hrStatus: 'Pending', status: 'Active', venue: 'Main Seminar Hall', openings: 50, time: '10:00 AM' },
      { id: 3, logo: 'C', name: 'Cognizant', role: 'GenC Elevate', pkg: 6.0, date: '2026-05-11', deadline: '2026-05-09', type: 'Off-Campus', loc: 'Coimbatore', minCgpa: 6.5, maxArrears: 1, hrContact: 'genc@cognizant.com', hiringDepts: ['CSE', 'ECE', 'IT'], internshipType: '3 Months Internship', applicants: 50, shortlisted: 18, selectedCount: 1, roundsTimeline: ['Aptitude', 'GD', 'Technical', 'HR'], hrStatus: 'Completed', status: 'Completed', venue: 'Virtual Drive', openings: 20, time: '11:00 AM' },
      { id: 4, logo: 'W', name: 'Wipro', role: 'Project Engineer', pkg: 4.5, date: '2026-06-05', deadline: '2026-06-02', type: 'On-Campus', loc: 'Bengaluru', minCgpa: 6.0, maxArrears: 1, hrContact: 'campus@wipro.com', hiringDepts: ['CSE', 'ECE', 'IT', 'MECH', 'CIVIL'], internshipType: 'Intern + PPO', applicants: 60, shortlisted: 0, selectedCount: 0, roundsTimeline: ['Aptitude', 'Technical', 'HR'], hrStatus: 'Pending', status: 'Upcoming', venue: 'Block 2 Auditorium', openings: 40, time: '09:30 AM' },
      { id: 5, logo: 'I', name: 'Infosys', role: 'Specialist Programmer', pkg: 9.5, date: '2026-05-25', deadline: '2026-05-22', type: 'On-Campus', loc: 'Mysore', minCgpa: 7.5, maxArrears: 0, hrContact: 'hr@infosys.com', hiringDepts: ['CSE', 'IT'], internshipType: '6 Months Internship', applicants: 35, shortlisted: 15, selectedCount: 0, roundsTimeline: ['Aptitude', 'Coding', 'Technical', 'HR'], hrStatus: 'In Progress', status: 'Active', venue: 'Research Lab 1', openings: 10, time: '09:00 AM' }
    ];
    localStorage.setItem('edu_erp_placement_companies', JSON.stringify(initial));
    return initial;
  });

  const setCompanies = (newVal) => {
    setCompaniesState(newVal);
    localStorage.setItem('edu_erp_placement_companies', JSON.stringify(newVal));
    window.dispatchEvent(new Event('storage'));
  };

  // Shared Placement State
  const [placementStats, setPlacementStats] = useState({
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
  });

  // Persistent Eligibility Filters
  const [eligibilityFilters, setEligibilityFilters] = useState({
    minCGPA: 6.5,
    maxArrears: 0
  });

  // Centralized computed datasets - Single Source of Truth useMemo Hooks
  const onlyEligibleStudents = useMemo(() => {
    return eligibleStudentsList.filter(s => s.eligible);
  }, [eligibleStudentsList]);

  const placedStudentsList = useMemo(() => {
    return (students ?? []).filter(student => student.status === 'placed');
  }, [students]);

  const internshipStudentsList = useMemo(() => {
    return (students ?? []).filter(student => student.stipend !== undefined);
  }, [students]);

  const paidStudentsList = useMemo(() => {
    return (students ?? []).filter(student => student.feeStatus === 'Paid');
  }, [students]);

  const pendingStudentsList = useMemo(() => {
    return (students ?? []).filter(student => student.feeStatus === 'Pending');
  }, [students]);

  const successWallList = useMemo(() => {
    return (students ?? []).filter(student => student.status === 'placed');
  }, [students]);

  const highestPackageVal = useMemo(() => {
    const pkgs = placedStudentsList.map(s => Number(s.packageOffered || 0));
    return pkgs.length > 0 ? Math.max(...pkgs) : 0;
  }, [placedStudentsList]);

  const averagePackageVal = useMemo(() => {
    const pkgs = placedStudentsList.map(s => Number(s.packageOffered || 0));
    return pkgs.length > 0 ? Number((pkgs.reduce((a,b)=>a+b, 0) / pkgs.length).toFixed(2)) : 0;
  }, [placedStudentsList]);

  const totalFeesAmount = useMemo(() => {
    return paidStudentsList.reduce((sum, student) => sum + (student.feeAmount || 0), 0);
  }, [paidStudentsList]);

  // Derived placement statistics matching counts perfectly (no stale counts)
  const derivedStats = useMemo(() => {
    const totalStudents = students.length;
    const placedCount = placedStudentsList.length;
    const successPercentage = totalStudents > 0 ? Math.round((placedCount / totalStudents) * 100) : 0;

    return {
      eligibleStudents: onlyEligibleStudents.length,
      companiesVisiting: companies.length,
      studentsPlaced: placedCount,
      highestPackage: highestPackageVal,
      averagePackage: averagePackageVal,
      internshipOffers: internshipStudentsList.length,
      feesCollected: totalFeesAmount,
      successWall: successWallList.length,
      feesPaidStudents: paidStudentsList.length,
      feesPendingStudents: students.length - paidStudentsList.length,
      successPercentage: successPercentage
    };
  }, [
    students.length,
    onlyEligibleStudents.length,
    placedStudentsList.length,
    highestPackageVal,
    averagePackageVal,
    internshipStudentsList.length,
    totalFeesAmount,
    successWallList.length,
    paidStudentsList.length
  ]);

  // Calculate live eligible students list in real-time
  useEffect(() => {
    const minCGPA = Number(eligibilityFilters?.minCGPA ?? 0);
    const maxArrears = Number(eligibilityFilters?.maxArrears ?? 0);

    const updated = (students ?? []).map(student => {
      const reasons = [];
      const cgpa = Number(student?.cgpa ?? 0);
      const arrears = Number(student?.arrears ?? 0);

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

    const eligibleCount = updated.filter(s => s.eligible).length;

    setPlacementStats(prev => ({
      ...prev,
      eligibleStudents: eligibleCount
    }));

    setEligibleStudentsList(updated);
  }, [eligibilityFilters]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/placement/analytics');
      const data = response.data;
      setAnalytics(data);
      
      // Populate shared state from initial analytics
      setPlacementStats({
        eligibleStudents: data?.totalStudents ?? 0,
        companiesVisiting: data?.companiesCount ?? 0,
        studentsPlaced: data?.placedCount ?? 0,
        highestPackage: data?.highestPackage ?? 0,
        averagePackage: data?.avgPackage ?? 0,
        internshipOffers: data?.internshipsCount ?? 0,
        feesCollected: data?.fees?.totalFeesCollected ?? 0,
        successWall: data?.placedCount ?? 0,
        feesPaidStudents: data?.fees?.paidCount ?? 0,
        feesPendingStudents: data?.fees?.pendingCount ?? 0,
        successPercentage: data?.successPercentage ?? 0
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'TPO Dashboard', icon: TrendingUp },
    { id: 'companies', label: 'Company Drives', icon: Building2 },
    { id: 'eligibility', label: 'Eligibility', icon: CheckCircle },
    { id: 'timeline', label: 'Student Timeline', icon: Clock },
    { id: 'fees', label: 'Placement Fees', icon: DollarSign },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'placed', label: 'Placed Wall', icon: Award },
  ];

  const renderContent = () => {
    const sharedProps = {
      dashboardStats: placementStats,
      setDashboardStats: setPlacementStats,
      eligibilityFilters,
      setEligibilityFilters,
      students,
      setStudents,
      companies,
      setCompanies
    };

    switch (activeTab) {
      case 'dashboard': return (
        <PlacementDashboard 
          {...sharedProps}
          dashboardStats={derivedStats}
          analytics={analytics} 
          loading={loading} 
          onOpenDriveModal={() => setShowDriveModal(true)} 
          onOpenOfficerModal={() => setShowOfficerModal(true)}
          onOpenOfficerDrawer={() => setShowOfficerDrawer(true)}
          onCardClick={(type) => {
            setDashboardModalType(type);
            setShowDashboardModal(true);
          }}
        />
      );
      case 'companies': return <CompanyManagement {...sharedProps} />;
      case 'fees': return <PlacementFees {...sharedProps} />;
      case 'eligibility': return <EligibilityChecker {...sharedProps} />;
      case 'timeline': return <StudentPlacementTimeline {...sharedProps} />;
      case 'internships': return <InternshipTracking {...sharedProps} />;
      default: return (
        <div className="flex flex-col items-center justify-center h-96 text-slate-400 animate-fade-in">
          <Award size={64} className="mb-4 opacity-20" />
          <h3 className="text-xl font-bold">Coming Soon</h3>
          <p className="text-sm">The Success Wall and placement gallery are under construction.</p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                <Briefcase size={24} />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Placement Cell</h1>
          </div>
          <p className="text-slate-500 mt-1 font-medium text-sm ml-1">Training & Placement Office (TPO) - Engineering Campus</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-all shadow-sm text-xs">
            <Download size={18} /> Export Reports
          </button>
          <button 
            onClick={() => setShowDriveModal(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-2 transition-all shadow-xl shadow-indigo-200 text-xs"
          >
            <Plus size={18} /> New Drive
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-1 overflow-x-auto hide-scrollbar sticky top-4 z-20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
              activeTab === tab.id 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="min-h-[600px]">
        <SafeErrorBoundary>
          {renderContent()}
        </SafeErrorBoundary>
      </div>

      {/* Modals & Drawers */}
      <NewDriveModal 
        isOpen={showDriveModal} 
        onClose={() => setShowDriveModal(false)}
        onSuccess={fetchAnalytics}
      />
      
      <AddOfficerModal 
        isOpen={showOfficerModal} 
        onClose={() => setShowOfficerModal(false)}
        onSuccess={fetchAnalytics}
      />

      <OfficerDetailsDrawer 
        isOpen={showOfficerDrawer} 
        onClose={() => setShowOfficerDrawer(false)}
      />

      <DashboardDataModal 
        isOpen={showDashboardModal}
        onClose={() => {
          setShowDashboardModal(false);
          setDashboardModalType('');
        }}
        modalType={dashboardModalType}
        students={eligibleStudentsList}
        companies={companies}
        eligibleStudents={onlyEligibleStudents}
        placedStudents={placedStudentsList}
        internshipStudents={internshipStudentsList}
        paidStudents={paidStudentsList}
        pendingStudents={pendingStudentsList}
        successWallStudents={successWallList}
        highestPackageVal={highestPackageVal}
        averagePackageVal={averagePackageVal}
        eligibilityFilters={eligibilityFilters}
      />
    </div>
  );
};

export default Placement;
