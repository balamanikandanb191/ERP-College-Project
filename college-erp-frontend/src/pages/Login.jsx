import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  Shield, 
  BookOpen, 
  Users, 
  Heart,
  Eye,
  EyeOff,
  CheckCircle,
  Sparkles,
  Info,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

const ROLE_PRESETS = {
  Admin: {
    email: 'admin@eduerp.com',
    password: 'Admin@123',
    name: 'Administrator',
    icon: Shield,
    desc: 'System administration, user registration management, billing configurations, and log auditing.',
    badgeStyle: 'bg-white/10 text-white/95 border-white/15',
    gradientStyle: 'linear-gradient(135deg, rgba(109, 40, 217, 0.95) 0%, rgba(79, 70, 229, 0.95) 100%)',
    primaryColor: 'text-violet-650',
    focusRing: 'focus:ring-violet-500/10 focus:border-violet-500',
    outlineGlow: 'shadow-violet-500/5 border-violet-200/50 bg-violet-50/30'
  },
  Teacher: {
    email: 'teacher@eduerp.com',
    password: 'Teacher@123',
    name: 'Faculty Member',
    icon: BookOpen,
    desc: 'Record daily class attendance registers, assign evaluation marks, and build student progress logs.',
    badgeStyle: 'bg-white/10 text-white/95 border-white/15',
    gradientStyle: 'linear-gradient(135deg, rgba(4, 120, 87, 0.95) 0%, rgba(13, 148, 136, 0.95) 100%)',
    primaryColor: 'text-emerald-650',
    focusRing: 'focus:ring-emerald-500/10 focus:border-emerald-500',
    outlineGlow: 'shadow-emerald-500/5 border-emerald-200/50 bg-emerald-50/30'
  },
  Student: {
    email: 'student@eduerp.com',
    password: 'Student@123',
    name: 'Enrolled Student',
    icon: GraduationCap,
    desc: 'Check course schedules, check attendance thresholds, register for exams, and borrow library books.',
    badgeStyle: 'bg-white/10 text-white/95 border-white/15',
    gradientStyle: 'linear-gradient(135deg, rgba(71, 85, 105, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)', // Muted Slate Blue
    primaryColor: 'text-slate-600',
    focusRing: 'focus:ring-slate-500/10 focus:border-slate-500',
    outlineGlow: 'shadow-slate-500/5 border-slate-200/50 bg-slate-50/30'
  },
  Staff: {
    email: 'staff@eduerp.com',
    password: 'Staff@123',
    name: 'Administrative Staff',
    icon: Users,
    desc: 'Manage prospective leads, process Bonafides, issue TC certificates, and manage logistics.',
    badgeStyle: 'bg-white/10 text-white/95 border-white/15',
    gradientStyle: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(59, 130, 246, 0.95) 100%)', // Muted Sapphire Blue
    primaryColor: 'text-blue-600',
    focusRing: 'focus:ring-blue-500/10 focus:border-blue-500',
    outlineGlow: 'shadow-blue-500/5 border-blue-200/50 bg-blue-50/30'
  },
  Parent: {
    email: 'parent@eduerp.com',
    password: 'Parent@123',
    name: 'Student Parent',
    icon: Heart,
    desc: 'Monitor student\'s weekly performance graphs, submit leave notifications, and pay college fee ledgers.',
    badgeStyle: 'bg-white/10 text-white/95 border-white/15',
    gradientStyle: 'linear-gradient(135deg, rgba(126, 34, 206, 0.95) 0%, rgba(79, 70, 229, 0.95) 100%)', // Muted Plum/Violet
    primaryColor: 'text-purple-600',
    focusRing: 'focus:ring-purple-500/10 focus:border-purple-500',
    outlineGlow: 'shadow-purple-500/5 border-purple-200/50 bg-purple-50/30'
  }
};

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const preselected = location.state?.preselectedRole;
    if (preselected && ROLE_PRESETS[preselected]) {
      setSelectedRole(preselected);
      setEmail(ROLE_PRESETS[preselected].email);
      setPassword(ROLE_PRESETS[preselected].password);
    } else {
      setEmail(ROLE_PRESETS.Admin.email);
      setPassword(ROLE_PRESETS.Admin.password);
    }
  }, [location.state]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setEmail(ROLE_PRESETS[role].email);
    setPassword(ROLE_PRESETS[role].password);
  };

  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      const loggedUser = result.user;
      toast.success(`Welcome back, ${loggedUser.role}!`, { duration: 3000 });
      
      setTimeout(() => {
        const role = loggedUser.role;
        if (role === 'Super Admin' || role === 'Admin') {
          navigate('/admin');
        } else if (role === 'Staff' || role === 'Teacher') {
          navigate('/staff');
        } else if (role === 'Student' || role === 'Parent') {
          navigate('/student');
        } else {
          navigate('/unauthorized');
        }
      }, 500);
    } else {
      toast.error(result.message || 'Authentication failed. Please verify credentials.', { duration: 4000 });
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    const preset = ROLE_PRESETS[selectedRole];
    setEmail(preset.email);
    setPassword(preset.password);
    setLoading(true);
    
    const result = await login(preset.email, preset.password);
    if (result.success) {
      toast.success(`Authenticated as ${selectedRole}`);
      setTimeout(() => {
        const role = result.user.role;
        if (role === 'Super Admin' || role === 'Admin') {
          navigate('/admin');
        } else if (role === 'Staff' || role === 'Teacher') {
          navigate('/staff');
        } else if (role === 'Student' || role === 'Parent') {
          navigate('/student');
        } else {
          navigate('/unauthorized');
        }
      }, 500);
    } else {
      toast.error(result.message || 'Quick login failed.');
      setLoading(false);
    }
  };

  const activePreset = ROLE_PRESETS[selectedRole];
  const ActiveIcon = activePreset.icon;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-0 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main card panel */}
      <div className="w-full max-w-5xl bg-white border border-slate-250/80 rounded-none sm:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[90vh] md:min-h-0 relative z-10">
        
        {/* Left marketing panel */}
        <div 
          className="hidden md:flex md:w-5/12 p-10 flex-col justify-between text-white relative transition-all duration-700 ease-in-out border-r border-slate-200/50"
          style={{ background: activePreset.gradientStyle }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>
          
          {/* Top Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
              <GraduationCap className="text-white h-5.5 w-5.5" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              Edu<span className="text-white/80 font-medium">ERP</span>
            </span>
          </div>

          {/* Dynamic Content */}
          <div className="my-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase text-white/90 shadow-sm backdrop-blur-md">
              <Sparkles size={11} className="text-white animate-pulse" />
              Role Guided Access
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRole}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/10 flex items-center justify-center shadow-xs">
                  <ActiveIcon size={26} className="text-white" />
                </div>
                
                <h3 className="text-2xl font-black tracking-tight leading-tight text-white">
                  {activePreset.name}
                </h3>
                
                <p className="text-[12px] leading-relaxed font-semibold text-white/85">
                  {activePreset.desc}
                </p>

                <div className="pt-4 space-y-2.5">
                  <span className="text-[9px] font-black tracking-widest uppercase block text-white/50">
                    Capabilities Verified:
                  </span>
                  {[
                    'Dynamic API scope guards',
                    'Custom responsive reporting dashboard',
                    'Interactive scheduler integrations'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex gap-2.5 text-xs font-semibold items-center text-white/90">
                      <CheckCircle size={14} className="text-white/80" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer branding */}
          <div className="text-[10px] font-bold border-t pt-5 flex items-center gap-2 border-white/10 text-white/60">
            <Activity size={12} className="text-white/80" />
            <span>EduERP Enterprise Security Protocol v2.4</span>
          </div>

        </div>

        {/* Right form panel */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto space-y-7">
            
            {/* Form Headers */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Portal Sign In
              </h2>
              <p className="text-slate-500 text-xs mt-1.5 font-semibold">
                Select your account preset to quickly test dashboard functionality.
              </p>
            </div>

            {/* Dynamic tabs */}
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                Access Portals Presets
              </span>
              <div className="grid grid-cols-5 gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                {Object.keys(ROLE_PRESETS).map((role) => {
                  const preset = ROLE_PRESETS[role];
                  const Icon = preset.icon;
                  const isSelected = selectedRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleChange(role)}
                      className={`relative flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-300 group cursor-pointer ${
                        isSelected 
                          ? 'text-primary font-bold' 
                          : 'text-slate-400 hover:text-slate-655'
                      }`}
                    >
                      {/* Active tab slide animation */}
                      {isSelected && (
                        <motion.div
                          layoutId="activeRolePill"
                          className="absolute inset-0 bg-white border border-slate-200/80 rounded-xl shadow-xs z-0"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      
                      <span className="relative z-10 flex flex-col items-center">
                        <Icon size={16} className={isSelected ? 'text-primary' : 'group-hover:scale-105 transition-transform'} />
                        <span className="text-[9px] font-black mt-1 tracking-tight">
                          {role}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preset description glow panel */}
            <div className={`p-4 rounded-2xl border transition-all duration-350 flex items-center justify-between gap-4 ${activePreset.outlineGlow}`}>
              <div>
                <span className="text-[9px] font-black tracking-widest text-slate-450 uppercase block">Selected Credentials:</span>
                <p className="text-[12px] font-mono font-bold text-slate-800 mt-1">{activePreset.email}</p>
                <p className="text-[11px] font-mono font-semibold text-slate-500 mt-0.5">Password: <span className="text-slate-800 font-bold">{activePreset.password}</span></p>
              </div>
              <button
                type="button"
                onClick={handleQuickLogin}
                className="px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer shadow-sm transition-colors shrink-0"
              >
                Instant Login
              </button>
            </div>

            {/* Login Inputs */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={15} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-slate-800 placeholder:text-slate-450 focus:outline-none focus:ring-4 transition-all font-semibold ${activePreset.focusRing}`}
                    placeholder="name@college.edu"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                    Password
                  </label>
                  <a href="#" className="text-xs text-primary font-bold hover:underline transition-colors font-sans">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={15} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-11 py-3.5 text-xs text-slate-800 placeholder:text-slate-455 focus:outline-none focus:ring-4 transition-all font-semibold ${activePreset.focusRing}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Keep Signed In */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4.5 w-4.5 rounded border-slate-305 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 text-xs text-slate-550 font-semibold cursor-pointer">
                  Remember my credentials
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/10 disabled:opacity-75 disabled:cursor-not-allowed text-xs cursor-pointer mt-4"
              >
                {loading ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white/25 border-t-white rounded-full animate-spin"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Help desk link */}
            <div className="text-center text-xs text-slate-400 font-semibold pt-4">
              Need assistance? Contact <a href="#" className="text-primary font-bold hover:underline font-sans">Registrar Office</a>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
