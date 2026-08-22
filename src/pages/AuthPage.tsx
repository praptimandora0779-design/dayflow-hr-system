import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, UserCheck, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, allUsers, switchRoleUser } = useAuth();
  const [email, setEmail] = useState('');
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
      setError('Please enter your email');
      return;
    }
    const success = login(email);
    if (!success) {
      setError('User not found. Try one of the preset quick demo accounts below.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md glass-card bg-slate-900/90 border-slate-800 text-white rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
            <Calendar className="w-7 h-7 text-white stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Dayflow HRMS</h1>
          <p className="text-xs text-slate-400 mt-1">Every workday, perfectly aligned.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-slate-800/80 p-1 mb-6 border border-slate-700/60">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              !isSignUp ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              isSignUp ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {!isSignUp ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="e.g. alex.morgan@dayflow.hr"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center space-x-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-xs text-slate-300">
            <p className="text-center text-slate-400">
              In hackathon mode, instant sign up is auto-approved with fake token verification.
            </p>
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Work Email</label>
              <input
                type="email"
                placeholder="jane.doe@dayflow.hr"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Role</label>
              <select
                value={signupForm.role}
                onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">HR Admin / HR Officer</option>
              </select>
            </div>
            <button
              onClick={() => {
                if (signupForm.email) login(signupForm.email);
              }}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition"
            >
              Create Account & Sign In
            </button>
          </div>
        )}

        {/* Demo Quick Sign-in Section */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Hackathon Demo Logins
            </span>
          </div>

          <div className="space-y-2">
            {allUsers.slice(0, 3).map((usr) => (
              <button
                key={usr.id}
                onClick={() => switchRoleUser(usr.id)}
                className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 flex items-center justify-between text-left transition group"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={usr.photoUrl}
                    alt={usr.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-600"
                  />
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-blue-400 transition">
                      {usr.name}
                    </p>
                    <p className="text-[10px] text-slate-400">{usr.jobTitle}</p>
                  </div>
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    usr.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {usr.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
