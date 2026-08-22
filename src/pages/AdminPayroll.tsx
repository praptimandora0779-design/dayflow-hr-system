import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { User, SalaryStructure } from '../types/hrms';
import { generateSalarySlipPDF } from '../utils/pdfGenerator';
import { Download, Edit3, FileText } from 'lucide-react';

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Payroll & Compensation</h2>
          <p className="text-xs text-slate-500 font-normal">
            Configure salary structures and export official PDF payslips.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="hr-panel p-4 border-l-4 border-l-emerald-600">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Monthly Net Payroll
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            ${totalNetPayroll.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Disbursed to {allUsers.length} staff members</p>
        </div>

        <div className="hr-panel p-4 border-l-4 border-l-blue-600">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Gross Expenditures
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            ${totalGrossPayroll.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Basic + HRA + Special Allowances</p>
        </div>

        <div className="hr-panel p-4 border-l-4 border-l-rose-600">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Tax & Deductions Withheld
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            ${totalDeductions.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Withholding model applied</p>
        </div>
      </div>

      {/* Roster Table */}
      <div className="hr-panel overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
            Payroll Roster
          </h3>
          <span className="text-xs text-slate-500 font-mono">{allUsers.length} Employees</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono font-medium uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3 text-right">Basic Pay</th>
                <th className="px-5 py-3 text-right">HRA & Allowances</th>
                <th className="px-5 py-3 text-right">Deductions</th>
                <th className="px-5 py-3 text-right">Net Monthly Salary</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {allUsers.map((user) => {
                const s = user.salary;
                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.photoUrl}
                          alt={user.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{user.employeeId} • {user.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-mono tabular-nums text-slate-900">${s.basic.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right font-mono tabular-nums text-slate-700">${(s.hra + s.allowances).toLocaleString()}</td>
                    <td className="px-5 py-3 text-right font-mono tabular-nums text-rose-700">-${s.deductions.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                      ${s.netPay.toLocaleString()} USD
                    </td>
                    <td className="px-5 py-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleEditSalary(user)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs inline-flex items-center gap-1 transition"
                      >
                        <Edit3 className="w-3 h-3 text-slate-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(user)}
                        className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs inline-flex items-center gap-1 transition shadow-2xs"
                      >
                        <Download className="w-3 h-3" />
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-md shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Edit Salary ({selectedUser.name})
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSalary} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Basic Salary ($)</label>
                  <input
                    type="number"
                    value={salaryForm.basic}
                    onChange={(e) => setSalaryForm({ ...salaryForm, basic: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">HRA ($)</label>
                  <input
                    type="number"
                    value={salaryForm.hra}
                    onChange={(e) => setSalaryForm({ ...salaryForm, hra: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Allowances ($)</label>
                  <input
                    type="number"
                    value={salaryForm.allowances}
                    onChange={(e) => setSalaryForm({ ...salaryForm, allowances: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Deductions ($)</label>
                  <input
                    type="number"
                    value={salaryForm.deductions}
                    onChange={(e) => setSalaryForm({ ...salaryForm, deductions: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 font-mono font-semibold text-rose-700"
                  />
                </div>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-right font-semibold text-slate-900 text-xs font-mono tabular-nums">
                Calculated Net Pay: ${(salaryForm.basic + salaryForm.hra + salaryForm.allowances - salaryForm.deductions).toLocaleString()} USD
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-3.5 py-1.5 rounded-md bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-2xs"
                >
                  Save Salary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
