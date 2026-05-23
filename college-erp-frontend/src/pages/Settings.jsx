import React, { useState, useEffect } from 'react';
import { 
  Building2, Image, GraduationCap, Users, Clock, 
  Calendar, BookOpen, Truck, Home, Bell, Shield, 
  Palette, BarChart3, Users2, Search, Save, RotateCcw,
  BookMarked, CreditCard, Award, UserCheck, LayoutDashboard
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

// Sub-sections
import InstitutionSection from '../components/settings/InstitutionSection';
import BrandingSection from '../components/settings/BrandingSection';
import AcademicSection from '../components/settings/AcademicSection';
import AdmissionSection from '../components/settings/AdmissionSection';
import AttendanceSection from '../components/settings/AttendanceSection';
import SecuritySection from '../components/settings/SecuritySection';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('institution');
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Could not load system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (sectionData) => {
    try {
      setSaving(true);
      // Format data for bulk update
      const payload = Object.entries(sectionData).map(([key, value]) => ({
        group: activeSection,
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value),
        type: typeof value
      }));

      await api.post('/settings/bulk', { settings: payload });
      toast.success('Settings updated successfully');
      fetchSettings(); // Refresh
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'institution', label: 'Institution Info', icon: Building2, color: 'text-blue-600' },
    { id: 'branding', label: 'Branding & Theme', icon: Palette, color: 'text-purple-600' },
    { id: 'academic', label: 'Academic Calendar', icon: Calendar, color: 'text-emerald-600' },
    { id: 'admission', label: 'Student Admission', icon: GraduationCap, color: 'text-indigo-600' },
    { id: 'hr', label: 'Staff & HR', icon: Users, color: 'text-rose-600' },
    { id: 'attendance', label: 'Attendance Rules', icon: UserCheck, color: 'text-amber-600' },
    { id: 'timetable', label: 'Timetable Config', icon: Clock, color: 'text-cyan-600' },
    { id: 'exams', label: 'Examination', icon: Award, color: 'text-violet-600' },
    { id: 'fees', label: 'Fees & Finance', icon: CreditCard, color: 'text-teal-600' },
    { id: 'library', label: 'Library Rules', icon: BookMarked, color: 'text-orange-600' },
    { id: 'transport', label: 'Transport', icon: Truck, color: 'text-slate-600' },
    { id: 'hostel', label: 'Hostel', icon: Home, color: 'text-pink-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-red-600' },
    { id: 'security', label: 'Security & Roles', icon: Shield, color: 'text-indigo-700' },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3, color: 'text-green-600' },
    { id: 'alumni', label: 'Alumni', icon: Users2, color: 'text-sky-600' },
  ];

  const filteredSections = sections.filter(s => 
    s.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    const sectionSettings = settings.filter(s => s.group === activeSection);
    // Convert to flat object for easy editing
    const data = sectionSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    switch (activeSection) {
      case 'institution': return <InstitutionSection data={data} onSave={handleSave} saving={saving} />;
      case 'branding': return <BrandingSection data={data} onSave={handleSave} saving={saving} />;
      case 'academic': return <AcademicSection data={data} onSave={handleSave} saving={saving} />;
      case 'admission': return <AdmissionSection data={data} onSave={handleSave} saving={saving} />;
      case 'attendance': return <AttendanceSection data={data} onSave={handleSave} saving={saving} />;
      case 'security': return <SecuritySection data={data} onSave={handleSave} saving={saving} />;
      default: return (
        <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
          <LayoutDashboard size={64} className="mb-4 opacity-20" />
          <h3 className="text-xl font-bold">Section Under Development</h3>
          <p className="text-sm">This configuration panel will be available in the next update.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-72 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden shrink-0">
        <div className="p-5 border-b border-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search settings..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          <div className="space-y-1">
            {filteredSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeSection === section.id 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <section.icon size={18} className={activeSection === section.id ? 'text-blue-600' : 'text-slate-400'} />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-50 bg-slate-50/50">
          <button 
            onClick={fetchSettings}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-all"
          >
            <RotateCcw size={14} />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {sections.find(s => s.id === activeSection)?.label}
            </h2>
            <p className="text-sm text-slate-500 font-medium">Configure global system behavior and institutional data</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Live Sync Active</span>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-40 bg-slate-50 rounded-3xl w-full"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-slate-50 rounded-xl w-full"></div>
                <div className="h-12 bg-slate-50 rounded-xl w-full"></div>
              </div>
              <div className="h-64 bg-slate-50 rounded-3xl w-full"></div>
            </div>
          ) : renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
