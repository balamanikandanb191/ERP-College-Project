import React, { useState, useEffect } from 'react';
import { X, Search, Filter, ShieldAlert, GraduationCap } from 'lucide-react';
import StudentCard from './StudentCard';

const EligibleStudentsModal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  students = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // ESC Key Support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Safe extraction
  const studentList = students ?? [];

  // Filter lists dynamically
  const filteredList = studentList.filter(student => {
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.reg?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || student.dept === selectedDept;

    return matchesSearch && matchesDept;
  });

  const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT'];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose} // Backdrop click close
    >
      <div 
        className="bg-white rounded-[40px] w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
      >
        
        {/* Header - Navy Gradient */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              <GraduationCap size={22} className="text-indigo-400" />
              Eligible Candidates Database
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Live database based on TPO Eligibility Engine filters
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter Section */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50 shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search by name or reg no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
        </div>

        {/* Scrollable Cards Grid */}
        <div className="p-6 overflow-y-auto flex-1 min-h-[300px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredList.map(student => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>

          {/* Empty State */}
          {filteredList.length === 0 && (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center h-full">
              <ShieldAlert size={40} className="mb-2 opacity-35" />
              <h4 className="font-black text-sm text-slate-700">No eligible students found</h4>
              <p className="text-xs mt-1 max-w-xs">Adjust your search parameters or check Eligibility Engine filters.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 flex justify-end shrink-0 bg-slate-50/50">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all text-xs cursor-pointer shadow-md shadow-slate-900/10"
          >
            Close Database
          </button>
        </div>

      </div>
    </div>
  );
};

export default EligibleStudentsModal;
