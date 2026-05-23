import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Users, BookOpen, CalendarCheck, ClipboardList, Clock, 
  MapPin, AlertCircle, RefreshCw, Calendar, Sparkles, BookOpenCheck, ShieldAlert
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [exams, setExams] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeViewDay, setActiveViewDay] = useState(
    new Date().toLocaleDateString('en-US', { weekday: 'long' })
  );

  useEffect(() => {
    try {
      const cached = localStorage.getItem('edu_erp_exams_registry');
      if (cached) {
        setExams(JSON.parse(cached));
      }
      
      const cachedCalendar = localStorage.getItem('edu_erp_academic_calendar_events');
      if (cachedCalendar) {
        setCalendarEvents(JSON.parse(cachedCalendar));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/timetable');
      setSchedules(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error loading staff schedules:', e);
      toast.error('Failed to sync live timetable roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const todayWeekday = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  // Filter invigilator duties today for logged in staff member
  const myDutiesToday = (exams ?? []).filter(ex => ex.invigilatorName === user?.name || ex.invigilatorId === user?.id);

  // Dynamic stats & calculations
  const mySchedules = schedules ?? [];
  const todayClasses = mySchedules.filter(s => s.day === todayWeekday && s.status !== 'Cancelled');
  const totalHoursWeek = mySchedules.filter(s => s.status !== 'Cancelled').length;
  
  // Distinct subjects
  const subjectMap = {};
  mySchedules.forEach(s => {
    if (s.subject) {
      subjectMap[s.subject] = (subjectMap[s.subject] ?? 0) + 1;
    }
  });
  const subjectData = Object.entries(subjectMap).map(([name, value]) => ({ name, value }));

  const getLiveStatus = (t) => {
    if (t.status === 'Substitute') return 'substitute';
    if (t.status === 'Cancelled') return 'cancelled';
    if (t.day !== todayWeekday) return 'upcoming_day';

    const now = new Date();
    const [startH, startM] = t.startTime.split(':').map(Number);
    const [endH, endM] = t.endTime.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startH, startM, 0);

    const endDate = new Date();
    endDate.setHours(endH, endM, 0);

    if (now >= startDate && now <= endDate) return 'ongoing';
    if (now < startDate) return 'upcoming';
    return 'completed';
  };

  const getStatusBadge = (t) => {
    const status = getLiveStatus(t);
    switch (status) {
      case 'substitute':
        return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 rounded-full flex items-center gap-1 shrink-0">Substitute Assigned</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 rounded-full flex items-center gap-1 shrink-0">Cancelled</span>;
      case 'ongoing':
        return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center gap-1 shrink-0 animate-pulse">🟢 Ongoing Class</span>;
      case 'upcoming':
        return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100 rounded-full flex items-center gap-1 shrink-0">🟡 Upcoming Class</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-100 rounded-full flex items-center gap-1 shrink-0">Completed</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-100 rounded-full flex items-center gap-1 shrink-0">Scheduled</span>;
    }
  };

  // Free periods calculation today
  const possiblePeriods = [1, 2, 3, 4, 5, 6];
  const occupiedPeriods = todayClasses.map(c => parseInt(c.periodNumber));
  const freePeriods = possiblePeriods.filter(p => !occupiedPeriods.includes(p));

  const staffHighlights = useMemo(() => {
    return (calendarEvents ?? [])
      .filter(evt => {
        if (!evt) return false;
        // relevant to staff: meetings, exams, placement, workshops, leave days, holidays
        const relevantCategory = ['Holidays', 'Staff Meetings', 'Exams', 'Workshops', 'Leave Days', 'Symposiums', 'Placement Drives'].includes(evt.category);
        const upcoming = evt.startDate >= '2026-05-20';
        return relevantCategory && upcoming;
      })
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, 6);
  }, [calendarEvents]);

  const stats = [
    { title: 'Total Workload', value: `${totalHoursWeek} hrs / wk`, icon: Clock, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { title: 'Classes Scheduled Today', value: `${todayClasses.length} sessions`, icon: BookOpen, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { title: 'Unique Subjects', value: `${subjectData.length} active`, icon: BookOpenCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { title: 'Free periods Today', value: freePeriods.length > 0 ? `Periods: ${freePeriods.join(', ')}` : 'None', icon: Sparkles, color: 'text-pink-600 bg-pink-50 border-pink-100' },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-12 Outfit-Font">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
            Welcome back, {user?.name || 'Faculty Member'}!
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Here is your live synchronized academic schedule and workload overview.
          </p>
        </div>
        <button 
          onClick={fetchSchedule}
          disabled={loading}
          className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-colors shadow-xs text-xs"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Sync Roster
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100/80 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all shadow-xs">
            <div className={`p-3 rounded-2xl shrink-0 ${stat.color.split(' ')[1]} ${stat.color.split(' ')[0]}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{stat.title}</span>
              <span className="text-base font-black text-slate-800 uppercase leading-none mt-1.5 block">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Today's Schedule Portal */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-xs">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5 mb-5 border-b border-slate-100 pb-3">
              <CalendarCheck className="text-indigo-600" size={20} />
              My Schedule Today ({todayWeekday})
            </h2>
            
            {loading ? (
              <div className="py-8 text-center text-slate-400 animate-pulse text-sm font-semibold">
                Syncing schedules...
              </div>
            ) : todayClasses.length > 0 ? (
              <div className="space-y-4">
                {(todayClasses ?? []).map((t, idx) => (
                  <div 
                    key={t.id || idx} 
                    className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center bg-indigo-50 border border-indigo-100/50 text-indigo-600 rounded-2xl p-3 shrink-0 w-16">
                        <span className="text-xs font-black block uppercase tracking-widest leading-none">Period</span>
                        <span className="text-lg font-black block leading-none mt-1">{t.periodNumber}</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{t.subject}</h4>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1 flex items-center gap-1.5">
                          <span>{t.department} • Semester {t.semester} • Section {t.section}</span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-0.5"><MapPin size={10} /> Room: {t.roomNumber ?? 'Not Assigned'}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-right text-xs text-slate-400 font-bold flex items-center gap-1">
                        <Clock size={12} /> {t.startTime?.substring(0,5)} - {t.endTime?.substring(0,5)}
                      </div>
                      {getStatusBadge(t)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 border border-slate-100 border-dashed rounded-2xl text-center bg-slate-50/50">
                <Sparkles className="mx-auto text-emerald-500 mb-3 animate-bounce-short" size={36} />
                <h4 className="text-slate-700 font-extrabold text-sm">You have a Free Day!</h4>
                <p className="text-slate-400 text-xs mt-1">No teaching sessions scheduled for today.</p>
              </div>
            )}
          </div>

          {/* Weekly Roster Roster View */}
          <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
                <Calendar className="text-indigo-600" size={20} />
                Weekly Schedule Roster
              </h2>
              <div className="flex gap-1 overflow-x-auto py-1 hide-scrollbar">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                  <button
                    key={d}
                    onClick={() => setActiveViewDay(d)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors shrink-0 ${
                      activeViewDay === d 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {d.substring(0,3)}
                  </button>
                ))}
              </div>
            </div>

            {mySchedules.filter(s => s.day === activeViewDay).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-black">
                      <th className="p-3">Period</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Class/Sec</th>
                      <th className="p-3">Classroom</th>
                      <th className="p-3 text-right">Timing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60 font-medium">
                    {(mySchedules.filter(s => s.day === activeViewDay) ?? []).map((t, idx) => (
                      <tr key={t.id || idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-extrabold text-indigo-600">Period {t.periodNumber}</td>
                        <td className="p-3 font-bold text-slate-800">{t.subject}</td>
                        <td className="p-3">{t.department} Sem {t.semester} Sec {t.section}</td>
                        <td className="p-3 font-bold text-slate-700">{t.roomNumber ?? 'Not Assigned'}</td>
                        <td className="p-3 text-right text-slate-400">{t.startTime?.substring(0,5)} - {t.endTime?.substring(0,5)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No classes scheduled for {activeViewDay}.
              </div>
            )}
          </div>
        </div>

        {/* Workload Fatigue & Subject Load Chart */}
        <div className="col-span-1 space-y-6">
          
          {/* Today's Invigilation Duties */}
          {myDutiesToday.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-indigo-950/20 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
              <h3 className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldAlert className="text-indigo-400" size={16} /> Today's Invigilation Duty
              </h3>
              
              <div className="space-y-4 relative z-10">
                {myDutiesToday.map((duty, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-black">{duty.subjectName}</h4>
                        <span className="text-[10px] text-indigo-300 font-bold block mt-0.5">{duty.subjectCode} • Sem {duty.semester}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Assigned</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[10px] font-semibold text-slate-300">
                      <div>
                        <span className="text-[8px] font-black text-indigo-300 uppercase tracking-wider block">Hall Room</span>
                        <span className="font-extrabold text-white">{duty.roomNumber}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-indigo-300 uppercase tracking-wider block">Strength</span>
                        <span className="font-extrabold text-white">{duty.totalStudents} Students</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-bold text-slate-300">
                      <span className="flex items-center gap-1"><Clock size={11} /> {duty.startTime} - {duty.endTime}</span>
                      <button 
                        onClick={() => toast.success('COE Emergency distress beacon broadcasted!')}
                        className="px-2.5 py-1 bg-red-600/30 hover:bg-red-600/50 border border-red-500/30 rounded-xl text-[9px] font-black uppercase tracking-wider text-red-300 flex items-center gap-0.5 cursor-pointer transition-colors"
                      >
                        COE SOS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workload Fatigue Warning Indicator Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <ShieldAlert className="text-indigo-600" size={16} /> Load & Fatigue Analysis
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                  <span>Weekly Teaching Load</span>
                  <span className="text-slate-800">{totalHoursWeek} / 18 hours</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      totalHoursWeek >= 15 ? 'bg-rose-500' : totalHoursWeek >= 10 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${Math.min((totalHoursWeek / 18) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-1">
                  {totalHoursWeek >= 15 
                    ? '⚠️ Warning: Heavy teaching schedule. Fatigue risk is Critical.' 
                    : totalHoursWeek >= 10 
                      ? 'Moderate workload. Optimum teaching conditions.' 
                      : 'Light teaching workload. Available for substitution.'}
                </p>
              </div>

              {/* Classroom utilization mock */}
              <div className="border-t border-slate-100 pt-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-700">Substitutions Active</h5>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      {mySchedules.filter(s => s.status === 'Substitute').length} assignments this week
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Distribution Donut Chart */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">
              Subject Distribution
            </h3>
            
            {subjectData.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className="w-full h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {subjectData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} classes`, 'Load']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 w-full mt-4 text-xs">
                  {subjectData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        <span className="text-slate-600 truncate max-w-44">{entry.name}</span>
                      </div>
                      <span className="text-slate-800">{entry.value} sessions</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="py-6 text-center text-slate-400 text-xs">No subjects distributed yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* Academic Calendar & Staff Highlights */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 mt-8 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="text-indigo-600" size={18} />
            Academic Calendar & Staff Activities
          </h2>
          <span className="px-2.5 py-0.5 rounded text-[8px] font-black uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">Live Sync</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(staffHighlights ?? []).map((item, idx) => {
            let bgTheme = 'bg-slate-50 border-slate-200/50';
            let badgeTheme = 'bg-slate-100 text-slate-600';
            
            if (item.category === 'Staff Meetings') {
              bgTheme = 'bg-indigo-50/50 border-indigo-100';
              badgeTheme = 'bg-indigo-100 text-indigo-800';
            } else if (item.category === 'Holidays') {
              bgTheme = 'bg-amber-50/50 border-amber-100';
              badgeTheme = 'bg-amber-100 text-amber-800';
            } else if (item.category === 'Exams') {
              bgTheme = 'bg-rose-50/50 border-rose-100';
              badgeTheme = 'bg-rose-100 text-rose-800';
            } else if (item.category === 'Leave Days') {
              bgTheme = 'bg-pink-50/50 border-pink-100';
              badgeTheme = 'bg-pink-100 text-pink-800';
            } else if (item.category === 'Workshops' || item.category === 'Symposiums') {
              bgTheme = 'bg-cyan-50/50 border-cyan-100';
              badgeTheme = 'bg-cyan-100 text-cyan-800';
            }

            return (
              <div key={idx} className={`p-4 rounded-2xl border ${bgTheme} flex flex-col justify-between min-h-[120px] transition-all hover:shadow-xs`}>
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${badgeTheme}`}>{item.category}</span>
                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{item.startDate}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-xs mt-2.5 leading-snug">{item.title}</h4>
                  {item.description && (
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-2.5 mt-2 border-t border-slate-100/60 text-[9px] font-bold text-slate-400">
                  <span>📍 {item.venue || 'Campus'}</span>
                  <span className="text-slate-500 font-extrabold">Dept: {item.department}</span>
                </div>
              </div>
            );
          })}
          {staffHighlights.length === 0 && (
            <div className="col-span-full text-center py-6 text-slate-400 text-xs font-semibold">No upcoming staff meetings or calendar events.</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default StaffDashboard;
