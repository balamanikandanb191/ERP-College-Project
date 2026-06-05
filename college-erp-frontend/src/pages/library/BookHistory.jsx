import React, { useState, useEffect } from 'react';
import { Search, Calendar, CheckCircle2, History, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const BookHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/borrow-records');
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching borrow history:', error);
      toast.error('Failed to load borrow records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Filter records
  const filteredRecords = records.filter(record => {
    const bookTitle = record.Book?.bookName?.toLowerCase() || '';
    const isStudent = record.borrowerType?.toLowerCase() === 'student';
    const borrowerName = (isStudent ? record.Student?.fullName : record.Staff?.fullName)?.toLowerCase() || '';
    const borrowerId = (isStudent ? record.Student?.registerNumber : record.Staff?.staffId)?.toLowerCase() || '';
    const bookIsbn = record.Book?.isbn?.toLowerCase() || '';

    const matchSearch = 
      bookTitle.includes(searchTerm.toLowerCase()) ||
      borrowerName.includes(searchTerm.toLowerCase()) ||
      borrowerId.includes(searchTerm.toLowerCase()) ||
      bookIsbn.includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'All' || record.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
          <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
            <History size={24} />
          </div>
          Book Borrow History & Logs
        </h1>
        <p className="text-gray-500 text-sm mt-1">Audit complete borrowing history, actual return dates, and outstanding transactions</p>
      </div>

      {/* Search bar & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by book title, borrower name, ID or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Borrowed">Active (Borrowed)</option>
            <option value="Returned">Returned</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* History table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/70 text-gray-500 border-b border-gray-100 font-semibold">
              <tr>
                <th className="px-6 py-4">Book Details</th>
                <th className="px-6 py-4">Borrower</th>
                <th className="px-6 py-4">Borrow Date</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Actual Return Date</th>
                <th className="px-6 py-4">Fine Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                    <p>Loading history...</p>
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-gray-400">
                    <History className="mx-auto mb-3 text-gray-300" size={48} />
                    <p className="text-lg font-bold text-gray-700">No borrow records found</p>
                    <p className="text-sm">Try modifying your query or check out new books.</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const bookTitle = record.Book?.bookName || 'Unknown Book';
                  const bookIsbn = record.Book?.isbn || 'N/A';
                  const isStudent = record.borrowerType?.toLowerCase() === 'student';
                  const borrowerName = isStudent ? record.Student?.fullName : record.Staff?.fullName;
                  const borrowerCode = isStudent ? record.Student?.registerNumber : record.Staff?.staffId;
                  
                  return (
                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{bookTitle}</span>
                          <span className="text-gray-400 text-xs mt-0.5">ISBN: {bookIsbn}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          {isStudent ? (
                            <>
                              <span className="font-bold text-gray-900 text-sm leading-tight">{record.Student?.fullName || 'Unknown Student'}</span>
                              <div className="flex flex-col gap-0.5 text-gray-500">
                                <span><strong className="text-gray-700">Reg No:</strong> {record.Student?.registerNumber}</span>
                                {record.Student?.academicYear && <span><strong className="text-gray-700">Year:</strong> {record.Student.academicYear}</span>}
                                {record.Student?.semester && <span><strong className="text-gray-700">Semester:</strong> {record.Student.semester}</span>}
                                {record.Student?.department && <span><strong className="text-gray-700">Dept:</strong> {record.Student.department} {record.Student.course ? `(${record.Student.course})` : ''}</span>}
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="font-bold text-gray-900 text-sm leading-tight">{record.Staff?.fullName || 'Unknown Staff'}</span>
                              <div className="flex flex-col gap-0.5 text-gray-500">
                                <span><strong className="text-gray-700">Staff ID:</strong> {record.Staff?.staffId}</span>
                                {record.Staff?.department && <span><strong className="text-gray-700">Dept:</strong> {record.Staff.department}</span>}
                              </div>
                            </>
                          )}
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded w-max mt-1 ${
                            isStudent
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {record.borrowerType?.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{record.borrowDate}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{record.returnDate}</td>
                      <td className="px-6 py-4 font-semibold">
                        {record.actualReturnDate ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 size={14} />
                            {record.actualReturnDate}
                          </span>
                        ) : (
                          <span className="text-gray-400 flex items-center gap-1 font-normal">
                            <AlertCircle size={14} className="text-amber-500" />
                            Not Returned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold">
                        {record.fineAmount > 0 ? (
                          <span className="text-rose-600">₹{record.fineAmount}</span>
                        ) : (
                          <span className="text-gray-400 font-normal">Nil</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          record.status === 'Returned' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : record.status === 'Overdue'
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}>
                          {record.status}
                        </span>
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
  );
};

export default BookHistory;
