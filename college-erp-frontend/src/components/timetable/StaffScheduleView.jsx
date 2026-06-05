import React, { useState } from 'react';
import { Users, Clock, Calendar, CheckCircle } from 'lucide-react';

const StaffScheduleView = ({ timetables, loading }) => {
  const [selectedStaff, setSelectedStaff] = useState('');

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading staff schedules...</div>;

  // Extract unique staff members from timetable for the dropdown
  const uniqueStaff = [];
  const staffMap = new Map();
  timetables.forEach(t => {
    if (t.staff && !staffMap.has(t.staff.id)) {
      staffMap.set(t.staff.id, true);
      uniqueStaff.push(t.staff);
    }
  });

  const staffSchedule = timetables.filter(t => t.staffId === selectedStaff);

  // Quick Workload analytics for selected staff
  const totalClasses = staffSchedule.length;
  const uniqueSubjects = new Set(staffSchedule.map(t => t.subjectName)).size;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const classesToday = staffSchedule.filter(t => t.day === today).length;

  // Debug Validation Logger
  React.useEffect(() => {
    console.log('[DEBUG Staff Schedule Sync]');
    console.log('- Raw timetables count:', (timetables ?? []).length);
    console.log('- Selected staff:', selectedStaff);
    console.log('- Transformed staffSchedule rows:', staffSchedule.map(s => ({
      day: s.day,
      period: s.periodNumber,
      subject: s.subjectName,
      roomNumber: s.roomNumber
    })));
  }, [timetables, selectedStaff, staffSchedule]);

  return (
    <div className="p-6">
      <div className="max-w-xl mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Staff Member</label>
        <select
          value={selectedStaff}
          onChange={e => setSelectedStaff(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white font-medium shadow-sm"
        >
          <option value="">-- Choose a staff member to view schedule --</option>
          {uniqueStaff.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.staffId})</option>)}
        </select>
      </div>

      {!selectedStaff ? (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
          <Users size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">Select a staff member from the dropdown to view their detailed workload.</p>
        </div>
      ) : (
        <div className="animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
              <p className="text-xs text-indigo-600 font-bold uppercase mb-1">Total Workload</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalClasses} <span className="text-sm font-medium text-gray-500">classes / wk</span></h3>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
              <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Subjects Handled</p>
              <h3 className="text-2xl font-bold text-gray-900">{uniqueSubjects} <span className="text-sm font-medium text-gray-500">subjects</span></h3>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <p className="text-xs text-blue-600 font-bold uppercase mb-1">Classes Today</p>
              <h3 className="text-2xl font-bold text-gray-900">{classesToday} <span className="text-sm font-medium text-gray-500">scheduled</span></h3>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="text-indigo-600" size={20} /> Weekly Roster</h3>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                  <th className="px-4 py-3 font-semibold">Day</th>
                  <th className="px-4 py-3 font-semibold">Period & Time</th>
                  <th className="px-4 py-3 font-semibold">Class & Subject</th>
                  <th className="px-4 py-3 font-semibold">Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staffSchedule.length > 0 ? staffSchedule.sort((a, b) => {
                  const days = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
                  return days[a.day] - days[b.day] || a.periodNumber - b.periodNumber;
                }).map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-900">{t.day}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-indigo-600">Period {t.periodNumber}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {t.startTime.substring(0, 5)} - {t.endTime.substring(0, 5)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{t.subjectName}</div>
                      <div className="text-xs text-gray-500">{t.department} • Sem {t.semester} • Sec {t.section}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">{t.roomNumber ?? "Not Assigned"}</td>
                  </tr>
                )) : <tr><td colSpan="4" className="p-8 text-center text-gray-500"><CheckCircle className="mx-auto text-emerald-500 mb-2" size={32} />No classes scheduled for this staff.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffScheduleView;
