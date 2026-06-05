import React, { useState, useEffect } from 'react';
import { Search, DollarSign, UserCheck, BookOpen, CreditCard, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const FineReport = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, Paid, Unpaid

  const fetchFines = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/borrow-records');
      // Fines are records where fineAmount > 0 or has historically been overdue
      const recordsWithFines = (Array.isArray(data) ? data : []).filter(r => r.fineAmount > 0 || r.status === 'Overdue');
      setFines(recordsWithFines);
    } catch (error) {
      console.error('Error fetching fine logs:', error);
      toast.error('Failed to load fine records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const handleCollectFine = async (id, currentFine) => {
    if (window.confirm(`Confirm collection of fine payment: ₹${currentFine}?`)) {
      try {
        // Collect fine: set fineAmount to 0 and mark status as Returned if it was overdue
        await api.put(`/borrow-records/${id}`, {
          fineAmount: 0,
          status: 'Returned'
        });
        toast.success('Fine collected successfully! Record settled.');
        fetchFines();
      } catch (error) {
        toast.error('Failed to clear fine payment');
      }
    }
  };

  // Filter fines
  const filteredFines = fines.filter(fine => {
    const bookTitle = fine.Book?.bookName?.toLowerCase() || '';
    const borrowerName = (fine.borrowerType === 'student' ? fine.Student?.fullName : fine.Staff?.fullName)?.toLowerCase() || '';
    const borrowerId = (fine.borrowerType === 'student' ? fine.Student?.registerNumber : fine.Staff?.staffId)?.toLowerCase() || '';

    const matchSearch = 
      bookTitle.includes(searchTerm.toLowerCase()) ||
      borrowerName.includes(searchTerm.toLowerCase()) ||
      borrowerId.includes(searchTerm.toLowerCase());

    const isPaid = fine.fineAmount === 0 && fine.status === 'Returned';
    const matchType = 
      filterType === 'All' ||
      (filterType === 'Paid' && isPaid) ||
      (filterType === 'Unpaid' && !isPaid);

    return matchSearch && matchType;
  });

  // Calculate stats
  const totalFinesCollected = fines.filter(f => f.fineAmount === 0 && f.status === 'Returned').length * 150; // estimate or mock
  const totalFinesOutstanding = filteredFines.reduce((sum, f) => sum + (f.fineAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
          <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
            <DollarSign size={24} />
          </div>
          Fine Management & Reports
        </h1>
        <p className="text-gray-500 text-sm mt-1">Audit overdue fines, collect payments, and view settlement reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Fines Outstanding</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-1">₹{totalFinesOutstanding}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Settlement Actions</span>
            <span className="text-sm font-semibold text-gray-500 mt-1">Collect, waive or audit individual borrower balances</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by borrower name, ID or book title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="All">All Fines</option>
            <option value="Unpaid">Unpaid (Outstanding)</option>
            <option value="Paid">Settled (Paid)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/70 text-gray-500 border-b border-gray-100 font-semibold">
              <tr>
                <th className="px-6 py-4">Borrower Details</th>
                <th className="px-6 py-4">Book Reference</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Fine Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                    Loading fine transactions...
                  </td>
                </tr>
              ) : filteredFines.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    No fine records found.
                  </td>
                </tr>
              ) : (
                filteredFines.map((fine) => {
                  const borrowerName = fine.borrowerType === 'student' ? fine.Student?.fullName : fine.Staff?.fullName;
                  const borrowerCode = fine.borrowerType === 'student' ? fine.Student?.registerNumber : fine.Staff?.staffId;
                  const isPaid = fine.fineAmount === 0 && fine.status === 'Returned';

                  return (
                    <tr key={fine.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{borrowerName}</span>
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-extrabold w-max mt-1">
                            {borrowerCode} ({fine.borrowerType})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-700">{fine.Book?.bookName}</span>
                          <span className="text-gray-400 text-xs mt-0.5">ISBN: {fine.Book?.isbn}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-semibold">{fine.returnDate}</td>
                      <td className="px-6 py-4">
                        <span className={`font-extrabold text-sm ${isPaid ? 'text-gray-400 line-through' : 'text-rose-600'}`}>
                          ₹{isPaid ? 0 : fine.fineAmount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isPaid 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {isPaid ? 'Settled (Paid)' : 'Unpaid (Overdue)'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!isPaid && (
                          <button
                            onClick={() => handleCollectFine(fine.id, fine.fineAmount)}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ml-auto"
                          >
                            <CreditCard size={12} />
                            Collect Fine
                          </button>
                        )}
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

export default FineReport;
