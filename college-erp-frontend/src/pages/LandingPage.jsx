import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Users,
  Award,
  Clock,
  BookOpen,
  Calendar,
  Layers,
  TrendingUp,
  CreditCard,
  Home,
  Bus,
  Briefcase,
  Search,
  Shield,
  Activity,
  ChevronDown,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ChevronRight,
  MessageSquare,
  DollarSign,
  Package,
  FileText,
  FileSpreadsheet
} from 'lucide-react';

// Modules Data
const INNER_ORBIT = [
  { name: 'Student Portal', icon: Users, color: 'text-blue-600 border-blue-200/60 bg-blue-50/60 shadow-blue-100/30' },
  { name: 'Faculty Portal', icon: Award, color: 'text-emerald-600 border-emerald-200/60 bg-emerald-50/60 shadow-emerald-100/30' },
  { name: 'Examination System', icon: FileSpreadsheet, color: 'text-rose-600 border-rose-200/60 bg-rose-50/60 shadow-rose-100/30' },
  { name: 'Attendance Management', icon: Clock, color: 'text-amber-600 border-amber-200/60 bg-amber-50/60 shadow-amber-100/30' }
];

const MIDDLE_ORBIT = [
  { name: 'Course Management', icon: BookOpen, color: 'text-indigo-600 border-indigo-200/60 bg-indigo-50/60 shadow-indigo-100/30' },
  { name: 'Timetable Scheduler', icon: Calendar, color: 'text-purple-600 border-purple-200/60 bg-purple-50/60 shadow-purple-100/30' },
  { name: 'Learning Resources', icon: Layers, color: 'text-sky-600 border-sky-200/60 bg-sky-50/60 shadow-sky-100/30' },
  { name: 'Academic Analytics', icon: TrendingUp, color: 'text-teal-600 border-teal-200/60 bg-teal-50/60 shadow-teal-100/30' }
];

const OUTER_ORBIT = [
  { name: 'Admissions Management', icon: Users, color: 'text-violet-600 border-violet-200/60 bg-violet-50/60 shadow-violet-100/30' },
  { name: 'Finance & Fees', icon: CreditCard, color: 'text-emerald-600 border-emerald-200/60 bg-emerald-50/60 shadow-emerald-100/30' },
  { name: 'Hostel Management', icon: Home, color: 'text-amber-600 border-amber-200/60 bg-amber-50/60 shadow-amber-100/30' },
  { name: 'Transport Tracking', icon: Bus, color: 'text-sky-600 border-sky-200/60 bg-sky-50/60 shadow-sky-100/30' },
  { name: 'Placement Cell', icon: Briefcase, color: 'text-rose-600 border-rose-200/60 bg-rose-50/60 shadow-rose-100/30' },
  { name: 'Alumni Portal', icon: GraduationCap, color: 'text-blue-600 border-blue-200/60 bg-blue-50/60 shadow-blue-100/30' },
  { name: 'Library Management', icon: BookOpen, color: 'text-indigo-600 border-indigo-200/60 bg-indigo-50/60 shadow-indigo-100/30' },
  { name: 'Communication Hub', icon: MessageSquare, color: 'text-purple-600 border-purple-200/60 bg-purple-50/60 shadow-purple-100/30' },
  { name: 'HR & Payroll', icon: DollarSign, color: 'text-teal-600 border-teal-200/60 bg-teal-50/60 shadow-teal-100/30' },
  { name: 'Inventory Management', icon: Package, color: 'text-orange-600 border-orange-200/60 bg-orange-50/60 shadow-orange-100/30' },
  { name: 'Research Management', icon: Search, color: 'text-pink-600 border-pink-200/60 bg-pink-50/60 shadow-pink-100/30' },
  { name: 'Accreditation & Compliance', icon: Shield, color: 'text-cyan-600 border-cyan-200/60 bg-cyan-50/60 shadow-cyan-100/30' }
];

const ALL_MODULES = [...INNER_ORBIT, ...MIDDLE_ORBIT, ...OUTER_ORBIT];

