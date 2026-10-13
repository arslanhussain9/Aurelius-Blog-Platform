'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { useAuth } from '@/components/AuthContext';
import { 
  Sparkles, 
  Search, 
  Filter, 
  PenSquare, 
  SlidersHorizontal, 
  Activity, 
  Layers, 
  Zap, 
  Terminal, 
  Radio, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function HomePage() {
  const { user, demoLogin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('latest');

  const categories = ['All', 'AI Infrastructure', 'Web Engineering', 'SaaS Strategy'];

  useEffect(() => {
    fetchPosts();
  }, [search, selectedCategory, sortOrder]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCategory !== 'All') params.set('category', selectedCategory);
      if (sortOrder) params.set('sort', sortOrder);

      const res = await fetch(`/api/posts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDeleted = (deletedId) => {
    setPosts(prev => prev.filter(p => p.id !== deletedId));
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden border border-indigo-500/20 bg-gradient-to-b from-auralis-card/90 via-auralis-bg to-auralis-card/40 shadow-2xl">
        {/* Ambient background glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>AURALIS // ENTERPRISE AI VOICE INFRASTRUCTURE</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Engineering Sub-80ms Real-Time Voice & <span className="gradient-text">Full-Stack Systems</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-auralis-textMuted leading-relaxed">
            A developer publication and community platform covering streaming acoustic tokens, WebSockets, RESTful API design, and modern full-stack architectures.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/create"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-glow-indigo transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <PenSquare className="w-4 h-4" />
              Publish an Article
            </Link>

            <Link
              href="/stitch"
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              Stitch MCP Setup
            </Link>

            {!user && (
              <button
                onClick={() => demoLogin('admin')}
                className="px-5 py-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-medium text-sm transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                1-Click Demo Login
              </button>
            )}
          </div>
        </div>

        {/* Live Infrastructure Telemetry Cards */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-8">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
            <div className="text-xs text-auralis-textMuted font-mono flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Latency P95
            </div>
            <div className="text-2xl font-bold text-white mt-1 font-mono">68 ms</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">● Sub-100ms Target Met</div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
            <div className="text-xs text-auralis-textMuted font-mono flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-indigo-400" /> Concurrent Audio
            </div>
            <div className="text-2xl font-bold text-white mt-1 font-mono">52.4 k</div>
            <div className="text-[11px] text-auralis-textMuted font-mono mt-0.5">Active Channels</div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
            <div className="text-xs text-auralis-textMuted font-mono flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" /> Architecture
            </div>
            <div className="text-2xl font-bold text-white mt-1 font-mono">REST + WS</div>
            <div className="text-[11px] text-cyan-400 font-mono mt-0.5">Full Duplex Audio</div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
            <div className="text-xs text-auralis-textMuted font-mono flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" /> Deployment
            </div>
            <div className="text-2xl font-bold text-white mt-1 font-mono">Vercel</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">Serverless Ready</div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-glow-indigo'
                    : 'bg-auralis-card border border-auralis-border text-auralis-textMuted hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-auralis-textMuted" />
              <input
                type="text"
                placeholder="Search articles & tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-auralis-card border border-auralis-border text-sm text-white placeholder-auralis-textMuted focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 rounded-xl bg-auralis-card border border-auralis-border text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="latest">Latest Articles</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 rounded-2xl bg-auralis-card border border-auralis-border animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-black/20 p-8">
            <SlidersHorizontal className="w-10 h-10 text-auralis-textMuted/40 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No articles found</h3>
            <p className="text-sm text-auralis-textMuted mt-1 max-w-sm mx-auto">
              We couldn't find any articles matching "{search}". Try searching for another topic or reset filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="mt-5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostDeleted={handlePostDeleted}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
