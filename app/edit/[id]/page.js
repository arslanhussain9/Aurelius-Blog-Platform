'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { 
  ArrowLeft, 
  Trash2, 
  Save 
} from 'lucide-react';

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Dev');
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
        setCategory(p.category || 'Web Dev');
        setTags(Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''));
        setCoverImage(p.coverImage || '');
        setExcerpt(p.excerpt || '');
        setContent(p.content || '');
      } else {
        setError('Post not found');
      }
    } catch {
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
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        alert(data.error || 'Delete failed');
      }
    } catch {
      alert('Error deleting post');
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-outline font-mono">Loading post for editing...</div>;
  }

  if (!post) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-on-surface mb-2">Post Not Found</h2>
        <Link href="/" className="text-primary underline text-sm">Return to feed</Link>
      </div>
    );
  }

  const isAuthor = user && (user.id === post.authorId || user.role === 'admin');
  if (!isAuthor) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-on-surface mb-2">Unauthorized</h2>
        <p className="text-sm text-on-surface-variant mb-4">You can only edit your own articles.</p>
        <Link href="/" className="text-primary underline text-sm">Return to feed</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/posts/${id}`}
          className="inline-flex items-center gap-2 text-sm text-outline hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Back to Post
        </Link>
        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded-full border border-rose-200 bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete Post
        </button>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface mb-8">Edit Article</h1>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6 bg-surface-container-lowest p-8 rounded-[20px] border border-outline-variant shadow-sm">
        <div>
          <label className="block text-xs font-mono text-outline uppercase mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-lg font-bold text-on-surface focus:outline-none focus:border-primary"
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
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
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
            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-outline uppercase mb-2">
            Short Summary / Excerpt
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-outline uppercase mb-2">
            Content (Markdown) *
          </label>
          <textarea
            required
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary font-mono leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-outline-variant flex items-center justify-end gap-3">
          <Link
            href={`/posts/${id}`}
            className="px-6 py-2.5 rounded-full text-sm font-semibold text-outline hover:text-on-surface"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-full bg-primary text-on-primary font-semibold text-sm hover:opacity-90 active:scale-95 duration-200 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
