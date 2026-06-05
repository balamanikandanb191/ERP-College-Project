import React, { useState, useEffect } from 'react';
import { Search, Download, Calendar, Filter, FileText, CheckCircle, Flame, BarChart3, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const REPORTS_LIST = [
  { id: 'date', name: 'Date-Wise Enquiry Report', desc: 'Filter student enquiries logged between specific calendar dates' },
  { id: 'status', name: 'Status-Wise & Conversion', desc: 'Analyze conversion status: Confirmed, Follow-up, Interested, etc.' },
  { id: 'standard', name: 'Standard-Wise Demand', desc: 'Identify courses and standards with the highest applicant demand' },
  { id: 'source', name: 'Source-Wise Enquiry', desc: 'Understand marketing performance (Website, Walk-in, Referrals)' },
  { id: 'location', name: 'Location-Wise Report', desc: 'Review student distribution by cities, districts, and regions' },
  { id: 'tenant', name: 'Tenant-Wise Report', desc: 'Track admissions allocations and enquiries grouped by tenant ID' },
  { id: 'pending', name: 'Pending Follow-Up', desc: 'Review leads currently in Follow-up or Interested status' },
  { id: 'called', name: 'Called vs Not-Called', desc: 'Compare contacted leads with dials vs uncontacted records' },
  { id: 'hostel', name: 'Hostel Requirement', desc: 'View list of prospective applicants requesting residential accommodation' },
  { id: 'transport', name: 'Transport Requirement', desc: 'View student list requesting college transport/bus route accommodation' },
  { id: 'custom', name: 'Custom Multi-Filter', desc: 'Combine multiple filters, date ranges, and statuses into a custom report' }
];

const EnquiryReport = () => {
  const [selectedReport, setSelectedReport] = useState(null); // null means show dashboard grid
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('All');
  const [course, setCourse] = useState('All');
  const [source, setSource] = useState('All');
  const [location, setLocation] = useState('All');
  const [tenant, setTenant] = useState('All');
  const [calledFilter, setCalledFilter] = useState('All'); // 'All', 'true', 'false'
  const [hostelFilter, setHostelFilter] = useState('All'); // 'All', 'Yes', 'No'
  const [transportFilter, setTransportFilter] = useState('All'); // 'All', 'Yes', 'No'

  const loadReportData = async () => {
    if (!selectedReport) return;
    setLoading(true);

    try {
      const params = { limit: 200, search };

      // Set params based on report selection
      if (selectedReport.id === 'date') {
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
      } else if (selectedReport.id === 'status') {
        if (status !== 'All') params.status = status;
      } else if (selectedReport.id === 'standard') {
        if (course !== 'All') params.neededStandard = course;
      } else if (selectedReport.id === 'source') {
        if (source !== 'All') params.source = source;
      } else if (selectedReport.id === 'location') {
        if (location !== 'All') params.city = location;
      } else if (selectedReport.id === 'tenant') {
        if (tenant !== 'All') params.tenantId = tenant;
      } else if (selectedReport.id === 'pending') {
        // Only fetch follow-up or interested
        params.status = 'Follow-up'; // backend gets single status, so we will client-filter if needed or request it
      } else if (selectedReport.id === 'called') {
        if (calledFilter !== 'All') params.called = calledFilter;
      } else if (selectedReport.id === 'hostel') {
        if (hostelFilter !== 'All') params.hostel = hostelFilter;
        else params.hostel = 'Yes'; // Default to Yes for hostel report
      } else if (selectedReport.id === 'transport') {
        if (transportFilter !== 'All') params.transport = transportFilter;
        else params.transport = 'Yes'; // Default to Yes for transport report
      } else if (selectedReport.id === 'custom') {
        if (status !== 'All') params.status = status;
        if (course !== 'All') params.neededStandard = course;
        if (source !== 'All') params.source = source;
        if (location !== 'All') params.city = location;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
      }

      const res = await api.get('/enquiries', { params });
      if (res.data && res.data.success) {
        let resultData = res.data.data;

        // Perform secondary client-side filtering if needed (e.g. for pending: 'Follow-up' AND 'Interested')
        if (selectedReport.id === 'pending') {
          resultData = resultData.filter(x => x.status === 'Follow-up' || x.status === 'Interested');
        }

        setData(resultData);
      }
    } catch (error) {
      console.error('Failed to load report data:', error);
      toast.error('Failed to retrieve report data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [
    selectedReport,
    search,
    startDate,
    endDate,
    status,
    course,
    source,
    location,
    tenant,
    calledFilter,
    hostelFilter,
    transportFilter
  ]);

  const resetFilters = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setStatus('All');
    setCourse('All');
    setSource('All');
    setLocation('All');
    setTenant('All');
    setCalledFilter('All');
    setHostelFilter('All');
    setTransportFilter('All');
  };

  const handleReportSelect = (report) => {
    resetFilters();
    setSelectedReport(report);
  };

  const exportCSV = () => {
    if (data.length === 0) {
      toast.error('No records available to export.');
      return;
    }
    const headers = [
      'EQID',
      'Student Name',
      'Phone',
      'Parent Name',
      'Parent Phone',
      'Course Preference',
      'Reg No',
      'Source',
      'City',
      'Tenant ID',
      'Staff ID',
      'Staff Name',
      'Status',
      'Calls Placed',
      'Hostel',
      'Transport',
      'Date'
    ];
    
    const rows = data.map(x => [
      x.eqid,
      x.studentName,
      x.mobileNo,
      x.parentName,
      x.parentMobile,
      x.neededStandard,
      x.studentRegNo || '-',
      x.source,
      x.city || x.district,
      x.tenantId || 'Tenant',
      x.staffId || 'Unassigned',
      x.staffName || 'Unassigned',
      x.status,
      x.calls || 0,
      x.hostel,
      x.transport,
      x.enquiryDate
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Admission_${selectedReport.name.replace(/\s+/g, '_')}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report exported to CSV!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
              {selectedReport ? `Enquiry Analytics / ${selectedReport.name}` : 'Enquiry consolidated reports'}
            </span>
            <h1 className="text-3xl font-black mt-2">
              {selectedReport ? selectedReport.name : 'Enquiry Reports & Analytics'}
            </h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">
              {selectedReport ? selectedReport.desc : 'Comprehensive insights into your admission funnel, tele-caller performance, and campaign sources'}
            </p>
          </div>
          {selectedReport && (
            <div className="flex gap-2">
              <button 
                onClick={exportCSV} 
                className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg cursor-pointer transition-colors"
              >
                <Download size={18} /> Export Excel / CSV
              </button>
              <button 
                onClick={() => setSelectedReport(null)}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 rounded-2xl text-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowLeft size={18} /> Back
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RENDER REPORT DASHBOARD GRID (IF NO SELECTED REPORT) */}
      {!selectedReport ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPORTS_LIST.map((r, i) => (
            <div key={r.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-indigo-100 transition-all flex flex-col justify-between space-y-4 group">
              <div>
                <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 inline-block">
                  <FileText size={20} />
                </span>
                <h3 className="font-black text-slate-800 text-base mt-4 group-hover:text-indigo-600 transition-colors">{r.name}</h3>
                <p className="text-slate-400 text-xs font-semibold mt-1 leading-relaxed">{r.desc}</p>
              </div>
              <button 
                onClick={() => handleReportSelect(r)}
                className="w-full py-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-100"
              >
                View Report <ArrowLeft className="rotate-180" size={13} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* RENDER DETAILED REPORT TABLE VIEW */
        <div className="space-y-6">
          {/* Specific Filters Row based on report type */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-wrap gap-4 items-center">
            
            {/* Global search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-3 text-slate-400" size={15} />
              <input 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                placeholder="Search report records..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>

            {/* Date-wise report specific parameters */}
            {selectedReport.id === 'date' && (
              <div className="flex gap-2 items-center text-xs font-bold text-slate-500">
                <span className="shrink-0">Start Date:</span>
                <input type="date" className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <span className="shrink-0">End Date:</span>
                <input type="date" className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            )}

            {/* Status-wise report specific parameters */}
            {selectedReport.id === 'status' && (
              <select className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
                value={status} onChange={e => setStatus(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Interested">Interested</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Rejected">Rejected</option>
                <option value="Closed">Closed</option>
              </select>
            )}

            {/* Standard-wise report specific parameters */}
            {selectedReport.id === 'standard' && (
              <select className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
                value={course} onChange={e => setCourse(e.target.value)}>
                <option value="All">All Courses</option>
                <option value="B.E. Computer Science">B.E. Computer Science</option>
                <option value="B.Tech Information Tech">B.Tech Information Tech</option>
                <option value="B.E. Electronics">B.E. Electronics</option>
                <option value="B.E. Mechanical">B.E. Mechanical</option>
                <option value="B.Pharmacy">B.Pharmacy</option>
                <option value="B.Sc Agriculture">B.Sc Agriculture</option>
              </select>
            )}

            {/* Source-wise report specific parameters */}
            {selectedReport.id === 'source' && (
              <select className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
                value={source} onChange={e => setSource(e.target.value)}>
                <option value="All">All Sources</option>
                <option value="Website">Website</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Advertisement">Advertisement</option>
              </select>
            )}

            {/* Location-wise report specific parameters */}
            {selectedReport.id === 'location' && (
              <select className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
                value={location} onChange={e => setLocation(e.target.value)}>
                <option value="All">All Locations</option>
                <option value="Perambalur">Perambalur</option>
                <option value="Namakkal">Namakkal</option>
                <option value="Salem">Salem</option>
                <option value="Trichy">Trichy</option>
                <option value="Chennai">Chennai</option>
              </select>
            )}

            {/* Tenant-wise report specific parameters */}
            {selectedReport.id === 'tenant' && (
              <select className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
                value={tenant} onChange={e => setTenant(e.target.value)}>
                <option value="All">All Tenants</option>
                <option value="Tenant">Tenant</option>
                <option value="Tenant 1">Tenant 1</option>
              </select>
            )}

            {/* Called vs Not Called report specific parameters */}
            {selectedReport.id === 'called' && (
              <select className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
                value={calledFilter} onChange={e => setCalledFilter(e.target.value)}>
                <option value="All">All Call Status</option>
                <option value="true">Called Leads (Calls &gt; 0)</option>
                <option value="false">Not Called Leads (Calls = 0)</option>
              </select>
            )}

            {/* Hostel report specific parameters */}
            {selectedReport.id === 'hostel' && (
              <select className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
                value={hostelFilter} onChange={e => setHostelFilter(e.target.value)}>
                <option value="All">All Residential Choice</option>
                <option value="Yes">Requested Hostel (Yes)</option>
                <option value="No">No Hostel Required (No)</option>
              </select>
            )}

            {/* Transport report specific parameters */}
            {selectedReport.id === 'transport' && (
              <select className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
                value={transportFilter} onChange={e => setTransportFilter(e.target.value)}>
                <option value="All">All Transport Choice</option>
                <option value="Yes">Requested Transport (Yes)</option>
                <option value="No">No Transport Required (No)</option>
              </select>
            )}

            {/* Custom Multi-Filter Report Parameters */}
            {selectedReport.id === 'custom' && (
              <div className="flex flex-wrap gap-2">
                <select className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
                  value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="All">Status: All</option>
                  <option value="New">New</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Interested">Interested</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
                <select className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
                  value={course} onChange={e => setCourse(e.target.value)}>
                  <option value="All">Course: All</option>
                  <option value="B.E. Computer Science">Computer Science</option>
                  <option value="B.Tech Information Tech">Information Tech</option>
                  <option value="B.Pharmacy">Pharmacy</option>
                </select>
                <select className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none"
                  value={source} onChange={e => setSource(e.target.value)}>
                  <option value="All">Source: All</option>
                  <option value="Website">Website</option>
                  <option value="Walk-in">Walk-in</option>
                </select>
                <input type="date" className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
            )}
            
            <button 
              onClick={resetFilters}
              className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:text-indigo-600 text-xs font-bold rounded-xl hover:bg-slate-50 flex items-center gap-1 cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>

          {/* Results Summary Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center text-xs font-bold text-slate-500">
            <div>Total matching records found: <span className="text-slate-800 text-sm font-black">{data.length}</span></div>
            <div className="flex items-center gap-1.5"><RefreshCw size={13} className="text-slate-400" /> Live database connection</div>
          </div>

          {/* Detailed Data Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-5 py-4">EQID</th>
                    <th className="px-5 py-4">Student Name</th>
                    <th className="px-5 py-4">Preferred Course</th>
                    <th className="px-5 py-4">City / Region</th>
                    <th className="px-5 py-4">Counselor Assigned</th>
                    <th className="px-5 py-4">Source</th>
                    <th className="px-5 py-4">Calls</th>
                    <th className="px-5 py-4">Hostel / Bus</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="py-16 text-center text-slate-400 font-bold">Querying reports data from backend...</td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-16 text-center text-slate-400 font-bold">No matching records found in database</td>
                    </tr>
                  ) : (
                    data.map(x => (
                      <tr key={x.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 text-xs font-black text-indigo-600 font-mono">{x.eqid}</td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-800">{x.studentName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{x.mobileNo}</div>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-600 text-xs">{x.neededStandard}</td>
                        <td className="px-5 py-4 text-xs font-semibold text-slate-500">{x.city || x.district}</td>
                        <td className="px-5 py-4 font-bold text-slate-600 text-xs">{x.staffName || 'Unassigned'}</td>
                        <td className="px-5 py-4 text-xs font-semibold text-slate-500">{x.source}</td>
                        <td className="px-5 py-4 font-mono font-black text-slate-900">{x.calls || 0}</td>
                        <td className="px-5 py-4 text-xs font-semibold text-slate-400">
                          H: {x.hostel || 'No'} / B: {x.transport || 'No'}
                        </td>
                        <td className="px-5 py-4 text-xs font-mono font-bold text-slate-400">{x.enquiryDate}</td>
                        <td className="px-5 py-4 text-right">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                            x.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            x.status === 'Follow-up' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            x.status === 'Interested' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            x.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            x.status === 'Closed' ? 'bg-slate-100 text-slate-600 border-slate-300' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {x.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryReport;
