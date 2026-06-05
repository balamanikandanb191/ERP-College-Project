import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, ShieldAlert, Printer, Award, FileText, User } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const NoDueCertificate = () => {
  const [borrowerType, setBorrowerType] = useState('student');
  const [searchId, setSearchId] = useState('');
  const [students, setStudents] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search result state
  const [checked, setChecked] = useState(false);
  const [borrower, setBorrower] = useState(null);
  const [activeLoans, setActiveLoans] = useState([]);
  const [unpaidFines, setUnpaidFines] = useState([]);

  useEffect(() => {
    const loadLists = async () => {
      try {
        setLoading(true);
        const [studentsRes, staffRes, recordsRes] = await Promise.all([
          api.get('/students'),
          api.get('/staff'),
          api.get('/borrow-records')
        ]);
        setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
        setStaffList(Array.isArray(staffRes.data) ? staffRes.data : []);
        setBorrowRecords(Array.isArray(recordsRes.data) ? recordsRes.data : []);
      } catch (error) {
        console.error('Error loading validation data:', error);
        toast.error('Failed to load validation databases');
      } finally {
        setLoading(false);
      }
    };
    loadLists();
  }, []);

  const handleCheckDues = (e) => {
    e.preventDefault();
    setChecked(true);

    if (borrowerType === 'student') {
      const foundStudent = students.find(s => s.registerNumber.trim().toLowerCase() === searchId.trim().toLowerCase());
      if (!foundStudent) {
        setBorrower(null);
        toast.error('Student registration number not found');
        return;
      }
      setBorrower(foundStudent);
      
      // Find active loans and fines
      const loans = borrowRecords.filter(r => r.studentId === foundStudent.id && (r.status === 'Borrowed' || r.status === 'Overdue'));
      const fines = borrowRecords.filter(r => r.studentId === foundStudent.id && r.fineAmount > 0 && r.status !== 'Returned');
      
      setActiveLoans(loans);
      setUnpaidFines(fines);
    } else {
      const foundStaff = staffList.find(st => st.staffId.trim().toLowerCase() === searchId.trim().toLowerCase());
      if (!foundStaff) {
        setBorrower(null);
        toast.error('Staff ID not found');
        return;
      }
      setBorrower(foundStaff);

      // Find active loans and fines
      const loans = borrowRecords.filter(r => r.staffId === foundStaff.id && (r.status === 'Borrowed' || r.status === 'Overdue'));
      const fines = borrowRecords.filter(r => r.staffId === foundStaff.id && r.fineAmount > 0 && r.status !== 'Returned');
      
      setActiveLoans(loans);
      setUnpaidFines(fines);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const hasDues = activeLoans.length > 0 || unpaidFines.reduce((sum, f) => sum + f.fineAmount, 0) > 0;

  return (
    <div className="space-y-6 print:p-0">
      
      {/* Header (hidden on print) */}
      <div className="mb-6 flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <Award size={24} />
            </div>
            No Due Certificate (Library)
          </h1>
          <p className="text-gray-500 text-sm mt-1">Audit accounts and generate No Due certificates for graduating or departing students/staff</p>
        </div>
      </div>

      {/* Verification Box (hidden on print) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm print:hidden">
        <h2 className="text-base font-bold text-gray-800 mb-4">Validate Account Dues</h2>
        <form onSubmit={handleCheckDues} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Account Type</label>
            <select
              value={borrowerType}
              onChange={(e) => { setBorrowerType(e.target.value); setChecked(false); setBorrower(null); }}
              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="student">Student</option>
              <option value="staff">Staff Member</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              {borrowerType === 'student' ? 'Registration Number' : 'Staff ID'}
            </label>
            <input
              type="text"
              required
              placeholder={borrowerType === 'student' ? 'e.g. REG-2023-0045' : 'e.g. EMP-TCH-102'}
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
          >
            <Search size={16} />
            Check Dues
          </button>
        </form>
      </div>

      {/* Results View */}
      {checked && borrower && (
        <div className="space-y-6">
          
          {/* Due Status Banner (hidden on print) */}
          <div className="print:hidden">
            {hasDues ? (
              <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-start gap-4 text-rose-800 animate-in fade-in slide-in-from-top-3 duration-300">
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                  <ShieldAlert size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-rose-900 leading-tight">No Due Blocked</h3>
                  <p className="text-sm text-rose-700 mt-1">Outstanding dues found. All books must be returned and fines cleared before a certificate is issued.</p>
                  
                  <div className="mt-4 border-t border-rose-200/50 pt-4 space-y-2">
                    {activeLoans.length > 0 && (
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider block text-rose-900 mb-1">Active Loans ({activeLoans.length})</span>
                        <ul className="text-xs list-disc list-inside space-y-1">
                          {activeLoans.map(l => (
                            <li key={l.id}>{l.Book?.bookName} (Due: {l.returnDate})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {unpaidFines.length > 0 && (
                      <div className="mt-3">
                        <span className="text-xs font-bold uppercase tracking-wider block text-rose-900 mb-1">Outstanding Fines</span>
                        <ul className="text-xs list-disc list-inside space-y-1">
                          {unpaidFines.map(f => (
                            <li key={f.id}>{f.Book?.bookName} - Fine: ₹{f.fineAmount}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-start gap-4 text-emerald-800 animate-in fade-in slide-in-from-top-3 duration-300">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-emerald-900 leading-tight">Account Clear</h3>
                  <p className="text-sm text-emerald-700 mt-1">Lending registry checks completed. The borrower has returned all books and paid all outstanding fines.</p>
                </div>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5 shrink-0"
                >
                  <Printer size={14} />
                  Print Certificate
                </button>
              </div>
            )}
          </div>

          {/* Certificate Render (Visible on Check Dues if clear, or printable) */}
          {!hasDues && (
            <div className="bg-white border-[12px] border-double border-indigo-900 p-8 sm:p-12 rounded-2xl shadow-sm text-center relative overflow-hidden max-w-2xl mx-auto print:border-[8px] print:shadow-none print:my-0">
              
              {/* Corner Watermarks */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/20 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-50/20 rounded-full blur-2xl pointer-events-none"></div>

              {/* Institution Seal Header */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="w-16 h-16 border-2 border-indigo-900 rounded-full flex items-center justify-center p-2 text-indigo-900 mb-2">
                  <Award size={36} className="stroke-[1.5]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-wide uppercase">EduERP Engineering College</h2>
                <span className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Affiliated to University of Excellence | NBA & NAAC Accredited</span>
              </div>

              {/* Title */}
              <div className="border-y-2 border-indigo-900/10 py-3 mb-8">
                <h3 className="text-lg font-black text-indigo-900 uppercase tracking-widest">NO DUE CERTIFICATE</h3>
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Department of Library</span>
              </div>

              {/* Certificate content statement */}
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium px-4">
                This is to certify that <span className="font-extrabold text-indigo-950 text-base border-b border-gray-300 pb-0.5">{borrower.fullName}</span>, 
                holding identification <span className="font-extrabold text-indigo-950 text-base border-b border-gray-300 pb-0.5">
                  {borrowerType === 'student' ? borrower.registerNumber : borrower.staffId}
                </span>, 
                affiliated with the department of <span className="font-extrabold text-indigo-950 text-base border-b border-gray-300 pb-0.5">{borrower.department || 'General'}</span>, 
                has returned all borrowed materials, textbooks, reference materials, journals and cleared all outstanding fine dues to the College Central Library.
              </p>

              <p className="text-sm text-gray-500 mt-6 leading-normal">
                Consequently, no dues are outstanding from the individual, and the Central Library hereby clears the account.
              </p>

              {/* Date */}
              <div className="mt-8 text-left pl-4">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Date of Issue</span>
                <span className="text-sm font-extrabold text-gray-800">{new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 mt-12 pt-6 border-t border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-24 bg-gray-50 border border-dashed border-gray-200 rounded flex items-center justify-center text-[10px] text-gray-400 font-semibold mb-2">
                    Librarian Seal
                  </div>
                  <span className="w-full border-t border-gray-300 pt-1.5 text-xs font-bold text-gray-800 uppercase tracking-wider">Librarian</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Central Library</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-10 w-24 bg-gray-50 border border-dashed border-gray-200 rounded flex items-center justify-center text-[10px] text-gray-400 font-semibold mb-2">
                    Principal Seal
                  </div>
                  <span className="w-full border-t border-gray-300 pt-1.5 text-xs font-bold text-gray-800 uppercase tracking-wider">Principal / Dean</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Academic Deanery</span>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default NoDueCertificate;
