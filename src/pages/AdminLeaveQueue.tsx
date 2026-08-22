import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { LeaveRequest } from '../types/hrms';
import { LeaveBadge } from '../components/ui/Badge';
import { CalendarCheck, CheckCircle2, XCircle, MessageSquare, Sparkles } from 'lucide-react';
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
    setAdminComment(action === 'APPROVED' ? 'Approved by HR Operations.' : 'Requires rescheduling due to sprint priorities.');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Leave Approvals Queue</h2>
          <p className="text-xs text-slate-500">
            Review time-off applications, add admin feedback, and notify employees instantly.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 space-x-4 text-xs font-semibold">
        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`pb-3 transition flex items-center gap-1.5 ${
            statusFilter === 'PENDING'
              ? 'border-b-2 border-amber-500 text-amber-700 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Pending Queue ({leaves.filter((l) => l.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setStatusFilter('APPROVED')}
          className={`pb-3 transition flex items-center gap-1.5 ${
            statusFilter === 'APPROVED'
              ? 'border-b-2 border-emerald-500 text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Approved ({leaves.filter((l) => l.status === 'APPROVED').length})
        </button>
        <button
          onClick={() => setStatusFilter('REJECTED')}
          className={`pb-3 transition flex items-center gap-1.5 ${
            statusFilter === 'REJECTED'
              ? 'border-b-2 border-rose-500 text-rose-700 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Rejected ({leaves.filter((l) => l.status === 'REJECTED').length})
        </button>
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`pb-3 transition ${
            statusFilter === 'ALL'
              ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          All Applications ({leaves.length})
        </button>
      </div>

      {/* Leave Requests Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Employee Details</th>
                <th className="px-6 py-3.5">Leave Type</th>
                <th className="px-6 py-3.5">Dates & Duration</th>
                <th className="px-6 py-3.5">Reason Remarks</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No leave requests found in this queue.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-900">{leave.userName}</div>
                      <div className="text-[11px] text-slate-400">{leave.department} • {leave.userEmail}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-semibold text-slate-800">{leave.type} Leave</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-900">{leave.daysCount} Day(s)</div>
                      <div className="text-[11px] text-slate-500">{leave.startDate} to {leave.endDate}</div>
                    </td>
                    <td className="px-6 py-3.5 max-w-xs">
                      <p className="text-slate-700 truncate">{leave.reason}</p>
                      {leave.adminComment && (
                        <p className="text-[10px] text-blue-600 font-medium italic mt-0.5">
                          HR Comment: "{leave.adminComment}"
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <LeaveBadge status={leave.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {leave.status === 'PENDING' ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenReview(leave, 'APPROVED')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs flex items-center space-x-1 transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleOpenReview(leave, 'REJECTED')}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shadow-xs flex items-center space-x-1 transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Confirm Leave {reviewAction === 'APPROVED' ? 'Approval' : 'Rejection'}
              </h3>
              <button onClick={() => setSelectedLeave(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReview} className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="font-bold text-slate-900">{selectedLeave.userName}</div>
                <div className="text-[11px] text-slate-500">
                  {selectedLeave.type} Leave • {selectedLeave.startDate} to {selectedLeave.endDate} ({selectedLeave.daysCount} days)
                </div>
                <div className="mt-2 text-slate-700 italic">"{selectedLeave.reason}"</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> HR Admin Comment / Note for Employee
                </label>
                <textarea
                  rows={3}
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Enter approval note or explanation..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedLeave(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white font-bold shadow-md transition ${
                    reviewAction === 'APPROVED' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
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
