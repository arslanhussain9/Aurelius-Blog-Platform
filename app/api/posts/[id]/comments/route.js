import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const post = db.getPostById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const comments = db.getCommentsByPostId(id);
    return NextResponse.json({ comments, count: comments.length });
  } catch (err) {
    console.error('Fetch comments error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const user = auth.getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Please log in to leave a comment' }, { status: 401 });
    }

    const { id } = params;
    const post = db.getPostById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Comment content cannot be empty' }, { status: 400 });
    }

    const newComment = db.createComment({
      postId: id,
      userId: user.id,
      userName: user.name || user.username,
      userAvatar: user.avatar,
      content: content.trim()
    });

    const allComments = db.getCommentsByPostId(id);

    return NextResponse.json({
      message: 'Comment added successfully',
      comment: newComment,
      commentsCount: allComments.length
    }, { status: 201 });
  } catch (err) {
    console.error('Add comment error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
