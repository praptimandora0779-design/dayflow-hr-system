import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { LeaveRequest, LeaveType } from '../types/hrms';
import { LeaveBadge } from '../components/ui/Badge';
import { Plus } from 'lucide-react';

export const EmployeeLeave: React.FC = () => {
  const { currentUser } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Form state
  const [leaveType, setLeaveType] = useState<LeaveType>('PAID');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      const list = storageService.getUserLeaves(currentUser.id);
      setLeaves(list);
    }
  }, [currentUser?.id]);

  if (!currentUser) return null;

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Select a start date before an end date.');
      return;
    }
    const days = calculateDays();
    if (days <= 0) {
      setError('End date cannot be earlier than start date.');
      return;
    }
    if (!reason.trim()) {
      setError('Provide a reason for your leave request.');
      return;
    }

    storageService.createLeaveRequest({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      department: currentUser.department,
      type: leaveType,
      startDate,
      endDate,
      daysCount: days,
      reason,
    });

    // Reset modal & form
    setShowApplyModal(false);
    setStartDate('');
    setEndDate('');
    setReason('');
    setError('');

    // Refresh list
    setLeaves(storageService.getUserLeaves(currentUser.id));
  };

  const approvedPaidDays = leaves
    .filter((l) => l.type === 'PAID' && l.status === 'APPROVED')
    .reduce((sum, l) => sum + l.daysCount, 0);

  const approvedSickDays = leaves
    .filter((l) => l.type === 'SICK' && l.status === 'APPROVED')
    .reduce((sum, l) => sum + l.daysCount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Leave Management</h2>
          <p className="text-xs text-slate-500 font-normal">
            Apply for time off and review application status.
          </p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs flex items-center justify-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="hr-panel p-4 border-l-4 border-l-blue-600">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Paid Leave Balance</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {Math.max(0, 15 - approvedPaidDays)} / 15 <span className="text-xs font-normal text-slate-500">Days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{approvedPaidDays} days used this year</p>
        </div>

        <div className="hr-panel p-4 border-l-4 border-l-amber-600">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Sick Leave Balance</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {Math.max(0, 7 - approvedSickDays)} / 7 <span className="text-xs font-normal text-slate-500">Days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{approvedSickDays} days used this year</p>
        </div>

        <div className="hr-panel p-4 border-l-4 border-l-slate-400">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Unpaid Leave</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            0 <span className="text-xs font-normal text-slate-500">Days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Subject to HR approval</p>
        </div>
      </div>

      {/* Table & Actionable Empty State */}
      <div className="hr-panel overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
            Leave Applications
          </h3>
          <span className="text-xs text-slate-500 font-mono">Total: {leaves.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono font-medium uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Start Date</th>
                <th className="px-5 py-3">End Date</th>
                <th className="px-5 py-3">Days</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">HR Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500 font-normal">
                    No leave requests yet — click <button onClick={() => setShowApplyModal(true)} className="text-blue-700 font-semibold underline">Apply for Leave</button> to submit your first time off.
                  </td>
                </tr>
              ) : (
                leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3 font-semibold text-slate-900">{l.type} Leave</td>
                    <td className="px-5 py-3 font-mono tabular-nums text-slate-700">{l.startDate}</td>
                    <td className="px-5 py-3 font-mono tabular-nums text-slate-700">{l.endDate}</td>
                    <td className="px-5 py-3 font-mono tabular-nums font-semibold text-slate-900">{l.daysCount} d</td>
                    <td className="px-5 py-3 text-slate-600 max-w-xs truncate">{l.reason}</td>
                    <td className="px-5 py-3">
                      <LeaveBadge status={l.status} />
                    </td>
                    <td className="px-5 py-3 text-slate-500 italic">
                      {l.adminComment ? `"${l.adminComment}"` : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-md shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Apply for Time Off</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                >
                  <option value="PAID">Paid Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-medium"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-medium"
                  />
                </div>
              </div>

              {startDate && endDate && (
                <div className="p-2 rounded-md bg-slate-100 text-slate-800 font-semibold font-mono text-xs text-center border border-slate-200">
                  Calculated Duration: {calculateDays()} Day(s)
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 mb-1">Reason / Remarks</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State the reason for your leave request..."
                  className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800 font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-3.5 py-1.5 rounded-md bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs"
                >
                  Apply for Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
