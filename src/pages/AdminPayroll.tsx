import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { User, SalaryStructure } from '../types/hrms';
import { generateSalarySlipPDF } from '../utils/pdfGenerator';
import { CreditCard, Download, Edit3, DollarSign, FileText, Check } from 'lucide-react';

export const AdminPayroll: React.FC = () => {
  const { allUsers } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Edit salary form
  const [salaryForm, setSalaryForm] = useState<SalaryStructure>({
    basic: 5000,
    hra: 2000,
    allowances: 1200,
    deductions: 900,
    netPay: 7300,
  });

  const handleEditSalary = (user: User) => {
    setSelectedUser(user);
    setSalaryForm({ ...user.salary });
  };

  const handleSaveSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      const netPay = salaryForm.basic + salaryForm.hra + salaryForm.allowances - salaryForm.deductions;
      const updatedUser: User = {
        ...selectedUser,
        salary: {
          ...salaryForm,
          netPay,
        },
      };
      storageService.saveUser(updatedUser);
      setSelectedUser(null);
    }
  };

  const handleDownloadPDF = (user: User) => {
    generateSalarySlipPDF(user, 'August 2026');
  };

  const totalGrossPayroll = allUsers.reduce((sum, u) => sum + u.salary.basic + u.salary.hra + u.salary.allowances, 0);
  const totalNetPayroll = allUsers.reduce((sum, u) => sum + u.salary.netPay, 0);
  const totalDeductions = allUsers.reduce((sum, u) => sum + u.salary.deductions, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Payroll & Salary Slips</h2>
          <p className="text-xs text-slate-500">
            Configure employee compensation structures and generate downloadable PDF payslips.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border-l-4 border-emerald-500">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Monthly Net Payroll</div>
          <div className="text-2xl font-black text-slate-900 mt-1">${totalNetPayroll.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400 mt-1">Disbursed to {allUsers.length} employees</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-blue-500">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Payroll Expenditures</div>
          <div className="text-2xl font-black text-slate-900 mt-1">${totalGrossPayroll.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400 mt-1">Basic + HRA + Allowances</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-rose-500">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Deductions & Tax Withheld</div>
          <div className="text-2xl font-black text-slate-900 mt-1">${totalDeductions.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400 mt-1">Simplified withholding model</p>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Organization Payroll Roster</h3>
          <span className="text-xs text-slate-400 font-medium">{allUsers.length} Employees</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Basic Pay</th>
                <th className="px-6 py-3.5">HRA & Allowances</th>
                <th className="px-6 py-3.5">Tax / Deductions</th>
                <th className="px-6 py-3.5">Net Monthly Pay</th>
                <th className="px-6 py-3.5 text-right">Actions & Slip Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {allUsers.map((user) => {
                const s = user.salary;
                return (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.photoUrl}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-[11px] text-slate-400">{user.employeeId} • {user.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">${s.basic.toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-slate-700">${(s.hra + s.allowances).toLocaleString()}</td>
                    <td className="px-6 py-3.5 font-semibold text-rose-700">-${s.deductions.toLocaleString()}</td>
                    <td className="px-6 py-3.5 font-bold text-emerald-700 text-sm">
                      ${s.netPay.toLocaleString()} USD
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleEditSalary(user)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs inline-flex items-center gap-1 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(user)}
                        className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-xs inline-flex items-center gap-1 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF Slip</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Salary Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Edit Salary Structure ({selectedUser.name})
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSalary} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Basic Salary ($)</label>
                  <input
                    type="number"
                    value={salaryForm.basic}
                    onChange={(e) => setSalaryForm({ ...salaryForm, basic: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">HRA ($)</label>
                  <input
                    type="number"
                    value={salaryForm.hra}
                    onChange={(e) => setSalaryForm({ ...salaryForm, hra: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Special Allowances ($)</label>
                  <input
                    type="number"
                    value={salaryForm.allowances}
                    onChange={(e) => setSalaryForm({ ...salaryForm, allowances: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tax & Deductions ($)</label>
                  <input
                    type="number"
                    value={salaryForm.deductions}
                    onChange={(e) => setSalaryForm({ ...salaryForm, deductions: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-rose-700"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center font-bold text-emerald-900 text-sm">
                Calculated Net Pay: ${(salaryForm.basic + salaryForm.hra + salaryForm.allowances - salaryForm.deductions).toLocaleString()} USD
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Save Salary Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
