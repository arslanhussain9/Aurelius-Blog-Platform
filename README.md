# DevBlog — Full-Stack Blogging Platform with Comments

A modern, responsive full-stack blogging platform where users can register, publish articles, and engage in community discussions. Built with **Next.js 14 (App Router)**, **Tailwind CSS**, **JWT Authentication**, and **RESTful API Route Handlers**.

---

## 🚀 Key Features

- **User Authentication**:
  - Secure registration, login, and logout.
  - Password encryption using **bcryptjs**.
  - Stateless authentication with **JSON Web Tokens (JWT)**.
  - **1-Click Demo Login** buttons (Alex Rivera - Admin, Sophia Chen - Member) for fast testing.
- **Post Management (CRUD)**:
  - Create posts with title, category, tags, cover image presets, and markdown content.
  - Explore feed with full-text search, category chips (`Web Dev`, `Tutorials`, `Design`), and sorting (`Latest`, `Most Popular`).
  - Edit existing posts (author-restricted).
  - Delete posts with confirmation modals (author-restricted).
  - Like/upvote posts with live counters.
- **Interactive Comment System**:
  - Comment section on every blog post.
  - Instant optimistic comment publishing.
  - Delete own comments or moderate comments as post author.
  - Author verification badges on discussion threads.
- **Vercel Serverless Ready**:
  - Resilient persistence layer in `lib/db.js` with automatic serverless `/tmp` fallback.
  - Zero-config deployment on Vercel.

---

## 💻 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Tests
```bash
npm test
```

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Framework Preset: **Next.js** (auto-detected).
4. Click **Deploy**.
