import React, { useState, useEffect } from 'react';
import { Search, Printer, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';
import api from '../services/api';

const SEED_TCS = [
  { id: 'tc-201', registerNumber: 'REG20261102', studentName: 'Vikas Krishnan', dateOfLeaving: '2026-05-15', conduct: 'Excellent', feeStatus: 'Cleared', reason: 'Course Completed' },
  { id: 'tc-202', registerNumber: 'REG20268841', studentName: 'Shreya Roy', dateOfLeaving: '2026-05-18', conduct: 'Good', feeStatus: 'Cleared', reason: 'Higher Studies' }
];

const TC = () => {
  const { records } = useMasterData('tc_details', SEED_TCS);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await api.get('/students');
        if (data) {
          setStudents(data);
        }
      } catch (err) {
        console.error('Failed to fetch students:', err);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (records && records.length > 0 && !selectedRecord) {
      setSelectedRecord(records[0]);
    }
  }, [records]);

  const handlePrint = () => {
    window.print();
  };

  const filtered = (records || []).filter(r => (r.studentName || '').toLowerCase().includes(search.toLowerCase()) || (r.registerNumber || '').includes(search));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 print:p-0 print:m-0">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden print:hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Certificates Module</span>
            <h1 className="text-3xl font-black mt-2">Generate Transfer Certificate</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Select a student record to preview and print their official college Transfer Certificate</p>
          </div>
          {selectedRecord && (
            <button onClick={handlePrint}
              className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg">
              <Printer size={18} /> Print Certificate
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
        {/* Records list */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4 print:hidden">
          <h3 className="font-black text-slate-800 text-base">Exiting Students Registry</h3>
          
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Select Student (Register No)</label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white font-semibold text-slate-700"
              value={selectedRecord?.registerNumber || ''}
              onChange={e => {
                const rNum = e.target.value;
                const student = students.find(s => s.registerNumber === rNum);
                if (student) {
                  const matchedTc = (records || []).find(t => t.registerNumber === rNum);
                  if (matchedTc) {
                    setSelectedRecord(matchedTc);
                    toast.success(`Loaded prepared TC for ${student.fullName}`);
                  } else {
                    setSelectedRecord({
                      id: `temp-${student.registerNumber}`,
                      registerNumber: student.registerNumber,
                      studentName: student.fullName,
                      dateOfLeaving: new Date().toISOString().split('T')[0],
                      reason: 'Course Completed',
                      conduct: 'Excellent',
                      feeStatus: 'Cleared'
                    });
                    toast.success(`Generated preview TC for ${student.fullName}`);
                  }
                } else {
                  setSelectedRecord(null);
                }
              }}
            >
              <option value="">-- Choose Student --</option>
              {students.map(s => (
                <option key={s.id} value={s.registerNumber}>
                  {s.registerNumber} - {s.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
              placeholder="Filter by name..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto pr-1">
            {filtered.map(r => (
              <button key={r.id} onClick={() => setSelectedRecord(r)}
                className={`w-full text-left p-3 rounded-2xl flex flex-col gap-1 transition-colors ${selectedRecord?.id === r.id ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-slate-50'}`}>
                <span className="font-black text-slate-800 text-sm">{r.studentName}</span>
                <span className="font-mono text-xs text-indigo-600 font-bold">{r.registerNumber}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="lg:col-span-2 print:col-span-3">
          {selectedRecord ? (
            <div className="bg-white rounded-3xl border-4 border-double border-slate-800 shadow-md p-10 max-w-2xl mx-auto space-y-8 relative overflow-hidden print:border-slate-800 print:shadow-none">
              {/* College Header */}
              <div className="text-center space-y-2 border-b-2 border-slate-800 pb-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">National Institute of Technology & Science</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Affiliated to State University | Approved by AICTE</p>
                <h3 className="text-base font-black text-slate-700 bg-slate-100 inline-block px-4 py-1 rounded-full uppercase tracking-wider">Transfer Certificate</h3>
              </div>

              {/* Certificate Fields */}
              <div className="space-y-4 text-sm text-slate-800 font-semibold leading-loose">
                <div className="flex justify-between border-b border-dashed border-slate-200 py-1">
                  <span>1. Register / Enrollment Number:</span>
                  <span className="font-mono font-black text-slate-950">{selectedRecord.registerNumber}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-200 py-1">
                  <span>2. Name of the Pupil:</span>
                  <span className="font-black text-slate-950 uppercase">{selectedRecord.studentName}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-200 py-1">
                  <span>3. Date of leaving the institution:</span>
                  <span className="font-mono font-black text-slate-950">{selectedRecord.dateOfLeaving}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-200 py-1">
                  <span>4. Reason for Leaving:</span>
                  <span className="font-black text-slate-950">{selectedRecord.reason || 'Course Completed'}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-200 py-1">
                  <span>5. Conduct and Character:</span>
                  <span className="font-black text-emerald-700 uppercase">{selectedRecord.conduct}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-200 py-1">
                  <span>6. Institution Dues status:</span>
                  <span className="font-black text-slate-950">{selectedRecord.feeStatus || 'Cleared'}</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex justify-between pt-16 text-xs text-slate-500 font-black uppercase tracking-wider">
                <div className="text-center">
                  <div className="w-32 border-t border-slate-400 mt-4 pt-2">Prepared By</div>
                </div>
                <div className="text-center">
                  <div className="w-32 border-t border-slate-400 mt-4 pt-2">Principal Signature</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center text-slate-400 font-bold">
              Please select a student record to preview the certificate
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TC;