const FEED_LOGS = [
  { text: 'Admission registry: 142 new records synced', time: 'Just now', type: 'admission' },
  { text: 'Attendance updated for CS Semester IV Section A', time: '2 mins ago', type: 'attendance' },
  { text: 'Fee payment receipt generated: Invoice #8902', time: '5 mins ago', type: 'finance' },
  { text: 'Model exam results published for Engineering Math', time: '8 mins ago', type: 'exam' },
  { text: 'Transport route #12 GPS check-in complete', time: '12 mins ago', type: 'transport' },
  { text: 'Placement drive scheduled for Google Inc.', time: '15 mins ago', type: 'placement' }
];

const GALLERY_MOCKUPS = [
  {
    name: 'Student Portal',
    icon: Users,
    color: 'border-blue-500/30 bg-blue-950/40 text-blue-400 shadow-blue-500/5',
    tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    desc: 'Profile: John Doe • GPA: 3.92 • Attendance: 98.2%',
    pos: 'lg:top-[4%] lg:left-[6%] lg:w-[210px]',
    parallaxX: -30,
    parallaxY: -35,
    rotate: 'lg:-rotate-6 lg:hover:-rotate-3',
    delay: '0s',
    preview: (
      <div className="space-y-1.5 mt-2 text-[10px] text-slate-400 font-medium">
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span>Student ID:</span> <span className="text-white font-semibold font-mono">#STD-9021</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span>CGPA Rank:</span> <span className="text-emerald-400 font-bold">A+ (3.92)</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span> <span className="text-blue-400 font-semibold">Enrolled</span>
        </div>
      </div>
    )
  },
  {
    name: 'Faculty Portal',
    icon: Award,
    color: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-400 shadow-emerald-500/5',
    tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    desc: 'Allocations, class logs, mark entry dashboard.',
    pos: 'lg:top-[6%] lg:right-[8%] lg:w-[230px]',
    parallaxX: 35,
    parallaxY: -30,
    rotate: 'lg:rotate-4 lg:hover:rotate-1',
    delay: '1.5s',
    preview: (
      <div className="space-y-1.5 mt-2 text-[10px] text-slate-400 font-medium">
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span>Active Classes:</span> <span className="text-white font-semibold">4 Classes</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span>Sub. Allocated:</span> <span className="text-emerald-400 font-semibold">Maths, CS</span>
        </div>
        <div className="flex justify-between">
          <span>Mark Logs:</span> <span className="text-white font-semibold">9/9 Completed</span>
        </div>
      </div>
    )
  },
  {
    name: 'Examination System',
    icon: FileSpreadsheet,
    color: 'border-rose-500/30 bg-rose-950/40 text-rose-400 shadow-rose-500/5',
    tagColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    desc: 'Automatic hall tickets, seat maps, strength list.',
    pos: 'lg:bottom-[6%] lg:left-[6%] lg:w-[220px]',
    parallaxX: -35,
    parallaxY: 30,
    rotate: 'lg:rotate-6 lg:hover:rotate-2',
    delay: '0.8s',
    preview: (
      <div className="space-y-1.5 mt-2 text-[10px] text-slate-400 font-medium">
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span>Hall Allocation:</span> <span className="text-white font-semibold">Block A, B</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span>Seating Capacity:</span> <span className="text-white font-semibold">45 / Hall</span>
        </div>
        <div className="flex justify-between">
          <span>Result Engine:</span> <span className="text-rose-400 font-semibold font-mono">READY</span>
        </div>
      </div>
    )
  },
  {
    name: 'Attendance Tracker',
    icon: Clock,
    color: 'border-amber-500/30 bg-amber-950/40 text-amber-400 shadow-amber-500/5',
    tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    desc: 'Realtime RFID logs, class absence reports.',
    pos: 'lg:bottom-[5%] lg:right-[6%] lg:w-[220px]',
    parallaxX: 25,
    parallaxY: 35,
    rotate: 'lg:-rotate-4 lg:hover:-rotate-1',
    delay: '2.3s',
    preview: (
      <div className="space-y-1.5 mt-2 text-[10px] text-slate-400 font-medium">
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span>Daily Log Sync:</span> <span className="text-emerald-400 font-semibold">100% Success</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span>Absent Alerts:</span> <span className="text-white font-semibold">SMS Dispatched</span>
        </div>
        <div className="flex justify-between">
          <span>Average Attendance:</span> <span className="text-amber-400 font-semibold font-mono">96.8%</span>
        </div>
      </div>
    )
  },
  {
    name: 'Course Management',
    icon: BookOpen,
    color: 'border-indigo-500/30 bg-indigo-950/40 text-indigo-400 shadow-indigo-500/5',
    tagColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    desc: 'Syllabus definitions, credits registry.',
    pos: 'lg:top-[36%] lg:left-[2%] lg:w-[190px]',
    parallaxX: -45,
    parallaxY: -5,
    rotate: 'lg:-rotate-12 lg:hover:-rotate-6',
    delay: '1.1s',
    preview: (
      <div className="space-y-1.5 mt-2 text-[10px] text-slate-400 font-medium">
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span>Core Syllabi:</span> <span className="text-white font-semibold">18 Courses</span>
        </div>
        <div className="flex justify-between">
          <span>Avg Credits:</span> <span className="text-indigo-400 font-semibold">24 per Sem</span>
        </div>
      </div>
    )
  },
  {
    name: 'Timetable Scheduler',
    icon: Calendar,
    color: 'border-purple-500/30 bg-purple-950/40 text-purple-400 shadow-purple-500/5',
    tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    desc: 'Conflict-free classroom schedule generator.',
    pos: 'lg:top-[34%] lg:right-[3%] lg:w-[200px]',
    parallaxX: 45,
    parallaxY: -8,
    rotate: 'lg:rotate-12 lg:hover:rotate-6',
    delay: '3s',
    preview: (
      <div className="space-y-1.5 mt-2 text-[10px] text-slate-400 font-medium">
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span>Schedule State:</span> <span className="text-emerald-400 font-semibold">Conflict-Free</span>
        </div>
        <div className="flex justify-between">
          <span>Allocated Rooms:</span> <span className="text-white font-semibold">28 Classrooms</span>
        </div>
      </div>
    )
  },
  {
    name: 'Academic Analytics',
    icon: TrendingUp,
    color: 'border-teal-500/30 bg-teal-950/40 text-teal-400 shadow-teal-500/5',
    tagColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    desc: 'Aggregated reports, growth stats, KPIs.',
    pos: 'lg:bottom-[33%] lg:left-[50%] lg:-translate-x-1/2 lg:w-[210px]',
    parallaxX: 0,
    parallaxY: 40,
    rotate: 'lg:rotate-2 lg:hover:rotate-0',
    delay: '1.9s',
    preview: (
      <div className="space-y-1.5 mt-2 text-[10px] text-slate-400 font-medium">
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span>Sync Status:</span> <span className="text-emerald-400 font-semibold">Active (14ms)</span>
        </div>
        <div className="flex justify-between">
          <span>Performance KPI:</span> <span className="text-teal-400 font-bold">98.4% Efficiency</span>
        </div>
      </div>
    )
  },
  {
    name: 'Admissions Desk',
    icon: Users,
    color: 'border-violet-500/30 bg-violet-950/40 text-violet-400 shadow-violet-500/5',
    tagColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    desc: 'Verify applications, issue forms, register status.',
    pos: 'lg:top-[70%] lg:left-[22%] lg:w-[210px]',
    parallaxX: -20,
    parallaxY: 32,
    rotate: 'lg:-rotate-3 lg:hover:-rotate-1',
    delay: '2.7s',
    preview: (
      <div className="space-y-1.5 mt-2 text-[10px] text-slate-400 font-medium">
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span>New Applicants:</span> <span className="text-white font-semibold">1,402 Pending</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span>Admitted Today:</span> <span className="text-emerald-400 font-semibold">+45 Students</span>
        </div>
        <div className="flex justify-between">
          <span>Form Issue Rate:</span> <span className="text-white font-semibold">94% Capacity</span>
        </div>
      </div>
    )
  },
  {
    name: 'Finance & Fees',
    icon: CreditCard,
    color: 'border-pink-500/30 bg-pink-950/40 text-pink-400 shadow-pink-500/5',
    tagColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    desc: 'Central ledger, student fee structures.',
    pos: 'lg:top-[68%] lg:right-[22%] lg:w-[210px]',
    parallaxX: 20,
    parallaxY: 28,
    rotate: 'lg:rotate-3 lg:hover:rotate-1',
    delay: '0.5s',
    preview: (
      <div className="space-y-1.5 mt-2 text-[10px] text-slate-400 font-medium">
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span>Defaulters Alert:</span> <span className="text-rose-400 font-semibold">0 Detected</span>
        </div>
        <div className="flex justify-between">
          <span>Total Collection:</span> <span className="text-emerald-400 font-bold font-mono">92.4% Rec.</span>
        </div>
      </div>
    )
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  // Parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // Operations Feed index
  const [feedIndex, setFeedIndex] = useState(0);

  // Track mouse coordinates for smooth 3D parallax tilt
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2); // -1 to 1
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2); // -1 to 1
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cycle the live feed every 4 seconds
  useEffect(() => {
    const feedInterval = setInterval(() => {
      setFeedIndex((prev) => (prev + 1) % FEED_LOGS.length);
    }, 4000);
    return () => clearInterval(feedInterval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden font-sans relative selection:bg-indigo-500 selection:text-white">

      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-blue-50/40 via-indigo-50/20 to-transparent rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute top-[50vh] left-[-200px] w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Floating mathematical glyphs for Linear/Apple style academic look */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none opacity-[0.15]">
        <div className="absolute top-[12vh] left-[6%] text-indigo-900 font-serif text-3xl">∑</div>
        <div className="absolute top-[40vh] left-[3%] text-blue-900 text-4xl">∫</div>
        <div className="absolute top-[75vh] right-[5%] text-indigo-900 text-3xl">π</div>
        <div className="absolute top-[20vh] right-[8%] text-blue-900 font-mono text-xl">{"{...}"}</div>
      </div>

      {/* Header Glass Navbar */}
      <div className="sticky top-0 z-50 px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        <nav className="bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-full px-6 py-3 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center shadow shadow-indigo-500/10">
              <GraduationCap className="text-white h-4.5 w-4.5" strokeWidth={2.5} />
            </div>
            <span className="text-base font-black text-slate-900 tracking-tight">
              Edu<span className="text-indigo-600">ERP</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Directory</a>
            <a href="#portals" className="hover:text-indigo-600 transition-colors">Sandbox Login</a>
            <a href="#specs" className="hover:text-indigo-600 transition-colors">Engine specs</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-full text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/10 transition-all cursor-pointer"
              >
                Dashboard
                <ArrowRight size={13} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-slate-500 hover:text-slate-950 font-extrabold text-xs transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('portals');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-full text-xs transition-all cursor-pointer shadow-sm"
                >
                  Demo Logins
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 pt-8 pb-20">

        {/* Left Side Content Column */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-100/50 text-[10px] font-black uppercase tracking-wider text-indigo-600 shadow-xs">
            <Sparkles size={11} className="text-indigo-500 animate-pulse" />
            Empowering Smart Academic Governance
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-slate-900 leading-[1.05] font-sans">
            Unify Your Campus Under a <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 bg-clip-text text-transparent">
              Single Intelligent System
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-semibold max-w-xl">
            A state-of-the-art ERP managing student admissions, academic configurations, examinations, attendance registry, finance ledger, hostel, transport routing, placement cells, and alumni relations from one central platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-all text-xs cursor-pointer"
            >
              Sign In to Portals
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-600 font-extrabold rounded-xl border border-slate-200 transition-all text-xs shadow-xs cursor-pointer"
            >
              Explore Modules
            </button>
          </div>

          {/* Metrics List Block */}
          <div className="pt-8 border-t border-slate-100 flex flex-wrap gap-x-10 gap-y-6">
            <div>
              <p className="text-2xl font-black text-slate-900">15,000+</p>
              <p className="text-[9px] text-slate-400 font-black uppercase mt-0.5 tracking-wider">Students Enrolled</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">450+</p>
              <p className="text-[9px] text-slate-400 font-black uppercase mt-0.5 tracking-wider">Faculty Members</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">98.4%</p>
              <p className="text-[9px] text-slate-400 font-black uppercase mt-0.5 tracking-wider">Placement Rate</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">25+</p>
              <p className="text-[9px] text-slate-400 font-black uppercase mt-0.5 tracking-wider">Departments</p>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Orbital Animation (Desktop) & Carousel (Mobile) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[580px] w-full">

          {/* Desktop view: Rotating concentric system */}
          <div className="hidden lg:block relative w-[580px] h-[580px] select-none scale-[0.9] xl:scale-100 origin-center transition-transform">

            {/* Parallax Container bound to Mouse Position */}
            <motion.div
              style={{
                x: mousePos.x * 20,
                y: mousePos.y * 20,
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="w-full h-full relative flex items-center justify-center"
            >
              {/* Central Core: ERP CORE Shield */}
              <div className="w-[100px] h-[100px] rounded-3xl bg-white border-2 border-indigo-100 flex flex-col items-center justify-center shadow-xl shadow-indigo-100/40 relative z-40 bg-white/95 backdrop-blur-md group hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl animate-pulse"></div>
                <GraduationCap className="text-indigo-600 h-8 w-8 relative z-10" />
                <span className="text-[8px] font-black tracking-widest text-slate-800 uppercase mt-1 relative z-10">ERP CORE</span>
              </div>

              {/* Inner Orbit (Radius 100px, Speed 20s) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
                className="absolute w-[200px] h-[200px] rounded-full border border-slate-150 border-dashed z-30"
              >
                {INNER_ORBIT.map((mod, idx) => {
                  const angle = (idx * 2 * Math.PI) / INNER_ORBIT.length;
                  const x = 100 * Math.cos(angle);
                  const y = 100 * Math.sin(angle);
                  return (
                    <motion.div
                      key={mod.name}
                      style={{
                        position: 'absolute',
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        x: '-50%',
                        y: '-50%'
                      }}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
                      className="origin-center"
                    >
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white/90 backdrop-blur-md shadow-xs ${mod.color.split(' ')[0]} ${mod.color.split(' ')[1]} ${mod.color.split(' ')[2]} text-[10px] font-bold cursor-pointer hover:scale-105 transition-transform whitespace-nowrap`}>
                        <mod.icon size={11} className="shrink-0" />
                        <span>{mod.name}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Middle Orbit (Radius 180px, Speed 30s) */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
                className="absolute w-[360px] h-[360px] rounded-full border border-slate-150 z-20"
              >
                {MIDDLE_ORBIT.map((mod, idx) => {
                  const angle = (idx * 2 * Math.PI) / MIDDLE_ORBIT.length;
                  const x = 180 * Math.cos(angle);
                  const y = 180 * Math.sin(angle);
                  return (
                    <motion.div
                      key={mod.name}
                      style={{
                        position: 'absolute',
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        x: '-50%',
                        y: '-50%'
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
                      className="origin-center"
                    >
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white/90 backdrop-blur-md shadow-xs ${mod.color.split(' ')[0]} ${mod.color.split(' ')[1]} ${mod.color.split(' ')[2]} text-[10px] font-bold cursor-pointer hover:scale-105 transition-transform whitespace-nowrap`}>
                        <mod.icon size={11} className="shrink-0" />
                        <span>{mod.name}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Outer Orbit (Radius 260px, Speed 40s) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
                className="absolute w-[520px] h-[520px] rounded-full border border-slate-100 z-10"
              >
                {OUTER_ORBIT.map((mod, idx) => {
                  const angle = (idx * 2 * Math.PI) / OUTER_ORBIT.length;
                  const x = 260 * Math.cos(angle);
                  const y = 260 * Math.sin(angle);
                  return (
                    <motion.div
                      key={mod.name}
                      style={{
                        position: 'absolute',
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        x: '-50%',
                        y: '-50%'
                      }}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
                      className="origin-center"
                    >
                      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border bg-white/80 backdrop-blur-md shadow-xs ${mod.color.split(' ')[0]} ${mod.color.split(' ')[1]} ${mod.color.split(' ')[2]} text-[9px] font-bold cursor-pointer hover:scale-105 transition-transform whitespace-nowrap`}>
                        <mod.icon size={10} className="shrink-0" />
                        <span>{mod.name}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

          </div>

          {/* Mobile/Tablet View: Swipeable Carousel */}
          <div className="block lg:hidden w-full px-2 mt-8">
            <p className="text-center text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3">All Active ERP Modules</p>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scroll-smooth snap-x snap-mandatory">
              {ALL_MODULES.map((mod, idx) => (
                <div key={idx} className="snap-center shrink-0 w-48 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${mod.color.split(' ')[0]} ${mod.color.split(' ')[2]}`}>
                    <mod.icon size={14} />
                  </div>
                  <h4 className="text-xs font-black text-slate-800">{mod.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Live integrated database operations.</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
            </div>
          </div>

          {/* Floating Dark Glass Panel: Campus Operations Feed */}
          <div className="w-full max-w-[420px] bg-slate-900/90 backdrop-blur-md border border-slate-850 rounded-2xl p-4 mt-6 lg:absolute lg:bottom-[-140px] lg:z-50 shadow-xl text-left space-y-2 select-none">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-black uppercase text-slate-350 tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Campus Operations Feed
              </span>
              <span className="text-[8px] font-mono text-slate-500 font-bold tracking-widest">LIVE TRANSACTIONS</span>
            </div>

            <div className="h-[40px] flex items-center overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={feedIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between w-full text-xs text-white"
                >
                  <span className="font-semibold truncate max-w-[280px] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                    {FEED_LOGS[feedIndex].text}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono shrink-0">{FEED_LOGS[feedIndex].time}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* Concept info Section */}
      <section id="about" className="bg-slate-50/50 py-20 px-6 border-y border-slate-100 relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
            The Concept
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug font-sans">
            "An enterprise dashboard designed to unify academic modules and simplify campus operations."
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto font-semibold leading-relaxed">
            By building independent controllers, modular components, and real-time operations feed, the system enables students, parents, faculty, and administration to sync effortlessly.
          </p>
        </div>
      </section>

      {/* Directory Section: Interactive 3D Showcase (Replacing the grid circled in 3rd image) */}
      <section id="features" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        
        {/* Large screen: Scattered 3D Gallery (Inspired by Luke Baffait's design) */}
        <div className="hidden lg:block relative bg-slate-950 text-white rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden min-h-[780px] w-full p-8 select-none">
          
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"></div>
          
          {/* Decorative glowing gradient orbs */}
          <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Central static text block */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-lg z-25 pointer-events-none">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-950 border border-indigo-900/60 px-3.5 py-1.5 rounded-full">
              System Directory
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-5 text-white leading-tight font-sans">
              Each module is built <br />
              to <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">integrate, automate</span> & <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">empower</span> our campus.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-5 font-semibold max-w-sm mx-auto leading-relaxed">
              Hover over the floating mockups to inspect live dashboard parameters, databases, and metrics.
            </p>
          </div>

          {/* Scattered 3D Cards */}
          {GALLERY_MOCKUPS.map((card, idx) => {
            const CardIcon = card.icon;
            return (
              <motion.div
                key={idx}
                style={{
                  transform: `translate3d(${mousePos.x * card.parallaxX}px, ${mousePos.y * card.parallaxY}px, 0) perspective(1000px)`,
                  transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
                className={`absolute ${card.pos} group cursor-pointer pointer-events-auto z-10`}
              >
                {/* Floating container card with glassmorphism and subtle border */}
                <div 
                  className={`border ${card.color} backdrop-blur-md rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-900/80 ${card.rotate} animate-float`}
                  style={{ animationDelay: card.delay, animationDuration: '6s' }}
                >
                  
                  {/* Mockup browser dot header */}
                  <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/70"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/70"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/70"></span>
                    <span className="text-[7px] text-slate-500 font-semibold uppercase tracking-wider ml-auto">Live Sync</span>
                  </div>

                  {/* Main header bar: Icon + Title */}
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${card.tagColor}`}>
                      <CardIcon size={12} />
                    </div>
                    <span className="text-xs font-black text-white tracking-tight">{card.name}</span>
                  </div>

                  {/* Custom preview widget */}
                  {card.preview}

                  {/* Tiny description */}
                  <p className="text-[9px] text-slate-550 mt-3 font-semibold border-t border-white/5 pt-2">
                    {card.desc}
                  </p>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Small/Mobile screens: Clean Responsive Grid Layout */}
        <div className="block lg:hidden text-center max-w-3xl mx-auto mb-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
            System Directory
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Integrated Enterprise Modules
          </h2>
          <p className="text-slate-550 text-xs sm:text-sm mt-3 font-semibold leading-relaxed">
            Explore a detailed list of modules optimized for speed, reliability, and security.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 text-left">
            {GALLERY_MOCKUPS.map((card, idx) => {
              const CardIcon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col h-full group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl border border-indigo-100 bg-indigo-50/60 text-indigo-600 flex items-center justify-center shrink-0">
                      <CardIcon size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800 tracking-tight">{card.name}</h3>
                      <span className="text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border border-slate-150 bg-slate-50 text-slate-400 group-hover:text-indigo-600 transition-colors mt-0.5 inline-block">
                        Active
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-550 text-xs leading-relaxed flex-grow font-semibold">
                    {card.desc}. This module is connected to the master database via API controllers with role-based checks.
                  </p>
                  <div className="mt-5 flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer transition-colors pt-4 border-t border-slate-100">
                    Explore integration details
                    <ChevronRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* Sandbox Access Section */}
      <section id="portals" className="bg-slate-50/50 py-24 px-6 border-y border-slate-150 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
            Sandbox Credentials
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
            Launch Development Sandbox
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-semibold">
            To view individual dashboards, log in using any role preset on the login screen (Admin, Teacher, Student, Parent, Staff).
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/10 transition-all text-xs cursor-pointer"
            >
              Sign In to System
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Tech specs section */}
      <section id="specs" className="py-24 px-6 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 z-10 relative">
        <div className="md:w-1/2">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
            Specs & Integrity
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Engineered for Modern Enterprise Standards
          </h2>
          <p className="text-slate-550 text-xs sm:text-sm mt-4 leading-relaxed font-semibold">
            The portal syncs schema definitions automatically inside Sequelize transactions, authenticates requests via stateless Bearer JSON Web Tokens, and hashes storage with salted bcrypt algorithms.
          </p>
        </div>

        <div className="md:w-1/2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm w-full">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Shield size={14} className="text-indigo-600" />
            Security & Performance Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
              <span className="text-xs font-semibold text-slate-600">Database Engine</span>
              <span className="text-xs font-bold text-slate-800">MySQL / InnoDB</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
              <span className="text-xs font-semibold text-slate-600">Avg Sync Latency</span>
              <span className="text-xs font-mono font-bold text-slate-800">14ms</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
              <span className="text-xs font-semibold text-slate-600">Password Encryption</span>
              <span className="text-xs font-mono font-bold text-slate-800">Bcrypt (Salt rounds: 10)</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
              <span className="text-xs font-semibold text-slate-600">Session Protocol</span>
              <span className="text-xs font-bold text-slate-800">Stateless JWT-HS256</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-6 border-t border-slate-100 text-[11px] text-slate-400 font-semibold z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="text-white h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-slate-850">EduERP Enterprises</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-700 transition-colors">Security Policies</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Terms of Operations</a>
            <a href="#" className="hover:text-slate-700 transition-colors">IT Registrar Desk</a>
          </div>

          <p className="text-[10px] text-slate-400 font-medium">
            &copy; 2026 EduERP Suite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
