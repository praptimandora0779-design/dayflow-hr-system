import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { AttendanceRecord, AttendanceStatus } from '../types/hrms';
import { AttendanceBadge } from '../components/ui/Badge';
import { Calendar, Filter, Edit2 } from 'lucide-react';

export const AdminAttendance: React.FC = () => {
  const { allUsers } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [editRecord, setEditRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    setAttendance(storageService.getAttendance());
  }, []);

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Attendance Master</h2>
          <p className="text-xs text-slate-500 font-normal">
            Organization-wide shift logs, timestamps, and manual exception entries.
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="hr-panel p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-600">Select Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-900"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-600">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
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

      {/* Attendance Logs Table */}
      <div className="hr-panel overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
            Shift Records for {selectedDate}
          </h3>
          <span className="text-xs text-slate-500 font-mono">{tableRows.length} Employees</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono font-medium uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Check In</th>
                <th className="px-5 py-3">Check Out</th>
                <th className="px-5 py-3">Hours Logged</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tableRows.map(({ user, record }) => (
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
                        <div className="text-[10px] text-slate-500">{user.jobTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-800">{user.department}</td>
                  <td className="px-5 py-3 font-mono tabular-nums text-slate-900">{record.checkIn || '—'}</td>
                  <td className="px-5 py-3 font-mono tabular-nums text-slate-900">{record.checkOut || '—'}</td>
                  <td className="px-5 py-3 font-mono tabular-nums font-semibold text-slate-900">
                    {record.workHours ? `${record.workHours} hrs` : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <AttendanceBadge status={record.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setEditRecord(record)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs inline-flex items-center gap-1 transition"
                    >
                      <Edit2 className="w-3 h-3 text-slate-600" />
                      <span>Adjust</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustment Modal */}
      {editRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-md shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Adjust Shift Log Entry</h3>
              <button onClick={() => setEditRecord(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCorrection} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={editRecord.status}
                  onChange={(e) => setEditRecord({ ...editRecord, status: e.target.value as AttendanceStatus })}
                  className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 font-semibold"
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
                  <label className="block font-medium text-slate-700 mb-1">Check In Time</label>
                  <input
                    type="text"
                    value={editRecord.checkIn || '09:00:00'}
                    onChange={(e) => setEditRecord({ ...editRecord, checkIn: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Check Out Time</label>
                  <input
                    type="text"
                    value={editRecord.checkOut || '17:30:00'}
                    onChange={(e) => setEditRecord({ ...editRecord, checkOut: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Adjustment Reason Note</label>
                <input
                  type="text"
                  value={editRecord.notes || ''}
                  onChange={(e) => setEditRecord({ ...editRecord, notes: e.target.value })}
                  placeholder="e.g. Manual shift entry approved by HR"
                  className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditRecord(null)}
                  className="px-3.5 py-1.5 rounded-md bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-2xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
