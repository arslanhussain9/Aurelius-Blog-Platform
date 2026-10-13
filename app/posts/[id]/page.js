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
  Sparkles,
  Terminal,
  Bookmark
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
    if (!confirm('Are you sure you want to permanently delete this post?')) return;

    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Network error while deleting');
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
      <div className="max-w-4xl mx-auto py-12 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-white/10 rounded-lg" />
        <div className="h-12 w-3/4 bg-white/10 rounded-xl" />
        <div className="h-96 w-full bg-white/10 rounded-3xl" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-2">Post Not Found</h2>
        <p className="text-sm text-auralis-textMuted mb-6">
          The requested article does not exist or may have been removed.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
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
    <article className="max-w-4xl mx-auto py-4 sm:py-8">
      {/* Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-auralis-textMuted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        {/* Share & Copy Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-auralis-textMuted hover:text-white border border-white/10 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? 'Link Copied!' : 'Share Article'}
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        {/* Category & Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-cyan-300 border border-indigo-500/30">
            {post.category || 'General'}
          </span>
          <span className="text-xs text-auralis-textMuted font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> {post.readTime}
          </span>
          <span className="text-xs text-auralis-textMuted font-mono flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg text-auralis-textMuted leading-relaxed">
          {post.excerpt}
        </p>

        {/* Author Card & Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <img
              src={post.authorAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${post.authorName}`}
              alt={post.authorName}
              className="w-11 h-11 rounded-full border border-indigo-500/40 object-cover"
            />
            <div>
              <div className="font-semibold text-white text-sm">{post.authorName}</div>
              <div className="text-xs text-auralis-textMuted font-mono">
                Author & Contributor
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400' : ''}`} />
              <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
            </button>

            {/* Author Controls */}
            {isAuthor && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/edit/${post.id}`}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" /> Edit Post
                </Link>
                <button
                  onClick={handleDeletePost}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 flex items-center gap-1.5"
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
        <div className="my-8 rounded-3xl overflow-hidden border border-white/10 aspect-[16/9] bg-black/60 shadow-2xl">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Content Body */}
      <div className="prose prose-invert max-w-none space-y-6 text-base sm:text-lg leading-relaxed text-auralis-textLight/90">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-2xl font-bold text-white pt-4 pb-1 border-b border-white/10">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('```')) {
            const cleanCode = paragraph.replace(/```[a-z]*\n?/g, '');
            return (
              <div key={idx} className="my-6 rounded-2xl bg-black/70 border border-white/10 p-5 font-mono text-sm overflow-x-auto text-cyan-300">
                <div className="text-[11px] text-auralis-textMuted uppercase mb-3 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Code Snippet
                </div>
                <pre>{cleanCode}</pre>
              </div>
            );
          }
          if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
            return (
              <ul key={idx} className="list-disc pl-6 space-y-2 text-auralis-textLight/90">
                {paragraph.split('\n').map((item, itemIdx) => (
                  <li key={itemIdx}>
                    {item.replace(/^[0-9]+\.\s*|-\s*/, '')}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="whitespace-pre-line">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-auralis-textMuted font-mono">Tags:</span>
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-mono px-3 py-1 rounded-lg bg-white/5 text-cyan-300 border border-white/10"
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
