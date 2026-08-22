import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Building,
  ArrowLeft,
  Sparkles,
  UserCheck,
} from 'lucide-react';

export const AuthPage: React.FC<{ onBackToHome?: () => void }> = ({ onBackToHome }) => {
  const { login, allUsers, switchRoleUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Sign up state
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    role: 'EMPLOYEE' as 'ADMIN' | 'EMPLOYEE',
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your work email address');
      return;
    }
    const success = login(email);
    if (!success) {
      setError('User email not found. Please pick a preset demo persona below.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email) {
      setError('Please fill in your name and work email address.');
      return;
    }
    login(signupForm.email);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Ambient background glow elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shadow-lg shadow-blue-500/25">
            D
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white block leading-none font-display">
              Dayflow
            </span>
            <span className="text-[11px] text-slate-400 font-medium">HRMS Workplatform</span>
          </div>
        </div>

        {/* {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-700/60 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Landing Page</span>
          </button>
        )} */}
      </header>

      {/* Main Content Split Grid */}
      <main className="w-full max-w-6xl mx-auto px-6 py-4 flex-1 flex items-center justify-center z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column: Brand Showcase (Visible on Large screens) */}
          <div className="lg:col-span-6 hidden lg:flex flex-col justify-center space-y-6 pr-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Human Resources OS</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
              Every workday, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200">
                perfectly aligned.
              </span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Streamline attendance tracking, instant leave approvals, automated salary slips, and department-level workforce analytics.
            </p>

            <div className="space-y-3.5 pt-2">
              {[
                { title: 'One-Click Attendance Clocking', desc: 'Real-time shift tracking & presence matrix' },
                { title: 'Instant Leave Triage Queue', desc: 'Approve or reject leave requests in a single tap' },
                { title: 'Automated PDF Payslips', desc: 'Compliant monthly salary structure computation' },
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{feat.title}</h4>
                    <p className="text-[11px] text-slate-400">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Enterprise Role Security</p>
                  <p className="text-[10px] text-slate-400">Role-based views for Employees and HR Admins</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-medium px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                ACTIVE DEMO
              </span>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative"
            >
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight font-display">
                  {!isSignUp ? 'Welcome Back to Dayflow' : 'Create Your Dayflow Account'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {!isSignUp
                    ? 'Enter your work email or select a preset demo persona below.'
                    : 'Get started with your company email to explore HR features.'}
                </p>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="flex rounded-lg bg-slate-900/80 p-1 mb-6 border border-slate-700/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError('');
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${!isSignUp
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError('');
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${isSignUp
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sign In / Sign Up Forms */}
              {!isSignUp ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Work Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                        placeholder="sarah.jenkins@dayflow.hr"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Password <span className="text-slate-500 font-normal">(Optional for demo)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 group cursor-pointer"
                  >
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        placeholder="jane.doe@dayflow.hr"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                          <Building className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          value={signupForm.department}
                          onChange={(e) => setSignupForm({ ...signupForm, department: e.target.value })}
                          className="w-full pl-8 pr-2 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Account Role</label>
                      <select
                        value={signupForm.role}
                        onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value as any })}
                        className="w-full px-2.5 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 transition font-medium"
                      >
                        <option value="EMPLOYEE">Employee</option>
                        <option value="ADMIN">HR Admin</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 cursor-pointer mt-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Create Account & Log In</span>
                  </button>
                </form>
              )}

              {/* Hackathon Demo Account Switcher */}
              <div className="mt-6 pt-5 border-t border-slate-700/60">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider font-mono">
                    Instant Demo Login (One-Click)
                  </span>
                  <span className="text-[10px] text-slate-400">Hackathon Mode</span>
                </div>

                <div className="space-y-2">
                  {allUsers.slice(0, 3).map((usr) => (
                    <button
                      key={usr.id}
                      type="button"
                      onClick={() => switchRoleUser(usr.id)}
                      className="w-full p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/70 hover:border-blue-500/50 flex items-center justify-between text-left transition group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={usr.photoUrl}
                          alt={usr.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-600 group-hover:border-blue-400 transition"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-100 leading-none group-hover:text-blue-300 transition">
                            {usr.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{usr.jobTitle}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-semibold uppercase ${usr.role === 'ADMIN'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                      >
                        {usr.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </main>

      {/* Footer minimal line */}
      <footer className="w-full text-center py-4 text-xs text-slate-500 z-10 border-t border-slate-800/80">
        Dayflow HRMS • Hackathon Demo Edition • Every workday, perfectly aligned.
      </footer>
    </div>
  );
};
