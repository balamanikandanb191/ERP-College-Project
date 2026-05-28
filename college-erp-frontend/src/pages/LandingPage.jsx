import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Bus, 
  Home, 
  CreditCard, 
  Briefcase, 
  Award, 
  Users, 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
  Shield,
  Layers,
  Heart,
  Calendar,
  Check,
  Search,
  Bell,
  Activity,
  Plus,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSandboxTab, setActiveSandboxTab] = useState('Admin');
  const [activeFaq, setActiveFaq] = useState(null);
  const [tickerLogs, setTickerLogs] = useState([
    { text: 'Admission registry database synced', time: 'Just now', type: 'system' },
    { text: 'Bus Route #12 driver check-in completed', time: '1 min ago', type: 'transport' },
    { text: 'Prof. Miller published Grade Card for CSE-302', time: '3 mins ago', type: 'academic' },
    { text: 'Parent completed Online Fee Transaction ($1,200)', time: '5 mins ago', type: 'finance' }
  ]);

  // Periodic ticker event updates to make the page feel dynamically alive!
  useEffect(() => {
    const events = [
      { text: 'Student Alex checked out "Modern OS" from Library', type: 'academic' },
      { text: 'Warden registered room maintenance log (Hostel B)', type: 'hostel' },
      { text: 'Placement cell registered Google Drive application rules', type: 'placement' },
      { text: 'System backup transaction completed successfully', type: 'system' },
      { text: 'Staff generated 12 Bonafide Certificates', type: 'academic' }
    ];
    
    const interval = setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setTickerLogs(prev => [
        { text: randomEvent.text, time: 'Just now', type: randomEvent.type },
        ...prev.slice(0, 3).map(log => {
          if (log.time === 'Just now') return { ...log, time: '1 min ago' };
          if (log.time === '1 min ago') return { ...log, time: '4 mins ago' };
          return { ...log, time: '10 mins ago' };
        })
      ]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handlePortalLaunch = (role) => {
    navigate('/login', { state: { preselectedRole: role } });
  };

  const modules = [
    {
      icon: BookOpen,
      title: 'Academics & Timetable',
      desc: 'Seamless class allocations, subject mapping, academic calendars, and live student timetable rendering.',
      color: 'bg-blue-50/80 text-blue-600 border-blue-100/50 hover:bg-blue-100/30',
      iconBg: 'bg-blue-100/50',
      tag: 'Core'
    },
    {
      icon: CreditCard,
      title: 'Finance & Fees',
      desc: 'Automated fee structures, instant payments, detailed ledgers, dynamic fee estimations, and digital receipts.',
      color: 'bg-emerald-50/80 text-emerald-600 border-emerald-100/50 hover:bg-emerald-100/30',
      iconBg: 'bg-emerald-100/50',
      tag: 'Finance'
    },
    {
      icon: Briefcase,
      title: 'Career & Placements',
      desc: 'Drive coordination, partner company profiles, student eligibility trackers, and placement analytics dashboards.',
      color: 'bg-violet-50/80 text-violet-600 border-violet-100/50 hover:bg-violet-100/30',
      iconBg: 'bg-violet-100/50',
      tag: 'Career'
    },
    {
      icon: Home,
      title: 'Hostel Management',
      desc: 'Room allocation management, warden logs, hostel student directories, and complaints tracking.',
      color: 'bg-amber-50/80 text-amber-600 border-amber-100/50 hover:bg-amber-100/30',
      iconBg: 'bg-amber-100/50',
      tag: 'Campus'
    },
    {
      icon: Bus,
      title: 'Transport Logistics',
      desc: 'Route planning, driver allocations, passenger logs, and vehicle maintenance logging.',
      color: 'bg-sky-50/80 text-sky-600 border-sky-100/50 hover:bg-sky-100/30',
      iconBg: 'bg-sky-100/50',
      tag: 'Logistics'
    },
    {
      icon: Award,
      title: 'Exams & Grading',
      desc: 'Grade configuration, assessment marking sheets, exam schedules, and GPA calculation rules.',
      color: 'bg-rose-50/80 text-rose-600 border-rose-100/50 hover:bg-rose-100/30',
      iconBg: 'bg-rose-100/50',
      tag: 'Academic'
    }
  ];

  const portals = {
    Admin: {
      role: 'Admin',
      title: 'System Administrator',
      desc: 'Oversee user accounts, system configuration, academic years, global settings, and audit logs.',
      features: ['Role-based User Creation', 'System Settings Manager', 'Database Seeds Audit', 'Institution Branding'],
      badgeColor: 'bg-violet-50 text-violet-750 border-violet-100',
      btnColor: 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-100',
      mockup: (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Users Session</p>
              <h4 className="text-xl font-black text-slate-900 mt-0.5">1,245 Online</h4>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-sm">
            <p className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Shield size={14} className="text-violet-600" />
              Live Audit Trails
            </p>
            <div className="space-y-2">
              {[
                { log: 'Database schema migration sync completed', time: 'Just now' },
                { log: 'Token session granted for admin@eduerp.com', time: '10 mins ago' },
                { log: 'Auto seed completed: 5 core roles provisioned', time: '1 hr ago' }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between text-[11px] items-start py-2 border-b border-slate-50 last:border-0">
                  <span className="text-slate-600 font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0"></span>
                    {item.log}
                  </span>
                  <span className="text-slate-400 font-mono text-[9px] shrink-0 mt-0.5">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    Teacher: {
      role: 'Teacher',
      title: 'Faculty Portal',
      desc: 'Record student attendance, input grades, configure timetables, and manage curriculum.',
      features: ['Attendance Logging', 'Mark Entries', 'Schedules Tracking', 'Student Search'],
      badgeColor: 'bg-emerald-50 text-emerald-750 border-emerald-100',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100',
      mockup: (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-800">Attendance Log - CSE II A</span>
              <span className="text-[10px] bg-slate-150 text-slate-500 px-2 py-0.5 rounded-md font-bold">Today</span>
            </div>
            <div className="space-y-2">
              {[
                { name: 'Alex Mercer', reg: 'REG-0045', present: true },
                { name: 'Chloe Frazier', reg: 'REG-0046', present: true },
                { name: 'Daniel Park', reg: 'REG-0047', present: false }
              ].map((student, sIdx) => (
                <div key={sIdx} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs font-black text-slate-800">{student.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{student.reg}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${student.present ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {student.present ? 'Present' : 'Absent'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    Student: {
      role: 'Student',
      title: 'Student Workspace',
      desc: 'View schedules, check attendance thresholds, register for exams, and browse library catalogue.',
      features: ['Attendance Progress', 'Grade Cards', 'Library Book Borrows', 'Placements Registry'],
      badgeColor: 'bg-amber-50 text-amber-750 border-amber-100',
      btnColor: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-100',
      mockup: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
              <p className="text-[10px] text-slate-450 font-black uppercase tracking-wider">Attendance Rate</p>
              <div className="w-16 h-16 mx-auto my-2.5 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" className="stroke-slate-100 fill-none" strokeWidth="5" />
                  <circle cx="32" cy="32" r="28" className="stroke-primary fill-none" strokeWidth="5" strokeDasharray="175" strokeDashoffset="35" />
                </svg>
                <span className="absolute text-xs font-black text-slate-850">80%</span>
              </div>
              <p className="text-[10px] text-emerald-500 font-black">Satisfactory</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center flex flex-col justify-between shadow-sm">
              <div>
                <p className="text-[10px] text-slate-450 font-black uppercase tracking-wider">Cumulative GPA</p>
                <h3 className="text-3xl font-black text-slate-900 mt-2">8.72</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-bold bg-slate-50 py-1 rounded border border-slate-100">Semester IV</span>
            </div>
          </div>
        </div>
      )
    },
    Staff: {
      role: 'Staff',
      title: 'Office Administration',
      desc: 'Track student enquiries, print certificates, register leads, and coordinate transport.',
      features: ['Enquiry & Lead Manager', 'Bonafide Certificate', 'Bus Allocation', 'TC Request Forms'],
      badgeColor: 'bg-blue-50 text-blue-750 border-blue-100',
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100',
      mockup: (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3.5 shadow-sm">
            <p className="text-xs font-black text-slate-800">Registration Enquiries</p>
            <div className="grid grid-cols-3 gap-2.5 text-center text-[10px] font-black">
              <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                <p className="text-blue-700 text-sm">48</p>
                <p className="text-slate-450 mt-0.5">Leads</p>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                <p className="text-amber-700 text-sm">18</p>
                <p className="text-slate-450 mt-0.5">Contacted</p>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                <p className="text-emerald-700 text-sm">12</p>
                <p className="text-slate-450 mt-0.5">Admitted</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    Parent: {
      role: 'Parent',
      title: 'Parent Portal',
      desc: 'Monitor children\'s daily attendance, complete pending fee payments, and view grade cards.',
      features: ['Attendance Tracker', 'Fee Payment Hub', 'Grade Sheets', 'Leave Applications'],
      badgeColor: 'bg-pink-50 text-pink-750 border-pink-100',
      btnColor: 'bg-pink-600 hover:bg-pink-700 text-white shadow-pink-100',
      mockup: (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-800">Pending Fees Invoice</span>
              <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-black">OVERDUE</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <div>
                <p className="text-[10px] text-slate-400 font-bold">Academic Fee (Semester IV)</p>
                <p className="text-base font-black text-slate-900 mt-0.5">$1,850.00</p>
              </div>
              <button 
                onClick={() => handlePortalLaunch('Parent')}
                className="px-3.5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-[10px] font-bold cursor-pointer transition-colors shadow-sm"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/20 text-slate-800 overflow-x-hidden font-sans relative">
      
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none animate-pulse-subtle"></div>
      <div className="absolute top-[80vh] left-1/4 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>

      {/* Floating mathematical details */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none opacity-30">
        <div className="absolute top-[15vh] left-[8%] animate-float text-slate-350 font-serif text-3xl">∑</div>
        <div className="absolute top-[45vh] left-[4%] animate-float-delayed text-slate-300 text-4xl">∫</div>
        <div className="absolute top-[70vh] right-[6%] animate-float text-slate-350 text-3xl">π</div>
        <div className="absolute top-[25vh] right-[10%] animate-float-delayed text-slate-300 font-mono text-2xl">{"{...}"}</div>
      </div>

      {/* Floating Pill Glass-Navbar */}
      <div className="sticky top-0 z-50 px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        <nav className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-full px-6 py-3.5 shadow-lg shadow-slate-100/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center shadow shadow-primary/20">
              <GraduationCap className="text-white h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">
              Edu<span className="text-primary">ERP</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-xs font-black text-slate-450 uppercase tracking-widest">
            <a href="#features" className="hover:text-primary transition-colors">Modules</a>
            <a href="#stats" className="hover:text-primary transition-colors">Metrics</a>
            <a href="#portals" className="hover:text-primary transition-colors">Portals Guide</a>
            <a href="#specs" className="hover:text-primary transition-colors">Tech Specs</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-extrabold rounded-full text-xs flex items-center gap-1.5 shadow-md shadow-primary/10 transition-all cursor-pointer"
              >
                Dashboard
                <ArrowRight size={13} />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-slate-600 hover:text-slate-950 font-extrabold text-xs transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('portals');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-full text-xs transition-all cursor-pointer shadow-sm"
                >
                  Demo Logins
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Side Content */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-wider text-primary shadow-sm">
            <Sparkles size={11} className="text-primary animate-pulse" />
            Empowering Smart Academic Governance
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.05]">
            Unify Your Campus Under a <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Single Intelligent System
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-semibold max-w-2xl">
            A secure, role-restricted ERP dashboard managing student enrolments, exam grading rosters, financial invoices, campus transport, and hostel logistics with sub-millisecond response rates.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2">
            <button 
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 bg-primary hover:bg-primary-dark text-white font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all text-sm cursor-pointer"
            >
              Sign In to Portals
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('portals');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-extrabold rounded-xl border border-slate-200 transition-all text-sm shadow-sm cursor-pointer"
            >
              Sandbox Guide
            </button>
          </div>

          {/* Core Specs badges */}
          <div className="pt-6 border-t border-slate-200/60 flex flex-wrap gap-8">
            <div>
              <p className="text-3xl font-black text-slate-850">14ms</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Sync Latency</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-850">98.4%</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Placements Rate</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-850">5 Roles</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Access Profiles</p>
            </div>
          </div>
        </div>

        {/* Right Side Concentric Orbit Ring System & Live Operations Log */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 relative min-h-[460px]">
          
          {/* Circular Orbiting System Container */}
          <div className="relative w-80 h-80 flex items-center justify-center bg-gradient-to-tr from-slate-100/50 to-white rounded-full border border-slate-200/60 shadow-inner">
            
            {/* Outer Circular Orbit Ring (Slow rotation) */}
            <div className="absolute inset-4 rounded-full border border-dashed border-slate-200/80 animate-spin-slow">
              {/* Orbiting Icons */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <BookOpen size={14} />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                <CreditCard size={14} />
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm">
                <Briefcase size={14} />
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                <Home size={14} />
              </div>
            </div>

            {/* Inner Ring (Reverse rotation) */}
            <div className="absolute inset-16 rounded-full border border-slate-200/60" style={{ animation: 'spin-slow 15s linear infinite reverse' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-xs">
                <Bus size={11} />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
                <Award size={11} />
              </div>
            </div>

            {/* Central University Shield core */}
            <div className="w-24 h-24 rounded-3xl bg-primary flex flex-col items-center justify-center text-white shadow-xl shadow-primary/20 relative z-10 border border-primary-light/20">
              <GraduationCap size={36} strokeWidth={2} />
              <span className="text-[9px] font-black tracking-widest uppercase mt-1">CORE</span>
            </div>

          </div>

          {/* Live Campus Operations Monitor (Real-time events ticker logs) */}
          <div className="w-full max-w-sm bg-slate-950 rounded-2xl p-4 shadow-xl border border-slate-850 text-left space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-900">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Campus Operations Feed
              </span>
              <span className="text-[9px] font-mono text-slate-500 font-bold">LIVE SOCKET</span>
            </div>
            
            <div className="space-y-1.5 min-h-[90px] flex flex-col justify-end">
              <AnimatePresence>
                {tickerLogs.slice(0, 3).map((log, lIdx) => (
                  <motion.div 
                    key={log.text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center text-[10px] py-1 border-b border-slate-900 last:border-0"
                  >
                    <span className="text-slate-350 font-bold truncate max-w-[240px] flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0"></span>
                      {log.text}
                    </span>
                    <span className="text-slate-500 font-mono text-[9px] shrink-0">{log.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Counter Section */}
      <section id="stats" className="bg-white py-16 border-y border-slate-200 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: '15,000+', title: 'Active Students Enrolled', icon: Users, color: 'text-primary bg-blue-50 border-blue-100' },
            { num: '450+', title: 'Expert Teaching Faculty', icon: BookOpen, color: 'text-violet-600 bg-violet-50 border-violet-100' },
            { num: '98.4%', title: 'Placements Success Rate', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { num: '25+', title: 'Syllabus Departments', icon: Layers, color: 'text-amber-600 bg-amber-50 border-amber-100' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center flex flex-col items-center">
              <div className={`p-3 rounded-xl border mb-3 text-slate-800 ${stat.color.split(' ')[1]} ${stat.color.split(' ')[2]}`}>
                <stat.icon size={20} className={stat.color.split(' ')[0]} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.num}</h2>
              <p className="text-xs font-semibold text-slate-500 mt-1">{stat.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-primary bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
            Modular Integrations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-4 tracking-tight">
            Comprehensive Management System Modules
          </h2>
          <p className="text-slate-500 text-sm mt-3 font-semibold leading-relaxed">
            Every module is designed to interact perfectly with local caches, role security tokens, and responsive mobile interfaces.
          </p>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {modules.map((mod, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col h-full group"
            >
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 shrink-0 ${mod.color.split(' ')[0]} ${mod.color.split(' ')[2]}`}>
                <mod.icon size={18} className={mod.iconColor} />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{mod.title}</h3>
                <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-400 group-hover:text-primary transition-colors">
                  {mod.tag}
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-3 leading-relaxed flex-grow font-medium font-sans">
                {mod.desc}
              </p>
              <div className="mt-5 flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark cursor-pointer transition-colors pt-4 border-t border-slate-100">
                Explore integration details
                <ChevronRight size={13} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Interactive Portals Dashboard Sandbox Section */}
      <section id="portals" className="bg-white py-24 px-6 border-y border-slate-200 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
              System Live Sandbox
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-4 tracking-tight">
              Pre-Configured System Portals
            </h2>
            <p className="text-slate-500 text-sm mt-3 font-semibold">
              Select a portal tab to preview its dashboard widget mockup before launching.
            </p>
          </div>

          {/* Sandbox Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left selector panel */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                {Object.keys(portals).map((key) => {
                  const item = portals[key];
                  const isSelected = activeSandboxTab === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveSandboxTab(key)}
                      className={`w-full text-left p-4.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'bg-primary/5 border-primary/20 text-slate-900 shadow-sm font-bold' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-350'
                      }`}
                    >
                      <div>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${item.badgeColor}`}>
                          {item.role} Role
                        </span>
                        <h4 className="text-base font-bold mt-1 text-slate-900">{item.title}</h4>
                      </div>
                      <ChevronRight size={18} className={isSelected ? 'text-primary' : 'text-slate-400'} />
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => handlePortalLaunch(activeSandboxTab)}
                className={`w-full py-4 bg-primary text-white hover:bg-primary-dark font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 text-sm cursor-pointer mt-4`}
              >
                Launch {activeSandboxTab} Portal
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Right Desktop Dashboard mockup viewport */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shadow-inner">
              
              {/* Fake Window bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 px-1 text-xs text-slate-400 font-bold select-none">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200 block"></span>
                </div>
                <span>{activeSandboxTab} Dashboard Widget</span>
                <span className="w-4"></span>
              </div>

              {/* Viewport content changes dynamically */}
              <div className="flex-grow flex flex-col justify-center min-h-[220px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSandboxTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {portals[activeSandboxTab].mockup}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-250/60 text-[10px] text-slate-450 font-bold flex gap-2.5 justify-center">
                <span>• Live Database Connected</span>
                <span>• Scope Validation Configured</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Interactive FAQ Accordion Area */}
      <section className="py-24 px-6 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-primary bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
            Help Desk
          </span>
          <h2 className="text-3xl font-extrabold text-slate-950 mt-4 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3.5">
          {[
            { q: 'How do I login to testing sandbox roles?', a: 'Click the "Demo Logins" or "Launch Demo Portals" button. On the login page, you can choose any preset from the selector tabs (Admin, Teacher, Student, Staff, Parent) and click "Instant Login" to immediately bypass forms.' },
            { q: 'Does database synchronization wipe testing records?', a: 'Yes, during sandbox development startup, the Sequelize sync utility clean-recreates schema files and runs seeder configurations automatically to guarantee credential consistency.' },
            { q: 'What scopes are configured for Parents?', a: 'Parents are granted secure visibility levels mapping directly to the Student Portal dashboard where they can oversee attendance rates, grade files, and pay pending fee ledgers.' }
          ].map((faq, idx) => {
            const isFaqOpen = activeFaq === idx;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setActiveFaq(isFaqOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5 text-sm sm:text-base">
                    <HelpCircle size={16} className="text-primary" />
                    {faq.q}
                  </span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform ${isFaqOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>
                <AnimatePresence>
                  {isFaqOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100"
                    >
                      <p className="p-5 text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech specs section */}
      <section id="specs" className="py-24 px-6 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 z-10 relative">
        <div className="md:w-1/2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
            Specs & Integrity
          </span>
          <h2 className="text-3xl font-extrabold text-slate-950 mt-4 tracking-tight">
            Engineered for Modern Enterprise Standards
          </h2>
          <p className="text-slate-500 text-sm mt-4 leading-relaxed font-semibold">
            The portal syncs schema definitions automatically inside Sequelize transactions, authenticates requests via stateless Bearer JSON Web Tokens, and hashes storage with salted bcrypt algorithms.
          </p>

          <div className="mt-6 space-y-4">
            {[
              { title: 'Encrypted Token Signatures', desc: 'Authentication state stored locally with zero session overhead.' },
              { title: 'Cascade Sync Schema Protection', desc: 'Sync procedures utilize raw foreign key disabling to prevent integrity loss.' },
              { title: 'Granular Middleware Guards', desc: 'Specific API endpoints bound strictly to corresponding system scopes.' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <Check size={10} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2 bg-white border border-slate-250/80 rounded-2xl p-6 shadow-md shadow-slate-200/50">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            Security & Performance Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200/40">
              <span className="text-xs font-semibold text-slate-600">Database Engine</span>
              <span className="text-xs font-bold text-slate-800">MySQL / InnoDB</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200/40">
              <span className="text-xs font-semibold text-slate-600">Avg Sync Latency</span>
              <span className="text-xs font-mono font-bold text-slate-800">14ms</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200/40">
              <span className="text-xs font-semibold text-slate-600">Password Encryption</span>
              <span className="text-xs font-mono font-bold text-slate-800">Bcrypt (Salt rounds: 10)</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200/40">
              <span className="text-xs font-semibold text-slate-600">Session Protocol</span>
              <span className="text-xs font-bold text-slate-800">Stateless JWT-HS256</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-slate-900 text-white relative overflow-hidden z-10">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Begin Academic Coordination?
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-md mx-auto leading-relaxed font-semibold">
            Access the sandbox portal immediately by utilizing the pre-filled logins corresponding to your university profile.
          </p>
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-extrabold rounded-xl flex items-center gap-2 shadow-lg shadow-primary/10 transition-all text-sm cursor-pointer animate-pulse"
            >
              Sign In to System
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-6 border-t border-slate-200 text-xs text-slate-400 font-semibold z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="text-white h-4.5 w-4.5" />
            </div>
            <span className="font-bold text-slate-800">EduERP Enterprises</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-700 transition-colors">Security Policies</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Terms of Operations</a>
            <a href="#" className="hover:text-slate-700 transition-colors">IT registrar Desk</a>
          </div>

          <p className="text-[11px] text-slate-400 font-medium">
            &copy; 2026 EduERP Suite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
