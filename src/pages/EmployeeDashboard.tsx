import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { StatCard } from '../components/ui/StatCard';
import { AttendanceBadge, LeaveBadge } from '../components/ui/Badge';
import {
  Clock,
  CalendarCheck,
  CreditCard,
  CheckCircle2,
  LogOut,
  Play,
  TrendingUp,
  AlertCircle,
  FileText,
  ArrowRight,
} from 'lucide-react';

interface EmployeeDashboardProps {
  onNavigate: (tab: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [timeStr, setTimeStr] = useState('');
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [userLeaves, setUserLeaves] = useState<any[]>([]);

  if (!currentUser) return null;

  // Digital clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    setTimeStr(new Date().toLocaleTimeString());
    return () => clearInterval(timer);
  }, []);

  // Fetch today's record & leaves
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const userAtt = storageService.getUserAttendance(currentUser.id);
    const todayAtt = userAtt.find((a) => a.date === today);
    setTodayRecord(todayAtt || null);

    const leaves = storageService.getUserLeaves(currentUser.id);
    setUserLeaves(leaves);
  }, [currentUser.id]);

  const handleCheckIn = () => {
    storageService.recordCheckIn(currentUser.id);
  };

  const handleCheckOut = () => {
    storageService.recordCheckOut(currentUser.id);
  };

  const pendingLeaves = userLeaves.filter((l) => l.status === 'PENDING').length;
  const approvedLeavesCount = userLeaves.filter((l) => l.status === 'APPROVED').reduce((acc, l) => acc + l.daysCount, 0);

  return (
    <div className="space-y-5">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Good day, {currentUser.name}</h2>
          <p className="text-xs text-slate-500 font-normal">
            {currentUser.jobTitle} • {currentUser.department} Department
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold font-mono tracking-tight text-slate-900 tabular-nums">{timeStr}</p>
          <p className="text-[11px] text-slate-500 font-mono">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Hero Workspace: Today's Action Dock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Shift & Clocking Card (Hero Position) */}
        <div className="hr-panel p-5 flex flex-col justify-between md:col-span-2 border-l-4 border-l-slate-900">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                  Today's Shift Status
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Daily Attendance Check-In</h3>
              </div>
              {todayRecord && <AttendanceBadge status={todayRecord.status} />}
            </div>

            <div className="my-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                {todayRecord?.checkIn ? (
                  <div className="space-y-1">
                    <div className="text-xs text-slate-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Shift started at <strong className="font-mono tabular-nums text-slate-900">{todayRecord.checkIn}</strong></span>
                    </div>
                    {todayRecord.checkOut && (
                      <p className="text-xs text-slate-500 pl-5 font-mono">
                        Shift ended at {todayRecord.checkOut} ({todayRecord.workHours || 8} hrs logged)
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-600">
                    Shift check-in pending for today. Click below to mark your start time.
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="w-full sm:w-auto shrink-0">
                {!todayRecord?.checkIn ? (
                  <button
                    onClick={handleCheckIn}
                    className="px-5 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs flex items-center justify-center space-x-2 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Check In Now</span>
                  </button>
                ) : !todayRecord?.checkOut ? (
                  <button
                    onClick={handleCheckOut}
                    className="px-5 py-2.5 rounded-md bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs shadow-2xs flex items-center justify-center space-x-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Check Out Shift</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-600 font-mono text-xs border border-slate-200">
                    Shift Completed ({todayRecord.workHours || 8} hrs)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Standard Hours: 09:00 - 17:30</span>
            <span>Location: Main Office</span>
          </div>
        </div>

        {/* Shortcuts & Action Card */}
        <div className="hr-panel p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Quick HR Actions
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-1 mb-3">Frequent Tasks</h3>

            <div className="space-y-2">
              <button
                onClick={() => onNavigate('leave')}
                className="w-full p-2.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-semibold flex items-center justify-between transition border border-slate-200"
              >
                <span className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-slate-600" /> Apply for Leave
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('payroll')}
                className="w-full p-2.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-semibold flex items-center justify-between transition border border-slate-200"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-600" /> View Salary Slip
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Pending Leave Requests: <strong className="text-slate-900 font-mono">{pendingLeaves}</strong>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Paid Leave Available"
          value={`${Math.max(0, 15 - approvedLeavesCount)} / 15`}
          subtitle="12 Paid • 5 Sick days allotted"
          icon={CalendarCheck}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingLeaves}
          subtitle={pendingLeaves > 0 ? "Awaiting HR review" : "No pending requests"}
          icon={AlertCircle}
        />
        <StatCard
          title="Net Monthly Pay"
          value={`$${currentUser.salary.netPay.toLocaleString()}`}
          subtitle="Direct deposit ready"
          icon={CreditCard}
        />
        <StatCard
          title="Shift Attendance Rate"
          value="94.5%"
          subtitle="Above organization average"
          icon={TrendingUp}
          trend={{ value: '2.1%', isPositive: true }}
        />
      </div>

      {/* Recent Leave Request Activity */}
      <div className="hr-panel p-5">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
            Recent Leave Applications
          </h3>
          <button
            onClick={() => onNavigate('leave')}
            className="text-xs font-semibold text-blue-700 hover:underline"
          >
            Manage all
          </button>
        </div>

        <div className="space-y-2">
          {userLeaves.slice(0, 3).map((leave) => (
            <div
              key={leave.id}
              className="p-3 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-semibold text-slate-900">
                  {leave.type} Leave ({leave.daysCount} days)
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {leave.startDate} to {leave.endDate} • {leave.reason}
                </div>
                {leave.adminComment && (
                  <div className="text-[10px] text-slate-600 italic mt-0.5">
                    HR Note: "{leave.adminComment}"
                  </div>
                )}
              </div>
              <LeaveBadge status={leave.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
