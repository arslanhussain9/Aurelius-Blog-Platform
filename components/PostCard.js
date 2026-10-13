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
  ArrowUpRight 
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

    const prevLikes = likes;
    const prevLiked = isLiked;
    setLikes(prevLiked ? prevLikes - 1 : prevLikes + 1);
    setIsLiked(!prevLiked);

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
      if (!res.ok) throw new Error('Like failed');
      const data = await res.json();
      setLikes(data.likes);
      setIsLiked(data.liked);
    } catch {
      setLikes(prevLikes);
      setIsLiked(prevLiked);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this article?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
      if (res.ok) {
        if (onPostDeleted) onPostDeleted(post.id);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Error deleting post');
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
    <article className="group bg-surface-container-lowest border border-outline-variant rounded-[20px] p-6 hover:shadow-stitch-hover transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover Image Container */}
        {post.coverImage && (
          <Link href={`/posts/${post.id}`} className="block relative aspect-[16/10] overflow-hidden rounded-xl bg-surface-container mb-4">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
        )}

        {/* Metadata Strip */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 bg-surface-container border border-outline-variant rounded-full text-xs font-medium text-on-surface">
            {post.category || 'General'}
          </span>
          <span className="text-xs text-outline font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime || '4 min read'}
          </span>
        </div>

        {/* Title */}
        <Link href={`/posts/${post.id}`}>
          <h3 className="text-xl font-bold tracking-tight text-on-surface group-hover:text-outline transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="mt-2 text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono text-outline"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Area */}
      <div className="mt-6 pt-4 border-t border-outline-variant/60 flex items-center justify-between">
        {/* Author */}
        <div className="flex items-center gap-2.5">
          <img
            src={post.authorAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${post.authorName}`}
            alt={post.authorName}
            className="w-7 h-7 rounded-full border border-outline-variant object-cover"
          />
          <div className="text-xs">
            <div className="font-semibold text-on-surface">{post.authorName}</div>
            <div className="text-[11px] text-outline">{formattedDate}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Like Pill */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              isLiked
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600' : ''}`} />
            <span>{likes}</span>
          </button>

          {/* Comments Count */}
          <Link
            href={`/posts/${post.id}#comments`}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-outline" />
            <span>{post.commentsCount ?? 0}</span>
          </Link>

          {/* Author Controls */}
          {isAuthor && (
            <div className="flex items-center gap-1 pl-1 border-l border-outline-variant">
              <Link
                href={`/edit/${post.id}`}
                className="p-1 rounded-full hover:bg-surface-container text-outline hover:text-on-surface"
                title="Edit post"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1 rounded-full hover:bg-rose-50 text-outline hover:text-rose-600"
                title="Delete post"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
