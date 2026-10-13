import React from 'react';
import Link from 'next/link';
import { Radio, Github, Twitter, Cpu, Terminal, Shield, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-auralis-border bg-black/60 mt-20 text-auralis-textMuted text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-glow-indigo"></span>
              <span className="font-extrabold text-white text-lg tracking-wider">AURALIS // SAAS PLATFORM</span>
            </div>
            <p className="text-auralis-textMuted max-w-md text-sm leading-relaxed">
              Enterprise AI Voice Infrastructure & Full-Stack Community Platform. Engineered for real-time acoustic streaming, sub-80ms speculative inference, and content workflows.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-cyan-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Edge Voice Nodes: 28 Regions
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Zero Data Retention
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 font-mono">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Articles & Feed</Link></li>
              <li><Link href="/create" className="hover:text-white transition-colors">Publish Post</Link></li>
              <li><Link href="/stitch" className="hover:text-white transition-colors">Stitch MCP Bridge</Link></li>
              <li><Link href="/auth" className="hover:text-white transition-colors">Account & Auth</Link></li>
            </ul>
          </div>

          {/* Deployment & Tech Stack */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 font-mono">Architecture</h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
                Next.js 14 App Router
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/10 text-cyan-300">
                JWT Stateless Auth + bcryptjs
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/10 text-indigo-300">
                Vercel Serverless Ready
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-auralis-textMuted">
          <div>
            © 2026 Auralis Inc. All rights reserved. Full-stack Blogging Platform with Comments.
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <span className="text-emerald-400">Status: All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
