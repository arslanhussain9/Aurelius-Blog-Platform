'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { 
  PenSquare, 
  Sparkles, 
  Image as ImageIcon, 
  ArrowLeft, 
  Send, 
  Terminal, 
  Eye, 
  FileText 
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Voice AI Wave', url: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Code & Terminal', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Abstract Neon', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cloud Architecture', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
];

export default function CreatePostPage() {
  const router = useRouter();
  const { user, demoLogin } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI Infrastructure');
  const [tags, setTags] = useState('Voice AI, Edge Computing, WebSockets');
  const [coverImage, setCoverImage] = useState(PRESET_IMAGES[0].url);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState(`Voice interfaces are transforming how humans interact with machines.\n\n### The Core Latency Challenge\nHuman conversation operates on a tightly-coupled temporal window. If an agent delays response beyond 150ms, conversational turns degrade.\n\n### Implementation Blueprint\nWe implement full-duplex audio chunk streaming directly over secure WebSockets.`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewTab, setPreviewTab] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and Content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          tags,
          coverImage,
          excerpt: excerpt || content.slice(0, 160) + '...',
          content
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish post');
      }

      router.push(`/posts/${data.post.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <PenSquare className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to Publish</h2>
        <p className="text-sm text-auralis-textMuted mb-6">
          You must be an authenticated member to create and publish articles on the Auralis platform.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => demoLogin('admin')}
            className="w-full py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-semibold text-sm hover:bg-cyan-900/60 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            1-Click Demo Login as Elena Rostova
          </button>
          <Link
            href="/auth"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-glow-indigo transition-all"
          >
            Sign In with Email
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-auralis-textMuted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Return
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Create New Article</h1>
          <p className="text-sm text-auralis-textMuted mt-1">
            Author: <span className="text-cyan-400 font-mono">{user.name || user.username}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setPreviewTab(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !previewTab ? 'bg-indigo-600 text-white' : 'text-auralis-textMuted hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1" /> Editor
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              previewTab ? 'bg-indigo-600 text-white' : 'text-auralis-textMuted hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 inline mr-1" /> Preview
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {previewTab ? (
        <div className="p-8 rounded-3xl bg-auralis-card border border-auralis-border space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-cyan-300 border border-indigo-500/30">
              {category}
            </span>
            <h2 className="text-3xl font-bold text-white mt-3">{title || 'Untitled Article'}</h2>
            <p className="text-auralis-textMuted mt-2">{excerpt || 'No excerpt provided.'}</p>
          </div>
          {coverImage && (
            <img src={coverImage} alt="Cover Preview" className="w-full h-64 object-cover rounded-2xl" />
          )}
          <div className="prose prose-invert max-w-none whitespace-pre-line text-auralis-textLight/90">
            {content}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-2">
              Article Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Building Ultra-Low Latency Voice Infrastructure"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-auralis-card border border-auralis-border text-lg font-bold text-white placeholder-auralis-textMuted/50 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-auralis-card border border-auralis-border text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="AI Infrastructure">AI Infrastructure</option>
                <option value="Web Engineering">Web Engineering</option>
                <option value="SaaS Strategy">SaaS Strategy</option>
                <option value="Developer Experience">Developer Experience</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="Voice AI, Next.js, WebSockets"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-auralis-card border border-auralis-border text-sm text-white placeholder-auralis-textMuted/50 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-auralis-card border border-auralis-border text-sm text-white placeholder-auralis-textMuted/50 focus:outline-none focus:border-cyan-500 mb-2"
            />
            {/* Quick preset picker */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-auralis-textMuted font-mono">Quick Presets:</span>
              {PRESET_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCoverImage(img.url)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all ${
                    coverImage === img.url
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-white/5 text-auralis-textMuted border-white/5 hover:text-white'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-2">
              Short Summary / Excerpt
            </label>
            <input
              type="text"
              placeholder="Brief summary that appears in article cards (optional)"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-auralis-card border border-auralis-border text-sm text-white placeholder-auralis-textMuted/50 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-2">
              Article Content (Markdown supported) *
            </label>
            <textarea
              required
              rows={12}
              placeholder="Write your article body here. Use ### for subheadings, ``` for code snippets..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-auralis-card border border-auralis-border text-sm text-white placeholder-auralis-textMuted/50 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-auralis-textMuted hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-glow-indigo transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
