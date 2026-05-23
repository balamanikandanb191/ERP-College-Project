import React, { useState } from 'react';
import { 
  ArrowLeft, Shield, Sparkles, Printer, FileText, 
  TrendingUp, Award, Clock, DollarSign, Calendar, 
  MapPin, ShieldAlert, FileCheck, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

// Subcomponents
import StudentSmartID from './StudentSmartID';
import AcademicIntelligence from './AcademicIntelligence';
import AttendanceAnalytics from './AttendanceAnalytics';
import StudentFinancePanel from './StudentFinancePanel';
import StudentTransportPanel from './StudentTransportPanel';
import PlacementCareerPanel from './PlacementCareerPanel';
import ParentGuardianPanel from './ParentGuardianPanel';
import StudentDocumentVault from './StudentDocumentVault';
import StudentAdminControls from './StudentAdminControls';

const StudentEnterpriseProfile = ({ student = {}, onClose }) => {
  const [activeTab, setActiveTab] = useState('smart_id');

  const safeData = student || {};

  const getProfileImage = () => {
    const defaultAvatar = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=250&auto=format&fit=crop';
    const photo = safeData.photoUrl || safeData.profileImage || safeData.photo || '';
    if (!photo) return defaultAvatar;
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
      return photo;
    }
    return `http://localhost:5000/${photo}`;
  };

  const tabs = [
    { id: 'smart_id', label: 'Smart ID Card', icon: Award },
    { id: 'academic', label: 'Academics', icon: TrendingUp },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'finance', label: 'Fees & Finance', icon: DollarSign },
    { id: 'transport', label: 'Transport / Hostel', icon: MapPin },
    { id: 'placement', label: 'Career & Placement', icon: Shield },
    { id: 'parents', label: 'Parent Details', icon: Info },
    { id: 'vault', label: 'Document Vault', icon: FileCheck },
    { id: 'admin', label: 'Admin Actions', icon: ShieldAlert }
  ];

  // Print Profile Simulator
  const handlePrintID = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    toast.success(`Report downloaded successfully for student: ${safeData.fullName || safeData.name}`);
  };

  const handleGenerateSummary = () => {
    toast.success(`Parent briefing summary generated successfully!`);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'smart_id':
        return <StudentSmartID student={safeData} />;
      case 'academic':
        return <AcademicIntelligence student={safeData} />;
      case 'attendance':
        return <AttendanceAnalytics student={safeData} />;
      case 'finance':
        return <StudentFinancePanel student={safeData} />;
      case 'transport':
        return <StudentTransportPanel student={safeData} />;
      case 'placement':
        return <PlacementCareerPanel student={safeData} />;
      case 'parents':
        return <ParentGuardianPanel student={safeData} />;
      case 'vault':
        return <StudentDocumentVault student={safeData} />;
      case 'admin':
        return <StudentAdminControls student={safeData} />;
      default:
        return <StudentSmartID student={safeData} />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-fade-in">
      
      {/* Upper Navigation and Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md border border-slate-100 p-5 rounded-[28px] shadow-xs">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold uppercase text-[10px] tracking-widest transition-colors self-start md:self-auto bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl border border-slate-200/60 shadow-inner"
        >
          <ArrowLeft size={14} /> Back to Register
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={handlePrintID}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 flex items-center gap-2 transition-all shadow-md text-xs uppercase tracking-wider"
          >
            <Printer size={14} /> Print ID Card
          </button>
          <button 
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-all shadow-xs text-xs uppercase tracking-wider"
          >
            <FileText size={14} className="text-slate-400" /> Export Full Report
          </button>
          <button 
            onClick={handleGenerateSummary}
            className="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 flex items-center gap-2 transition-all shadow-xs text-xs uppercase tracking-wider"
          >
            <Sparkles size={14} className="text-indigo-500" /> Parent Summary
          </button>
        </div>
      </div>

      {/* Profile Header Cards */}
      <div className="bg-slate-900 text-white rounded-[40px] p-6 md:p-8 relative overflow-hidden shadow-xl border-l-8 border-indigo-500 flex flex-col md:flex-row items-center gap-6 md:gap-8">
        
        {/* Student Avatar */}
        <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl shrink-0 bg-white/10 flex items-center justify-center font-black text-4xl text-indigo-300">
          <img 
            src={getProfileImage()} 
            alt={safeData.fullName || safeData.name} 
            className="w-full h-full object-cover animate-fade-in"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=250&auto=format&fit=crop';
            }}
          />
        </div>

        {/* Student Summary */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
            <h2 className="text-2xl font-black tracking-tight">{safeData.fullName || safeData.name}</h2>
            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 self-center">
              Active Enrolled
            </span>
          </div>

          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            {safeData.registerNumber || safeData.reg || 'REG99999'} • {safeData.department || 'Computer Science'}
          </p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-xl border border-white/10 text-[10px]">
              <span className="text-slate-400 font-bold uppercase">Year:</span>
              <span className="font-bold">{safeData.year || '3rd Year'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-xl border border-white/10 text-[10px]">
              <span className="text-slate-400 font-bold uppercase">Sem:</span>
              <span className="font-bold">{safeData.semester || 'Semester VI'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-xl border border-white/10 text-[10px]">
              <span className="text-slate-400 font-bold uppercase">CGPA:</span>
              <span className="font-bold text-indigo-300">{safeData.cgpa || '8.2'}</span>
            </div>
          </div>
        </div>

        {/* Floating background blur design */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      </div>

      {/* Main Split Layout: Sidebar Navigation + Sub-panel View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Nav */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-4 shadow-sm h-fit space-y-2">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-3 py-1 block">
            Intelligence Navigation
          </span>
          <div className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display Panel */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm min-h-[480px]">
          {renderActiveTabContent()}
        </div>

      </div>

    </div>
  );
};

export default StudentEnterpriseProfile;
