import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant bg-surface mt-24 text-outline text-sm">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs tracking-tighter">
                A
              </div>
              <span className="font-bold text-xl tracking-tighter text-on-surface">Aurelius</span>
            </div>
            <p className="text-on-surface-variant text-sm max-w-sm leading-relaxed">
              Full-stack blogging platform with content management, user interactions, and discussions.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-8 text-sm">
            <Link href="/" className="text-on-surface font-medium hover:underline">Articles</Link>
            <Link href="/create" className="text-on-surface font-medium hover:underline">Write Post</Link>
            <Link href="/auth" className="text-on-surface font-medium hover:underline">Account</Link>
          </div>
        </div>

        <div className="pt-8 border-t border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between text-xs text-outline">
          <div>
            © 2026 Aurelius Blog Platform. All rights reserved.
          </div>
          <div className="mt-4 sm:mt-0 font-mono">
            Vercel Serverless Ready
          </div>
        </div>
      </div>
    </footer>
  );
}
