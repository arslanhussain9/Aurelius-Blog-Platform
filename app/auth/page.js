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
  User, 
  Lock 
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { user, login, register, demoLogin } = useAuth();

  const [mode, setMode] = useState('login');
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
      <div className="max-w-md mx-auto py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto mb-4 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-2">Already Signed In</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Logged in as <span className="font-semibold text-on-surface">{user.name || user.username}</span>.
        </p>
        <Link
          href="/"
          className="px-8 py-3 rounded-full bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-all inline-block shadow-sm"
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
    <div className="max-w-md mx-auto py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-outline hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>
      </div>

      <div className="rounded-[24px] bg-surface-container-lowest border border-outline-variant p-8 shadow-sm">
        {/* Mode Switcher Tabs */}
        <div className="flex p-1 bg-surface-container rounded-full border border-outline-variant mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
              mode === 'login' ? 'bg-primary text-on-primary shadow-sm' : 'text-outline hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
              mode === 'register' ? 'bg-primary text-on-primary shadow-sm' : 'text-outline hover:text-on-surface'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="mb-6 p-4 rounded-xl bg-surface-container border border-outline-variant">
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Quick Demo Accounts (1-Click)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              disabled={loading}
              className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant text-left transition-all"
            >
              <div className="font-semibold text-xs text-on-surface">Alex Rivera</div>
              <div className="text-[10px] text-outline">Author / Admin</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('member')}
              disabled={loading}
              className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant text-left transition-all"
            >
              <div className="font-semibold text-xs text-on-surface">Sophia Chen</div>
              <div className="text-[10px] text-outline">Member</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-outline uppercase mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="text"
                  required
                  placeholder="alex@example.com or alex_rivera"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-outline uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-full bg-primary text-on-primary font-semibold text-sm hover:opacity-90 active:scale-95 duration-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-outline uppercase mb-1.5">
                Username *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. dev_sarah"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-outline uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Miller"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-outline uppercase mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="sarah@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-outline uppercase mb-1.5">
                Password * (min 6 characters)
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-outline uppercase mb-1.5">
                Bio (optional)
              </label>
              <input
                type="text"
                placeholder="Frontend developer, writer..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-full bg-primary text-on-primary font-semibold text-sm hover:opacity-90 active:scale-95 duration-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
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
