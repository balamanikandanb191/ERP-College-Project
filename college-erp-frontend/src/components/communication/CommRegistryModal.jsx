import React, { useState, useMemo } from 'react';
import { X, Search, Filter, ArrowUpDown, Calendar, Clock, MapPin, ShieldAlert, Award, FileText, Bell, Inbox } from 'lucide-react';

const CommRegistryModal = ({ isOpen, onClose, title, data = [], type, activeRegistry }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [secondaryFilter, setSecondaryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest

  // Debug telemetry logging
  console.log("Telemetry - CommRegistryModal props:", { isOpen, activeRegistry, title, type, dataCount: (data ?? []).length });

  if (!isOpen || !activeRegistry) return null;

  const safeData = data ?? [];

  // Memoized Filtering & Sorting
  const filteredAndSortedData = useMemo(() => {
    let result = [...safeData];

    // Search query matches
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = (result ?? []).filter(item => {
        if (!item) return false;
        const titleStr = item.title || item.sender || item.creator || '';
        const descStr = item.content || item.messagePreview || item.instructions || '';
        return titleStr.toLowerCase().includes(q) || descStr.toLowerCase().includes(q);
      });
    }

    // Department Filter
    if (deptFilter !== 'All') {
      result = (result ?? []).filter(item => {
        if (!item) return false;
        const itemDepts = item.departments || item.department || '';
        if (Array.isArray(itemDepts)) {
          return (itemDepts ?? []).some(d => d && d.toLowerCase().includes(deptFilter.toLowerCase()));
        }
        return (itemDepts || '').toLowerCase().includes(deptFilter.toLowerCase());
      });
    }

    // Secondary Dynamic Filters depending on card type
    if (secondaryFilter !== 'All') {
      result = (result ?? []).filter(item => {
        if (!item) return false;
        if (type === 'alerts') {
          return (item.severity || '').toLowerCase() === secondaryFilter.toLowerCase();
        }
        if (type === 'notices') {
          return (item.priority || '').toLowerCase() === secondaryFilter.toLowerCase();
        }
        if (type === 'holidays') {
          return (item.type || '').toLowerCase() === secondaryFilter.toLowerCase();
        }
        if (type === 'events') {
          return (item.liveStatus || '').toLowerCase() === secondaryFilter.toLowerCase();
        }
        if (type === 'scheduledBroadcasts') {
          return (item.status || '').toLowerCase() === secondaryFilter.toLowerCase();
        }
        return true;
      });
    }

    // Sort order
    result.sort((a, b) => {
      if (!a || !b) return 0;
      const parseDate = (item) => {
        if (!item) return 0;
        const val = item.timestamp || item.sentTime || item.scheduledTime || item.startDate || item.examDate || item.validity;
        if (!val) return Date.now();
        const d = new Date(val);
        return isNaN(d.getTime()) ? Date.now() : d.getTime();
      };
      const timeA = parseDate(a);
      const timeB = parseDate(b);
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [safeData, searchTerm, deptFilter, secondaryFilter, sortOrder, type]);

  const departments = ['All', 'Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Administration'];

  const getSecondaryFilterOptions = () => {
    switch (type) {
      case 'alerts':
        return ['All', 'Critical', 'Warning', 'Info'];
      case 'notices':
        return ['All', 'Emergency', 'High', 'Important', 'General'];
      case 'holidays':
        return ['All', 'National', 'Restricted', 'Institutional'];
      case 'events':
        return ['All', 'Ongoing', 'Upcoming', 'Completed'];
      case 'scheduledBroadcasts':
        return ['All', 'Pending', 'Transmitted'];
      default:
        return null;
    }
  };

  const secondaryOptions = getSecondaryFilterOptions();

  // Dynamic Card renderer based on KPI type
  const renderCard = (item, index) => {
    if (!item) return null;
    switch (type) {
      case 'notices':
        return (
          <div key={index} className="bg-slate-50 border border-slate-200/50 rounded-3xl p-5 hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                  item.priority === 'Emergency' ? 'bg-red-50 text-red-600 border-red-100' :
                  item.priority === 'High' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {item.priority} Notices
                </span>
                <h4 className="text-sm font-black text-slate-800 uppercase mt-2 leading-snug">{item.title}</h4>
              </div>
              {item.attachment && (
                <span className="text-[9px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg shrink-0">
                  📎 PDF Attached
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200/40 text-[10px] text-slate-500 font-bold">
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Department</span>
                <span className="text-slate-700">{item.department || 'All'}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Audience Target</span>
                <span className="text-slate-700">{item.audience || 'All Students'}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Published By</span>
                <span className="text-slate-700">{item.publishedBy || 'Dean Office'}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Timeline</span>
                <span className="text-slate-700">{item.timestamp || 'Just now'}</span>
              </div>
            </div>
          </div>
        );

      case 'events':
        return (
          <div key={index} className="bg-slate-50 border border-slate-200/50 rounded-3xl p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                  item.liveStatus === 'Ongoing' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse' :
                  'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {item.liveStatus}
                </span>
                <h4 className="text-sm font-black text-slate-800 uppercase mt-2 leading-snug">{item.title}</h4>
              </div>
              <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full">
                {item.registrationCount || 0} Registered
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200/40 text-[10px] text-slate-500 font-bold">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-400" />
                <div>
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Venue Location</span>
                  <span className="text-slate-700">{item.venue || 'Campus Hall'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                <div>
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Timings slot</span>
                  <span className="text-slate-700">{item.timing || '09:00 AM - 04:00 PM'}</span>
                </div>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Coordinator Faculty</span>
                <span className="text-slate-700">{item.coordinator || 'HOD CS'}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Target Divisions</span>
                <span className="text-slate-700 truncate block max-w-[120px]">
                  {Array.isArray(item.departments) ? item.departments.join(', ') : (item.departments || 'All')}
                </span>
              </div>
            </div>
          </div>
        );

      case 'holidays':
        return (
          <div key={index} className="bg-slate-50 border border-slate-200/50 rounded-3xl p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[9px] font-black uppercase tracking-wider">
                  {item.type} Holiday
                </span>
                <h4 className="text-sm font-black text-slate-800 uppercase mt-2 leading-snug">{item.title}</h4>
              </div>
              <span className="text-[10px] font-black uppercase bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1 rounded-full animate-bounce-slow">
                {item.daysRemaining} days left
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200/40 text-[10px] text-slate-500 font-bold">
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Calendar Interval</span>
                <span className="text-slate-700">{item.startDate} {item.endDate ? `to ${item.endDate}` : ''}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Target Divisions</span>
                <span className="text-slate-700">{item.departments || 'All Departments'}</span>
              </div>
            </div>
          </div>
        );

      case 'alerts':
        return (
          <div key={index} className="bg-red-50/50 border border-red-100 rounded-3xl p-5 hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-3">
                <div className="p-2.5 bg-red-100 text-red-600 rounded-2xl shrink-0 mt-1">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded-full text-[9px] font-black uppercase tracking-wider">
                    {item.severity} Alert
                  </span>
                  <h4 className="text-sm font-black text-slate-800 uppercase mt-2 leading-snug">{item.instructions || 'Critical Advisory Notice'}</h4>
                </div>
              </div>
              <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                item.acknowledged 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : 'bg-red-100 text-red-700 border-red-200 animate-pulse'
              }`}>
                {item.acknowledged ? 'Acknowledged' : 'Pending Action'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-red-100/50 text-[10px] text-slate-500 font-bold">
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Issued Authority</span>
                <span className="text-slate-700">{item.issuedBy || 'Dean Office'}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Validity Expiry</span>
                <span className="text-slate-700">{item.activeUntil || '24 hours'}</span>
              </div>
            </div>
          </div>
        );

      case 'unreadPings':
        return (
          <div key={index} className="bg-slate-50 border border-slate-200/50 rounded-3xl p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-sm shrink-0">
                  {item.sender?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase leading-snug">{item.sender}</h4>
                  <p className="text-[11px] font-medium text-slate-500 mt-1 italic">"{item.messagePreview}"</p>
                </div>
              </div>
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-black animate-pulse">
                {item.unreadCount}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200/40 text-[10px] text-slate-500 font-bold">
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Recipient Cohort</span>
                <span className="text-slate-700">{item.recipientGroup || 'All'}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Sent Time</span>
                <span className="text-slate-700">{item.sentTime || 'Just now'}</span>
              </div>
            </div>
          </div>
        );

      case 'scheduledBroadcasts':
        return (
          <div key={index} className="bg-slate-50 border border-slate-200/50 rounded-3xl p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                  item.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                  {item.status}
                </span>
                <h4 className="text-sm font-black text-slate-800 uppercase mt-2 leading-snug">{item.content || 'Notice draft'}</h4>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200/40 text-[10px] text-slate-500 font-bold">
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Scheduled Target</span>
                <span className="text-slate-700">{item.scheduledTime || 'Tomorrow'}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Audience target</span>
                <span className="text-slate-700">{item.target || 'All'}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Author Creator</span>
                <span className="text-slate-700">{item.creator || 'Admin'}</span>
              </div>
            </div>
          </div>
        );

      case 'exams':
        return (
          <div key={index} className="bg-slate-50 border border-slate-200/50 rounded-3xl p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="px-2.5 py-0.5 bg-purple-50 text-purple-600 border border-purple-100 rounded-full text-[9px] font-black uppercase tracking-wider">
                  Academic Exam schedule
                </span>
                <h4 className="text-sm font-black text-slate-800 uppercase mt-2 leading-snug">{item.title}</h4>
              </div>
              {item.attachment && (
                <span className="text-[9px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg shrink-0">
                  📎 SYLLABUS PDF
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200/40 text-[10px] text-slate-500 font-bold">
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Division Dept</span>
                <span className="text-slate-700">{item.department || 'All'}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Semester Level</span>
                <span className="text-slate-700">{item.semester || 'All'}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Hall seating</span>
                <span className="text-slate-700">{item.hall || 'Main Auditorium'}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Timeline Date</span>
                <span className="text-slate-700">{item.examDate || 'May 2026'}</span>
              </div>
            </div>
          </div>
        );

      case 'staff':
        return (
          <div key={index} className="bg-slate-50 border border-slate-200/50 rounded-3xl p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="px-2.5 py-0.5 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-wider">
                  HR INTERNAL: {item.category || 'Teaching Staff'}
                </span>
                <h4 className="text-sm font-black text-slate-800 uppercase mt-2 leading-snug">{item.title}</h4>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200/40 text-[10px] text-slate-500 font-bold">
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Division Dept</span>
                <span className="text-slate-700">{item.department || 'Administration'}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Issued Director</span>
                <span className="text-slate-700">{item.issuedBy || 'HR Admin'}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Valid Till</span>
                <span className="text-slate-700">{item.validity || '30 days'}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-scale-in my-8 flex flex-col max-h-[90vh]">
        
        {/* Sticky Header */}
        <div className="bg-slate-900 p-6 md:p-8 text-white flex justify-between items-center shrink-0 border-b border-white/10 relative">
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Calendar size={24} className="text-rose-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight leading-none uppercase">{title} Registry</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">
                Showing {filteredAndSortedData.length} of {safeData.length} dynamic matching records
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-xl transition-all relative z-10 close-button"
            id="close-registry-modal-btn"
          >
            <X size={24} />
          </button>
        </div>

        {/* Toolbar: Search, Filters & Sorting */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by title, preview content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Department Filter */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
              <Filter size={14} className="text-slate-400" />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-transparent text-[11px] font-black text-slate-700 outline-none cursor-pointer uppercase tracking-wider"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d} Dept</option>
                ))}
              </select>
            </div>

            {/* Dynamic Secondary Filter */}
            {secondaryOptions && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={secondaryFilter}
                  onChange={(e) => setSecondaryFilter(e.target.value)}
                  className="bg-transparent text-[11px] font-black text-slate-700 outline-none cursor-pointer uppercase tracking-wider"
                >
                  {secondaryOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Sorting Orders */}
            <button
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition-all flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider"
              title="Toggle Sort Order"
            >
              <ArrowUpDown size={14} /> {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </button>

          </div>

        </div>

        {/* Scrollable Records Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-4 min-h-[300px]">
          {(filteredAndSortedData ?? []).length > 0 ? (
            (filteredAndSortedData ?? []).map((item, index) => renderCard(item, index))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-center text-slate-300">
                <Inbox size={32} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase">No registry items matched</h3>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Try revising your search text query or clear your department/priority filters to see remaining notices.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md"
          >
            Close Registry
          </button>
        </div>

      </div>
    </div>
  );
};

export default CommRegistryModal;
