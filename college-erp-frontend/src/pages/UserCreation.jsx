import React, { useState } from 'react';
import { Plus, Search, Shield, User, Users, Eye, EyeOff, Trash2, Edit2, Check, X, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMasterData } from '../hooks/useMasterData';

const ROLES = ['Admin', 'Staff', 'Teacher', 'Student', 'Parent'];
const ROLE_COLORS = {
  'Admin': 'bg-violet-100 text-violet-700 border-violet-200',
  'Super Admin': 'bg-rose-100 text-rose-700 border-rose-200',
  'Staff': 'bg-blue-100 text-blue-700 border-blue-200',
  'Teacher': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Student': 'bg-amber-100 text-amber-700 border-amber-200',
  'Parent': 'bg-pink-100 text-pink-700 border-pink-200',
};

const SEED_USERS = [
  { id: 'u-001', name: 'Dr. Amit Sharma', email: 'amit.sharma@edu.in', role: 'Admin', status: 'Active', lastLogin: '23 May 2026, 09:12 AM' },
  { id: 'u-002', name: 'Prof. Sneha Iyer', email: 'sneha.iyer@edu.in', role: 'Teacher', status: 'Active', lastLogin: '23 May 2026, 08:45 AM' },
  { id: 'u-003', name: 'Rajesh Kumar', email: 'rajesh.kumar@edu.in', role: 'Staff', status: 'Active', lastLogin: '22 May 2026, 04:30 PM' },
  { id: 'u-004', name: 'Priya Mehta', email: 'priya.m@students.edu.in', role: 'Student', status: 'Active', lastLogin: '23 May 2026, 07:55 AM' },
  { id: 'u-005', name: 'Ramesh Nair', email: 'ramesh.nair@edu.in', role: 'Parent', status: 'Inactive', lastLogin: '15 May 2026, 11:00 AM' },
];

const emptyForm = { name: '', email: '', role: 'Staff', password: '', status: 'Active' };

const UserCreation = () => {
  const { records: users, addRecord, updateRecord, deleteRecord } = useMasterData('user_creation', SEED_USERS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
    if (editing) {
      const res = await updateRecord(editing.id, form);
      if (res.success) toast.success('User updated successfully!');
    } else {
      const entry = { ...form, lastLogin: 'Never' };
      const res = await addRecord(entry);
      if (res.success) toast.success('User created successfully!');
    }
    setShowModal(false); setForm(emptyForm); setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    const res = await deleteRecord(id);
    if (res.success) toast.success('User removed.');
  };

  const toggleStatus = async (id) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const entry = { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' };
    const res = await updateRecord(id, entry);
    if (res.success) toast.success('Status updated!');
  };

  const openEdit = (user) => { setEditing(user); setForm({ name: user.name, email: user.email, role: user.role, password: '', status: user.status }); setShowModal(true); };
  const filtered = users.filter(u => (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase()) || (u.role || '').toLowerCase().includes(search.toLowerCase()));
  const counts = ROLES.reduce((a, r) => ({ ...a, [r]: users.filter(u => u.role === r).length }), {});

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
              <Shield size={30} className="text-violet-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-300 bg-violet-500/20 px-3 py-1 rounded-full border border-violet-500/30">File Module</span>
              <h1 className="text-3xl font-black mt-2 tracking-tight">User Creation</h1>
              <p className="text-slate-400 text-xs font-semibold mt-1">Manage ERP system users, roles, and access credentials</p>
            </div>
          </div>
          <button onClick={() => { setEditing(null); setForm(emptyForm); setShowModal(true); }}
            className="px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg shadow-violet-500/20 transition-all">
            <Plus size={18} /> Create User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {ROLES.map(role => (
          <div key={role} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role}s</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{counts[role] || 0}</h3>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border mt-2 inline-block ${ROLE_COLORS[role]}`}>{role}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span className="text-xs font-bold text-slate-500 ml-auto">{filtered.length} users</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Last Login</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{user.name}</p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${ROLE_COLORS[user.role] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{user.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleStatus(user.id)}
                      className={`flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-full border transition-colors ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'}`}>
                      {user.status === 'Active' ? <Check size={11} /> : <X size={11} />} {user.status}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400 font-semibold">{user.lastLogin}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { toast.success(`Password reset link sent to ${user.email}`); }} className="p-1.5 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-all" title="Reset Password"><KeyRound size={15} /></button>
                      <button onClick={() => openEdit(user)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all" title="Edit"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(user.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all" title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-5 py-16 text-center text-slate-400 font-bold">No users found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">{editing ? 'Edit User' : 'Create New User'}</h3>
              <button onClick={() => { setShowModal(false); setEditing(null); }} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1">Full Name *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Dr. John Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1">Email Address *</label>
                  <input type="email" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="user@edu.in" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1">Role</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1">Status</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1">{editing ? 'New Password (leave blank to keep)' : 'Password'}</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 pr-10" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-700">{showPwd ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm shadow-md shadow-violet-500/20 transition-colors">{editing ? 'Save Changes' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCreation;
