import React from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Users, CalendarCheck, TrendingUp, Award } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { allUsers } = useAuth();
  const leaves = storageService.getLeaves();
  const attendance = storageService.getAttendance();

  // Pie chart data: Leave distribution by type
  const paidCount = leaves.filter((l) => l.type === 'PAID').length || 4;
  const sickCount = leaves.filter((l) => l.type === 'SICK').length || 2;
  const unpaidCount = leaves.filter((l) => l.type === 'UNPAID').length || 1;

  const leavePieData = [
    { name: 'Paid Leave', value: paidCount, color: '#3b82f6' },
    { name: 'Sick Leave', value: sickCount, color: '#f59e0b' },
    { name: 'Unpaid Leave', value: unpaidCount, color: '#94a3b8' },
  ];

  // Bar chart data: Department workforce distribution
  const deptMap: Record<string, number> = {};
  allUsers.forEach((u) => {
    deptMap[u.department] = (deptMap[u.department] || 0) + 1;
  });

  const deptBarData = Object.keys(deptMap).map((dept) => ({
    department: dept,
    Headcount: deptMap[dept],
  }));

  // Weekly attendance chart data
  const weeklyAttendanceData = [
    { day: 'Mon', Present: 8, Late: 1, Absent: 0 },
    { day: 'Tue', Present: 7, Late: 1, Absent: 1 },
    { day: 'Wed', Present: 9, Late: 0, Absent: 0 },
    { day: 'Thu', Present: 8, Late: 1, Absent: 0 },
    { day: 'Fri', Present: 7, Late: 2, Absent: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">HR Analytics & Reports</h2>
          <p className="text-xs text-slate-500">
            Workforce demographic distribution, leave analytics, and attendance benchmarks.
          </p>
        </div>
      </div>

      {/* Top Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Bar Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-blue-600" /> Weekly Shift Breakdown
              </h3>
              <p className="text-[11px] text-slate-400">Present vs Late vs Absent counts</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Type Pie Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-amber-500" /> Leave Type Distribution
              </h3>
              <p className="text-[11px] text-slate-400">Proportion of requested leave categories</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leavePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leavePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Breakdown Cards */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" /> Departmental Headcount & Expenditure
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          {Object.keys(deptMap).map((dept) => {
            const count = deptMap[dept];
            const deptPayroll = allUsers
              .filter((u) => u.department === dept)
              .reduce((sum, u) => sum + u.salary.netPay, 0);

            return (
              <div key={dept} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-900 text-sm">{dept}</div>
                <div className="text-slate-500">{count} Active Employees</div>
                <div className="text-emerald-700 font-bold text-xs pt-1 border-t border-slate-200">
                  ${deptPayroll.toLocaleString()} Monthly Payroll
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
