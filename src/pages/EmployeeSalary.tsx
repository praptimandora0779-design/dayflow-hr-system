import React from 'react';
import { useAuth } from '../context/AuthContext';
import { generateSalarySlipPDF } from '../utils/pdfGenerator';
import { Download, ShieldCheck, FileCheck } from 'lucide-react';

export const EmployeeSalary: React.FC = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const s = currentUser.salary;
  const grossPay = s.basic + s.hra + s.allowances;

  const handleDownloadPDF = () => {
    generateSalarySlipPDF(currentUser, 'August 2026');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Salary & Payslip</h2>
          <p className="text-xs text-slate-500 font-normal">
            Read-only monthly compensation breakdown and official PDF salary slip export.
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Payslip</span>
        </button>
      </div>

      {/* Net Salary Highlight Box */}
      <div className="hr-panel p-5 bg-slate-900 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-wider">
            Monthly Take-Home Pay
          </span>
          <div className="text-3xl font-bold text-black mt-1 font-mono tabular-nums">
            ${s.netPay.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400 font-sans">USD / month</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-normal">Direct deposit credited on 1st of every month.</p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 p-3.5 rounded-md border border-slate-800">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <div className="font-semibold text-white">HR Verified Payroll</div>
            <div className="text-slate-400 font-mono text-[11px]">Status: Disbursed</div>
          </div>
        </div>
      </div>

      {/* Itemized Payroll Table */}
      <div className="hr-panel p-5">
        <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider mb-4 border-b border-slate-100 pb-2.5">
          Itemized Payroll Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Earnings */}
          <div className="space-y-2 p-3.5 rounded-md bg-slate-50 border border-slate-200">
            <div className="font-semibold text-slate-900 uppercase font-mono text-[10px] pb-2 border-b border-slate-200 flex justify-between">
              <span>Earnings & Allowances</span>
              <span>Amount</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-600 font-medium">Basic Salary</span>
              <span className="font-semibold text-slate-900 font-mono tabular-nums">${s.basic.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-600 font-medium">House Rent Allowance (HRA)</span>
              <span className="font-semibold text-slate-900 font-mono tabular-nums">${s.hra.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-600 font-medium">Special Allowances</span>
              <span className="font-semibold text-slate-900 font-mono tabular-nums">${s.allowances.toLocaleString()}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-xs font-mono tabular-nums">
              <span>Total Gross Salary:</span>
              <span className="text-slate-900">${grossPay.toLocaleString()}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="space-y-2 p-3.5 rounded-md bg-slate-50 border border-slate-200">
            <div className="font-semibold text-slate-900 uppercase font-mono text-[10px] pb-2 border-b border-slate-200 flex justify-between">
              <span>Deductions & Taxes</span>
              <span>Amount</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-600 font-medium">Income Tax Withheld</span>
              <span className="font-semibold text-rose-800 font-mono tabular-nums">-${s.deductions.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-600 font-medium">Provident Fund (PF)</span>
              <span className="font-semibold text-slate-400 font-mono tabular-nums">$0.00</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-xs font-mono tabular-nums">
              <span>Total Deductions:</span>
              <span className="text-rose-800">-${s.deductions.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-4 p-3 rounded-md bg-slate-100 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-slate-600 shrink-0" />
            <span className="font-normal">
              <strong>Calculation Model:</strong> Net Pay = (Basic + HRA + Special Allowances) − Income Tax Deductions.
            </span>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shrink-0 transition shadow-2xs"
          >
            Export PDF Slip
          </button>
        </div>
      </div>
    </div>
  );
};
