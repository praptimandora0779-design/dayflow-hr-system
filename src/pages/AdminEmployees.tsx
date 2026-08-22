import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { User, UserRole } from '../types/hrms';
import { Search, Plus, Edit3, Trash2, Building, Mail, Phone, Shield } from 'lucide-react';

export const AdminEmployees: React.FC = () => {
  const { allUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form for New / Edit Employee
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'EMPLOYEE' as UserRole,
    department: 'Engineering',
    jobTitle: '',
    phone: '',
    address: '',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    basic: 4500,
    hra: 1800,
    allowances: 1000,
    deductions: 800,
  });

  const departments = Array.from(new Set(allUsers.map((u) => u.department)));

  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || u.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      jobTitle: user.jobTitle,
      phone: user.phone,
      address: user.address,
      photoUrl: user.photoUrl,
      basic: user.salary.basic,
      hra: user.salary.hra,
      allowances: user.salary.allowances,
      deductions: user.salary.deductions,
    });
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const netPay = form.basic + form.hra + form.allowances - form.deductions;

    if (selectedUser) {
      // Edit existing
      const updated: User = {
        ...selectedUser,
        name: form.name,
        email: form.email,
        role: form.role,
        department: form.department,
        jobTitle: form.jobTitle,
        phone: form.phone,
        address: form.address,
        photoUrl: form.photoUrl,
        salary: {
          basic: form.basic,
          hra: form.hra,
          allowances: form.allowances,
          deductions: form.deductions,
          netPay,
        },
      };
      storageService.saveUser(updated);
      setSelectedUser(null);
    } else {
      // Add new
      const newEmpId = `EMP-${Math.floor(100 + Math.random() * 900)}`;
      const newUser: User = {
        id: `usr_emp_${Date.now()}`,
        employeeId: newEmpId,
        name: form.name,
        email: form.email,
        role: form.role,
        department: form.department,
        jobTitle: form.jobTitle,
        joinDate: new Date().toISOString().split('T')[0],
        phone: form.phone || '+1 (555) 000-1122',
        address: form.address || 'Company Headquarters, SF',
        photoUrl: form.photoUrl,
        salary: {
          basic: form.basic,
          hra: form.hra,
          allowances: form.allowances,
          deductions: form.deductions,
          netPay,
        },
      };
      storageService.saveUser(newUser);
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Employee Directory</h2>
          <p className="text-xs text-slate-500">
            Manage organization employees, roles, departments, and payroll profiles.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null);
            setForm({
              name: '',
              email: '',
              role: 'EMPLOYEE',
              department: 'Engineering',
              jobTitle: 'Software Engineer',
              phone: '+1 (555) 123-4567',
              address: 'San Francisco, CA',
              photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              basic: 4500,
              hra: 1800,
              allowances: 1000,
              deductions: 800,
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, ID, title, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium shrink-0">Filter Dept:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Departments ({allUsers.length})</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Directory Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">ID / Role</th>
                <th className="px-6 py-3.5">Department & Title</th>
                <th className="px-6 py-3.5">Contact Info</th>
                <th className="px-6 py-3.5">Net Monthly Pay</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-400">Joined {user.joinDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="font-mono font-semibold text-slate-800">{user.employeeId}</div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="font-semibold text-slate-900">{user.jobTitle}</div>
                    <div className="text-[11px] text-slate-500">{user.department}</div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="text-slate-700 font-medium">{user.email}</div>
                    <div className="text-[11px] text-slate-400">{user.phone}</div>
                  </td>
                  <td className="px-6 py-3.5 font-bold text-emerald-700">
                    ${user.salary.netPay.toLocaleString()} USD
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 ml-auto transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {(showAddModal || selectedUser) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {selectedUser ? `Edit Employee Profile (${selectedUser.employeeId})` : 'Add New Employee'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedUser(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">HR Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={form.jobTitle}
                    onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  />
                </div>
              </div>

              {/* Salary Section */}
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
                <h4 className="font-bold text-blue-900 uppercase text-[11px]">Salary Structure Configuration</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Basic Pay ($)</label>
                    <input
                      type="number"
                      value={form.basic}
                      onChange={(e) => setForm({ ...form, basic: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">HRA ($)</label>
                    <input
                      type="number"
                      value={form.hra}
                      onChange={(e) => setForm({ ...form, hra: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Allowances ($)</label>
                    <input
                      type="number"
                      value={form.allowances}
                      onChange={(e) => setForm({ ...form, allowances: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Deductions ($)</label>
                    <input
                      type="number"
                      value={form.deductions}
                      onChange={(e) => setForm({ ...form, deductions: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-rose-700"
                    />
                  </div>
                </div>

                <div className="text-right font-bold text-blue-900 text-xs">
                  Net Salary Calculation: ${(form.basic + form.hra + form.allowances - form.deductions).toLocaleString()} USD
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-md shadow-blue-500/20"
                >
                  Save Employee Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
