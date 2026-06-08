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
          <div className="w-full max-w-[420px] bg-slate-900/90 backdrop-blur-md border border-slate-850 rounded-2xl p-4 mt-6 lg:absolute lg:bottom-[-20px] lg:z-50 shadow-xl text-left space-y-2 select-none">
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

      {/* Directory Grid Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
            System Directory
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Integrated Enterprise Modules
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-3 font-semibold leading-relaxed">
            Explore a detailed list of modules optimized for speed, reliability, and security.
          </p>
        </div>

        {/* Directory Modules Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_MODULES.slice(0, 9).map((mod, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-sm transition-all flex flex-col h-full group"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-5 shrink-0 ${mod.color.split(' ')[0]} ${mod.color.split(' ')[2]}`}>
                <mod.icon size={16} />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 tracking-tight">{mod.name}</h3>
                <span className="text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border border-slate-150 bg-slate-50 text-slate-400 group-hover:text-indigo-600 transition-colors">
                  Active
                </span>
              </div>
              <p className="text-slate-550 text-xs mt-3 leading-relaxed flex-grow font-semibold">
                This module supports CRUD operations, CSV exports, role access checks, and real-time database sync logic.
              </p>
              <div className="mt-5 flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer transition-colors pt-4 border-t border-slate-100">
                Explore integration details
                <ChevronRight size={12} />
              </div>
            </motion.div>
          ))}
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
