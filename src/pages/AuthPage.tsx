import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ShieldCheck } from 'lucide-react';

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
      setError('Please enter your work email address');
      return;
    }
    const success = login(email);
    if (!success) {
      setError('User not found. Select a preset demo account below.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        {/* Header Logo & Name */}
        <div className="text-center mb-6">
          <div className="w-9 h-9 rounded-md bg-slate-900 text-white font-black text-sm flex items-center justify-center mx-auto mb-3">
            D
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Dayflow</h1>
          <p className="text-xs text-slate-500 mt-1 font-normal">Every workday, perfectly aligned.</p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex rounded-md bg-slate-100 p-0.5 mb-5 border border-slate-200">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition ${
              !isSignUp ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition ${
              isSignUp ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        {!isSignUp ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="alex.morgan@dayflow.hr"
                className="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs transition flex items-center justify-center space-x-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="space-y-3 text-xs text-slate-700">
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Work Email</label>
              <input
                type="email"
                placeholder="jane.doe@dayflow.hr"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Role</label>
              <select
                value={signupForm.role}
                onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value as any })}
                className="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-200 text-xs font-medium"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">HR Admin / Officer</option>
              </select>
            </div>
            <button
              onClick={() => {
                if (signupForm.email) login(signupForm.email);
              }}
              className="w-full py-2.5 px-3 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition"
            >
              Create Account & Sign In
            </button>
          </div>
        )}

        {/* Demo Quick Logins */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono mb-2">
            Preset Hackathon Demo Logins
          </div>

          <div className="space-y-1.5">
            {allUsers.slice(0, 3).map((usr) => (
              <button
                key={usr.id}
                onClick={() => switchRoleUser(usr.id)}
                className="w-full p-2 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left transition"
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={usr.photoUrl}
                    alt={usr.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-300"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 leading-none">{usr.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{usr.jobTitle}</p>
                  </div>
                </div>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold uppercase ${
                    usr.role === 'ADMIN' ? 'bg-slate-200 text-slate-800' : 'bg-slate-200 text-slate-700'
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
