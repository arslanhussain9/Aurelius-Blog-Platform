import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    const authorId = searchParams.get('authorId') || '';
    const sort = searchParams.get('sort') || 'latest';

    let posts = db.getPosts();

    // Attach comments count to each post summary
    posts = posts.map(post => {
      const comments = db.getCommentsByPostId(post.id);
      return {
        ...post,
        commentsCount: comments.length
      };
    });

    // Filtering
    if (search) {
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(search) ||
        p.excerpt.toLowerCase().includes(search) ||
        p.content.toLowerCase().includes(search) ||
        p.tags?.some(t => t.toLowerCase().includes(search))
      );
    }

    if (category && category !== 'All') {
      posts = posts.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (tag) {
      posts = posts.filter(p => p.tags?.some(t => t.toLowerCase() === tag.toLowerCase()));
    }

    if (authorId) {
      posts = posts.filter(p => p.authorId === authorId);
    }

    // Sorting
    if (sort === 'popular') {
      posts.sort((a, b) => ((b.likes || 0) + (b.commentsCount || 0) * 2) - ((a.likes || 0) + (a.commentsCount || 0) * 2));
    } else {
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return NextResponse.json({ posts, total: posts.length });
  } catch (err) {
    console.error('Fetch posts error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = auth.getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in to publish a post.' }, { status: 401 });
    }

    const body = await request.json();
    const { title, excerpt, content, category, tags, coverImage } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Calculate approximate read time
    const wordCount = content.trim().split(/\s+/).length;
    const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

    // Process tags
    const processedTags = Array.isArray(tags)
      ? tags.map(t => t.trim()).filter(Boolean)
      : typeof tags === 'string'
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : ['Tech'];

    const newPost = db.createPost({
      title: title.trim(),
      excerpt: excerpt?.trim() || content.slice(0, 160).trim() + '...',
      content: content.trim(),
      category: category?.trim() || 'General',
      tags: processedTags,
      coverImage: coverImage?.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      readTime: `${readMinutes} min read`,
      authorId: user.id,
      authorName: user.name || user.username,
      authorAvatar: user.avatar
    });

    return NextResponse.json({
      message: 'Post created successfully',
      post: { ...newPost, commentsCount: 0 }
    }, { status: 201 });
  } catch (err) {
    console.error('Create post error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
