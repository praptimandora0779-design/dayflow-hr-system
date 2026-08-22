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
  UserCheck,
  Building,
  Sparkles,
  MapPin,
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
    const today = new Date().toISOString().split('T')[0];
    const userAtt = storageService.getUserAttendance(currentUser.id);
    setTodayRecord(userAtt.find((a) => a.date === today) || null);
  };

  const handleCheckOut = () => {
    storageService.recordCheckOut(currentUser.id);
    const today = new Date().toISOString().split('T')[0];
    const userAtt = storageService.getUserAttendance(currentUser.id);
    setTodayRecord(userAtt.find((a) => a.date === today) || null);
  };

  const pendingLeaves = userLeaves.filter((l) => l.status === 'PENDING').length;
  const approvedLeavesCount = userLeaves.filter((l) => l.status === 'APPROVED').reduce((acc, l) => acc + l.daysCount, 0);

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center space-x-3.5">
          <img
            src={currentUser.photoUrl}
            alt={currentUser.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-blue-500/20 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
                Good day, {currentUser.name}
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE SHIFT
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {currentUser.jobTitle} • {currentUser.department} Department • {currentUser.email}
            </p>
          </div>
        </div>

        <div className="sm:text-right bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/80 shrink-0">
          <p className="text-lg font-bold font-mono tracking-tight text-slate-900 tabular-nums leading-none">
            {timeStr}
          </p>
          <p className="text-[11px] text-slate-500 font-mono mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Hero Workspace: Today's Action Dock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Shift & Clocking Card (Hero Position - 8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                  Today's Shift Status
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Daily Attendance Clocking</h3>
              </div>
              {todayRecord && <AttendanceBadge status={todayRecord.status} />}
            </div>

            <div className="my-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
              <div>
                {todayRecord?.checkIn ? (
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Shift started at <strong className="font-mono tabular-nums text-blue-600">{todayRecord.checkIn}</strong></span>
                    </div>
                    {todayRecord.checkOut ? (
                      <p className="text-xs text-slate-500 pl-6 font-mono">
                        Shift ended at {todayRecord.checkOut} ({todayRecord.workHours || 8} hrs logged)
                      </p>
                    ) : (
                      <p className="text-xs text-emerald-700 pl-6 font-mono">
                        Shift currently active • Logging standard working hours
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Shift Check-In Pending</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Click the button on the right to start your workday log.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="w-full sm:w-auto shrink-0">
                {!todayRecord?.checkIn ? (
                  <button
                    onClick={handleCheckIn}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Clock In Now</span>
                  </button>
                ) : !todayRecord?.checkOut ? (
                  <button
                    onClick={handleCheckOut}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md shadow-amber-600/20 flex items-center justify-center space-x-2 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Clock Out Shift</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-mono text-xs font-semibold border border-emerald-200 inline-block">
                    ✓ Shift Completed ({todayRecord.workHours || 8} hrs)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Standard Shift: 09:00 AM - 05:30 PM
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Main HQ Office
            </span>
          </div>
        </div>

        {/* Shortcuts & Action Card (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Quick Self-Service
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5 mb-3">Employee Actions</h3>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('leave')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-semibold flex items-center justify-between transition border border-slate-200 cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4 text-blue-600" /> Apply for Paid Leave
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('payroll')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-semibold flex items-center justify-between transition border border-slate-200 cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-purple-600" /> Download Payslip PDF
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pending Leave Requests:</span>
            <strong className="text-slate-900 font-mono font-bold">{pendingLeaves}</strong>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Paid Leave Balance"
          value={`${Math.max(0, 15 - approvedLeavesCount)} / 15`}
          subtitle="12 Paid • 5 Sick days allotted"
          icon={CalendarCheck}
          accentColor="blue"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingLeaves}
          subtitle={pendingLeaves > 0 ? "Awaiting HR manager review" : "No pending requests"}
          icon={AlertCircle}
          accentColor="amber"
        />
        <StatCard
          title="Net Take-Home Pay"
          value={`$${currentUser.salary.netPay.toLocaleString()}`}
          subtitle="Direct deposit ready"
          icon={CreditCard}
          accentColor="purple"
        />
        <StatCard
          title="Attendance Score"
          value="94.5%"
          subtitle="Above company benchmark"
          icon={TrendingUp}
          trend={{ value: '2.1%', isPositive: true }}
          accentColor="emerald"
        />
      </div>

      {/* Recent Leave Application History */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
            Recent Leave Applications
          </h3>
          <button
            onClick={() => onNavigate('leave')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {userLeaves.slice(0, 3).map((leave) => (
            <div
              key={leave.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-bold text-slate-900">
                  {leave.type} Leave ({leave.daysCount} {leave.daysCount === 1 ? 'day' : 'days'})
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {leave.startDate} to {leave.endDate} • {leave.reason}
                </div>
                {leave.adminComment && (
                  <div className="text-[11px] text-slate-600 italic mt-1 bg-white p-2 rounded-lg border border-slate-200">
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
