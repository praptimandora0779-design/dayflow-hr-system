import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { User, UserRole } from '../types/hrms';
import { Search, Plus, Edit3 } from 'lucide-react';

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Employee Directory</h2>
          <p className="text-xs text-slate-500 font-normal">
            Organization roster, job titles, and salary structures.
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
          className="px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs flex items-center justify-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="hr-panel p-3 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, ID, job title, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800 transition"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-mono shrink-0">Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
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

      {/* Directory Table */}
      <div className="hr-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono font-medium uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">ID / Role</th>
                <th className="px-5 py-3">Department & Title</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3 text-right">Net Monthly Salary</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{user.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Joined {user.joinDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-mono font-semibold text-slate-800">{user.employeeId}</div>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold uppercase ${
                        user.role === 'ADMIN' ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-semibold text-slate-900">{user.jobTitle}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{user.department}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-slate-800 font-medium">{user.email}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{user.phone}</div>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-900 font-mono tabular-nums">
                    ${user.salary.netPay.toLocaleString()} USD
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs inline-flex items-center gap-1 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {(showAddModal || selectedUser) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {selectedUser ? `Edit Employee (${selectedUser.employeeId})` : 'Add New Employee'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedUser(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-base font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">HR Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={form.jobTitle}
                    onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-semibold text-slate-900 font-mono text-[11px] uppercase">
                  Salary Configuration
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Basic ($)</label>
                    <input
                      type="number"
                      value={form.basic}
                      onChange={(e) => setForm({ ...form, basic: Number(e.target.value) })}
                      className="w-full px-2.5 py-1 rounded bg-white border border-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">HRA ($)</label>
                    <input
                      type="number"
                      value={form.hra}
                      onChange={(e) => setForm({ ...form, hra: Number(e.target.value) })}
                      className="w-full px-2.5 py-1 rounded bg-white border border-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Allowances ($)</label>
                    <input
                      type="number"
                      value={form.allowances}
                      onChange={(e) => setForm({ ...form, allowances: Number(e.target.value) })}
                      className="w-full px-2.5 py-1 rounded bg-white border border-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Deductions ($)</label>
                    <input
                      type="number"
                      value={form.deductions}
                      onChange={(e) => setForm({ ...form, deductions: Number(e.target.value) })}
                      className="w-full px-2.5 py-1 rounded bg-white border border-slate-200 font-mono text-rose-700"
                    />
                  </div>
                </div>

                <div className="text-right font-semibold text-slate-900 text-xs font-mono tabular-nums">
                  Calculated Net Pay: ${(form.basic + form.hra + form.allowances - form.deductions).toLocaleString()} USD
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-3.5 py-1.5 rounded-md bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-2xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
