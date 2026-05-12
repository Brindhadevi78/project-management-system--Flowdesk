import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isLogin && form.password !== form.confirm) {
      setError('Passwords do not match'); return;
    }
    if (!isLogin && form.password.length < 6) {
      setError('Password must be at least 6 characters'); return;
    }
    setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.email, form.password, form.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(v => !v);
    setError('');
    setForm({ name: '', email: '', password: '', confirm: '' });
  };

  return (
    <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-300/40 bg-white">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-brand-purple-800 to-brand-purple-900 p-12 text-white relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-brand-orange-500/20 rounded-full blur-2xl"></div>

          {/* Logo */}
          <div className="flex items-center gap-2 relative z-10">
            <div className="flex gap-[3px]">
              <div className="w-2 h-5 bg-brand-orange-500 rounded-full"></div>
              <div className="w-2 h-7 bg-white/80 rounded-full -mt-2"></div>
              <div className="w-2 h-5 bg-green-400 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">FlowDesk</h1>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Manage your projects smarter.
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-8">
              Track tasks, collaborate with your team, and hit every deadline — all in one place.
            </p>
            <div className="flex flex-col gap-3">
              {['Create & manage projects', 'Track tasks with priorities', 'Collaborate with your team', 'Real-time progress tracking'].map(f => (
                <div key={f} className="flex items-center gap-3 text-sm font-medium text-white/80">
                  <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center shrink-0">
                    <i className="ph-fill ph-check text-green-400 text-xs"></i>
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/30 text-xs relative z-10">© 2025 FlowDesk. All rights reserved.</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col justify-center p-10 md:p-14">
          <div className="max-w-sm w-full mx-auto">

            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-8 md:hidden">
              <div className="flex gap-[2px]">
                <div className="w-1.5 h-4 bg-brand-orange-500 rounded-full"></div>
                <div className="w-1.5 h-6 bg-brand-purple-800 rounded-full -mt-2"></div>
                <div className="w-1.5 h-4 bg-green-400 rounded-full"></div>
              </div>
              <h1 className="text-xl font-extrabold text-brand-purple-900">FlowDesk</h1>
            </div>

            <h2 className="text-3xl font-extrabold text-black mb-1">
              {isLogin ? 'Welcome back!' : 'Create account'}
            </h2>
            <p className="text-slate-400 text-sm mb-8">
              {isLogin ? 'Sign in to your workspace.' : 'Start managing your projects today.'}
            </p>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium px-4 py-3 rounded-2xl mb-5 flex items-center gap-2">
                <i className="ph-fill ph-warning-circle text-lg shrink-0"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <i className="ph ph-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input required type="text" value={form.name} onChange={set('name')} placeholder="John Doe"
                      className="w-full bg-slate-50 rounded-2xl pl-11 pr-4 py-3.5 font-medium text-black focus:ring-2 focus:ring-brand-purple-800 outline-none border-none" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Email</label>
                <div className="relative">
                  <i className="ph ph-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input required type="email" value={form.email} onChange={set('email')} placeholder="you@example.com"
                    className="w-full bg-slate-50 rounded-2xl pl-11 pr-4 py-3.5 font-medium text-black focus:ring-2 focus:ring-brand-purple-800 outline-none border-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Password</label>
                <div className="relative">
                  <i className="ph ph-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input required type="password" value={form.password} onChange={set('password')} placeholder="••••••••"
                    className="w-full bg-slate-50 rounded-2xl pl-11 pr-4 py-3.5 font-medium text-black focus:ring-2 focus:ring-brand-purple-800 outline-none border-none" />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Confirm Password</label>
                  <div className="relative">
                    <i className="ph ph-lock-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input required type="password" value={form.confirm} onChange={set('confirm')} placeholder="••••••••"
                      className="w-full bg-slate-50 rounded-2xl pl-11 pr-4 py-3.5 font-medium text-black focus:ring-2 focus:ring-brand-purple-800 outline-none border-none" />
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-brand-purple-800 text-white font-bold py-4 rounded-2xl mt-2 hover:bg-brand-purple-900 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading
                  ? <><i className="ph ph-spinner-gap animate-spin text-lg"></i> Please wait...</>
                  : isLogin ? 'Sign In' : 'Create Account'
                }
              </button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={switchMode} className="text-brand-purple-800 font-bold hover:underline">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
