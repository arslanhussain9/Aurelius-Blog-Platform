import fs from 'fs';
import path from 'path';

// Storage file path (uses /tmp on serverless or local directory)
const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'auralis_blog_data.json')
  : path.join(process.cwd(), 'data', 'blog_data.json');

// Initial seed data with Auralis Voice Infrastructure & Full-Stack blog posts
const initialData = {
  users: [
    {
      id: "usr_admin_1",
      username: "elena_ai",
      name: "Elena Rostova",
      email: "elena@auralis.ai",
      // hashed password for "password123"
      passwordHash: "$2a$10$wEkgmYF1kQd3a3y69F3lpejHkWjE43WlK1mG58mF7xN0bM9y64eTu",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      bio: "Chief AI Architect at Auralis. Scaling ultra-low latency voice models.",
      role: "admin",
      createdAt: "2026-09-01T10:00:00.000Z"
    },
    {
      id: "usr_dev_2",
      username: "marcus_k",
      name: "Marcus Vance",
      email: "marcus@devstack.io",
      passwordHash: "$2a$10$wEkgmYF1kQd3a3y69F3lpejHkWjE43WlK1mG58mF7xN0bM9y64eTu",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      bio: "Full-Stack Engineer & Audio Streaming Enthusiast. WebSockets, Node.js, Next.js.",
      role: "member",
      createdAt: "2026-09-15T12:30:00.000Z"
    }
  ],
  posts: [
    {
      id: "post_1",
      title: "Building Sub-80ms Real-Time Voice Agents with WebSockets and Edge AI",
      slug: "building-sub-80ms-real-time-voice-agents",
      excerpt: "A deep dive into how we engineered the Auralis Voice Engine to stream acoustic tokens with bidirectional WebSockets and speculative inference.",
      content: `Voice interactions fail when latency creeps past 200ms. Human conversational psychology demands seamless, sub-100ms response dynamics for speech synthesis to feel natural.\n\n### The Architecture of Real-time Streaming\nIn traditional REST-based voice applications, audio is captured, sent as a complete payload, transcribed, passed through an LLM, and then returned as synthesized audio. This sequential pipeline quickly introduces 600ms - 1.2s of perceptible delay.\n\nAt Auralis, we bypassed HTTP chunking entirely:\n\n1. **Full-Duplex WebSockets**: Audio streams are chunked into 20ms frames and transmitted continuously.\n2. **Speculative Decoding**: As soon as the first phonemes are processed, the streaming TTS engine begins pre-synthesizing acoustics.\n3. **Edge Acoustic Buffers**: Audio delivery is orchestrated through regional edge nodes.\n\n\`\`\`javascript\nconst stream = new VoicePipeline({\n  sampleRate: 24000,\n  frameSize: 480,\n  vadThreshold: 0.85\n});\nstream.on('audioDelta', (chunk) => audioContext.play(chunk));\n\`\`\`\n\n### Results\nAcross 50,000 concurrent streaming channels, our benchmark latency dropped from 240ms down to a median of **68ms** globally.`,
      coverImage: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=1200&q=80",
      category: "AI Infrastructure",
      tags: ["Voice AI", "WebSockets", "Edge Computing", "Low Latency"],
      readTime: "4 min read",
      authorId: "usr_admin_1",
      authorName: "Elena Rostova",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      likes: 42,
      likedBy: ["usr_dev_2"],
      createdAt: "2026-10-01T08:00:00.000Z",
      updatedAt: "2026-10-01T08:00:00.000Z"
    },
    {
      id: "post_2",
      title: "Full-Stack Architecture: RESTful APIs, Token Auth & Vercel Serverless",
      slug: "fullstack-architecture-restful-apis-token-auth-vercel",
      excerpt: "Best practices for architecting resilient full-stack applications with Next.js App Router, JWT authentication, and stateless database patterns.",
      content: `Developing a scalable blogging and content platform with user comments requires clean separation of concerns and robust security.\n\n### Key Pillars\n- **Stateless Authentication**: Using signed JWT tokens stored in HTTP-only cookies or bearer authorization headers ensures instant horizontal scaling without centralized session stores.\n- **Optimistic UI Updates**: Users should see their comments and likes immediately while the background RESTful API resolves.\n- **Input Sanitization**: Always validate and sanitize user input on both client and server before persistence.\n\n### Comments & Interaction Design\nComments should be linked by relational identifiers (\`postId\` and \`userId\`) with cascade-clean deletions and optimistic render pipelines.`,
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      category: "Web Engineering",
      tags: ["Next.js", "REST APIs", "Full Stack", "Vercel"],
      readTime: "5 min read",
      authorId: "usr_dev_2",
      authorName: "Marcus Vance",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      likes: 29,
      likedBy: [],
      createdAt: "2026-10-05T14:15:00.000Z",
      updatedAt: "2026-10-05T14:15:00.000Z"
    },
    {
      id: "post_3",
      title: "Why Developer Experience (DX) Determines AI Platform Adoption",
      slug: "why-developer-experience-determines-ai-platform-adoption",
      excerpt: "How modern AI companies win through delightful SDKs, comprehensive documentation, interactive playground sandboxes, and instant webhooks.",
      content: `The easiest AI models to integrate are the ones that developers actually ship into production. Clean APIs, interactive sandboxes, and typed SDKs are not optional accessories—they are the core product.\n\n### What Developers Actually Care About\n1. Copy-pasteable quickstarts that work in under 3 minutes.\n2. Predictable, debuggable error codes with clear remediation hints.\n3. Transparent rate limits and live request inspectability.\n4. Zero breaking changes on minor versions.`,
      coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
      category: "SaaS Strategy",
      tags: ["Developer Experience", "APIs", "Product"],
      readTime: "3 min read",
      authorId: "usr_admin_1",
      authorName: "Elena Rostova",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      likes: 18,
      likedBy: [],
      createdAt: "2026-10-10T11:20:00.000Z",
      updatedAt: "2026-10-10T11:20:00.000Z"
    }
  ],
  comments: [
    {
      id: "comment_1",
      postId: "post_1",
      userId: "usr_dev_2",
      userName: "Marcus Vance",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      content: "The 68ms streaming latency is insane! How do you handle network jitter on mobile 4G connections?",
      createdAt: "2026-10-01T09:30:00.000Z"
    },
    {
      id: "comment_2",
      postId: "post_1",
      userId: "usr_admin_1",
      userName: "Elena Rostova",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      content: "Great question Marcus! We use adaptive jitter buffers that dynamically size between 15ms and 35ms depending on packet round-trip time.",
      createdAt: "2026-10-01T10:05:00.000Z"
    },
    {
      id: "comment_3",
      postId: "post_2",
      userId: "usr_admin_1",
      userName: "Elena Rostova",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      content: "Spot on about optimistic UI updates. It completely changes how snappy the commenting experience feels.",
      createdAt: "2026-10-06T16:00:00.000Z"
    }
  ]
};

