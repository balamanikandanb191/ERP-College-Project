import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, Calendar, Phone, Mail, Award, Check, User, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { confirmDelete } from '../utils/confirmToast';

const DISTRICTS = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kallakurichi',
  'Kanchipuram',
  'Kanyakumari',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivaganga',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupathur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar',
  'Other'
];
const COMMUNITIES = ['BC', 'MBC', 'SC/ST', 'OC', 'DNC'];
const SCHOOL_TYPES = ['Government', 'Govt Aided', 'Private', 'CBSE', 'Other'];
const STANDARDS = ['10th Standard', '11th Standard', '12th Standard', 'Graduate', 'Other'];
const COURSES = [
  'B.E. Computer Science',
  'B.Tech Information Tech',
  'B.E. Electronics',
  'B.E. Mechanical',
  'B.Pharmacy',
  'B.Sc Agriculture',
  'Other'
];
const SOURCES = ['Website', 'Walk-in', 'Referral', 'Social Media', 'Advertisement', 'Exhibition', 'Other'];
const STATUSES = ['New', 'Follow-up', 'Interested', 'Confirmed', 'Rejected', 'Closed'];

const INITIAL_FORM = {
  studentName: '',
  mobileNo: '',
  parentName: '',
  parentMobile: '',
  doorNo: '',
  streetName: '',
  village: '',
  post: '',
  taluk: '',
  district: DISTRICTS[0],
  pinCode: '',
  annualIncome: '',
  community: COMMUNITIES[0],
  schoolType: SCHOOL_TYPES[0],
  currentStandard: STANDARDS[0],
  neededStandard: COURSES[0],
  studentRegNo: '',
  source: SOURCES[0],
  transport: 'No',
  hostel: 'No',
  status: 'New',
  schoolName: '',
  schoolAddress: '',
  city: '',
  notes: ''
};

const StudentEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [dbDistricts, setDbDistricts] = useState(DISTRICTS);
  const [dbCastes, setDbCastes] = useState(COMMUNITIES);

  const fetchMasters = async () => {
    try {
      const [casteRes, distRes] = await Promise.all([
        api.get('/masters/caste'),
        api.get('/masters/district')
      ]);
      if (casteRes.data && casteRes.data.length > 0) {
        setDbCastes(casteRes.data.map(item => item.data.casteName));
      }
      if (distRes.data && distRes.data.length > 0) {
        setDbDistricts(distRes.data.map(item => item.data.districtName));
      }
    } catch (error) {
      console.warn('Could not load caste/district masters from DB, using fallback arrays:', error);
    }
  };

  useEffect(() => {
    fetchMasters();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/enquiries', {
        params: { search, limit: 100 }
      });
      if (response.data && response.data.success) {
        setEnquiries(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
      toast.error('Failed to load enquiries from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [search]);

  const validateForm = () => {
    const required = [
      { key: 'studentName', label: 'Student Name' },
      { key: 'mobileNo', label: 'Mobile Number' },
      { key: 'parentName', label: 'Parent Name' },
      { key: 'parentMobile', label: 'Parent Mobile Number' },
      { key: 'doorNo', label: 'Door No' },
      { key: 'streetName', label: 'Street Name' },
      { key: 'village', label: 'Village' },
      { key: 'post', label: 'Post' },
      { key: 'taluk', label: 'Taluk' },
      { key: 'district', label: 'District' },
      { key: 'pinCode', label: 'Pin Code' },
      { key: 'annualIncome', label: 'Annual Income' },
      { key: 'community', label: 'Community' },
      { key: 'schoolType', label: 'School Type' },
      { key: 'currentStandard', label: 'Current Standard' },
      { key: 'neededStandard', label: 'Needed Standard' },
      { key: 'studentRegNo', label: 'Student Registration Number' },
      { key: 'source', label: 'Enquiry Source' },
      { key: 'schoolName', label: 'School Name' },
      { key: 'schoolAddress', label: 'School Address' }
    ];

    for (const field of required) {
      if (!form[field.key] || String(form[field.key]).trim() === '') {
        toast.error(`${field.label} is required`);
        return false;
      }
    }

    if (!/^\d{10}$/.test(form.mobileNo)) {
      toast.error('Mobile Number must be exactly 10 digits');
      return false;
    }
    if (!/^\d{10}$/.test(form.parentMobile)) {
      toast.error('Parent Mobile must be exactly 10 digits');
      return false;
    }
    if (!/^\d{6}$/.test(form.pinCode)) {
      toast.error('Pin Code must be exactly 6 digits');
      return false;
    }

    return true;
  };

  const submit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = { ...form };
      if (!payload.city) {
        payload.city = payload.village || payload.district;
      }

      if (editing) {
        const res = await api.put(`/enquiries/${editing.id}`, payload);
        if (res.data && res.data.success) {
          toast.success('Enquiry updated successfully!');
          fetchEnquiries();
          setShowModal(false);
          setEditing(null);
        }
      } else {
        const res = await api.post('/enquiries', payload);
        if (res.data && res.data.success) {
          toast.success(`Enquiry registered with EQID: ${res.data.data.eqid}`);
          fetchEnquiries();
          setShowModal(false);
          setEditing(null);
        }
      }
    } catch (error) {
      console.error('Failed to submit enquiry:', error);
      const msg = error.response?.data?.message || 'Failed to register student enquiry.';
      toast.error(msg);
    }
  };

  const del = async id => {
    confirmDelete(async () => {
      try {
        const res = await api.delete(`/enquiries/${id}`);
        if (res.data && res.data.success) {
          toast.success('Enquiry deleted successfully!');
          fetchEnquiries();
        }
      } catch (error) {
        toast.error('Failed to delete enquiry');
      }
    }, 'Are you sure you want to delete this student enquiry?');
  };

  const openEdit = r => {
    setEditing(r);
    setForm({ ...r });
    setShowModal(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(INITIAL_FORM);
    setShowModal(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">Admissions & Enquiry</span>
            <h1 className="text-3xl font-black mt-2">Student Enquiry Registration</h1>
            <p className="text-indigo-200 text-xs font-semibold mt-1">Capture, validate, and record details of new prospective admissions</p>
          </div>
          <button onClick={openNew}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg cursor-pointer transition-colors"><Plus size={18} /> Register Enquiry</button>
        </div>
      </div>

      {showModal ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden animate-slide-in">
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-800">{editing ? `Edit Enquiry (${form.eqid})` : 'New Student Enquiry Registration'}</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Please fill out all mandatory fields marked with an asterisk (*)</p>
            </div>
            <button onClick={() => { setShowModal(false); setEditing(null); }} className="p-2 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"><X size={18} /></button>
          </div>
          <form onSubmit={submit} className="p-6 space-y-6">
            
            {/* Form Section: Student Details */}
            <div>
              <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 border-b border-indigo-50 pb-1.5 flex items-center gap-1.5"><User size={13} /> 1. Personal & Academic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Student Name *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter student's full name" value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Mobile No *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="10-digit mobile number" value={form.mobileNo} onChange={e => setForm({ ...form, mobileNo: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Student Reg. No *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Registration/HSC Roll number" value={form.studentRegNo} onChange={e => setForm({ ...form, studentRegNo: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Parent Name *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Father or mother name" value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Parent Mobile *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Parent's mobile number" value={form.parentMobile} onChange={e => setForm({ ...form, parentMobile: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Annual Income *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 1,50,000" value={form.annualIncome} onChange={e => setForm({ ...form, annualIncome: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Community *</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.community} onChange={e => setForm({ ...form, community: e.target.value })}>{dbCastes.map(c => <option key={c} value={c}>{c}</option>)}</select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Current Standard *</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.currentStandard} onChange={e => setForm({ ...form, currentStandard: e.target.value })}>{STANDARDS.map(s => <option key={s} value={s}>{s}</option>)}</select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Needed Standard *</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.neededStandard} onChange={e => setForm({ ...form, neededStandard: e.target.value })}>{COURSES.map(c => <option key={c} value={c}>{c}</option>)}</select>
                </div>
              </div>
            </div>

            {/* Form Section: Address Details */}
            <div>
              <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 border-b border-indigo-50 pb-1.5 flex items-center gap-1.5"><MapPin size={13} /> 2. Address & Location Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Door No *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 12/A" value={form.doorNo} onChange={e => setForm({ ...form, doorNo: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Street Name *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Street/Road name" value={form.streetName} onChange={e => setForm({ ...form, streetName: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Village *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Village name" value={form.village} onChange={e => setForm({ ...form, village: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Post *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Post office name" value={form.post} onChange={e => setForm({ ...form, post: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Taluk *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Taluk name" value={form.taluk} onChange={e => setForm({ ...form, taluk: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">District *</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })}>{dbDistricts.map(d => <option key={d} value={d}>{d}</option>)}</select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Pin Code *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="6-digit PIN code" value={form.pinCode} onChange={e => setForm({ ...form, pinCode: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">City / Town (Optional)</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="City name" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Form Section: Previous School Details */}
            <div>
              <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 border-b border-indigo-50 pb-1.5">3. Previous School details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">School Type *</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.schoolType} onChange={e => setForm({ ...form, schoolType: e.target.value })}>{SCHOOL_TYPES.map(st => <option key={st} value={st}>{st}</option>)}</select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">School Name *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter previous school name" value={form.schoolName} onChange={e => setForm({ ...form, schoolName: e.target.value })} />
                </div>
                <div className="col-span-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">School Address *</label>
                  <textarea rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Full address of the previous school" value={form.schoolAddress} onChange={e => setForm({ ...form, schoolAddress: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Form Section: Miscellaneous Preferences */}
            <div>
              <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 border-b border-indigo-50 pb-1.5">4. Preferences & Pipeline Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Enquiry Source *</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>{SOURCES.map(s => <option key={s} value={s}>{s}</option>)}</select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Transport Required *</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none" value={form.transport} onChange={e => setForm({ ...form, transport: e.target.value })}><option value="Yes">Yes</option><option value="No">No</option></select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Hostel Required *</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none" value={form.hostel} onChange={e => setForm({ ...form, hostel: e.target.value })}><option value="Yes">Yes</option><option value="No">No</option></select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Status *</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{STATUSES.map(st => <option key={st} value={st}>{st}</option>)}</select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Tenant ID (Optional)</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none" placeholder="Tenant" value={form.tenantId} onChange={e => setForm({ ...form, tenantId: e.target.value })} />
                </div>
                <div className="col-span-5">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Follow-up Notes / Dialing Remarks</label>
                  <textarea rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="Enter any initial conversation remarks..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20 transition-all"><Save size={16} />{editing ? 'Update Record' : 'Save Enquiry'}</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-4 bg-slate-50/30">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 text-slate-400" size={15} />
              <input className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search by name, phone, reg no, or EQID..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-5 py-4">EQID</th>
                  <th className="px-5 py-4">Student Name</th>
                  <th className="px-5 py-4">Phone / Parent Phone</th>
                  <th className="px-5 py-4">Needed Course</th>
                  <th className="px-5 py-4">Source</th>
                  <th className="px-5 py-4">City / Location</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400 font-bold">Loading enquiries...</td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400 font-bold">No enquiries registered in the database</td>
                  </tr>
                ) : (
                  enquiries.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-5 py-4 text-xs font-black text-indigo-600 font-mono">{r.eqid}</td>
                      <td className="px-5 py-4 font-black text-slate-800">{r.studentName}</td>
                      <td className="px-5 py-4">
                        <div className="text-slate-700 font-semibold">{r.mobileNo}</div>
                        <div className="text-[11px] text-slate-400">Parent: {r.parentMobile}</div>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-600 text-xs">{r.neededStandard}</td>
                      <td className="px-5 py-4 text-xs font-semibold text-slate-500">{r.source}</td>
                      <td className="px-5 py-4 text-xs font-semibold text-slate-500">{r.city || r.district}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          r.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          r.status === 'Follow-up' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          r.status === 'Interested' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          r.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          r.status === 'Closed' ? 'bg-slate-100 text-slate-600 border-slate-300' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>{r.status}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(r)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg cursor-pointer"><Edit2 size={14} /></button>
                          <button onClick={() => del(r.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEnquiry;
