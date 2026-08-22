import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { AttendanceRecord, AttendanceStatus } from '../types/hrms';
import { AttendanceBadge } from '../components/ui/Badge';
import { Clock, Calendar, Search, Filter, Edit2, CheckCircle2 } from 'lucide-react';

export const AdminAttendance: React.FC = () => {
  const { allUsers } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [editRecord, setEditRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    setAttendance(storageService.getAttendance());
  }, []);

  // Combine all employees with their attendance record on selectedDate
  const tableRows = allUsers
    .filter((u) => u.role === 'EMPLOYEE')
    .map((usr) => {
      const rec = attendance.find((a) => a.userId === usr.id && a.date === selectedDate);
      return {
        user: usr,
        record: rec || {
          id: `att_abs_${usr.id}_${selectedDate}`,
          userId: usr.id,
          date: selectedDate,
          status: 'ABSENT' as AttendanceStatus,
          notes: 'No check-in recorded',
        },
      };
    })
    .filter((row) => {
      if (statusFilter === 'ALL') return true;
      return row.record.status === statusFilter;
    });

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (editRecord) {
      storageService.saveAttendanceRecord(editRecord);
      setAttendance(storageService.getAttendance());
      setEditRecord(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Organization Attendance Master</h2>
          <p className="text-xs text-slate-500">
            View live attendance logs across all departments and apply manual corrections.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" /> Select Date:
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-600" /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="PRESENT">Present</option>
            <option value="LATE">Late</option>
            <option value="HALF_DAY">Half Day</option>
            <option value="LEAVE">On Leave</option>
            <option value="ABSENT">Absent</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Attendance Grid for {selectedDate}
          </h3>
          <span className="text-xs text-slate-400 font-medium">Showing {tableRows.length} employees</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Check In</th>
                <th className="px-6 py-3.5">Check Out</th>
                <th className="px-6 py-3.5">Hours</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Manual Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tableRows.map(({ user, record }) => (
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
                        <div className="text-[11px] text-slate-400">{user.jobTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 font-medium">{user.department}</td>
                  <td className="px-6 py-3.5 font-mono text-slate-800">{record.checkIn || '—'}</td>
                  <td className="px-6 py-3.5 font-mono text-slate-800">{record.checkOut || '—'}</td>
                  <td className="px-6 py-3.5 font-semibold">
                    {record.workHours ? `${record.workHours} hrs` : '—'}
                  </td>
                  <td className="px-6 py-3.5">
                    <AttendanceBadge status={record.status} />
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => setEditRecord(record)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs inline-flex items-center gap-1 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Adjust</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Adjustment Modal */}
      {editRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Adjust Attendance Log</h3>
              <button onClick={() => setEditRecord(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCorrection} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editRecord.status}
                  onChange={(e) => setEditRecord({ ...editRecord, status: e.target.value as AttendanceStatus })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                >
                  <option value="PRESENT">Present</option>
                  <option value="LATE">Late</option>
                  <option value="HALF_DAY">Half Day</option>
                  <option value="LEAVE">On Leave</option>
                  <option value="ABSENT">Absent</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Check In Time</label>
                  <input
                    type="text"
                    value={editRecord.checkIn || '09:00:00'}
                    onChange={(e) => setEditRecord({ ...editRecord, checkIn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Check Out Time</label>
                  <input
                    type="text"
                    value={editRecord.checkOut || '17:30:00'}
                    onChange={(e) => setEditRecord({ ...editRecord, checkOut: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admin Notes / Exception Reason</label>
                <input
                  type="text"
                  value={editRecord.notes || ''}
                  onChange={(e) => setEditRecord({ ...editRecord, notes: e.target.value })}
                  placeholder="e.g. Manual correction approved by HR"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditRecord(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
