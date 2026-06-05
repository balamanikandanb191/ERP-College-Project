import React from 'react';

function StaffTable({
  staffList = [],
  onEdit,
  onDelete,
  onRowClick
}) {

  if (!Array.isArray(staffList) || staffList.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center">

        <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-6">
          <span className="text-3xl">👨‍🏫</span>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          No Staff Found
        </h3>

        <p className="text-slate-500">
          There are no staff members matching your criteria or the database is empty.
        </p>

      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50 border-b border-slate-200">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                STAFF MEMBER
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                CONTACT
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                PROFESSIONAL INFO
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                STATUS
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                ACTIONS
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {staffList.map((staff) => (

              <tr
                key={staff.id}
                onClick={() => {
                  if (onRowClick) {
                    onRowClick(staff);
                  }
                }}
                className="hover:bg-slate-50 transition cursor-pointer"
              >

                {/* STAFF MEMBER */}
                <td className="px-6 py-5">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">

                      <img
                        src={
                          staff.photoUrl
                            ? `http://localhost:5000/${staff.photoUrl}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                staff.fullName || 'Staff'
                              )}`
                        }
                        alt={staff.fullName}
                        className="w-full h-full object-cover"
                      />

                    </div>

                    <div>

                      <h3 className="font-semibold text-slate-900">
                        {staff.fullName || 'N/A'}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {staff.staffId || 'No ID'}
                      </p>

                    </div>

                  </div>

                </td>

                {/* CONTACT */}
                <td className="px-6 py-5">

                  <div className="space-y-1">

                    <p className="text-sm text-slate-700">
                      {staff.email || 'No Email'}
                    </p>

                    <p className="text-sm text-slate-500">
                      {staff.phone || 'No Phone'}
                    </p>

                  </div>

                </td>

                {/* PROFESSIONAL INFO */}
                <td className="px-6 py-5">

                  <div>

                    <p className="font-medium text-slate-800">
                      {staff.designation || 'Staff'}
                    </p>

                    <p className="text-sm text-slate-500">
                      {staff.department || 'Department'}
                    </p>

                  </div>

                </td>

                {/* STATUS */}
                <td className="px-6 py-5">

                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    ACTIVE
                  </span>

                </td>

                {/* ACTIONS */}
                <td className="px-6 py-5">

                  <div className="flex items-center justify-end gap-2">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        if (onEdit) {
                          onEdit(staff);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl text-sm font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        if (onDelete) {
                          onDelete(staff.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl text-sm font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing {staffList.length} staff member(s)
        </p>
      </div>

    </div>
  );
}

export default StaffTable;