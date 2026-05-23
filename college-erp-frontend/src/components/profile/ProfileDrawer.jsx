import React, { useState } from 'react';

import {
  X,
  User,
  Users,
  Shield,
  GraduationCap,
  Building,
  Phone,
  Mail,
  Calendar,
  FileText,
  Droplets,
  MapPin,
  Activity,
  Briefcase,
  DollarSign,
  Bus
} from 'lucide-react';

import IDCardPreview from '../idcard/IDCardPreview';
import DocumentManager from './DocumentManager';

const ProfileDrawer = ({ isOpen, onClose, data, type }) => {

  const [activeTab, setActiveTab] = useState('idcard');

  if (!isOpen || !data) return null;

  const isStudent = type === 'Student';

  const idNumber = isStudent
    ? data.registerNumber
    : data.staffId;

  const studentTabs = [
    { id: 'profile', label: 'Student Profile' },
    { id: 'academic', label: 'Academic Details' },
    { id: 'docs', label: 'Documents' },
    { id: 'idcard', label: 'Digital ID Card' }
  ];

  const staffTabs = [
    { id: 'profile', label: 'Staff Profile' },
    { id: 'employment', label: 'Employment' },
    { id: 'salary', label: 'Salary & Bank' },
    { id: 'docs', label: 'Documents' },
    { id: 'idcard', label: 'Digital ID Card' }
  ];

  const tabs = isStudent ? studentTabs : staffTabs;

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
      >

        {/* HEADER */}
        <div className="p-6 pb-0 bg-slate-50 border-b border-slate-100 shrink-0">

          <div className="flex justify-between items-start mb-6">

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 p-1 overflow-hidden shrink-0">

                <img
                  src={
                    data.photoUrl
                      ? `http://localhost:5000/${data.photoUrl}`
                      : 'https://ui-avatars.com/api/?name=' +
                        encodeURIComponent(data.fullName || 'User')
                  }
                  alt="Profile"
                  className="w-full h-full object-cover rounded-xl"
                />

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {data.fullName}
                  </h2>

                  {isStudent && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                        data.admissionStatus === 'Approved'
                          ? 'bg-emerald-100 text-emerald-600'
                          : data.admissionStatus === 'Rejected'
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      {data.admissionStatus || 'Pending'}
                    </span>
                  )}

                </div>

                <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">

                  {isStudent ? (
                    <GraduationCap size={14} className="text-indigo-500" />
                  ) : (
                    <Shield size={14} className="text-emerald-500" />
                  )}

                  {idNumber}

                </p>

              </div>

            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>

          </div>

          {/* TABS */}
          <div className="flex gap-1 overflow-x-auto">

            {tabs.map((tab) => (

              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>

            ))}

          </div>

        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">

          {/* ID CARD */}
          {activeTab === 'idcard' && (
            <div>

              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                Digital ID Preview
              </h3>

              <IDCardPreview
                type={type}
                data={data}
              />

            </div>
          )}

          {/* PROFILE */}
          {activeTab === 'profile' && (

            <div className="space-y-6">

              <div>

                <h3 className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[2px] flex items-center gap-2">

                  <User size={14} className="text-indigo-500" />

                  Personal Information

                </h3>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">

                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                      Gender
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {data.gender || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                      Blood Group
                    </p>
                    <p className="text-sm font-bold text-red-600">
                      {data.bloodGroup || 'O+'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                      Phone
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {data.phone || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                      Email
                    </p>
                    <p className="text-sm font-bold text-slate-900 break-all">
                      {data.email || 'N/A'}
                    </p>
                  </div>

                </div>

              </div>

            </div>

          )}

          {/* EMPLOYMENT */}
          {activeTab === 'employment' && !isStudent && (

            <div className="space-y-4">

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

                <h3 className="font-bold text-blue-900 mb-3">
                  Employment Details
                </h3>

                <div className="space-y-3">

                  <div className="flex justify-between">
                    <span className="text-slate-500">Department</span>
                    <span className="font-semibold">{data.department}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Designation</span>
                    <span className="font-semibold">{data.designation}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Experience</span>
                    <span className="font-semibold">
                      {data.experienceYears || 0} Years
                    </span>
                  </div>

                </div>

              </div>

            </div>

          )}

          {/* SALARY */}
          {activeTab === 'salary' && !isStudent && (

            <div className="space-y-4">

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">

                <h3 className="font-bold text-emerald-900 mb-3">
                  Salary & Bank Details
                </h3>

                <div className="space-y-3">

                  <div className="flex justify-between">
                    <span className="text-slate-500">Salary</span>
                    <span className="font-semibold">
                      ₹{data.salary || 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank</span>
                    <span className="font-semibold">
                      {data.bankName || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Account No</span>
                    <span className="font-semibold">
                      {data.accountNumber || 'N/A'}
                    </span>
                  </div>

                </div>

              </div>

            </div>

          )}

          {/* ACADEMIC */}
          {activeTab === 'academic' && isStudent && (

            <div className="space-y-4">

              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">

                <h3 className="font-bold text-indigo-900 mb-3">
                  Academic Details
                </h3>

                <div className="space-y-3">

                  <div className="flex justify-between">
                    <span className="text-slate-500">Department</span>
                    <span className="font-semibold">
                      {data.department}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Year</span>
                    <span className="font-semibold">
                      {data.year || data.academicYear}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Semester</span>
                    <span className="font-semibold">
                      {data.semester}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Section</span>
                    <span className="font-semibold">
                      {data.section}
                    </span>
                  </div>

                </div>

              </div>

            </div>

          )}

          {/* DOCUMENTS */}
          {activeTab === 'docs' && (

            <DocumentManager
              type={type}
              data={data}
            />

          )}

        </div>

      </div>

    </>
  );
};

export default ProfileDrawer;