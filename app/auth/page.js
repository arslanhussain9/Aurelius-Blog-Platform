'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { 
  LogIn, 
  UserPlus, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft, 
  Key, 
  Mail, 
  User, 
  Lock 
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { user, login, register, demoLogin } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register fields
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Already Signed In</h2>
        <p className="text-sm text-auralis-textMuted mb-6">
          You are currently logged in as <span className="text-cyan-400 font-semibold">{user.name || user.username}</span>.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-glow-indigo transition-all inline-block"
        >
          Return to Feed
        </Link>
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(emailOrUsername, password);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({
        username,
        email,
        password: regPassword,
        name,
        bio
      });
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setLoading(true);
    setError('');
    try {
      await demoLogin(role);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-auralis-textMuted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>
      </div>

      <div className="rounded-3xl bg-auralis-card border border-auralis-border p-6 sm:p-8 shadow-card">
        {/* Mode switcher tabs */}
        <div className="flex p-1 bg-black/40 rounded-xl border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login' ? 'bg-indigo-600 text-white shadow-glow-indigo' : 'text-auralis-textMuted hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register' ? 'bg-indigo-600 text-white shadow-glow-indigo' : 'text-auralis-textMuted hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Login Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Quick Demo Accounts (1-Click)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              disabled={loading}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-900/40 hover:bg-cyan-800/50 border border-cyan-500/30 text-white text-[11px] font-mono transition-all text-left"
            >
              <div className="font-semibold text-cyan-200">Elena Rostova</div>
              <div className="text-[10px] text-cyan-400">Admin Architect</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('member')}
              disabled={loading}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-900/40 hover:bg-cyan-800/50 border border-cyan-500/30 text-white text-[11px] font-mono transition-all text-left"
            >
              <div className="font-semibold text-cyan-200">Marcus Vance</div>
              <div className="text-[10px] text-cyan-400">Full-Stack Dev</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-auralis-textMuted" />
                <input
                  type="text"
                  required
                  placeholder="elena@auralis.ai or elena_ai"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-auralis-textMuted/50 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-auralis-textMuted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-auralis-textMuted/50 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-glow-indigo transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In to Auralis'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-1.5">
                Username *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. alex_voice"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-auralis-textMuted/50 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-auralis-textMuted/50 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="alex@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-auralis-textMuted/50 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-1.5">
                Password * (min 6 characters)
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-auralis-textMuted/50 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-1.5">
                Bio (optional)
              </label>
              <input
                type="text"
                placeholder="Full-stack engineer, acoustic models..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-auralis-textMuted/50 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-glow-indigo transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
