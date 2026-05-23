import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

const BorrowModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    borrowerType: 'Student',
    targetId: '', // student or staff id
    bookId: '',
    borrowDate: new Date().toISOString().split('T')[0],
    returnDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0], // +14 days
  });

  const [targets, setTargets] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTargets(formData.borrowerType);
      fetchBooks();
    }
  }, [isOpen, formData.borrowerType]);

  const fetchTargets = async (type) => {
    try {
      const endpoint = type === 'Student' ? '/students' : '/staff';
      const { data } = await api.get(endpoint);
      setTargets(Array.isArray(data) ? data : []);
      setFormData(prev => ({ ...prev, targetId: '' })); // reset on type change
    } catch (error) {
      toast.error(`Failed to load ${type}s`);
    }
  };

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books');
      const available = (Array.isArray(data) ? data : []).filter(b => b.availableCopies > 0);
      setBooks(available);
    } catch (error) {
      toast.error('Failed to load books');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        borrowerType: formData.borrowerType,
        bookId: formData.bookId,
        borrowDate: formData.borrowDate,
        returnDate: formData.returnDate
      };

      if (formData.borrowerType === 'Student') {
        payload.studentId = formData.targetId;
      } else {
        payload.staffId = formData.targetId;
      }

      await api.post('/borrow-records', payload);
      toast.success('Book issued successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border-color">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <ClipboardList className="text-primary" size={24} />
            Issue Book
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-danger hover:bg-danger/10 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Borrower Type</label>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, borrowerType: 'Student' })}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${formData.borrowerType === 'Student' ? 'bg-white shadow-sm text-primary' : 'text-text-muted'}`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, borrowerType: 'Staff' })}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${formData.borrowerType === 'Staff' ? 'bg-white shadow-sm text-primary' : 'text-text-muted'}`}
                >
                  Staff
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Select {formData.borrowerType} *</label>
              <select
                required
                value={formData.targetId}
                onChange={(e) => setFormData({...formData, targetId: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white"
              >
                <option value="">-- Search {formData.borrowerType} --</option>
                {targets.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} ({formData.borrowerType === 'Student' ? t.registerNumber : t.staffId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Select Book *</label>
              <select
                required
                value={formData.bookId}
                onChange={(e) => setFormData({...formData, bookId: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white"
              >
                <option value="">-- Available Books --</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.bookName} (Copies: {b.availableCopies})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">Borrow Date</label>
                <input
                  type="date" required
                  value={formData.borrowDate}
                  onChange={(e) => setFormData({...formData, borrowDate: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">Return Date</label>
                <input
                  type="date" required
                  value={formData.returnDate}
                  onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-border-color pt-6">
            <button
              type="button" onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-text-muted hover:text-text-main hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Issue Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowModal;