// In-memory cache for fast operations and fallback in serverless
let memoryCache = null;

function loadDatabase() {
  if (memoryCache) return memoryCache;

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      memoryCache = JSON.parse(raw);
      return memoryCache;
    }
  } catch (err) {
    console.warn("Could not read DB file, using memory cache:", err.message);
  }

  // Clone initial data
  memoryCache = JSON.parse(JSON.stringify(initialData));
  saveDatabase(memoryCache);
  return memoryCache;
}

function saveDatabase(data) {
  memoryCache = data;
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // In read-only serverless environments, in-memory cache still preserves state for runtime lifecycle
    console.warn("Could not persist to disk, keeping in memory:", err.message);
  }
}

export const db = {
  // Users
  getUsers: () => loadDatabase().users,
  getUserById: (id) => loadDatabase().users.find(u => u.id === id),
  getUserByEmail: (email) => loadDatabase().users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  getUserByUsername: (username) => loadDatabase().users.find(u => u.username.toLowerCase() === username.toLowerCase()),
  createUser: (userData) => {
    const data = loadDatabase();
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      role: 'member',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(userData.username)}`,
      bio: userData.bio || "Exploring voice AI and full-stack software development.",
      ...userData
    };
    data.users.push(newUser);
    saveDatabase(data);
    return newUser;
  },

  // Posts
  getPosts: () => loadDatabase().posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  getPostById: (id) => loadDatabase().posts.find(p => p.id === id),
  getPostBySlug: (slug) => loadDatabase().posts.find(p => p.slug === slug),
  createPost: (postData) => {
    const data = loadDatabase();
    const newPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      slug: (postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) + '-' + Date.now().toString().slice(-4),
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...postData
    };
    data.posts.unshift(newPost);
    saveDatabase(data);
    return newPost;
  },
  updatePost: (id, updates) => {
    const data = loadDatabase();
    const index = data.posts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    data.posts[index] = {
      ...data.posts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDatabase(data);
    return data.posts[index];
  },
  deletePost: (id) => {
    const data = loadDatabase();
    const postIndex = data.posts.findIndex(p => p.id === id);
    if (postIndex === -1) return false;

    // Delete post
    data.posts.splice(postIndex, 1);
    // Delete associated comments
    data.comments = data.comments.filter(c => c.postId !== id);
    saveDatabase(data);
    return true;
  },
  toggleLikePost: (postId, userId) => {
    const data = loadDatabase();
    const post = data.posts.find(p => p.id === postId);
    if (!post) return null;

    if (!Array.isArray(post.likedBy)) post.likedBy = [];
    
    const userIndex = post.likedBy.indexOf(userId);
    let liked = false;
    if (userIndex > -1) {
      post.likedBy.splice(userIndex, 1);
      post.likes = Math.max(0, (post.likes || 1) - 1);
      liked = false;
    } else {
      post.likedBy.push(userId);
      post.likes = (post.likes || 0) + 1;
      liked = true;
    }
    saveDatabase(data);
    return { likes: post.likes, liked };
  },

  // Comments
  getCommentsByPostId: (postId) => {
    return loadDatabase().comments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getCommentById: (id) => loadDatabase().comments.find(c => c.id === id),
  createComment: (commentData) => {
    const data = loadDatabase();
    const newComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      ...commentData
    };
    data.comments.unshift(newComment);
    saveDatabase(data);
    return newComment;
  },
  deleteComment: (commentId) => {
    const data = loadDatabase();
    const index = data.comments.findIndex(c => c.id === commentId);
    if (index === -1) return false;
    data.comments.splice(index, 1);
    saveDatabase(data);
    return true;
  }
};
