import React, { useState, useMemo } from 'react';
import { Search, Download, Calendar, Filter, FileText, CheckCircle, Flame, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';

const SEED_DATA = [
  { id: 'enq-101', name: 'Arun Prasath', phone: '9876543210', course: 'Computer Science', counselor: 'Priya Sharma', source: 'Website', status: 'Converted', date: '2026-05-23' },
  { id: 'enq-102', name: 'Kavitha Ram', phone: '9123456789', course: 'Information Technology', counselor: 'Priya Sharma', source: 'Walk-in', status: 'In-Progress', date: '2026-05-22' },
  { id: 'enq-103', name: 'Deepak Raj', phone: '8123456789', course: 'Electronics', counselor: 'Neha Gupta', source: 'Referral', status: 'Converted', date: '2026-05-20' },
  { id: 'enq-104', name: 'Sanjay Kumar', phone: '9444123456', course: 'Mechanical Engineering', counselor: 'Rohan Verma', source: 'Social Media', status: 'Lost', date: '2026-05-19' },
  { id: 'enq-105', name: 'Meera Nair', phone: '9555123456', course: 'Computer Science', counselor: 'Neha Gupta', source: 'Website', status: 'Converted', date: '2026-05-21' },
];

const COUNSELORS = ['All', 'Priya Sharma', 'Neha Gupta', 'Rohan Verma', 'Amit Singh'];
const SOURCES = ['All', 'Website', 'Walk-in', 'Referral', 'Social Media'];
const STATUSES = ['All', 'Converted', 'In-Progress', 'Lost'];

const EnquiryReport = () => {
  const [counselor, setCounselor] = useState('All');
  const [source, setSource] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const { records: data } = useMasterData('enquiry_report', SEED_DATA);

  const filtered = useMemo(() => {
    return data.filter(x => {
      const matchCounselor = counselor === 'All' || x.counselor === counselor;
      const matchSource = source === 'All' || x.source === source;
      const matchStatus = status === 'All' || x.status === status;
      const matchSearch = (x.name || '').toLowerCase().includes(search.toLowerCase()) || (x.course || '').toLowerCase().includes(search.toLowerCase());
      return matchCounselor && matchSource && matchStatus && matchSearch;
    });
  }, [counselor, source, status, search, data]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const converted = filtered.filter(x => x.status === 'Converted').length;
    const rate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0';
    return { total, converted, rate };
  }, [filtered]);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Phone,Course,Counselor,Source,Status,Date", ...filtered.map(x => `"${x.name}","${x.phone}","${x.course}","${x.counselor}","${x.source}","${x.status}","${x.date}"`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Admission_Enquiry_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report exported to CSV!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Admission Report</span>
            <h1 className="text-3xl font-black mt-2">Enquiry Consolidated Report</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Export, filter, and review conversion statistics for prospective student enquiries</p>
          </div>
          <button onClick={exportCSV} className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg">
            <Download size={18} /> Export Excel / CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Filtered Enquiries</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.total}</h3>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admissions Converted</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.converted}</h3>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admissions Conversion Rate</p>
          <h3 className="text-3xl font-black text-indigo-600 mt-1">{stats.rate}%</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 text-slate-400" size={15} />
          <input className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search report by student/course..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <select className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
            value={counselor} onChange={e => setCounselor(e.target.value)}>
            {COUNSELORS.map(c => <option key={c} value={c}>Counselor: {c}</option>)}
          </select>
          <select className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
            value={source} onChange={e => setSource(e.target.value)}>
            {SOURCES.map(s => <option key={s} value={s}>Source: {s}</option>)}
          </select>
          <select className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
            value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(st => <option key={st} value={st}>Status: {st}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-5 py-4">Student Name</th>
                <th className="px-5 py-4">Preferred Course</th>
                <th className="px-5 py-4">Assigned Counselor</th>
                <th className="px-5 py-4">Lead Source</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(x => (
                <tr key={x.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-800">{x.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{x.phone}</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-600 text-xs">{x.course}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{x.counselor}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-500">{x.source}</td>
                  <td className="px-5 py-4 text-xs font-mono font-bold text-slate-400">{x.date}</td>
                  <td className="px-5 py-4 text-right">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${x.status === 'Converted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : x.status === 'Lost' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {x.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="py-16 text-center text-slate-400 font-bold">No results found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnquiryReport;
