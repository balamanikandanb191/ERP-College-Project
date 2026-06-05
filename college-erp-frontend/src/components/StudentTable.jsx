import React from 'react';
import { Edit2, Trash2, MoreVertical, Mail, Phone, GraduationCap } from 'lucide-react';

const StudentTable = ({ students, onEdit, onDelete, onRowClick }) => {
  if (!students || students.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
          <GraduationCap className="text-slate-400" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">No Students Found</h3>
        <p className="text-slate-500 max-w-sm mx-auto text-sm">
          There are no students matching your criteria or the database is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200/80">
          <tr>
            <th scope="col" className="px-6 py-4 font-bold tracking-wider rounded-tl-xl">Student</th>
            <th scope="col" className="px-6 py-4 font-bold tracking-wider">Contact</th>
            <th scope="col" className="px-6 py-4 font-bold tracking-wider">Academic Info</th>
            <th scope="col" className="px-6 py-4 font-bold tracking-wider">Admission Status</th>
            <th scope="col" className="px-6 py-4 font-bold tracking-wider">Attendance</th>
            <th scope="col" className="px-6 py-4 font-bold tracking-wider rounded-tr-xl text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {(Array.isArray(students) ? students : []).map((student) => (
            <tr
              key={student.id}
              className="bg-white hover:bg-slate-50/80 transition-colors group cursor-pointer"
              onClick={() => onRowClick && onRowClick(student)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm overflow-hidden shrink-0">
                    {student.photoUrl ? (
                      <img
                        src={`http://localhost:5000/${student.photoUrl}`}
                        alt={student.fullName || student.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=250&auto=format&fit=crop';
                        }}
                      />
                    ) : (
                      (student.fullName || student.name || '?').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{student.fullName || student.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{student.registerNumber}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-xs text-slate-600 font-medium">
                    <Mail size={12} className="mr-1.5 text-slate-400" />
                    {student.email || 'N/A'}
                  </div>
                  <div className="flex items-center text-xs text-slate-600 font-medium">
                    <Phone size={12} className="mr-1.5 text-slate-400" />
                    {student.phone || 'N/A'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700">{student.department}</span>
                  <span className="text-xs text-slate-500 font-medium">{student.year} • {student.semester}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${student?.admissionStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      student?.admissionStatus === 'Verified' ? 'bg-indigo-100 text-indigo-700' :
                        student?.admissionStatus === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                          'bg-amber-100 text-amber-700'
                    }`}>
                    {student?.admissionStatus || 'Pending'}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-center ${student?.feesPaid === 'Paid' ? 'text-emerald-500' : 'text-amber-500'
                    }`}>
                    {student?.feesPaid} Fees
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${student?.attendancePercentage >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${student?.attendancePercentage || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-slate-600">{student?.attendancePercentage || 0}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(student); }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(student.id); }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
