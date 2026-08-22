import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AuthPage } from './pages/AuthPage';

// Employee pages
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { EmployeeAttendance } from './pages/EmployeeAttendance';
import { EmployeeLeave } from './pages/EmployeeLeave';
import { EmployeeSalary } from './pages/EmployeeSalary';
import { EmployeeProfile } from './pages/EmployeeProfile';

// Admin pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminEmployees } from './pages/AdminEmployees';
import { AdminAttendance } from './pages/AdminAttendance';
import { AdminLeaveQueue } from './pages/AdminLeaveQueue';
import { AdminPayroll } from './pages/AdminPayroll';
import { AdminAnalytics } from './pages/AdminAnalytics';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  if (!currentUser) {
    return <AuthPage />;
  }

  const isAdmin = currentUser.role === 'ADMIN';

  const renderView = () => {
    if (isAdmin) {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />;
        case 'employees':
          return <AdminEmployees />;
        case 'attendance':
          return <AdminAttendance />;
        case 'leave':
          return <AdminLeaveQueue />;
        case 'payroll':
          return <AdminPayroll />;
        case 'analytics':
          return <AdminAnalytics />;
        default:
          return <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
          return <EmployeeDashboard onNavigate={(tab) => setActiveTab(tab)} />;
        case 'attendance':
          return <EmployeeAttendance />;
        case 'leave':
          return <EmployeeLeave />;
        case 'payroll':
          return <EmployeeSalary />;
        case 'profile':
          return <EmployeeProfile />;
        default:
          return <EmployeeDashboard onNavigate={(tab) => setActiveTab(tab)} />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col md:flex-row gap-6">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 min-w-0">{renderView()}</main>
      </div>

      <footer className="border-t border-slate-200/80 bg-white/60 backdrop-blur-md py-4 text-center text-xs text-slate-500">
        Dayflow HRMS • Hackathon Demo Edition • Every workday, perfectly aligned.
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
