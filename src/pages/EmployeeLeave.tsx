import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { LeaveRequest, LeaveType } from '../types/hrms';
import { LeaveBadge } from '../components/ui/Badge';
import { Calendar, Plus, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

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

  // Calculate day difference
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
      setError('Please select both start and end dates.');
      return;
    }
    const days = calculateDays();
    if (days <= 0) {
      setError('End date cannot be earlier than start date.');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason for your leave request.');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Leave Management</h2>
          <p className="text-xs text-slate-500">Apply for time off and track status in real-time.</p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Apply New Leave</span>
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border-l-4 border-blue-500">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paid Leave Balance</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {Math.max(0, 15 - approvedPaidDays)} / 15 <span className="text-xs font-medium text-slate-500">Days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{approvedPaidDays} days used this year</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-amber-500">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sick Leave Balance</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {Math.max(0, 7 - approvedSickDays)} / 7 <span className="text-xs font-medium text-slate-500">Days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{approvedSickDays} days used this year</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-slate-400">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unpaid Leave</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            0 <span className="text-xs font-medium text-slate-500">Days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Subject to HR approval</p>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">My Leave Applications</h3>
          <span className="text-xs text-slate-400 font-medium">Total: {leaves.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Leave Type</th>
                <th className="px-6 py-3">Start Date</th>
                <th className="px-6 py-3">End Date</th>
                <th className="px-6 py-3">Days</th>
                <th className="px-6 py-3">Reason</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">HR Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No leave requests found. Click "Apply New Leave" above to request time off.
                  </td>
                </tr>
              ) : (
                leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-3.5 font-bold text-slate-900">{l.type} Leave</td>
                    <td className="px-6 py-3.5">{l.startDate}</td>
                    <td className="px-6 py-3.5">{l.endDate}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-800">{l.daysCount} d</td>
                    <td className="px-6 py-3.5 text-slate-600 max-w-xs truncate">{l.reason}</td>
                    <td className="px-6 py-3.5">
                      <LeaveBadge status={l.status} />
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 italic">
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Apply for Time Off</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium"
                >
                  <option value="PAID">Paid Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium"
                  />
                </div>
              </div>

              {startDate && endDate && (
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs text-center border border-blue-100">
                  Total Leave Duration: {calculateDays()} Day(s)
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Remarks</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State the reason for your time off request..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
                >
                  Submit Leave Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
