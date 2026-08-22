import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { AttendanceRecord } from '../types/hrms';
import { AttendanceBadge } from '../components/ui/Badge';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const EmployeeAttendance: React.FC = () => {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (currentUser) {
      const att = storageService.getUserAttendance(currentUser.id);
      setRecords(att);
    }
  }, [currentUser?.id]);

  if (!currentUser) return null;

  const totalPresent = records.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
  const totalLeaves = records.filter((r) => r.status === 'LEAVE').length;
  const totalHalfDays = records.filter((r) => r.status === 'HALF_DAY').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Attendance History</h2>
          <p className="text-xs text-slate-500">Track your daily shift check-ins and hours worked.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Days Present</div>
            <div className="text-xl font-bold text-slate-900">{totalPresent} Days</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Approved Leaves</div>
            <div className="text-xl font-bold text-slate-900">{totalLeaves} Days</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Half Days</div>
            <div className="text-xl font-bold text-slate-900">{totalHalfDays} Days</div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Attendance Logs</h3>
          <span className="text-xs text-slate-400 font-medium">Total Logs: {records.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Check In</th>
                <th className="px-6 py-3">Check Out</th>
                <th className="px-6 py-3">Hours Logged</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Notes / Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-3.5 font-bold text-slate-900">{rec.date}</td>
                    <td className="px-6 py-3.5 font-mono">{rec.checkIn || '—'}</td>
                    <td className="px-6 py-3.5 font-mono">{rec.checkOut || '—'}</td>
                    <td className="px-6 py-3.5 font-semibold">
                      {rec.workHours ? `${rec.workHours} hrs` : '—'}
                    </td>
                    <td className="px-6 py-3.5">
                      <AttendanceBadge status={rec.status} />
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">{rec.notes || 'Normal workday shift'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
