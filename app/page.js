'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { useAuth } from '@/components/AuthContext';
import { 
  Sparkles, 
  Search, 
  PenSquare, 
  SlidersHorizontal, 
  BookOpen, 
  MessageSquare, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  Code2,
  Share2,
  Play
} from 'lucide-react';

export default function HomePage() {
  const { user, demoLogin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('latest');

  const categories = ['All', 'Web Dev', 'Tutorials', 'Design'];

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
    <div className="pt-8 pb-20 space-y-24">
      {/* Stitch-Styled Hero Section */}
      <section className="flex flex-col items-center text-center mt-6">
        {/* Floating Tag Pill */}
        <div className="inline-flex items-center space-x-2 bg-surface-container-high px-4 py-2 rounded-full mb-8 border border-outline-variant shadow-sm">
          <span className="bg-primary text-on-primary text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
            New
          </span>
          <span className="text-sm font-medium text-on-surface">
            Aurelius Blog Platform v2.0 is live
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-outline" />
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-on-surface max-w-[920px] mb-6 leading-[1.05]">
          Create web stories that inspire developers
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-on-surface-variant max-w-[640px] mb-10 leading-relaxed">
          A full-stack publishing and community platform with user registration, secure authentication, post CRUD, and interactive comments.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-16">
          <Link
            href="/create"
            className="bg-primary text-on-primary font-medium text-sm px-8 py-3.5 rounded-full hover:opacity-90 active:scale-95 duration-200 w-full sm:w-auto shadow-sm flex items-center justify-center gap-2"
          >
            <PenSquare className="w-4 h-4" />
            Start Writing
          </Link>

          {!user && (
            <button
              onClick={() => demoLogin('admin')}
              className="bg-transparent border border-outline-variant text-on-surface font-medium text-sm px-8 py-3.5 rounded-full hover:bg-surface-container transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              1-Click Demo Login
            </button>
          )}
        </div>

        {/* Stitch-Styled Interactive Hero Preview Card */}
        <div className="w-full max-w-[1024px] bg-surface-container-lowest border border-outline-variant rounded-2xl p-2 shadow-stitch">
          <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/60 relative aspect-[16/8] sm:aspect-[16/7] flex flex-col justify-end p-6 sm:p-8 bg-gradient-to-tr from-surface-container-low via-surface to-surface-container-high">
            {/* Background graphic elements */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
              <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
              <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
              <span className="text-xs font-mono text-outline ml-2">aurelius.dev/blog/fullstack-guide</span>
            </div>

            {/* Floating Soundwave Player & Preview widget from Stitch */}
            <div className="bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4 fill-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-on-surface">
                    Getting Started with Full-Stack Web Development
                  </div>
                  <div className="text-xs text-on-surface-variant font-mono">
                    By Alex Rivera • 38 Likes • 2 Comments
                  </div>
                </div>
              </div>

              {/* Sound wave visualizer from Stitch */}
              <div className="flex items-center space-x-1.5 h-6">
                <div className="w-1 bg-primary rounded-full animate-wave-1"></div>
                <div className="w-1 bg-primary rounded-full animate-wave-2"></div>
                <div className="w-1 bg-primary rounded-full animate-wave-3"></div>
                <div className="w-1 bg-primary rounded-full animate-wave-4"></div>
                <div className="w-1 bg-outline rounded-full h-3"></div>
                <div className="w-1 bg-outline rounded-full h-2"></div>
                <div className="w-1 bg-outline rounded-full h-4"></div>
                <span className="text-xs font-mono text-outline pl-2">04:12</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stitch 6-Card Feature Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-2">
            Built for Modern Publishing
          </h2>
          <p className="text-sm text-on-surface-variant">
            Everything you need for content creation and developer discussions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[20px] p-6 hover:bg-surface-container-low transition-colors">
            <BookOpen className="w-6 h-6 text-primary mb-3" />
            <h3 className="text-lg font-bold text-on-surface mb-1">Post CRUD</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Create, read, edit, and delete rich markdown blog posts with custom categories and tags.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[20px] p-6 hover:bg-surface-container-low transition-colors">
            <MessageSquare className="w-6 h-6 text-primary mb-3" />
            <h3 className="text-lg font-bold text-on-surface mb-1">Interactive Comments</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Engage with readers through responsive comments, optimistic updates, and author badges.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[20px] p-6 hover:bg-surface-container-low transition-colors">
            <ShieldCheck className="w-6 h-6 text-primary mb-3" />
            <h3 className="text-lg font-bold text-on-surface mb-1">Auth & Security</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Salted password hashing with bcryptjs and stateless JSON Web Tokens (JWT) authentication.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[20px] p-6 hover:bg-surface-container-low transition-colors">
            <Code2 className="w-6 h-6 text-primary mb-3" />
            <h3 className="text-lg font-bold text-on-surface mb-1">RESTful Architecture</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Clean API Route Handlers for posts, comments, likes, and session authentication.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[20px] p-6 hover:bg-surface-container-low transition-colors">
            <Search className="w-6 h-6 text-primary mb-3" />
            <h3 className="text-lg font-bold text-on-surface mb-1">Live Search & Filter</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Instant real-time search across titles, content, and tags with category filters.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[20px] p-6 hover:bg-surface-container-low transition-colors">
            <Zap className="w-6 h-6 text-primary mb-3" />
            <h3 className="text-lg font-bold text-on-surface mb-1">Vercel Serverless Ready</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Zero-config deployment with resilient database adapter designed for edge and serverless.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="space-y-6 pt-8 border-t border-outline-variant">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="text"
                placeholder="Search articles & tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container border border-outline-variant text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 rounded-full bg-surface-container border border-outline-variant text-xs text-on-surface font-medium focus:outline-none"
            >
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Posts Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-96 rounded-[20px] bg-surface-container animate-pulse border border-outline-variant"
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 rounded-[20px] border border-dashed border-outline-variant bg-surface-container-low p-8">
              <SlidersHorizontal className="w-10 h-10 text-outline mx-auto mb-3" />
              <h3 className="text-lg font-bold text-on-surface">No articles found</h3>
              <p className="text-sm text-on-surface-variant mt-1 max-w-sm mx-auto">
                No articles match "{search}". Try searching for another keyword.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}
                className="mt-5 px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold"
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
        </div>
      </section>
    </div>
  );
}
