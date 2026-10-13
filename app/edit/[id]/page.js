'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { 
  ArrowLeft, 
  Send, 
  Trash2, 
  Save, 
  FileText 
} from 'lucide-react';

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI Infrastructure');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${id}`);
      if (res.ok) {
        const data = await res.json();
        const p = data.post;
        setPost(p);
        setTitle(p.title);
        setCategory(p.category || 'AI Infrastructure');
        setTags(Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''));
        setCoverImage(p.coverImage || '');
        setExcerpt(p.excerpt || '');
        setContent(p.content || '');
      } else {
        setError('Post not found');
      }
    } catch (err) {
      setError('Failed to fetch post details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          tags,
          coverImage,
          excerpt,
          content
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update post');
      }

      router.push(`/posts/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this post?')) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        alert(data.error || 'Delete failed');
      }
    } catch {
      alert('Network error while deleting post');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-auralis-textMuted font-mono">Loading post for editing...</div>;
  }

  if (!post) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Post Not Found</h2>
        <Link href="/" className="text-cyan-400 text-sm">Return to feed</Link>
      </div>
    );
  }

  const isAuthor = user && (user.id === post.authorId || user.role === 'admin');
  if (!isAuthor) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Unauthorized</h2>
        <p className="text-sm text-auralis-textMuted mb-4">You do not have permission to edit this post.</p>
        <Link href="/" className="text-cyan-400 text-sm">Return to feed</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/posts/${id}`}
          className="inline-flex items-center gap-2 text-sm text-auralis-textMuted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Back to Post
        </Link>
        <button
          onClick={handleDelete}
          className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete Post
        </button>
      </div>

      <h1 className="text-3xl font-extrabold text-white mb-8">Edit Article</h1>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-auralis-card border border-auralis-border text-lg font-bold text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

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
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-auralis-card border border-auralis-border text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-auralis-card border border-auralis-border text-sm text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-2">
            Short Summary / Excerpt
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-auralis-card border border-auralis-border text-sm text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-auralis-textMuted uppercase mb-2">
            Content (Markdown) *
          </label>
          <textarea
            required
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-auralis-card border border-auralis-border text-sm text-white focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <Link
            href={`/posts/${id}`}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-auralis-textMuted hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-glow-indigo transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
