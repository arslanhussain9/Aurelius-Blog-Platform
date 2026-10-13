import fs from 'fs';
import path from 'path';

// Storage file path (uses /tmp on serverless or local directory)
const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'blog_platform_data.json')
  : path.join(process.cwd(), 'data', 'blog_data.json');

// High-quality initial blog platform seed data
const initialData = {
  users: [
    {
      id: "usr_alex_1",
      username: "alex_rivera",
      name: "Alex Rivera",
      email: "alex@example.com",
      // hashed password for "password123"
      passwordHash: "$2a$10$lBukgGPLR/iwKTdRvrVulOhAj0z61N96nuvEdLofwWxhAcSmmJ5Sa",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      bio: "Full-stack developer passionate about React, Node.js, and teaching web engineering.",
      role: "admin",
      createdAt: "2026-09-01T10:00:00.000Z"
    },
    {
      id: "usr_sophia_2",
      username: "sophia_chen",
      name: "Sophia Chen",
      email: "sophia@example.com",
      passwordHash: "$2a$10$lBukgGPLR/iwKTdRvrVulOhAj0z61N96nuvEdLofwWxhAcSmmJ5Sa",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
      bio: "Frontend engineer & UI enthusiast. Writing about modern web design and clean code.",
      role: "member",
      createdAt: "2026-09-15T12:30:00.000Z"
    },
    {
      id: "usr_admin_demo",
      username: "admin",
      name: "Admin User",
      email: "admin@aurelius.dev",
      passwordHash: "$2a$10$lBukgGPLR/iwKTdRvrVulOhAj0z61N96nuvEdLofwWxhAcSmmJ5Sa",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=admin",
      bio: "Platform administrator.",
      role: "admin",
      createdAt: "2026-09-01T10:00:00.000Z"
    }
  ],
  posts: [
    {
      id: "post_1",
      title: "Getting Started with Full-Stack Web Development: A Complete Roadmap",
      slug: "getting-started-with-full-stack-web-development",
      excerpt: "Everything you need to know to become a confident full-stack developer, from frontend design to database modeling and RESTful API architecture.",
      content: `Full-stack development can feel overwhelming with the sheer number of libraries, frameworks, and tools available today.\n\n### The Core Pillars of Modern Web Development\nTo build complete end-to-end applications, you need to understand how the client and server communicate:\n\n1. **Frontend Architecture**: Building interactive, responsive user interfaces with component-based frameworks like React.\n2. **RESTful APIs**: Structuring clean endpoints for CRUD operations (Create, Read, Update, Delete) with status codes like 200, 201, 400, and 404.\n3. **Authentication & Security**: Safeguarding sensitive data with salted password hashing (bcrypt) and stateless JWT tokens.\n4. **Database Persistence**: Modeling entities (Users, Posts, Comments) with clean relational foreign keys.\n\n### Practical Tips for Beginners\n- Don't try to learn everything at once. Focus on building real projects from start to finish.\n- Pay attention to user feedback: smooth loading states, validation error messages, and intuitive navigation.\n\n\`\`\`javascript\n// Sample REST API route structure\napp.post('/api/posts', verifyAuth, async (req, res) => {\n  const { title, content } = req.body;\n  const newPost = await Post.create({ title, content, author: req.user.id });\n  res.status(201).json(newPost);\n});\n\`\`\`\n\nBuild projects, share them with peers, and iterate based on real feedback!`,
      coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
      category: "Web Dev",
      tags: ["Full Stack", "JavaScript", "React", "NodeJS"],
      readTime: "5 min read",
      authorId: "usr_alex_1",
      authorName: "Alex Rivera",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      likes: 38,
      likedBy: ["usr_sophia_2"],
      createdAt: "2026-10-01T08:00:00.000Z",
      updatedAt: "2026-10-01T08:00:00.000Z"
    },
    {
      id: "post_2",
      title: "10 Proven Habits for Writing Clean, Readable, and Maintainable Code",
      slug: "10-proven-habits-for-writing-clean-code",
      excerpt: "Good code isn't just about making things work—it is about making your logic clear, understandable, and effortless for future developers to maintain.",
      content: `Anyone can write code that a computer understands. Great developers write code that humans can understand.\n\n### 1. Meaningful Variable and Function Names\nAvoid cryptic abbreviations. If a function fetches user comments, call it \`getUserComments()\` rather than \`guc()\`. Clear naming eliminates the need for redundant comments.\n\n### 2. The Single Responsibility Principle\nEach function and component should do one thing well. When functions grow past 30 lines, check if sub-tasks can be extracted into clean helper utilities.\n\n### 3. Handle Errors Gracefully\nNever leave catch blocks empty. Log meaningful errors or display intuitive user-facing toast messages when an API call fails.\n\n### 4. Keep Component State Minimal\nDerive values from existing props and state whenever possible instead of creating duplicated synchronizations.`,
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      category: "Tutorials",
      tags: ["Clean Code", "Best Practices", "Software Engineering"],
      readTime: "4 min read",
      authorId: "usr_sophia_2",
      authorName: "Sophia Chen",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
      likes: 24,
      likedBy: [],
      createdAt: "2026-10-05T14:15:00.000Z",
      updatedAt: "2026-10-05T14:15:00.000Z"
    },
    {
      id: "post_3",
      title: "Why Thoughtful UI/UX Design Matters Just as Much as Backend Architecture",
      slug: "why-thoughtful-ui-ux-design-matters",
      excerpt: "The best backend in the world won't succeed if users get frustrated by the interface. Here is how to create interfaces that users love.",
      content: `User experience is often the determining factor in whether a platform grows or gets abandoned.\n\n### Key Design Details That Elevate Web Apps\n1. **Visual Hierarchy**: Guide the user's eye naturally from headlines to key actions using consistent font sizes and contrast.\n2. **Immediate Feedback**: Buttons should show loading spinners during submission, and cards should react with subtle hover effects.\n3. **Optimistic UI**: When a user posts a comment or likes a post, reflect the change immediately on screen before the server response finishes.\n4. **Accessibility & Dark Mode**: Ensure color contrast ratios meet accessibility standards so reading is effortless in all lighting environments.`,
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      category: "Design",
      tags: ["UI/UX", "Web Design", "Frontend"],
      readTime: "3 min read",
      authorId: "usr_alex_1",
      authorName: "Alex Rivera",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      likes: 19,
      likedBy: [],
      createdAt: "2026-10-10T11:20:00.000Z",
      updatedAt: "2026-10-10T11:20:00.000Z"
    }
  ],
  comments: [
    {
      id: "comment_1",
      postId: "post_1",
      userId: "usr_sophia_2",
      userName: "Sophia Chen",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
      content: "Great breakdown! Breaking down the full-stack journey into frontend, REST APIs, and database modeling makes it so much clearer for beginners.",
      createdAt: "2026-10-01T09:30:00.000Z"
    },
    {
      id: "comment_2",
      postId: "post_1",
      userId: "usr_alex_1",
      userName: "Alex Rivera",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      content: "Thanks Sophia! The hands-on project approach makes all the difference when connecting front and back ends.",
      createdAt: "2026-10-01T10:05:00.000Z"
    },
    {
      id: "comment_3",
      postId: "post_2",
      userId: "usr_alex_1",
      userName: "Alex Rivera",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      content: "Point #1 is gold. Self-documenting code with descriptive names saves hours of debugging down the road.",
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
      bio: userData.bio || "Member of the blogging community.",
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
