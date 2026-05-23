import React, { useMemo } from 'react';
import {
  Megaphone,
  Calendar,
  ShieldAlert,
  FileText,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Bell,
  Users,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const StatCard = ({ title, value, subValue, icon: Icon, colorClass, delay, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up cursor-pointer relative" 
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${colorClass} text-white shadow-lg`}>
        <Icon size={24} />
      </div>
      <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
        <ArrowUpRight size={14} />
        <span className="text-[10px] font-black">Live</span>
      </div>
    </div>
    <div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-slate-900">{value}</span>
        {subValue && <span className="text-xs font-bold text-slate-500">{subValue}</span>}
      </div>
    </div>
  </div>
);

const AnnouncementDashboard = ({
  notices = [],
  events = [],
  holidays = [],
  alerts = [],
  unreadPings = [],
  scheduledBroadcasts = [],
  exams = [],
  staff = [],
  loading = false,
  onCardClick
}) => {

  // Dynamically compute notices & events in a single unified feed
  const combinedFeed = useMemo(() => {
    const feed = [];
    
    (notices ?? []).forEach(item => {
      if (!item) return;
      feed.push({
        title: item.title || 'Untitled Circular',
        cat: 'Notices',
        date: item.timestamp || 'Just now',
        priority: item.priority || 'General',
        author: item.publishedBy || 'HR Admin',
        content: item.content || ''
      });
    });

    (events ?? []).forEach(item => {
      if (!item) return;
      feed.push({
        title: item.title || 'Untitled Event',
        cat: 'Events',
        date: item.timing || 'Today',
        priority: 'General',
        author: item.coordinator || 'Tech Club',
        content: `Active Event planned at ${item.venue || 'Main Auditorium'}`
      });
    });

    (exams ?? []).forEach(item => {
      if (!item) return;
      feed.push({
        title: item.title || 'Untitled Exam Schedule',
        cat: 'Exams',
        date: item.examDate || 'May 2026',
        priority: 'High',
        author: item.publishedBy || 'Exam Cell',
        content: `Semester Exam planned at Hall ${item.hall || 'Main Auditorium'}`
      });
    });

    (alerts ?? []).forEach(item => {
      if (!item) return;
      feed.push({
        title: item.instructions || 'Emergency Advisory Alert',
        cat: 'Emergency',
        date: 'Active',
        priority: 'Emergency',
        author: item.issuedBy || 'Principal Office',
        content: `Active emergency instructions issued until: ${item.activeUntil || 'Further Notice'}`
      });
    });

    (holidays ?? []).forEach(item => {
      if (!item) return;
      feed.push({
        title: `Holiday Announced: ${item.title || 'Institutional Holiday'}`,
        cat: 'Holidays',
        date: item.startDate || 'May 2026',
        priority: 'General',
        author: 'Dean Office',
        content: `${item.type || 'Institutional'} Holiday • Applicable to: ${item.departments || 'All'}`
      });
    });

    return feed;
  }, [notices, events, exams, alerts, holidays]);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[...Array(8)].map((_, i) => <div key={i} className="h-32 bg-slate-100 rounded-[32px]"></div>)}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Clickable Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Notices" 
          value={(notices ?? []).length} 
          subValue="Circulars" 
          icon={Megaphone} 
          colorClass="bg-rose-600" 
          delay={0}
          onClick={() => onCardClick('Total Notices', notices ?? [], 'notices')} 
        />
        <StatCard 
          title="Active Events" 
          value={(events ?? []).length} 
          subValue="Ongoing" 
          icon={Calendar} 
          colorClass="bg-emerald-600" 
          delay={100}
          onClick={() => onCardClick('Active Events', events ?? [], 'events')} 
        />
        <StatCard 
          title="Upcoming Holidays" 
          value={(holidays ?? []).length} 
          subValue="Calendar" 
          icon={Clock} 
          colorClass="bg-amber-600" 
          delay={200}
          onClick={() => onCardClick('Upcoming Holidays', holidays ?? [], 'holidays')} 
        />
        <StatCard 
          title="Emergency Alerts" 
          value={(alerts ?? []).length} 
          subValue="Priority" 
          icon={ShieldAlert} 
          colorClass="bg-red-600" 
          delay={300}
          onClick={() => onCardClick('Emergency Alerts', alerts ?? [], 'alerts')} 
        />
        <StatCard 
          title="Unread Pings" 
          value={(unreadPings ?? []).length} 
          subValue="New" 
          icon={Bell} 
          colorClass="bg-indigo-600" 
          delay={400}
          onClick={() => onCardClick('Unread Pings', unreadPings ?? [], 'unreadPings')} 
        />
        <StatCard 
          title="Scheduled" 
          value={(scheduledBroadcasts ?? []).length} 
          subValue="Pending" 
          icon={TrendingUp} 
          colorClass="bg-blue-600" 
          delay={500}
          onClick={() => onCardClick('Scheduled Broadcasts', scheduledBroadcasts ?? [], 'scheduledBroadcasts')} 
        />
        <StatCard 
          title="Exam Notices" 
          value={(exams ?? []).length} 
          subValue="Academic" 
          icon={FileText} 
          colorClass="bg-purple-600" 
          delay={600}
          onClick={() => onCardClick('Exam Notices', exams ?? [], 'exams')} 
        />
        <StatCard 
          title="Staff Notices" 
          value={(staff ?? []).length} 
          subValue="Internal" 
          icon={Users} 
          colorClass="bg-slate-600" 
          delay={700}
          onClick={() => onCardClick('Staff Notices', staff ?? [], 'staff')} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sync Dynamic Broadcast Feed */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
           <div className="flex justify-between items-center mb-8">
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Broadcast Feed</h3>
                 <p className="text-sm text-slate-500 font-medium">Real-time institutional announcements</p>
              </div>
              <button 
                onClick={() => onCardClick('Total Notices', notices, 'notices')}
                className="text-xs font-black text-rose-600 uppercase hover:underline"
              >
                View Notices Archive
              </button>
           </div>

           <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {combinedFeed.length > 0 ? (
                combinedFeed.map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group animate-fade-in-up">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                       item.priority === 'Emergency' ? 'bg-red-100 text-red-600 shadow-red-100' :
                       item.priority === 'High' || item.priority === 'Important' ? 'bg-amber-100 text-amber-600 shadow-amber-100' :
                       'bg-slate-100 text-slate-400 shadow-slate-100'
                     }`}>
                        {item.priority === 'Emergency' ? <AlertCircle size={24} /> : <Megaphone size={24} />}
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wider">{item.cat}</span>
                           <span className="text-[10px] font-black text-slate-400 uppercase">{item.date}</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-800 group-hover:text-rose-600 transition-colors leading-tight uppercase">{item.title}</h4>
                        <p className="text-xs font-bold text-slate-500 mt-1">Posted by {item.author}</p>
                        {item.content && (
                          <pre className="mt-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-mono whitespace-pre-wrap text-slate-600 leading-relaxed shadow-inner">
                            {item.content}
                          </pre>
                        )}
                     </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-center text-slate-300 mx-auto">
                    <Megaphone size={32} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase">No feed items available</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Deploy a new broadcast to see live feed details.</p>
                  </div>
                </div>
              )}
           </div>
        </div>

        {/* Dynamic Engagement */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-rose-100 border-l-8 border-rose-500">
           <h3 className="text-xl font-black mb-1">Read Tracking</h3>
           <p className="text-slate-400 text-xs font-medium mb-8">Announcement engagement metrics</p>
           
           <div className="space-y-6">
              {[
                { label: 'Overall Engagement', value: 82, color: 'bg-rose-500' },
                { label: 'Staff Participation', value: 94, color: 'bg-emerald-500' },
                { label: 'Student Interaction', value: 76, color: 'bg-blue-500' },
                { label: 'Emergency Reach', value: 99, color: 'bg-amber-500' },
              ].map((bar, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>{bar.label}</span>
                      <span>{bar.value}%</span>
                   </div>
                   <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.value}%` }} />
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle size={20} />
                 </div>
                 <div>
                    <p className="text-xs font-black">Smart Broadcast</p>
                    <p className="text-[10px] text-slate-400">AI-optimized delivery active</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDashboard;
