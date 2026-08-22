import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { StatCard } from '../components/ui/StatCard';
import { LeaveBadge } from '../components/ui/Badge';
import { LeaveRequest } from '../types/hrms';
import {
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Building2,
  Sparkles,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { allUsers } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    setLeaves(storageService.getLeaves());
    setAttendance(storageService.getAttendance());
  }, []);

  const totalEmployees = allUsers.filter((u) => u.role === 'EMPLOYEE').length;
  const pendingLeaves = leaves.filter((l) => l.status === 'PENDING');
  const today = new Date().toISOString().split('T')[0];
  const todayAtt = attendance.filter((a) => a.date === today);
  const presentToday = todayAtt.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 100;
  const totalPayroll = allUsers.reduce((sum, u) => sum + u.salary.netPay, 0);

  // Recharts chart data for past 7 days attendance
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayAtt = attendance.filter((a) => a.date === dateStr);
    const presentCount =
      dayAtt.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length ||
      Math.floor(Math.random() * 2) + 7;
    return {
      day: dayLabel,
      Present: presentCount,
      Leave: dayAtt.filter((a) => a.status === 'LEAVE').length || (i === 2 ? 1 : 0),
    };
  });

  // Department Distribution
  const departmentsMap: Record<string, number> = {};
  allUsers.forEach((u) => {
    departmentsMap[u.department] = (departmentsMap[u.department] || 0) + 1;
  });

  const handleQuickAction = (leaveId: string, status: 'APPROVED' | 'REJECTED') => {
    storageService.updateLeaveStatus(leaveId, status, `Reviewed by HR Admin via dashboard`);
    setLeaves(storageService.getLeaves());
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
                Organization Command Center
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                HR Admin Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Real-time attendance matrix, pending leave approvals, and organizational payroll operations.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('leave')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 transition cursor-pointer shrink-0"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Review Leave Queue ({pendingLeaves.length})</span>
        </button>
      </div>

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={`${totalEmployees} Staff`}
          subtitle={`Across ${Object.keys(departmentsMap).length} Active Departments`}
          icon={Users}
          accentColor="blue"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          subtitle={`${presentToday} of ${totalEmployees} logged present today`}
          icon={Clock}
          trend={{ value: '3.4%', isPositive: true }}
          accentColor="emerald"
        />
        <StatCard
          title="Pending Leave Triage"
          value={pendingLeaves.length}
          subtitle={pendingLeaves.length > 0 ? "Requires manager approval" : "All leave requests cleared"}
          icon={CalendarCheck}
          accentColor="amber"
        />
        <StatCard
          title="Monthly Payroll Disbursed"
          value={`$${totalPayroll.toLocaleString()}`}
          subtitle="Net monthly disbursement"
          icon={CreditCard}
          accentColor="purple"
        />
      </div>

      {/* Triage Action Bar & Department Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Immediate Action Triage Queue (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pending Leave Approvals Queue</h3>
                  <p className="text-[11px] text-slate-500">Requires immediate review from HR Administration</p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {pendingLeaves.length} Pending Decision{pendingLeaves.length !== 1 ? 's' : ''}
              </span>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-800">All Queue Actions Cleared!</p>
                <p className="text-[11px] text-slate-500 max-w-sm">
                  There are no pending employee leave applications requiring approval at this time.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{leave.userName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold uppercase">
                          {leave.department}
                        </span>
                        <LeaveBadge status={leave.status} />
                      </div>
                      <p className="text-slate-600 text-xs italic">"{leave.reason}"</p>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {leave.type} Leave ({leave.daysCount}d) • {leave.startDate} to {leave.endDate}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleQuickAction(leave.id, 'APPROVED')}
                        className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-2xs flex items-center space-x-1.5 transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleQuickAction(leave.id, 'REJECTED')}
                        className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-2xs flex items-center space-x-1.5 transition cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Auto-sync active • Changes save to local HR database
            </span>
            <button
              onClick={() => onNavigate('leave')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Manage full leave roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Department Breakdowns Card (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Departments Roster</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-semibold">
                {Object.keys(departmentsMap).length} Teams
              </span>
            </div>

            <div className="space-y-2.5">
              {Object.entries(departmentsMap).map(([dept, count]) => (
                <div
                  key={dept}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-xs font-semibold text-slate-800">{dept}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                    {count} {count === 1 ? 'member' : 'members'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('employees')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>View Employee Directory</span>
            </button>
          </div>
        </div>

      </div>

      {/* Weekly Shift Attendance Chart Panel */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600 inline" />
              <span>Weekly Shift Attendance Volume</span>
            </h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Daily logged presence versus approved leave status across organization.
            </p>
          </div>
          <button
            onClick={() => onNavigate('attendance')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View Full Attendance Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                }}
              />
              <Bar dataKey="Present" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Leave" fill="#d97706" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
