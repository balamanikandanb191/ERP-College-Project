import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const AttendanceModal = ({ isOpen, onClose, attendanceData, type, inline = false }) => {
  const isEdit = !!attendanceData;
  const isStudent = type === 'student';

  const [formData, setFormData] = useState({
    target_id: '', // student_id or staff_id
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    remarks: ''
  });

  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTargets();
      if (isEdit) {
        setFormData({
          target_id: isStudent ? attendanceData.student_id : attendanceData.staff_id,
          date: attendanceData.date,
          status: attendanceData.status,
          remarks: attendanceData.remarks || ''
        });
      } else {
        setFormData({
          target_id: '',
          date: new Date().toISOString().split('T')[0],
          status: 'Present',
          remarks: ''
        });
      }
    }
  }, [isOpen, isEdit, attendanceData, isStudent]);

  const fetchTargets = async () => {
    try {
      const endpoint = isStudent ? '/students' : '/staff';
      const { data } = await api.get(endpoint);
      setTargets(data || []);
    } catch (error) {
      toast.error(`Failed to load ${isStudent ? 'students' : 'staff'} list`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isStudent ? '/student-attendance' : '/staff-attendance';
      const payload = {
        date: formData.date,
        status: formData.status,
        remarks: formData.remarks
      };

      if (isStudent) {
        payload.student_id = formData.target_id;
      } else {
        payload.staff_id = formData.target_id;
      }

      if (isEdit) {
        await api.put(`${endpoint}/${attendanceData.id}`, payload);
        toast.success('Attendance updated');
      } else {
        await api.post(endpoint, payload);
        toast.success('Attendance marked');
      }

      window.location.reload(); // Simple refresh for now to update table
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (inline) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border-color">
          <h2 className="text-xl font-bold text-text-main">
            {isEdit ? 'Edit Attendance' : `Mark ${isStudent ? 'Student' : 'Staff'} Attendance`}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">
                Select {isStudent ? 'Student' : 'Staff'}
              </label>
              <select
                required
                disabled={isEdit}
                value={formData.target_id}
                onChange={(e) => setFormData({...formData, target_id: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white disabled:bg-gray-100 disabled:text-text-muted"
              >
                <option value="">-- Select --</option>
                {Array.isArray(targets) && targets.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} ({isStudent ? t.registerNumber : t.staffId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Date</label>
              <input
                type="date"
                required
                disabled={isEdit}
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm disabled:bg-gray-100 disabled:text-text-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Status</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                {!isStudent && <option value="Leave">On Leave</option>}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Remarks (Optional)</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                rows="2"
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                placeholder="Add any notes..."
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-text-muted hover:text-text-main hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border-color">
          <h2 className="text-xl font-bold text-text-main">
            {isEdit ? 'Edit Attendance' : `Mark ${isStudent ? 'Student' : 'Staff'} Attendance`}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-danger hover:bg-danger/10 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">
                Select {isStudent ? 'Student' : 'Staff'}
              </label>
              <select
                required
                disabled={isEdit}
                value={formData.target_id}
                onChange={(e) => setFormData({...formData, target_id: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white disabled:bg-gray-100 disabled:text-text-muted"
              >
                <option value="">-- Select --</option>
                {Array.isArray(targets) && targets.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} ({isStudent ? t.registerNumber : t.staffId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Date</label>
              <input
                type="date"
                required
                disabled={isEdit} // usually date is not editable, only status
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm disabled:bg-gray-100 disabled:text-text-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Status</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                {!isStudent && <option value="Leave">On Leave</option>}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Remarks (Optional)</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                rows="2"
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                placeholder="Add any notes..."
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-text-muted hover:text-text-main hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceModal;
