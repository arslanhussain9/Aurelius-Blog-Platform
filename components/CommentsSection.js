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

      setComments(prev => [data.comment, ...prev.filter(c => c.id !== tempId)]);
    } catch (err) {
      setError(err.message);
      setComments(prev => prev.filter(c => c.id !== tempId));
      setNewContent(submittedContent);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    const previousComments = [...comments];
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
    <section id="comments" className="mt-16 pt-10 border-t border-outline-variant">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary border border-outline-variant">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-on-surface">
              Discussion & Comments
            </h3>
            <p className="text-xs text-outline font-mono">
              {comments.length} {comments.length === 1 ? 'thought shared' : 'thoughts shared'}
            </p>
          </div>
        </div>
      </div>

      {/* New Comment Box */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10 p-6 rounded-[20px] bg-surface-container-lowest border border-outline-variant shadow-sm transition-all">
          <div className="flex items-start gap-3.5">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`}
              alt={user.name}
              className="w-9 h-9 rounded-full border border-outline-variant object-cover mt-1 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-on-surface">
                  Posting as <span className="font-mono text-primary font-bold">{user.name || user.username}</span>
                </span>
                <span className="text-[11px] text-outline font-mono">
                  Markdown supported
                </span>
              </div>

              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Share your perspective, code insights, or questions..."
                rows={3}
                required
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary transition-colors resize-y"
              />

              {error && (
                <p className="mt-2 text-xs text-rose-600 font-medium">
                  {error}
                </p>
              )}

              <div className="mt-3 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !newContent.trim()}
                  className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 active:scale-95 duration-200 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Posting...' : 'Publish Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-8 rounded-[20px] bg-surface-container-low border border-outline-variant text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary mb-3 border border-outline-variant">
            <LogIn className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-on-surface mb-1">
            Join the Discussion
          </h4>
          <p className="text-sm text-on-surface-variant max-w-md mb-6">
            Sign in to share your thoughts, exchange feedback with other developers, or start a thread.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => demoLogin('admin')}
              className="px-5 py-2.5 rounded-full border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              1-Click Demo Login
            </button>
            <Link
              href="/auth"
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
            >
              Sign In or Register
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 rounded-[20px] border border-dashed border-outline-variant bg-surface-container-low">
            <MessageSquare className="w-8 h-8 text-outline mx-auto mb-2" />
            <p className="text-sm text-outline">
              No comments yet. Start the conversation!
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
                className="group p-5 rounded-[20px] bg-surface-container-lowest border border-outline-variant hover:border-outline/50 transition-all flex items-start gap-3.5"
              >
                <img
                  src={comment.userAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.userName}`}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full border border-outline-variant object-cover flex-shrink-0 mt-0.5"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-on-surface">
                        {comment.userName}
                      </span>

                      {comment.userId === postAuthorId && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container text-primary border border-outline-variant font-medium flex items-center gap-1">
                          <UserCheck className="w-2.5 h-2.5" /> Author
                        </span>
                      )}

                      <span className="text-xs text-outline font-mono">
                        • {timeFormatted}
                      </span>
                    </div>

                    {canDelete && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-full text-outline hover:text-rose-600 hover:bg-rose-50 transition-all"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-on-surface leading-relaxed whitespace-pre-line">
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
