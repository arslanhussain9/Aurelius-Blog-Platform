import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const post = db.getPostById(id) || db.getPostBySlug(id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const comments = db.getCommentsByPostId(post.id);

    return NextResponse.json({
      post: {
        ...post,
        comments,
        commentsCount: comments.length
      }
    });
  } catch (err) {
    console.error('Get post error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = auth.getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const post = db.getPostById(id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Permission check: only author or admin can update
    if (post.authorId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden. You can only edit your own posts.' }, { status: 403 });
    }

    const body = await request.json();
    const { title, excerpt, content, category, tags, coverImage } = body;

    const updates = {};
    if (title) updates.title = title.trim();
    if (excerpt !== undefined) updates.excerpt = excerpt.trim();
    if (content) {
      updates.content = content.trim();
      const wordCount = content.trim().split(/\s+/).length;
      updates.readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
    }
    if (category) updates.category = category.trim();
    if (tags) {
      updates.tags = Array.isArray(tags)
        ? tags.map(t => t.trim()).filter(Boolean)
        : tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (coverImage) updates.coverImage = coverImage.trim();

    const updatedPost = db.updatePost(id, updates);
    const comments = db.getCommentsByPostId(id);

    return NextResponse.json({
      message: 'Post updated successfully',
      post: { ...updatedPost, comments, commentsCount: comments.length }
    });
  } catch (err) {
    console.error('Update post error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = auth.getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const post = db.getPostById(id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Permission check
    if (post.authorId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden. You can only delete your own posts.' }, { status: 403 });
    }

    const deleted = db.deletePost(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Could not delete post' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Post and associated comments deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
