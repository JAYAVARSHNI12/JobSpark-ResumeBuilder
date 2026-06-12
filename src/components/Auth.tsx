import React, { useState } from 'react';
import { UserPlus, LogIn, ShieldAlert, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
  onCancel: () => void;
}

export default function Auth({ onAuthSuccess, onCancel }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (password.length < 5) {
      setError('Password must be at least 5 characters.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Fetch users database simulation
      const usersStr = localStorage.getItem('jobspark_users') || '[]';
      const users = JSON.parse(usersStr) as { id: string; username: string; passwordHash: string }[];

      const lowercaseUsername = username.trim().toLowerCase();

      if (isLogin) {
        // Authenticate
        const user = users.find(u => u.username.toLowerCase() === lowercaseUsername);
        if (!user || user.passwordHash !== password) {
          setError('Invalid username or password. (Hint: Create an account if new!)');
          setLoading(false);
          return;
        }

        setSuccess('Authentication successful! Logging in...');
        setTimeout(() => {
          onAuthSuccess({ id: user.id, username: user.username });
        }, 800);
      } else {
        // Register
        const exists = users.some(u => u.username.toLowerCase() === lowercaseUsername);
        if (exists) {
          setError('This username is already taken. Please try another.');
          setLoading(false);
          return;
        }

        const newUser = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          username: username.trim(),
          passwordHash: password // local sandbox, store securely or plain for educational purposes
        };

        users.push(newUser);
        localStorage.setItem('jobspark_users', JSON.stringify(users));

        setSuccess('Account created successfully! Switching to login...');
        setTimeout(() => {
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
          setLoading(false);
        }, 1200);
      }
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 no-print" id="auth-root-pane">
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl flex flex-col space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-xl mx-auto">
            {isLogin ? <LogIn className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
          </div>
          <h2 className="text-2xl font-black text-slate-800" id="auth-form-title">
            {isLogin ? 'Welcome Back' : 'Create Student Account'}
          </h2>
          <p className="text-slate-500 text-xs">
            {isLogin
              ? 'Sign in to customize templates, save resumes, and manage downloads.'
              : 'Sign up to start designing and export your layouts.'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-start gap-2 border border-red-100 animate-shake">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs flex items-start gap-2 border border-emerald-100">
            <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" id="credentials-form">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Username</label>
            <input
              type="text"
              required
              disabled={loading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alex_student"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 text-slate-800 placeholder-slate-400 text-sm"
              id="inp-username"
            />
          </div>

          <div className="space-y-1 relative">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 text-slate-800 placeholder-slate-400 text-sm"
                id="inp-password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">Min. 5 characters long</p>
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 text-slate-800 placeholder-slate-400 text-sm"
                id="inp-confirm-password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all focus:outline-none cursor-pointer flex items-center justify-center gap-2 ${
              loading ? 'opacity-80 cursor-wait' : ''
            }`}
            id="btn-auth-submit"
          >
            {loading ? (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            ) : isLogin ? (
              <>
                <LogIn className="h-4 w-4" />
                <span>Sign In to Dashboard</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Register Account</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 border-t border-slate-50 pt-4" id="auth-footer text">
          {isLogin ? (
            <p>
              New user?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className="text-cyan-600 hover:underline font-semibold cursor-pointer"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className="text-cyan-600 hover:underline font-semibold cursor-pointer"
              >
                Sign in with credentials
              </button>
            </p>
          )}

          <div className="mt-3">
            <button
              onClick={onCancel}
              className="text-slate-400 underline hover:text-slate-600 cursor-pointer p-1"
            >
              Cancel and Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
