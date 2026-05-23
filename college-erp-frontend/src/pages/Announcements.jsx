import React, { useState, useEffect, useMemo } from 'react';
import { 
  Megaphone, Calendar, Bell, ShieldAlert, 
  Plus, Search, Filter, Download, 
  TrendingUp, Award, Clock, FileText, X
} from 'lucide-react';
import api from '../services/api';
import SafeErrorBoundary from '../components/SafeErrorBoundary';
import toast from 'react-hot-toast';

// Sub-components
import AnnouncementDashboard from '../components/communication/AnnouncementDashboard';
import AcademicCalendar from '../components/communication/AcademicCalendar';
import CreateAnnouncementModal from '../components/communication/CreateAnnouncementModal';
import CommRegistryModal from '../components/communication/CommRegistryModal';

const Announcements = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Drilldown Registry Modal states
  const [registryOpen, setRegistryOpen] = useState(false);
  const [registryTitle, setRegistryTitle] = useState('');
  const [registryData, setRegistryData] = useState([]);
  const [registryType, setRegistryType] = useState('');
  const [activeRegistry, setActiveRegistry] = useState(null);

  // 8 Centralized Shared Communication States
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [unreadPings, setUnreadPings] = useState([]);
  const [scheduledBroadcasts, setScheduledBroadcasts] = useState([]);
  const [exams, setExams] = useState([]);
  const [staff, setStaff] = useState([]);

  // Initialize and synchronize states from localStorage
  const loadSharedStates = () => {
    try {
      // 1. Notices / Circulars
      const cachedNotices = localStorage.getItem('edu_erp_comm_notices');
      if (cachedNotices) {
        setNotices(JSON.parse(cachedNotices));
      } else {
        const defaultNotices = [
          { title: 'Semester Reopening Date Revised', department: 'Computer Science', audience: 'All Years', publishedBy: 'Dean Academics', timestamp: '2026-05-17', attachment: true, priority: 'High', content: 'The reopening date for the upcoming academic semester has been revised to June 5, 2026, due to structural scheduling alterations.' },
          { title: 'Annual Sports Meet 2026 Registration', department: 'Physical Education', audience: 'All Students', publishedBy: 'Sports Convener', timestamp: '2026-05-16', attachment: false, priority: 'General', content: 'Registrations are officially open for track and field events. Contact physical department coordinators to register.' },
          { title: 'Placement Drive - TCS Registration Deadline', department: 'Computer Science', audience: 'Final Years', publishedBy: 'TPO Head', timestamp: '2026-05-15', attachment: true, priority: 'Important', content: 'Final eligibility sheets are posted outside the Placement Cell. TCS application portal closes tonight at 11:59 PM.' }
        ];
        localStorage.setItem('edu_erp_comm_notices', JSON.stringify(defaultNotices));
        setNotices(defaultNotices);
      }

      // 2. Active Events
      const cachedEvents = localStorage.getItem('edu_erp_comm_events');
      if (cachedEvents) {
        setEvents(JSON.parse(cachedEvents));
      } else {
        const defaultEvents = [
          { title: 'Hackathon 2026: National Tech Summit', venue: 'Main Auditorium Hall A', coordinator: 'Dr. Amit Sharma (HOD CS)', timing: '10:00 AM - 05:00 PM', registrationCount: 148, liveStatus: 'Ongoing', departments: ['Computer Science', 'Information Technology'] },
          { title: 'Guest Lecture on Cloud System Scale', venue: 'Mini Seminar Hall 2', coordinator: 'Prof. Sneha Iyer', timing: '11:30 AM - 01:30 PM', registrationCount: 64, liveStatus: 'Upcoming', departments: ['Information Technology'] },
          { title: 'Workshop on Generative AI & LLMs', venue: 'CS Lab 3 Block C', coordinator: 'Tech Club Head', timing: '02:00 PM - 04:00 PM', registrationCount: 112, liveStatus: 'Upcoming', departments: ['Computer Science', 'Electronics'] }
        ];
        localStorage.setItem('edu_erp_comm_events', JSON.stringify(defaultEvents));
        setEvents(defaultEvents);
      }

      // 3. Upcoming Holidays
      const cachedHolidays = localStorage.getItem('edu_erp_comm_holidays');
      if (cachedHolidays) {
        setHolidays(JSON.parse(cachedHolidays));
      } else {
        const defaultHolidays = [
          { title: 'Buddha Purnima Festival Holiday', startDate: '2026-05-15', endDate: '2026-05-15', type: 'National', departments: 'All Departments', daysRemaining: 2 },
          { title: 'Summer Semester Break', startDate: '2026-06-01', endDate: '2026-06-15', type: 'Institutional', departments: 'All Students & Staff', daysRemaining: 14 }
        ];
        localStorage.setItem('edu_erp_comm_holidays', JSON.stringify(defaultHolidays));
        setHolidays(defaultHolidays);
      }

      // 4. Emergency Alerts
      const cachedAlerts = localStorage.getItem('edu_erp_comm_alerts');
      if (cachedAlerts) {
        setAlerts(JSON.parse(cachedAlerts));
      } else {
        const defaultAlerts = [
          { severity: 'Critical', issuedBy: 'Registrar Office', activeUntil: '2026-05-18', instructions: 'Heavy rain warning issued by weather office. College closed for tomorrow. Online lectures active.', acknowledged: false },
          { severity: 'Warning', issuedBy: 'Server Administration', activeUntil: '2026-05-17', instructions: 'Scheduled maintenance of campus ERP servers. Intermittent outages expected from 11 PM to 2 AM.', acknowledged: true }
        ];
        localStorage.setItem('edu_erp_comm_alerts', JSON.stringify(defaultAlerts));
        setAlerts(defaultAlerts);
      }

      // 5. Unread Pings
      const cachedPings = localStorage.getItem('edu_erp_comm_pings');
      if (cachedPings) {
        setUnreadPings(JSON.parse(cachedPings));
      } else {
        const defaultPings = [
          { sender: 'Dr. Vinoth (HOD CS)', recipientGroup: 'Final Year CS Faculty', unreadCount: 3, sentTime: '10 mins ago', messagePreview: 'Please update the mentoring sheets by today afternoon for the placement audit...' },
          { sender: 'Placement Cell Officer', recipientGroup: 'TPO Coordinators', unreadCount: 1, sentTime: '1 hour ago', messagePreview: 'Google recruitment drive hall seating is finalized in block C...' }
        ];
        localStorage.setItem('edu_erp_comm_pings', JSON.stringify(defaultPings));
        setUnreadPings(defaultPings);
      }

      // 6. Scheduled Broadcasts
      const cachedScheduled = localStorage.getItem('edu_erp_comm_broadcasts');
      if (cachedScheduled) {
        setScheduledBroadcasts(JSON.parse(cachedScheduled));
      } else {
        const defaultScheduled = [
          { scheduledTime: '2026-05-18 09:00 AM', target: 'All Students', status: 'Pending', creator: 'Dean Office', content: 'Academic course registration link for Summer Semester goes live tomorrow.' },
          { scheduledTime: '2026-05-19 10:00 AM', target: 'Teaching Staff', status: 'Pending', creator: 'HR Director', content: 'Faculty attendance registers biometric verification monthly notice.' }
        ];
        localStorage.setItem('edu_erp_comm_broadcasts', JSON.stringify(defaultScheduled));
        setScheduledBroadcasts(defaultScheduled);
      }

      // 7. Exam Notices
      const cachedExams = localStorage.getItem('edu_erp_comm_exams');
      if (cachedExams) {
        setExams(JSON.parse(cachedExams));
      } else {
        const defaultExams = [
          { title: 'Model Exams Theory Schedule June 2026', department: 'Computer Science', semester: 'Semester 6', hall: 'Block B Rooms 201-205', examDate: '2026-06-05', attachment: true, publishedBy: 'Controller of Exams' },
          { title: 'Lab Practical Board Assessment Timings', department: 'Electronics', semester: 'Semester 4', hall: 'Main VLSI Lab Block C', examDate: '2026-06-02', attachment: true, publishedBy: 'Controller of Exams' }
        ];
        localStorage.setItem('edu_erp_comm_exams', JSON.stringify(defaultExams));
        setExams(defaultExams);
      }

      // 8. Staff Notices
      const cachedStaff = localStorage.getItem('edu_erp_comm_staff');
      if (cachedStaff) {
        setStaff(JSON.parse(cachedStaff));
      } else {
        const defaultStaff = [
          { category: 'Teaching Staff', department: 'All Departments', title: 'Faculty Research Grant Applications Open', issuedBy: 'Director Research Office', validity: 'June 15, 2026', attachment: true },
          { category: 'All Faculty', department: 'All Departments', title: 'Annual Appraisals Review Guidelines 2026', issuedBy: 'HR Director Office', validity: 'May 30, 2026', attachment: true }
        ];
        localStorage.setItem('edu_erp_comm_staff', JSON.stringify(defaultStaff));
        setStaff(defaultStaff);
      }

    } catch (e) {
      console.error('Error loading communication states from localStorage:', e);
    }
  };

  useEffect(() => {
    loadSharedStates();

    // Listen for storage bridge changes to support immediate dynamic sync across active windows
    const handleStorageSync = () => {
      loadSharedStates();
    };

    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);
  useEffect(() => {
    console.log("Telemetry - Events state updated. Count:", (events ?? []).length);
  }, [events]);

  const openRegistry = (type) => {
    console.log("Telemetry - openRegistry called for type:", type);
    let title = '';
    let dataset = [];
    switch (type) {
      case 'events':
        title = 'Active Events';
        dataset = events ?? [];
        break;
      case 'notices':
        title = 'Total Notices';
        dataset = notices ?? [];
        break;
      case 'holidays':
        title = 'Upcoming Holidays';
        dataset = holidays ?? [];
        break;
      case 'alerts':
        title = 'Emergency Alerts';
        dataset = alerts ?? [];
        break;
      case 'unreadPings':
        title = 'Unread Pings';
        dataset = unreadPings ?? [];
        break;
      case 'scheduledBroadcasts':
        title = 'Scheduled Broadcasts';
        dataset = scheduledBroadcasts ?? [];
        break;
      case 'exams':
        title = 'Exam Notices';
        dataset = exams ?? [];
        break;
      case 'staff':
        title = 'Staff Notices';
        dataset = staff ?? [];
        break;
      default:
        title = 'Registry';
        dataset = [];
    }
    setRegistryTitle(title);
    setRegistryData(dataset ?? []);
    setRegistryType(type);
    setActiveRegistry(type);
    setRegistryOpen(true);
    console.log("Telemetry - Registry modal opened with payload:", { type, length: (dataset ?? []).length });
  };

  const handleOpenRegistry = (title, dataset, type) => {
    console.log("Telemetry - handleOpenRegistry called:", { title, type, length: dataset?.length });
    setRegistryTitle(title || 'Registry');
    setRegistryData(dataset ?? []);
    setRegistryType(type || '');
    setActiveRegistry(type || 'general');
    setRegistryOpen(true);
  };

  const handleCloseRegistry = () => {
    console.log("Telemetry - Closing registry modal.");
    setRegistryOpen(false);
    setActiveRegistry(null);
  };

  // Callback to sync new announcement deployment
  const handleAnnouncementSuccess = () => {
    loadSharedStates();
    setActiveTab('dashboard');
  };

  const tabs = [
    { id: 'dashboard', label: 'Comm. Center', icon: TrendingUp },
    { id: 'calendar', label: 'Academic Calendar', icon: Calendar },
    { id: 'notices', label: 'Circulars & Notices', icon: FileText },
    { id: 'events', label: 'Events Hub', icon: Award },
    { id: 'alerts', label: 'Emergency Alerts', icon: ShieldAlert },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return (
          <AnnouncementDashboard 
            notices={notices}
            events={events}
            holidays={holidays}
            alerts={alerts}
            unreadPings={unreadPings}
            scheduledBroadcasts={scheduledBroadcasts}
            exams={exams}
            staff={staff}
            loading={loading} 
            onCardClick={handleOpenRegistry}
          />
        );
      
      case 'calendar':
        return (
          <AcademicCalendar 
            liveEvents={events}
            liveHolidays={holidays}
            liveExams={exams}
          />
        );

      case 'notices':
        return (
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Circulars & Notices</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Official institutional directives</p>
              </div>
              <span className="px-3 py-1 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black rounded-full uppercase">
                {notices.length} notices
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(notices ?? []).map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-3xl p-6 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start gap-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                      item.priority === 'Emergency' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.priority}
                    </span>
                    <span className="text-[10px] font-black text-slate-400">{item.timestamp}</span>
                  </div>
                  <h4 className="text-base font-black text-slate-800 uppercase mt-3 leading-snug">{item.title}</h4>
                  <p className="text-xs text-slate-500 font-bold mt-2 leading-relaxed">{item.content}</p>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200/50 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <span>Target: {item.audience}</span>
                    <span>By: {item.publishedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Events Hub</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Schedules, workshops & symposiums</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black rounded-full uppercase">
                {events.length} Active Events
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(events ?? []).map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      item.liveStatus === 'Ongoing' ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.liveStatus}
                    </span>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                      {item.registrationCount} Registered
                    </span>
                  </div>
                  <h4 className="text-base font-black text-slate-800 uppercase leading-snug">{item.title}</h4>
                  
                  <div className="space-y-1.5 pt-3 border-t border-slate-200/50 text-[10px] text-slate-500 font-bold">
                    <div>Venue: <span className="text-slate-700">{item.venue}</span></div>
                    <div>Timing: <span className="text-slate-700">{item.timing}</span></div>
                    <div>Coordinator: <span className="text-slate-700">{item.coordinator}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'alerts':
        return (
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Emergency Alerts</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Live critical warnings & instructions</p>
              </div>
              <span className="px-3 py-1 bg-red-50 border border-red-100 text-red-600 text-xs font-black rounded-full uppercase">
                {alerts.length} Warnings
              </span>
            </div>

            <div className="space-y-4">
              {(alerts ?? []).map((item, idx) => (
                <div key={idx} className="bg-red-50/50 border border-red-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all">
                  <div className="flex gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-2xl shrink-0 h-12 w-12 flex items-center justify-center">
                      <ShieldAlert size={24} />
                    </div>
                    <div>
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-200 text-[8px] font-black uppercase rounded-full tracking-wider">
                        {item.severity} Alert
                      </span>
                      <h4 className="text-base font-black text-slate-800 uppercase mt-2">{item.instructions}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Issued By {item.issuedBy} • Active until {item.activeUntil}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 text-center ${
                    item.acknowledged ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-100 text-red-700 border-red-200 animate-pulse'
                  }`}>
                    {item.acknowledged ? 'Acknowledged' : 'Awaiting Action'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400 bg-white rounded-[40px] border border-slate-100 shadow-sm animate-fade-in">
             <Clock size={64} className="mb-4 opacity-20" />
             <h3 className="text-xl font-bold">Coming Soon</h3>
             <p className="text-sm">This section is currently being architected for production.</p>
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
             <div className="p-2.5 bg-rose-600 rounded-2xl text-white shadow-lg shadow-rose-100">
                <Megaphone size={24} />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Communications</h1>
          </div>
          <p className="text-slate-500 mt-1 font-medium text-sm ml-1">Centralized Institutional Broadcast & Activity Center</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleOpenRegistry('Unread Pings', unreadPings, 'unreadPings')}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-all shadow-sm text-xs"
          >
            <Bell size={18} /> Notification Logs
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 flex items-center gap-2 transition-all shadow-xl shadow-rose-200 text-xs"
          >
            <Plus size={18} /> New Broadcast
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
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-100' 
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

      {/* Deploy Broadcast Modal */}
      <CreateAnnouncementModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onSuccess={handleAnnouncementSuccess}
      />

      {/* Clickable Drilldown Registry Modal */}
      {activeRegistry && (
        <CommRegistryModal
          isOpen={registryOpen}
          onClose={handleCloseRegistry}
          title={registryTitle}
          data={registryData ?? []}
          type={registryType}
          activeRegistry={activeRegistry}
        />
      )}
    </div>
  );
};

export default Announcements;
