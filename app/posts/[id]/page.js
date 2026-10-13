'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import CommentsSection from '@/components/CommentsSection';
import { 
  ArrowLeft, 
  Heart, 
  Clock, 
  Calendar, 
  Edit3, 
  Trash2, 
  Share2, 
  Check, 
  Terminal 
} from 'lucide-react';

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
        setLikes(data.post.likes || 0);
        if (user && data.post.likedBy) {
          setIsLiked(data.post.likedBy.includes(user.id));
        }
      } else {
        setPost(null);
      }
    } catch (err) {
      console.error('Fetch post error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    const prevLikes = likes;
    const prevLiked = isLiked;
    setLikes(prevLiked ? prevLikes - 1 : prevLikes + 1);
    setIsLiked(!prevLiked);

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setLikes(data.likes);
        setIsLiked(data.liked);
      }
    } catch {
      setLikes(prevLikes);
      setIsLiked(prevLiked);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Error deleting');
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-surface-container rounded-full" />
        <div className="h-12 w-3/4 bg-surface-container rounded-2xl" />
        <div className="h-96 w-full bg-surface-container rounded-[24px]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto text-center py-24">
        <h2 className="text-2xl font-bold text-on-surface mb-2">Post Not Found</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          The requested article does not exist or has been removed.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>
      </div>
    );
  }

  const isAuthor = user && (user.id === post.authorId || user.role === 'admin');
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="max-w-4xl mx-auto py-8">
      {/* Back Button */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-outline hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        {/* Share Button */}
        <button
          onClick={handleCopyLink}
          className="px-4 py-2 rounded-full text-xs font-medium bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant transition-colors flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          {copied ? 'Link Copied!' : 'Share Article'}
        </button>
      </div>

      {/* Header Info */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-surface-container border border-outline-variant text-on-surface">
            {post.category || 'General'}
          </span>
          <span className="text-xs text-outline font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {post.readTime}
          </span>
          <span className="text-xs text-outline font-mono flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-on-surface tracking-tighter leading-[1.1]">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg text-on-surface-variant leading-relaxed">
          {post.excerpt}
        </p>

        {/* Author Card & Actions */}
        <div className="pt-6 border-t border-outline-variant flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={post.authorAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${post.authorName}`}
              alt={post.authorName}
              className="w-11 h-11 rounded-full border border-outline-variant object-cover"
            />
            <div>
              <div className="font-semibold text-on-surface text-sm">{post.authorName}</div>
              <div className="text-xs text-outline font-mono">
                Contributor
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Like Pill */}
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                isLiked
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
              <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
            </button>

            {/* Author Controls */}
            {isAuthor && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/edit/${post.id}`}
                  className="px-4 py-2 rounded-full border border-outline-variant bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </Link>
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 rounded-full border border-rose-200 bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      {post.coverImage && (
        <div className="my-10 rounded-[24px] overflow-hidden border border-outline-variant aspect-[16/9] bg-surface-container shadow-sm">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Content Body */}
      <div className="space-y-6 text-base sm:text-lg leading-relaxed text-on-surface">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-2xl font-bold tracking-tight text-on-surface pt-6 pb-2 border-b border-outline-variant">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('```')) {
            const cleanCode = paragraph.replace(/```[a-z]*\n?/g, '');
            return (
              <div key={idx} className="my-6 rounded-2xl bg-[#111318] border border-outline-variant/30 p-6 font-mono text-sm overflow-x-auto text-emerald-400">
                <div className="text-[11px] text-outline uppercase mb-3 flex items-center gap-2 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-outline" /> Code Snippet
                </div>
                <pre>{cleanCode}</pre>
              </div>
            );
          }
          if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
            return (
              <ul key={idx} className="list-disc pl-6 space-y-2 text-on-surface">
                {paragraph.split('\n').map((item, itemIdx) => (
                  <li key={itemIdx}>
                    {item.replace(/^[0-9]+\.\s*|-\s*/, '')}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="whitespace-pre-line text-on-surface">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-outline-variant flex items-center gap-2 flex-wrap">
          <span className="text-xs text-outline font-mono">Tags:</span>
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-mono px-3 py-1 rounded-full bg-surface-container text-on-surface border border-outline-variant"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Comments Section */}
      <CommentsSection
        postId={post.id}
        postAuthorId={post.authorId}
        initialComments={post.comments || []}
      />
    </article>
  );
}
