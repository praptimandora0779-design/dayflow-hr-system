import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  BarChart3,
  User,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'ADMIN';

  const adminNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employee Directory', icon: Users },
    { id: 'attendance', label: 'Attendance Master', icon: Clock },
    { id: 'leave', label: 'Leave Requests', icon: CalendarCheck },
    { id: 'payroll', label: 'Payroll & Slips', icon: CreditCard },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
  ];

  const employeeNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'My Attendance', icon: Clock },
    { id: 'leave', label: 'My Leave', icon: CalendarCheck },
    { id: 'payroll', label: 'My Salary Slip', icon: CreditCard },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const items = isAdmin ? adminNav : employeeNav;

  return (
    <aside className="w-full md:w-64 glass-panel border-r border-slate-200/80 p-4 shrink-0">
      <div className="mb-4 px-3 py-2 rounded-xl bg-slate-100/80 border border-slate-200/60 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {isAdmin ? 'HR Admin Suite' : 'Employee Portal'}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Role info badge in sidebar */}
      <div className="mt-8 p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-xs">
        <div className="flex items-center justify-between font-bold">
          <span>{currentUser.name}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500 text-white uppercase">
            {currentUser.role}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 truncate">{currentUser.email}</p>
        <div className="mt-2 pt-2 border-t border-slate-700 text-[10px] text-slate-400 flex justify-between">
          <span>Dept: {currentUser.department}</span>
          <span>ID: {currentUser.employeeId}</span>
        </div>
      </div>
    </aside>
  );
};
