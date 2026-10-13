'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { 
  Heart, 
  MessageSquare, 
  Clock, 
  Trash2, 
  Edit3, 
  Share2, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function PostCard({ post, onPostDeleted }) {
  const { user } = useAuth();
  const router = useRouter();
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(
    user ? (post.likedBy || []).includes(user.id) : false
  );
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = user && (user.id === post.authorId || user.role === 'admin');

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/auth');
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    // Optimistic UI update
    const previousLikes = likes;
    const previousLiked = isLiked;
    setLikes(previousLiked ? previousLikes - 1 : previousLikes + 1);
    setIsLiked(!previousLiked);

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
      if (!res.ok) throw new Error('Like failed');
      const data = await res.json();
      setLikes(data.likes);
      setIsLiked(data.liked);
    } catch (err) {
      // Revert on error
      setLikes(previousLikes);
      setIsLiked(previousLiked);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to permanently delete this post and its comments?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
      if (res.ok) {
        if (onPostDeleted) onPostDeleted(post.id);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete post');
      }
    } catch (err) {
      alert('Network error while deleting post');
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="group relative rounded-2xl bg-auralis-card border border-auralis-border hover:border-indigo-500/50 hover:shadow-glow-indigo transition-all duration-300 flex flex-col overflow-hidden">
      {/* Cover Image Container */}
      <Link href={`/posts/${post.id}`} className="block relative aspect-[16/9] overflow-hidden bg-black/40">
        <img
          src={post.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-auralis-card via-transparent to-transparent opacity-80" />
        
        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
            {post.category || 'General'}
          </span>
        </div>

        {/* Read Time */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-black/60 text-auralis-textMuted backdrop-blur-md flex items-center gap-1 border border-white/10">
            <Clock className="w-3 h-3 text-cyan-400" />
            {post.readTime || '3 min read'}
          </span>
        </div>
      </Link>

      {/* Post Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {post.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-auralis-textMuted border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <Link href={`/posts/${post.id}`}>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="mt-2 text-sm text-auralis-textMuted line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Footer Area: Author & Actions */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-2.5">
            <img
              src={post.authorAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${post.authorName}`}
              alt={post.authorName}
              className="w-7 h-7 rounded-full border border-indigo-500/30 object-cover"
            />
            <div className="text-xs">
              <div className="font-semibold text-white leading-tight">{post.authorName}</div>
              <div className="text-[11px] text-auralis-textMuted">{formattedDate}</div>
            </div>
          </div>

          {/* Metrics & Action buttons */}
          <div className="flex items-center gap-2">
            {/* Likes */}
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-white/5 text-auralis-textMuted hover:text-white hover:bg-white/10'
              }`}
              title="Like this post"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400' : ''}`} />
              <span>{likes}</span>
            </button>

            {/* Comments count */}
            <Link
              href={`/posts/${post.id}#comments`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 text-auralis-textMuted hover:text-cyan-300 hover:bg-white/10 transition-colors"
              title="View comments"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>{post.commentsCount ?? 0}</span>
            </Link>

            {/* Author Controls */}
            {isAuthor && (
              <div className="flex items-center gap-1 pl-1 border-l border-white/10">
                <Link
                  href={`/edit/${post.id}`}
                  className="p-1 rounded text-auralis-textMuted hover:text-indigo-300 hover:bg-indigo-500/10"
                  title="Edit post"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1 rounded text-auralis-textMuted hover:text-rose-400 hover:bg-rose-500/10"
                  title="Delete post"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
