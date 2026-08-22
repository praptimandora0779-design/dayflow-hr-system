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
  ShieldCheck,
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
    <aside className="w-full md:w-60 bg-slate-900 rounded-xl p-3 text-slate-300 shrink-0 border border-slate-800 self-start">
      <div className="mb-4 px-3 py-2 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          {isAdmin ? 'HR Admin Portal' : 'Employee Portal'}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold border-l-2 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 stroke-[1.75] ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="mt-8 p-3 rounded-md bg-slate-950 border border-slate-800 text-slate-300 text-xs">
        <div className="flex items-center justify-between font-semibold">
          <span className="text-white truncate max-w-[110px]">{currentUser.name}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium bg-slate-800 text-slate-300 uppercase">
            {currentUser.role}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5 truncate font-mono">{currentUser.email}</p>
        <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between font-mono">
          <span>{currentUser.department}</span>
          <span>{currentUser.employeeId}</span>
        </div>
      </div>
    </aside>
  );
};
