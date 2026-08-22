import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Bell,
  Check,
  RefreshCw,
  LogOut,
  ChevronDown,
  UserCheck,
  Building2,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    allUsers,
    switchRoleUser,
    logout,
    resetDemoData,
    notifications,
    unreadCount,
    markAllAsRead,
  } = useAuth();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Calendar className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">Dayflow</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Hackathon Demo
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Every workday, perfectly aligned.
            </p>
          </div>
        </div>

        {/* Right Section: Role Switcher & Profile & Notifications */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Quick Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition border border-slate-200"
              title="Switch user role for live demo"
            >
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">Demo Switcher:</span>
              <span className="text-blue-700 font-bold">{currentUser.name}</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded bg-slate-200 font-medium">
                {currentUser.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Switch Active Persona
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>

                <div className="max-h-64 overflow-y-auto py-1">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchRoleUser(user.id);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50/60 transition ${
                        user.id === currentUser.id ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 overflow-hidden">
                        <img
                          src={user.photoUrl}
                          alt={user.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="truncate">
                          <p className="font-semibold leading-tight truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{user.jobTitle}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 px-2 pt-1.5 mt-1">
                  <button
                    onClick={() => {
                      resetDemoData();
                      setShowRoleMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-medium flex items-center justify-center space-x-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Seed Demo Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowRoleMenu(false);
              }}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-blue-600 hover:underline font-medium flex items-center space-x-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs transition ${n.read ? 'bg-white' : 'bg-blue-50/50'}`}
                      >
                        <p className="font-semibold text-slate-900">{n.title}</p>
                        <p className="text-slate-600 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <img
              src={currentUser.photoUrl}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 font-medium">{currentUser.jobTitle}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
