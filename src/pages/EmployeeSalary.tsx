import React from 'react';
import { useAuth } from '../context/AuthContext';
import { generateSalarySlipPDF } from '../utils/pdfGenerator';
import { Download, CreditCard, DollarSign, ShieldCheck, FileCheck } from 'lucide-react';

export const EmployeeSalary: React.FC = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const s = currentUser.salary;
  const grossPay = s.basic + s.hra + s.allowances;

  const handleDownloadPDF = () => {
    generateSalarySlipPDF(currentUser, 'August 2026');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Salary Breakdown</h2>
          <p className="text-xs text-slate-500">
            Read-only payroll structure and instant PDF salary slip download.
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Payslip</span>
        </button>
      </div>

      {/* Net Salary Highlight Banner */}
      <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            Monthly Take-Home Pay
          </span>
          <div className="text-3xl font-black text-white mt-2">
            ${s.netPay.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">USD / month</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Direct deposit credited on 1st of every month.</p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <div className="text-xs">
            <div className="font-bold text-white">HR Verified Payroll</div>
            <div className="text-slate-400">Status: Processed & Disbursed</div>
          </div>
        </div>
      </div>

      {/* Detailed Earnings & Deductions Breakdown Card */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-600" /> Itemized Payroll Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Earnings Column */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-200 flex justify-between">
              <span>Earnings & Allowances</span>
              <span>Amount</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-600">Basic Salary</span>
              <span className="font-semibold text-slate-900">${s.basic.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-600">House Rent Allowance (HRA)</span>
              <span className="font-semibold text-slate-900">${s.hra.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-600">Special Allowances</span>
              <span className="font-semibold text-slate-900">${s.allowances.toLocaleString()}</span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
              <span>Total Gross Salary:</span>
              <span className="text-emerald-700">${grossPay.toLocaleString()}</span>
            </div>
          </div>

          {/* Deductions Column */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-200 flex justify-between">
              <span>Deductions & Taxes</span>
              <span>Amount</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-600">Income Tax & Health Insurance</span>
              <span className="font-semibold text-rose-700">-${s.deductions.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-600">Provident Fund (PF)</span>
              <span className="font-semibold text-slate-400">$0.00</span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
              <span>Total Deductions:</span>
              <span className="text-rose-700">-${s.deductions.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Calculation formula note */}
        <div className="mt-6 p-4 rounded-2xl bg-blue-50/80 border border-blue-100 text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <span>
              <strong>Simplified Calculation Model:</strong> Net Pay = (Basic + HRA + Special) − Tax
              Deductions.
            </span>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 transition shadow-xs"
          >
            Download Slip (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};
