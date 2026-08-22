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
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div className="glass-card rounded-3xl p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            Employee Workspace
          </span>
          <h2 className="text-2xl font-bold tracking-tight mt-2">Welcome back, {currentUser.name}!</h2>
          <p className="text-blue-100 text-xs mt-1">
            {currentUser.jobTitle} • {currentUser.department} Department
          </p>
        </div>

        {/* Digital Time & Date */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 text-right shrink-0">
          <p className="text-2xl font-black tracking-wider font-mono">{timeStr}</p>
          <p className="text-[11px] text-blue-100 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Main Grid: Check-In Widget + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Interactive Attendance Check-In Widget */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Daily Attendance Clock
            </h3>
            {todayRecord && <AttendanceBadge status={todayRecord.status} />}
          </div>

          <div className="my-6 text-center">
            {todayRecord?.checkIn ? (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Checked In at {todayRecord.checkIn}
                </div>
                {todayRecord.checkOut && (
                  <p className="text-xs text-slate-500">Checked Out at {todayRecord.checkOut}</p>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-500">
                You haven't checked in yet for today.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {!todayRecord?.checkIn ? (
              <button
                onClick={handleCheckIn}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Clock In Now</span>
              </button>
            ) : !todayRecord?.checkOut ? (
              <button
                onClick={handleCheckOut}
                className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Clock Out Now</span>
              </button>
            ) : (
              <div className="w-full py-2.5 rounded-2xl bg-slate-100 text-slate-500 font-semibold text-xs text-center border border-slate-200">
                Shift Completed ({todayRecord.workHours || 8} hrs logged)
              </div>
            )}
          </div>
        </div>

        {/* Stats Columns */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Leave Balance Remaining"
            value={`${Math.max(0, 15 - approvedLeavesCount)} / 15 Days`}
            subtitle="12 Paid • 5 Sick Days allotted annually"
            icon={CalendarCheck}
            colorScheme="blue"
          />
          <StatCard
            title="Pending Leave Requests"
            value={pendingLeaves}
            subtitle={pendingLeaves > 0 ? "Awaiting HR approval" : "No pending requests"}
            icon={AlertCircle}
            colorScheme="amber"
          />
          <StatCard
            title="Monthly Take-Home Salary"
            value={`$${currentUser.salary.netPay.toLocaleString()}`}
            subtitle="Basic + Allowances - Deductions"
            icon={CreditCard}
            colorScheme="emerald"
          />
          <StatCard
            title="Work Attendance Rate"
            value="94.5%"
            subtitle="Above company 90% benchmark"
            icon={TrendingUp}
            colorScheme="purple"
            trend={{ value: '2.1%', isPositive: true }}
          />
        </div>
      </div>

      {/* Quick Action Navigation Buttons & Recent Leave Requests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Shortcuts</h3>
          <button
            onClick={() => onNavigate('leave')}
            className="w-full p-3 rounded-2xl bg-blue-50 hover:bg-blue-100/80 text-blue-700 text-xs font-semibold flex items-center justify-between transition border border-blue-200"
          >
            <span className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4" /> Apply for Leave
            </span>
            <span>→</span>
          </button>
          <button
            onClick={() => onNavigate('payroll')}
            className="w-full p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 text-xs font-semibold flex items-center justify-between transition border border-emerald-200"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> Download Salary Slip
            </span>
            <span>→</span>
          </button>
        </div>

        <div className="md:col-span-2 glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recent Leave Requests
            </h3>
            <button
              onClick={() => onNavigate('leave')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-2">
            {userLeaves.slice(0, 3).map((leave) => (
              <div
                key={leave.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-800">
                    {leave.type} Leave ({leave.daysCount} days)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {leave.startDate} to {leave.endDate} • {leave.reason}
                  </div>
                  {leave.adminComment && (
                    <div className="text-[10px] text-blue-600 font-medium mt-0.5">
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
    </div>
  );
};
