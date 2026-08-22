import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { LeaveRequest } from '../types/hrms';
import { LeaveBadge } from '../components/ui/Badge';
import { CheckCircle2, XCircle, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminLeaveQueue: React.FC = () => {
  const { currentUser } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');

  // Modal review state
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [adminComment, setAdminComment] = useState('');

  useEffect(() => {
    setLeaves(storageService.getLeaves());
  }, []);

  const filteredLeaves = leaves.filter((l) => {
    if (statusFilter === 'ALL') return true;
    return l.status === statusFilter;
  });

  const handleOpenReview = (leave: LeaveRequest, action: 'APPROVED' | 'REJECTED') => {
    setSelectedLeave(leave);
    setReviewAction(action);
    setAdminComment(action === 'APPROVED' ? 'Approved by HR Operations.' : 'Reschedule requested due to sprint launch.');
  };

  const handleConfirmReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLeave) {
      storageService.updateLeaveStatus(
        selectedLeave.id,
        reviewAction,
        adminComment,
        currentUser?.name || 'HR Admin'
      );

      // Trigger celebratory confetti if approved!
      if (reviewAction === 'APPROVED') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }

      setLeaves(storageService.getLeaves());
      setSelectedLeave(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Leave Approvals Queue</h2>
          <p className="text-xs text-slate-500 font-normal">
            Review time-off requests, append HR feedback, and notify employees.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-medium">
        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`pb-2.5 transition flex items-center gap-1.5 ${
            statusFilter === 'PENDING'
              ? 'border-b-2 border-amber-600 text-amber-800 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Pending Review ({leaves.filter((l) => l.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setStatusFilter('APPROVED')}
          className={`pb-2.5 transition flex items-center gap-1.5 ${
            statusFilter === 'APPROVED'
              ? 'border-b-2 border-emerald-600 text-emerald-800 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Approved ({leaves.filter((l) => l.status === 'APPROVED').length})
        </button>
        <button
          onClick={() => setStatusFilter('REJECTED')}
          className={`pb-2.5 transition flex items-center gap-1.5 ${
            statusFilter === 'REJECTED'
              ? 'border-b-2 border-rose-600 text-rose-800 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Rejected ({leaves.filter((l) => l.status === 'REJECTED').length})
        </button>
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`pb-2.5 transition ${
            statusFilter === 'ALL'
              ? 'border-b-2 border-slate-900 text-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          All Applications ({leaves.length})
        </button>
      </div>

      {/* Queue Table */}
      <div className="hr-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono font-medium uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Leave Type</th>
                <th className="px-5 py-3">Dates & Duration</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400 font-medium">
                    No leave requests found in this queue.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3">
                      <div className="font-bold text-slate-900">{leave.userName}</div>
                      <div className="text-[10px] text-slate-500">{leave.department} • {leave.userEmail}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-medium text-slate-900">{leave.type} Leave</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-slate-900 font-mono tabular-nums">{leave.daysCount} Day(s)</div>
                      <div className="text-[10px] text-slate-500 font-mono">{leave.startDate} to {leave.endDate}</div>
                    </td>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="text-slate-700 truncate">{leave.reason}</p>
                      {leave.adminComment && (
                        <p className="text-[10px] text-slate-600 font-medium italic mt-0.5">
                          HR Note: "{leave.adminComment}"
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <LeaveBadge status={leave.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      {leave.status === 'PENDING' ? (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenReview(leave, 'APPROVED')}
                            className="px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-[11px] shadow-2xs flex items-center space-x-1 transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleOpenReview(leave, 'REJECTED')}
                            className="px-2.5 py-1 rounded-md bg-rose-700 hover:bg-rose-600 text-white font-semibold text-[11px] shadow-2xs flex items-center space-x-1 transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          Reviewed by {leave.reviewedBy || 'HR'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-md shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900">
                Confirm Leave {reviewAction === 'APPROVED' ? 'Approval' : 'Rejection'}
              </h3>
              <button onClick={() => setSelectedLeave(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReview} className="space-y-3 text-xs">
              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">{selectedLeave.userName}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {selectedLeave.type} Leave • {selectedLeave.startDate} to {selectedLeave.endDate} ({selectedLeave.daysCount} days)
                </div>
                <div className="mt-1 text-slate-700 italic">"{selectedLeave.reason}"</div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-600" /> HR Admin Note for Employee
                </label>
                <textarea
                  rows={2}
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Enter note..."
                  className="w-full px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedLeave(null)}
                  className="px-3.5 py-1.5 rounded-md bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 rounded-md text-white font-semibold shadow-2xs transition ${
                    reviewAction === 'APPROVED' ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-rose-700 hover:bg-rose-600'
                  }`}
                >
                  Confirm {reviewAction === 'APPROVED' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
