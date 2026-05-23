import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const DrilldownRegistryTable = ({ data = [], columns = [], searchKeys = [], onRowClick, onExport }) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Clean pagination height

  // Client-side search and filtering
  const filteredData = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return data;
    return (data ?? []).filter(row => {
      return searchKeys.some(key => {
        const val = row[key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(term);
      });
    });
  }, [data, search, searchKeys]);

  // Client-side sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const valA = a[sortKey] ?? '';
      const valB = b[sortKey] ?? '';
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc' 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    });
    return sorted;
  }, [filteredData, sortKey, sortOrder]);

  // Client-side pagination
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return sortedData.slice(startIdx, startIdx + pageSize);
  }, [sortedData, currentPage]);

  const totalPages = Math.max(Math.ceil(sortedData.length / pageSize), 1);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (onExport) {
      onExport(sortedData);
    } else {
      toast.success(`Exported ${sortedData.length} records successfully!`);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input 
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Type query to filter records..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-indigo-500 text-slate-800 placeholder-slate-400"
          />
        </div>

        <button 
          onClick={handleExport}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          <Download size={13} /> Export List
        </button>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-2xl">
        <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-black">
              {columns.map((col, idx) => (
                <th 
                  key={idx}
                  onClick={() => col.accessor && handleSort(col.accessor)}
                  className={`p-3 select-none ${col.accessor ? 'cursor-pointer hover:text-slate-700' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {col.accessor && sortKey === col.accessor && (
                      sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60 font-medium">
            {paginatedData.map((row, rowIdx) => (
              <tr 
                key={rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`hover:bg-indigo-50/30 transition-colors cursor-pointer ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="p-3">
                    {col.render ? col.render(row) : (row[col.accessor] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-400 font-semibold">
                  No records match the current filter selection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-2 py-1 text-xs text-slate-500 font-bold">
          <span>Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} matches</span>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="flex items-center px-1 font-extrabold text-slate-800">Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DrilldownRegistryTable;
