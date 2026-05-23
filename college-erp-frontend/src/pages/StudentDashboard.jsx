import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, CalendarDays, Award, Clock, Printer, AlertTriangle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [showTicket, setShowTicket] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);

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

  const studentDept = 'CSE'; // Assume CSE department for student
  
  // Safe filtering: merge standard registered exams with calendar Exams category
  const studentExams = useMemo(() => {
    const registryExams = (exams ?? []).filter(e => e.department === studentDept);
    const calendarExams = (calendarEvents ?? [])
      .filter(e => e.category === 'Exams' && (e.department === studentDept || e.department === 'All Departments'))
      .map(e => ({
        subjectName: e.title,
        examType: 'Semester Exam',
        subjectCode: e.priority === 'High' ? 'CORE' : 'ELEC',
        roomNumber: e.venue,
        examDate: e.startDate
      }));
    
    // Combine and remove duplicates by title/date
    const combined = [...registryExams];
    calendarExams.forEach(ce => {
      if (!combined.some(re => re.subjectName === ce.subjectName && re.examDate === ce.examDate)) {
        combined.push(ce);
      }
    });
    return combined;
  }, [exams, calendarEvents]);

  // Filter student-relevant activities (holidays, workshops, symposiums, deadlines)
  const studentHighlights = useMemo(() => {
    return (calendarEvents ?? [])
      .filter(evt => {
        if (!evt) return false;
        const relevantCategory = ['Holidays', 'Symposiums', 'Placement Drives', 'Workshops', 'Fee Deadlines', 'Sports Events', 'Cultural Events'].includes(evt.category);
        const relevantDept = evt.department === 'All Departments' || evt.department === studentDept;
        const upcoming = evt.startDate >= '2026-05-20';
        return relevantCategory && relevantDept && upcoming;
      })
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, 6);
  }, [calendarEvents]);
  
  const stats = [
    { title: 'Attendance', value: '92%', icon: CalendarDays, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'CGPA', value: '3.8', icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Enrolled Courses', value: '6', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Pending Assignments', value: '2', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="p-6 Outfit-Font max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>
        <p className="text-slate-400 text-xs font-semibold mt-1">Here's your academic overview and examination schedule.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              {stat.icon ? <stat.icon className={stat.color} size={28} /> : <div className="w-7 h-7 bg-white/20 rounded-full" />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
              <h3 className="text-xl font-black text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Today's Class Schedule */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Today's Class Schedule</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100/50 bg-slate-50/50">
              <div className="text-center w-16">
                <p className="text-sm font-bold text-slate-800">09:00</p>
                <p className="text-xs text-slate-400">AM</p>
              </div>
              <div className="w-1 h-10 bg-indigo-600 rounded-full"></div>
              <div>
                <p className="font-extrabold text-slate-800">Advanced Mathematics</p>
                <p className="text-xs text-slate-400 flex items-center gap-1"><BookOpen size={13} /> Room 302</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Examination Schedules & Hall Ticket Generator */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Upcoming Exam Schedule</h2>
            <button 
              onClick={() => {
                setShowTicket(true);
                toast.success('Compiling Hall Ticket details...');
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Printer size={12} /> Hall Ticket
            </button>
          </div>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {(studentExams ?? []).map((ex, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-800 text-xs">{ex.subjectName}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600">{ex.examType}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">{ex.subjectCode} • Hall: {ex.roomNumber} • Date: {ex.examDate}</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg shrink-0">
                  <ShieldCheck size={12} /> Eligible
                </div>
              </div>
            ))}
            {studentExams.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs font-semibold">No scheduled exams currently found.</div>
            )}
          </div>
        </div>

      </div>

      {/* Academic Highlights & Deadlines Widget */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Academic Calendar Highlights & Deadlines</h2>
          <span className="px-2.5 py-0.5 rounded text-[8px] font-black uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">Live Sync</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(studentHighlights ?? []).map((item, idx) => {
            let bgTheme = 'bg-slate-50 border-slate-200/50';
            let badgeTheme = 'bg-slate-100 text-slate-600';
            if (item.category === 'Holidays') {
              bgTheme = 'bg-amber-50/50 border-amber-100';
              badgeTheme = 'bg-amber-100 text-amber-800';
            } else if (item.category === 'Fee Deadlines') {
              bgTheme = 'bg-rose-50/50 border-rose-100';
              badgeTheme = 'bg-rose-100 text-rose-800';
            } else if (item.category === 'Placement Drives') {
              bgTheme = 'bg-indigo-50/50 border-indigo-100';
              badgeTheme = 'bg-indigo-100 text-indigo-800';
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
                </div>
                
                <div className="flex justify-between items-center pt-2.5 mt-2 border-t border-slate-100/60 text-[9px] font-bold text-slate-400">
                  <span>📍 {item.venue}</span>
                  <span className="text-slate-500 font-extrabold">Organized by {item.organizer}</span>
                </div>
              </div>
            );
          })}
          {studentHighlights.length === 0 && (
            <div className="col-span-full text-center py-6 text-slate-400 text-xs font-semibold">No upcoming events or deadlines.</div>
          )}
        </div>
      </div>

      {/* Hall Ticket Printable Popup Card */}
      {showTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden p-6 relative animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Vinoth Kumar • 2026CSE001</h3>
              <button onClick={() => setShowTicket(false)} className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"><X size={16} /></button>
            </div>
            
            <div className="flex flex-col items-center border-b border-slate-100 pb-4 mb-4 text-center">
              <div className="font-mono text-xl tracking-[0.25em] text-slate-800 font-bold">*2026CSE001*</div>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">Barcode Secured Slips Standard</span>
            </div>

            <div className="space-y-2.5">
              <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[9px] block">Schedules</span>
              {studentExams.map((ex, idx) => (
                <div key={idx} className="flex justify-between text-xs border-b border-slate-100/60 pb-1.5">
                  <span className="font-bold text-slate-700">{ex.subjectName}</span>
                  <span className="text-slate-400 font-semibold">{ex.examDate} • Hall {ex.roomNumber}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
              <button 
                onClick={() => {
                  toast.success('Printing secured exam slips...');
                  window.print();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer"
              >
                <Printer size={13} /> Print Slips
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
