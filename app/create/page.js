'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { 
  PenSquare, 
  Sparkles, 
  ArrowLeft, 
  Send, 
  Eye, 
  FileText 
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Code & Screen', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Architecture', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Abstract Gradient', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
];

export default function CreatePostPage() {
  const router = useRouter();
  const { user, demoLogin } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Dev');
  const [tags, setTags] = useState('Full Stack, React, NextJS');
  const [coverImage, setCoverImage] = useState(PRESET_IMAGES[0].url);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState(`Building full-stack applications with clean architecture.\n\n### Core Design Principles\n1. Stateless authentication with JWT.\n2. Clean RESTful API endpoints.\n3. Responsive, accessible UI with optimistic updates.`);
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
      <div className="max-w-md mx-auto py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-surface-container border border-outline-variant text-primary mx-auto mb-4 flex items-center justify-center">
          <PenSquare className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-on-surface mb-2">Sign in to Publish</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          You must be an authenticated member to create and publish articles on Aurelius.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => demoLogin('admin')}
            className="w-full py-3 rounded-full border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            1-Click Demo Login
          </button>
          <Link
            href="/auth"
            className="w-full py-3 rounded-full bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-all shadow-sm"
          >
            Sign In with Email
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-outline hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Return
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">Create New Article</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Author: <span className="font-semibold text-on-surface">{user.name || user.username}</span>
          </p>
        </div>

        <div className="flex items-center gap-1 bg-surface-container p-1 rounded-full border border-outline-variant">
          <button
            type="button"
            onClick={() => setPreviewTab(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !previewTab ? 'bg-primary text-on-primary' : 'text-outline hover:text-on-surface'
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              previewTab ? 'bg-primary text-on-primary' : 'text-outline hover:text-on-surface'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {previewTab ? (
        <div className="p-8 rounded-[20px] bg-surface-container-lowest border border-outline-variant space-y-6">
          <span className="text-xs px-3 py-1 rounded-full bg-surface-container text-on-surface border border-outline-variant">
            {category}
          </span>
          <h2 className="text-3xl font-bold text-on-surface mt-3">{title || 'Untitled Article'}</h2>
          <p className="text-on-surface-variant">{excerpt || 'No excerpt provided.'}</p>
          {coverImage && (
            <img src={coverImage} alt="Cover Preview" className="w-full h-64 object-cover rounded-xl" />
          )}
          <div className="prose max-w-none whitespace-pre-line text-on-surface leading-relaxed">
            {content}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-surface-container-lowest p-8 rounded-[20px] border border-outline-variant shadow-sm">
          <div>
            <label className="block text-xs font-mono text-outline uppercase mb-2">
              Article Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mastering Full-Stack Development with React & Node"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-lg font-bold text-on-surface placeholder-outline focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-outline uppercase mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="Web Dev">Web Dev</option>
                <option value="Tutorials">Tutorials</option>
                <option value="Design">Design</option>
                <option value="Software">Software</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-outline uppercase mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="React, REST API, Database"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-outline uppercase mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary mb-2"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-outline font-mono">Presets:</span>
              {PRESET_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCoverImage(img.url)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${
                    coverImage === img.url
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container text-on-surface border-outline-variant hover:bg-surface-container-high'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-outline uppercase mb-2">
              Short Summary / Excerpt
            </label>
            <input
              type="text"
              placeholder="Brief summary shown on the card feed"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-outline uppercase mb-2">
              Article Content (Markdown supported) *
            </label>
            <textarea
              required
              rows={12}
              placeholder="Write your article. Use ### for subheadings, ``` for code blocks..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary font-mono leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-outline-variant flex items-center justify-end gap-3">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-outline hover:text-on-surface"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full bg-primary text-on-primary font-semibold text-sm hover:opacity-90 active:scale-95 duration-200 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
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
