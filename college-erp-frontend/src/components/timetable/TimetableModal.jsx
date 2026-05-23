import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const TimetableModal = ({ isOpen, onClose, onSuccess, settings, timetables }) => {
  const [formData, setFormData] = useState({
    department: 'CSE',
    year: '1',
    semester: '1',
    section: 'A',
    day: 'Monday',
    periodNumber: '1',
    startTime: '09:00',
    endTime: '10:00',
    subject: '',
    roomNumber: '',
    staffId: '',
    academicYear: '2025-2026',
    status: 'Scheduled'
  });
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conflict, setConflict] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchStaff = async () => {
        try {
          const { data } = await api.get('/staff');
          setStaffList(Array.isArray(data) ? data : []);
        } catch (e) { console.error('Error fetching staff:', e); }
      };
      fetchStaff();
      setFormData({
        department: 'CSE', year: '1', semester: '1', section: 'A', day: 'Monday', periodNumber: '1',
        startTime: settings?.collegeStartTime?.substring(0, 5) || '09:00',
        endTime: '10:00', subject: '', roomNumber: '', staffId: '', academicYear: '2025-2026', status: 'Scheduled'
      });
      setConflict(null);
    }
  }, [isOpen, settings]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Client-Side Dynamic Conflict Checker
  const checkConflicts = (data) => {
    const pNumber = parseInt(data.periodNumber);
    const day = data.day;
    const room = data.roomNumber?.trim();
    const staffId = data.staffId;
    const dept = data.department;
    const year = data.year;
    const sem = data.semester;
    const sec = data.section;

    const list = timetables ?? [];
    for (const t of list) {
      if (t.day === day && parseInt(t.periodNumber) === pNumber && t.status !== 'Cancelled') {
        // 1. Staff Conflict
        if (t.staffId === staffId) {
          const staffObj = staffList.find(s => s.id === staffId);
          return {
            type: 'Staff Allocation Conflict',
            message: `Faculty member ${staffObj?.fullName || 'Selected Staff'} is already scheduled for Period ${pNumber} on ${day} in classroom ${t.roomNumber || 'N/A'}.`,
            details: t
          };
        }
        // 2. Room Conflict
        if (room && t.roomNumber?.toLowerCase() === room.toLowerCase()) {
          return {
            type: 'Classroom Booking Conflict',
            message: `Classroom ${room} is already occupied for Period ${pNumber} on ${day} by ${t.subject || 'another class'} (${t.department} Sem ${t.semester} Sec ${t.section}).`,
            details: t
          };
        }
        // 3. Section/Duplicate Period Conflict
        if (t.department === dept && t.year === year && t.semester === sem && t.section === sec) {
          return {
            type: 'Duplicate Period Conflict',
            message: `Section ${sec} of ${dept} Semester ${sem} already has class ${t.subject || 'scheduled'} for Period ${pNumber} on ${day}.`,
            details: t
          };
        }
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check conflicts client-side first
    const detectedConflict = checkConflicts(formData);
    if (detectedConflict) {
      setConflict(detectedConflict);
      return; // Stop submission!
    }

    try {
      setLoading(true);
      await api.post('/timetable', { ...formData, periodNumber: parseInt(formData.periodNumber) });
      toast.success('Timetable created successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create timetable');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-fade-in-up relative">
        
        {/* Conflict Warning Premium Dialog Box Overlay */}
        {conflict && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-rose-100 shadow-2xl w-full max-w-md overflow-hidden p-6 text-center animate-scale-up">
              <div className="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">{conflict.type}</h3>
              <p className="text-slate-500 text-xs font-semibold mt-2 leading-relaxed">{conflict.message}</p>
              
              {conflict.details && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 my-4 text-left text-xs space-y-1">
                  <p className="font-bold text-slate-700 uppercase tracking-widest text-[9px]">Conflicting Record Details</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-slate-400 font-medium">Subject:</span>
                      <p className="font-bold text-slate-800">{conflict.details.subject || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Classroom:</span>
                      <p className="font-bold text-slate-800">{conflict.details.roomNumber ?? 'Not Assigned'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Department:</span>
                      <p className="font-bold text-slate-800">{conflict.details.department} • Sec {conflict.details.section}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Timing:</span>
                      <p className="font-bold text-slate-800">{conflict.details.day} • Period {conflict.details.periodNumber}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <button 
                  type="button" 
                  onClick={() => setConflict(null)}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-xs uppercase tracking-wider"
                >
                  Adjust Schedule
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><div className="bg-indigo-50 p-2 rounded-lg"><Calendar className="text-indigo-600" size={20} /></div>Schedule Class</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-amber-50 text-amber-800 p-3 rounded-xl mb-6 text-sm flex items-center gap-2 border border-amber-200">
            <AlertTriangle size={16} className="shrink-0" /> Note: The system will automatically check for staff and classroom conflicts.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
              <select name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option><option value="MECH">MECH</option><option value="CIVIL">CIVIL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
              <select name="year" value={formData.year} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Semester & Section</label>
              <div className="flex gap-2">
                <input type="text" name="semester" value={formData.semester} onChange={handleChange} className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="Sem" required />
                <input type="text" name="section" value={formData.section} onChange={handleChange} className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="Sec (A)" required />
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-3 border-t border-gray-100 my-2 pt-4"><h3 className="font-semibold text-gray-800">Timing Details</h3></div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Day</label>
              <select name="day" value={formData.day} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                {settings?.workingDays ? settings.workingDays.map(d => <option key={d} value={d}>{d}</option>) : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Period Number *</label>
              <input type="number" name="periodNumber" value={formData.periodNumber} onChange={handleChange} min="1" max={settings?.totalPeriods || 8} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start & End Time</label>
              <div className="flex gap-2">
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="w-1/2 px-2 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" />
                <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="w-1/2 px-2 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" />
              </div>
            </div>

            <div className="col-span-1 md:col-span-3 border-t border-gray-100 my-2 pt-4"><h3 className="font-semibold text-gray-800">Class Details</h3></div>

            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Subject Name *</label><input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="e.g. Data Structures" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Classroom *</label><input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="e.g. A-204" /></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Assign Staff *</label>
              <select name="staffId" value={formData.staffId} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none bg-white">
                <option value="">-- Select Staff --</option>
                {staffList.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.staffId} - {s.department})</option>)}
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-2"><Save size={18} /> {loading ? 'Saving...' : 'Save Timetable'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimetableModal;
