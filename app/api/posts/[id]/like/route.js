import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const user = auth.getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Please log in to like posts' }, { status: 401 });
    }

    const { id } = params;
    const post = db.getPostById(id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const result = db.toggleLikePost(id, user.id);

    return NextResponse.json({
      success: true,
      likes: result.likes,
      liked: result.liked
    });
  } catch (err) {
    console.error('Like toggle error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
