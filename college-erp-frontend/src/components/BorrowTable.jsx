import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Filter, Plus, ClipboardList, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import BorrowModal from './BorrowModal';

const BorrowTable = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/borrow-records');
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load borrow records', { id: 'borrow-load-err' });
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleReturn = async (id) => {
    if (window.confirm('Mark this book as returned?')) {
      try {
        await api.put(`/borrow-records/${id}`, { status: 'Returned' });
        toast.success('Book returned successfully');
        fetchRecords();
      } catch (error) {
        toast.error('Failed to return book');
      }
    }
  };

  const filteredData = Array.isArray(records) ? records.filter(record => {
    if (!record) return false;
    const borrowerName = record.borrowerType === 'Student' 
      ? (record.Student?.fullName || '').toLowerCase()
      : (record.Staff?.fullName || '').toLowerCase();
    const bookName = (record.Book?.bookName || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return borrowerName.includes(search) || bookName.includes(search);
  }) : [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Returned': return <span className="px-3 py-1 text-xs font-bold bg-success/10 text-success rounded-lg">Returned</span>;
      case 'Borrowed': return <span className="px-3 py-1 text-xs font-bold bg-primary/10 text-primary rounded-lg">Borrowed</span>;
      case 'Overdue': return <span className="px-3 py-1 text-xs font-bold bg-danger/10 text-danger rounded-lg">Overdue</span>;
      default: return <span className="px-3 py-1 text-xs font-bold bg-gray-100 text-gray-600 rounded-lg">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border-color flex flex-col lg:flex-row gap-4 justify-between items-center bg-gray-50/50 rounded-t-2xl">
        <div className="relative w-full lg:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search borrower or book name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-border-color rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <button className="flex items-center justify-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-semibold px-4 py-2.5 border border-border-color bg-white rounded-xl shadow-sm w-full lg:w-auto">
            <Filter size={16} />
            Filters
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 text-white bg-primary hover:bg-primary-dark transition-colors text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm w-full lg:w-auto"
          >
            <Plus size={18} />
            Issue Book
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50/80 text-text-muted border-b border-border-color">
            <tr>
              <th className="px-6 py-4 font-semibold">Borrower Info</th>
              <th className="px-6 py-4 font-semibold">Book Info</th>
              <th className="px-6 py-4 font-semibold">Dates</th>
              <th className="px-6 py-4 font-semibold">Fine (₹)</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-text-muted">Loading records...</td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-text-muted">
                  <ClipboardList className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-lg font-medium text-text-main">No borrow records found.</p>
                </td>
              </tr>
            ) : (
              filteredData.map((record) => {
                const borrowerName = record.borrowerType === 'Student' ? record.Student?.fullName : record.Staff?.fullName;
                const borrowerId = record.borrowerType === 'Student' ? record.Student?.registerNumber : record.Staff?.staffId;
                const dept = record.borrowerType === 'Student' ? record.Student?.department : record.Staff?.department;

                return (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-text-main">{borrowerName}</span>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <span className="font-semibold">{record.borrowerType}</span> • {borrowerId}
                        </span>
                        <span className="text-xs text-text-muted">{dept}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-main truncate w-48">{record.Book?.bookName}</span>
                        <span className="text-xs text-text-muted">ISBN: {record.Book?.isbn}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-text-main text-sm">Out: <span className="font-medium">{record.borrowDate}</span></span>
                        <span className={`text-sm ${record.status === 'Overdue' ? 'text-danger font-semibold' : 'text-text-muted'}`}>
                          Due: {record.returnDate}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${record.fineAmount > 0 ? 'text-danger' : 'text-text-muted'}`}>
                        ₹{record.fineAmount}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                    <td className="px-6 py-4 text-right">
                      {(record.status === 'Borrowed' || record.status === 'Overdue') && (
                        <button 
                          onClick={() => handleReturn(record.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-success bg-success/10 hover:bg-success/20 rounded-lg transition-colors ml-auto border border-success/20"
                        >
                          <CheckCircle size={14} />
                          Return
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

      {isModalOpen && (
        <BorrowModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchRecords}
        />
      )}
    </div>
  );
};

export default BorrowTable;
