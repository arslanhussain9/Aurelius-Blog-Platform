'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  LogIn, 
  Sparkles, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

export default function CommentsSection({ postId, postAuthorId, initialComments = [] }) {
  const { user, demoLogin } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    if (!user) {
      setError('Please sign in to post a comment.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Optimistic comment creation
    const tempId = `temp_${Date.now()}`;
    const optimisticComment = {
      id: tempId,
      postId,
      userId: user.id,
      userName: user.name || user.username,
      userAvatar: user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`,
      content: newContent.trim(),
      createdAt: new Date().toISOString()
    };

    setComments([optimisticComment, ...comments]);
    const submittedContent = newContent;
    setNewContent('');

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: submittedContent })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to post comment');
      }

      // Replace optimistic comment with confirmed server comment
      setComments(prev => [data.comment, ...prev.filter(c => c.id !== tempId)]);
    } catch (err) {
      setError(err.message);
      // Revert optimistic comment
      setComments(prev => prev.filter(c => c.id !== tempId));
      setNewContent(submittedContent);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    const previousComments = [...comments];
    // Optimistic deletion
    setComments(comments.filter(c => c.id !== commentId));

    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Could not delete comment');
      }
    } catch (err) {
      alert(err.message);
      setComments(previousComments);
    }
  };

  return (
    <section id="comments" className="mt-12 pt-8 border-t border-auralis-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Discussion & Comments
            </h3>
            <p className="text-xs text-auralis-textMuted font-mono">
              {comments.length} {comments.length === 1 ? 'thought shared' : 'thoughts shared'}
            </p>
          </div>
        </div>
      </div>

      {/* New Comment Form or Login Banner */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10 p-4 sm:p-5 rounded-2xl bg-auralis-card border border-auralis-border focus-within:border-indigo-500/50 shadow-card transition-all">
          <div className="flex items-start gap-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`}
              alt={user.name}
              className="w-9 h-9 rounded-full border border-indigo-500/30 object-cover mt-1 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">
                  Posting as <span className="text-cyan-400 font-mono">{user.name || user.username}</span>
                </span>
                <span className="text-[11px] text-auralis-textMuted font-mono">
                  Markdown & text supported
                </span>
              </div>

              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Share your perspective on this architecture, voice pipeline, or code implementation..."
                rows={3}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-auralis-textMuted/60 focus:outline-none focus:border-cyan-500 transition-colors resize-y"
              />

              {error && (
                <p className="mt-2 text-xs text-rose-400 font-medium">
                  {error}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-auralis-textMuted hidden sm:inline">
                  Tip: Be constructive and respect community guidelines.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting || !newContent.trim()}
                  className="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-glow-indigo transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Posting...' : 'Publish Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-auralis-card to-cyan-950/40 border border-indigo-500/20 text-center flex flex-col items-center">
          <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white mb-1">
            Join the Discussion
          </h4>
          <p className="text-sm text-auralis-textMuted max-w-md mb-4">
            Sign in to share your thoughts, ask questions about the technical implementation, or interact with other engineers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => demoLogin('admin')}
              className="px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/60 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Demo Login
            </button>
            <Link
              href="/auth"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow-indigo transition-all"
            >
              Sign In or Register
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-white/10 bg-black/20">
            <MessageSquare className="w-8 h-8 text-auralis-textMuted/40 mx-auto mb-2" />
            <p className="text-sm text-auralis-textMuted">
              No comments yet. Be the first to start the conversation!
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const isCommentAuthor = user && user.id === comment.userId;
            const isPostAuthor = user && user.id === postAuthorId;
            const isAdmin = user && user.role === 'admin';
            const canDelete = isCommentAuthor || isPostAuthor || isAdmin;

            const timeFormatted = new Date(comment.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={comment.id}
                className="group p-4 sm:p-5 rounded-2xl bg-auralis-card border border-auralis-border hover:border-white/15 transition-all flex items-start gap-3.5"
              >
                <img
                  src={comment.userAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.userName}`}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full border border-indigo-500/30 object-cover flex-shrink-0 mt-0.5"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">
                        {comment.userName}
                      </span>

                      {/* Author badge */}
                      {comment.userId === postAuthorId && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                          <UserCheck className="w-2.5 h-2.5" /> Author
                        </span>
                      )}

                      {/* Timestamp */}
                      <span className="text-xs text-auralis-textMuted font-mono">
                        • {timeFormatted}
                      </span>
                    </div>

                    {/* Delete button */}
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-auralis-textMuted hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-auralis-textLight/90 leading-relaxed whitespace-pre-line">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
