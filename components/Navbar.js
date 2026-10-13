'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { 
  BookOpen, 
  PenSquare, 
  LogIn, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  Compass
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const pathname = usePathname();

  const handleQuickDemo = async () => {
    setIsDemoLoading(true);
    try {
      await demoLogin('admin');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-auralis-border bg-auralis-bg/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 p-[1.5px] shadow-glow-indigo transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-auralis-bg rounded-[10px] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                DevBlog
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                COMMUNITY
              </span>
            </div>
            <p className="text-[11px] text-auralis-textMuted hidden sm:block -mt-1">
              Read, Write & Discuss
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              pathname === '/'
                ? 'text-white bg-indigo-500/15 border border-indigo-500/30 shadow-sm'
                : 'text-auralis-textMuted hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            Explore Articles
          </Link>
          <Link
            href="/create"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              pathname === '/create'
                ? 'text-white bg-indigo-500/15 border border-indigo-500/30 shadow-sm'
                : 'text-auralis-textMuted hover:text-white hover:bg-white/5'
            }`}
          >
            <PenSquare className="w-4 h-4 text-indigo-400" />
            Write Post
          </Link>
        </nav>

        {/* User Account / Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/create"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-sm font-medium hover:from-indigo-500 hover:to-cyan-500 shadow-glow-indigo transition-all transform hover:-translate-y-0.5"
              >
                <PenSquare className="w-4 h-4" />
                Write Post
              </Link>

              <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`}
                  alt={user.name || user.username}
                  className="w-8 h-8 rounded-full border border-indigo-500/40 object-cover"
                />
                <div className="text-left text-xs">
                  <div className="font-semibold text-white leading-tight">{user.name || user.username}</div>
                  <div className="text-auralis-textMuted text-[10px] capitalize font-mono text-cyan-400">
                    {user.role}
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-auralis-textMuted hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleQuickDemo}
                disabled={isDemoLoading}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                {isDemoLoading ? 'Loading...' : '1-Click Demo Login'}
              </button>

              <Link
                href="/auth"
                className="px-4 py-1.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {!user && (
            <button
              onClick={handleQuickDemo}
              className="text-xs px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-medium"
            >
              Demo
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-auralis-textMuted hover:text-white hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-auralis-border bg-auralis-bg/95 p-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-auralis-textLight hover:bg-white/5"
          >
            Explore Articles
          </Link>
          <Link
            href="/create"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-auralis-textLight hover:bg-white/5"
          >
            Write Post
          </Link>

          <div className="pt-3 border-t border-white/10">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-indigo-500/40"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">{user.name}</div>
                    <div className="text-xs text-cyan-400 font-mono">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleQuickDemo();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-center rounded-lg bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 text-sm font-medium"
                >
                  Demo Login
                </button>
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center rounded-lg bg-indigo-600 text-white text-sm font-medium"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
