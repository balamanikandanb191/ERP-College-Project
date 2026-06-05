import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, UserCheck, RefreshCw, Send, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { confirmReturn } from '../../utils/confirmToast';

const BookIssue = () => {
  // Form state
  const [borrowerType, setBorrowerType] = useState('student');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedBorrowerId, setSelectedBorrowerId] = useState('');
  const [borrowDate, setBorrowDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 10); // 10 days loan period default
    return defaultDue.toISOString().split('T')[0];
  });

  // Data lists
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);


  const loadData = async () => {
    try {
      setLoading(true);
      const [booksRes, studentsRes, staffRes, loansRes] = await Promise.all([
        api.get('/books'),
        api.get('/students'),
        api.get('/staff'),
        api.get('/borrow-records')
      ]);

      setBooks(Array.isArray(booksRes.data) ? booksRes.data : []);
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
      setStaffList(Array.isArray(staffRes.data) ? staffRes.data : []);
      
      const allLoans = Array.isArray(loansRes.data) ? loansRes.data : [];
      // Filter active (borrowed/overdue) loans
      setActiveLoans(allLoans.filter(l => l.status === 'Borrowed' || l.status === 'Overdue'));
    } catch (error) {
      console.error('Error fetching circulation data:', error);
      toast.error('Failed to load data lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (borrowDate) {
      const bDate = new Date(borrowDate);
      bDate.setDate(bDate.getDate() + 10);
      setDueDate(bDate.toISOString().split('T')[0]);
    }
  }, [borrowDate]);

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookId) return toast.error('Please select a book');
    if (!selectedBorrowerId) return toast.error('Please select a borrower');

    // Double check book status
    const book = books.find(b => b.id.toString() === selectedBookId.toString());
    if (book) {
      if (book.status === 'Lost') {
        return toast.error('Cannot issue: Book is marked as Lost');
      }
      if (book.status === 'Damaged') {
        return toast.error('Cannot issue: Book is marked as Damaged');
      }
      if (book.status === 'Reference Only') {
        return toast.error('Cannot issue: Book is Reference Only');
      }
      if (book.availableCopies <= 0) {
        return toast.error('Cannot issue: No copies available');
      }
    }

    setSubmitLoading(true);
    try {
      const payload = {
        bookId: selectedBookId,
        borrowerType,
        studentId: borrowerType === 'student' ? selectedBorrowerId : null,
        staffId: borrowerType === 'staff' ? selectedBorrowerId : null,
        borrowDate,
        returnDate: dueDate // model takes `returnDate` as the due date
      };

      await api.post('/borrow-records', payload);
      toast.success('Book issued successfully!');
      
      // Clear form selections
      setSelectedBookId('');
      setSelectedBorrowerId('');
      // Reload Lists
      loadData();
    } catch (error) {
      console.error('Error issuing book:', error);
      toast.error(error.response?.data?.message || 'Failed to issue book');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReturnBook = (recordId, bookName) => {
    confirmReturn(async () => {
      try {
        await api.put(`/borrow-records/${recordId}`, { status: 'Returned' });
        toast.success(`"${bookName}" marked as returned`);
        loadData();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to return book');
      }
    }, bookName);
  };

  // Get all books to display status and check availability in real-time
  const availableBooksList = books;

  const getBookStatusLabel = (book) => {
    if (book.status === 'Lost') return 'Lost';
    if (book.status === 'Damaged') return 'Damaged';
    if (book.status === 'Reference Only') return 'Reference Only';
    if (book.availableCopies <= 0) return 'Out of Stock';
    return `${book.availableCopies} available`;
  };

  const handleBookSelection = (bookId) => {
    if (!bookId) {
      setSelectedBookId('');
      return;
    }
    const book = books.find(b => b.id.toString() === bookId.toString());
    if (book) {
      if (book.status === 'Lost') {
        toast.error(`The book "${book.bookName}" is marked as Lost and cannot be issued.`);
        setSelectedBookId('');
        return;
      }
      if (book.status === 'Damaged') {
        toast.error(`The book "${book.bookName}" is marked as Damaged and cannot be issued.`);
        setSelectedBookId('');
        return;
      }
      if (book.status === 'Reference Only') {
        toast.error(`The book "${book.bookName}" is for Reference Only and cannot be issued.`);
        setSelectedBookId('');
        return;
      }
      if (book.availableCopies <= 0) {
        toast.error(`The book "${book.bookName}" has no copies available and cannot be issued.`);
        setSelectedBookId('');
        return;
      }
    }
    setSelectedBookId(bookId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
          <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
            <RefreshCw size={24} />
          </div>
          Book Issue & Circulation
        </h1>
        <p className="text-gray-500 text-sm mt-1">Issue books to students or staff and track active loans in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Issue Book Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Send className="text-indigo-600" size={20} />
            New Book Issue
          </h2>

          <form onSubmit={handleIssueSubmit} className="space-y-4">
            {/* Borrower Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Borrower Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setBorrowerType('student'); setSelectedBorrowerId(''); }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    borrowerType === 'student'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => { setBorrowerType('staff'); setSelectedBorrowerId(''); }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    borrowerType === 'staff'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Staff Member
                </button>
              </div>
            </div>

            {/* Select Book */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Select Book *</label>
              <select
                required
                value={selectedBookId}
                onChange={(e) => handleBookSelection(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">-- Choose Book --</option>
                {availableBooksList.map(book => (
                  <option key={book.id} value={book.id}>
                    {book.customBookId} - {book.bookName} ({getBookStatusLabel(book)})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Borrower */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Select {borrowerType === 'student' ? 'Student' : 'Staff'} *
              </label>
              <select
                required
                value={selectedBorrowerId}
                onChange={(e) => setSelectedBorrowerId(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">-- Choose Borrower --</option>
                {borrowerType === 'student' ? (
                  students.map(s => (
                    <option key={s.id} value={s.id}>{s.registerNumber} - {s.fullName}</option>
                  ))
                ) : (
                  staffList.map(st => (
                    <option key={st.id} value={st.id}>{st.staffId} - {st.fullName}</option>
                  ))
                )}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Issue Date</label>
                <input
                  type="date"
                  required
                  value={borrowDate}
                  onChange={(e) => setBorrowDate(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              {submitLoading ? 'Processing...' : 'Issue Book'}
            </button>
          </form>
        </div>

        {/* Active Issues Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="text-indigo-600" size={20} />
              Active Issued Books
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/70 text-gray-500 border-b border-gray-100 font-semibold">
                <tr>
                  <th className="px-6 py-4">Book Details</th>
                  <th className="px-6 py-4">Borrower</th>
                  <th className="px-6 py-4">Issue / Due Dates</th>
                  <th className="px-6 py-4">Fine Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                      Loading circulation lists...
                    </td>
                  </tr>
                ) : activeLoans.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      No active issued books.
                    </td>
                  </tr>
                ) : (
                  activeLoans.map((loan) => {
                    const bookName = loan.Book?.bookName || 'Unknown Book';
                    const bookId = loan.Book?.isbn || '';
                    const borrowerName = loan.borrowerType === 'student' ? loan.Student?.fullName : loan.Staff?.fullName;
                    const borrowerCode = loan.borrowerType === 'student' ? loan.Student?.registerNumber : loan.Staff?.staffId;
                    
                    return (
                      <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{bookName}</span>
                            <span className="text-gray-400 text-xs">{loan.Book?.isbn}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">{borrowerName}</span>
                            <span className="text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold w-max mt-0.5">
                              {borrowerCode} ({loan.borrowerType})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                            <span>{loan.borrowDate}</span>
                            <ArrowRight size={12} className="text-gray-400" />
                            <span className={loan.status === 'Overdue' ? 'text-rose-600 font-bold' : ''}>
                              {loan.returnDate}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 w-max ${
                            loan.status === 'Overdue'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-indigo-50 text-indigo-700'
                          }`}>
                            {loan.status === 'Overdue' ? (
                              <>
                                <AlertTriangle size={12} />
                                Overdue (₹{loan.fineAmount})
                              </>
                            ) : (
                              'Borrowed'
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleReturnBook(loan.id, bookName)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/10"
                          >
                            Return Book
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookIssue;
