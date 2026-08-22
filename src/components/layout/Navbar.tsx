import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  Check,
  RefreshCw,
  LogOut,
  ChevronDown,
  UserCheck,
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
    <header className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Name & Tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center font-black text-xs">
            D
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-bold text-base tracking-tight text-slate-900">Dayflow</span>
            <span className="text-xs text-slate-500 font-normal hidden sm:inline">
              Every workday, perfectly aligned.
            </span>
          </div>
        </div>

        {/* Right Section: Persona Switcher & Notifications & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center space-x-2 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition border border-slate-200"
              title="Switch user role for live demo"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline text-slate-500">Active Persona:</span>
              <span className="font-semibold text-slate-900">{currentUser.name}</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded font-mono font-semibold bg-slate-200 text-slate-700 uppercase">
                {currentUser.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 font-mono uppercase">
                  Switch Active Persona
                </div>

                <div className="max-h-60 overflow-y-auto py-1">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchRoleUser(user.id);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                        user.id === currentUser.id ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <img
                          src={user.photoUrl}
                          alt={user.name}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="truncate">
                          <p className="font-semibold leading-tight text-slate-900 truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{user.jobTitle}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase shrink-0 ${
                          user.role === 'ADMIN' ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 px-2 pt-1 mt-1">
                  <button
                    onClick={() => {
                      resetDemoData();
                      setShowRoleMenu(false);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded-md font-medium flex items-center justify-center space-x-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Seed Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowRoleMenu(false);
              }}
              className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition border border-slate-200 relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-blue-700 hover:underline font-medium flex items-center space-x-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-400">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs transition ${n.read ? 'bg-white' : 'bg-slate-50'}`}
                      >
                        <p className="font-semibold text-slate-900">{n.title}</p>
                        <p className="text-slate-600 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block font-mono">{n.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <img
              src={currentUser.photoUrl}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-300"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 font-normal">{currentUser.jobTitle}</div>
            </div>
            <button
              onClick={logout}
              className="p-1 text-slate-400 hover:text-rose-700 transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
