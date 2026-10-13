import React from 'react';
import Link from 'next/link';
import { BookOpen, Heart, Code2, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-auralis-border bg-black/60 mt-20 text-auralis-textMuted text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-wider">DEVBLOG</span>
            </div>
            <p className="text-auralis-textMuted max-w-md text-sm leading-relaxed">
              A modern blogging platform with user registration, authentication, post publishing, and interactive comments. Built for developers to share insights and tutorials.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 font-mono">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Explore Articles</Link></li>
              <li><Link href="/create" className="hover:text-white transition-colors">Write a Post</Link></li>
              <li><Link href="/auth" className="hover:text-white transition-colors">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 font-mono">Tech Stack</h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
                Next.js 14 App Router
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/10 text-cyan-300">
                JWT Auth + bcryptjs
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/10 text-indigo-300">
                RESTful APIs + Tailwind
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-auralis-textMuted">
          <div>
            © 2026 DevBlog. Full-Stack Blogging Platform with Comments.
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" /> Built for Vercel Deployment
          </div>
        </div>
      </div>
    </footer>
  );
}
