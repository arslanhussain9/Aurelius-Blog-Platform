import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function DELETE(request, { params }) {
  try {
    const user = auth.getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: postId, commentId } = params;
    const comment = db.getCommentById(commentId);

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const post = db.getPostById(postId);

    // Permission: comment author, post author, or admin
    const canDelete =
      comment.userId === user.id ||
      (post && post.authorId === user.id) ||
      user.role === 'admin';

    if (!canDelete) {
      return NextResponse.json({ error: 'Forbidden. You do not have permission to delete this comment.' }, { status: 403 });
    }

    db.deleteComment(commentId);
    const remaining = db.getCommentsByPostId(postId);

    return NextResponse.json({
      message: 'Comment deleted successfully',
      commentsCount: remaining.length
    });
  } catch (err) {
    console.error('Delete comment error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
