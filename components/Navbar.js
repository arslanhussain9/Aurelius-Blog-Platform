'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { 
  PenSquare, 
  LogIn, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  BookOpen,
  ArrowRight
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
    <nav className="fixed top-0 w-full z-50 border-b border-outline-variant bg-surface/85 backdrop-blur-xl transition-all shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm tracking-tighter">
            A
          </div>
          <span className="text-2xl font-bold tracking-tighter text-on-surface group-hover:opacity-80 transition-opacity">
            Aurelius
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container-high border border-outline-variant text-on-surface-variant font-medium">
            Blog
          </span>
        </Link>

        {/* Navigation Links (Web) */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className={`tracking-tight font-medium text-sm transition-all pb-1 ${
              pathname === '/'
                ? 'text-on-surface font-semibold border-b-2 border-on-surface'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            Articles
          </Link>
          <Link
            href="/create"
            className={`tracking-tight font-medium text-sm transition-all pb-1 flex items-center gap-1.5 ${
              pathname === '/create'
                ? 'text-on-surface font-semibold border-b-2 border-on-surface'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <PenSquare className="w-3.5 h-3.5" />
            Write Post
          </Link>
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <Link
                href="/create"
                className="bg-primary text-on-primary font-medium text-sm px-5 py-2.5 rounded-full hover:opacity-90 active:scale-95 duration-200 transition-all flex items-center gap-2 shadow-sm"
              >
                <PenSquare className="w-4 h-4" />
                Write Post
              </Link>

              <div className="flex items-center space-x-3 pl-3 border-l border-outline-variant">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`}
                  alt={user.name || user.username}
                  className="w-8 h-8 rounded-full border border-outline-variant object-cover"
                />
                <div className="text-left text-xs">
                  <div className="font-semibold text-on-surface leading-tight">{user.name || user.username}</div>
                  <div className="text-on-surface-variant text-[10px] capitalize font-mono">
                    {user.role}
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 rounded-full text-outline hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleQuickDemo}
                disabled={isDemoLoading}
                className="border border-outline-variant text-on-surface font-medium text-xs px-4 py-2 rounded-full hover:bg-surface-container transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                {isDemoLoading ? 'Loading...' : '1-Click Demo'}
              </button>

              <Link
                href="/auth"
                className="bg-primary text-on-primary font-medium text-sm px-6 py-2.5 rounded-full hover:opacity-90 active:scale-95 duration-200 transition-all shadow-sm"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {!user && (
            <button
              onClick={handleQuickDemo}
              className="text-xs px-3 py-1.5 rounded-full bg-surface-container text-on-surface border border-outline-variant font-medium"
            >
              Demo
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-on-surface"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface p-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container"
          >
            Articles
          </Link>
          <Link
            href="/create"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container"
          >
            Write Post
          </Link>

          <div className="pt-3 border-t border-outline-variant">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-outline-variant"
                  />
                  <div>
                    <div className="text-sm font-semibold text-on-surface">{user.name}</div>
                    <div className="text-xs text-outline">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold"
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
                  className="py-2.5 text-center rounded-full bg-surface-container text-on-surface border border-outline-variant text-xs font-semibold"
                >
                  Demo Login
                </button>
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-full bg-primary text-on-primary text-xs font-semibold"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
