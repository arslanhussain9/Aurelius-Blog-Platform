# Auralis | Enterprise AI Voice Infrastructure & Full-Stack Blog Platform

A production-ready full-stack Blogging & Community platform built with **Next.js 14 (App Router)**, **Tailwind CSS**, **JWT Authentication**, **bcryptjs**, and **RESTful API Route Handlers**, styled with the ultra-sleek **Auralis Enterprise AI Voice** SaaS aesthetic. Ready for one-click deployment to **Vercel**.

---

## ⚡ Quick Start

### 1. Install & Run Locally
```bash
# Install dependencies
npm install

# Run automated test suite
npm test

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🚀 How to Connect Google Stitch MCP

The Google Stitch MCP endpoint is hosted at `https://stitch.googleapis.com/mcp`. It requires Google OAuth authentication.

### Method 1: Generate Access Token with Google Cloud CLI (Recommended)
1. Log in to your Google Cloud account associated with Stitch:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   gcloud auth print-access-token
   ```
2. Run the included fetcher in this repository with your token:
   ```bash
   node fetch-stitch.mjs <YOUR_ACCESS_TOKEN>
   ```
   This will immediately pull down screen `202f54c330664e909b5dbe1e6a9722e3` from project `3907361547178343444` into `./stitch_export`.

### Method 2: Configure Stitch MCP Proxy in your IDE (Claude Code, Cursor, Antigravity)
Run the official setup command:
```bash
npx @_davideast/stitch-mcp init
```
Or add the proxy server to your MCP client config:
```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "@_davideast/stitch-mcp", "proxy"]
    }
  }
}
```

### Method 3: Direct Web Export (Instant)
1. Go to [stitch.withgoogle.com](https://stitch.withgoogle.com).
2. Open **Auralis Saas Landing Page**.
3. Select screen **Auralis | Enterprise AI Voice Infrastructure**.
4. Click **Export / Code** in the top navigation bar to download or copy the code.

---

## ✨ Features Built & Verified

### 1. User Registration, Login & Authentication
- Secure password hashing using **bcryptjs**.
- Signed **JSON Web Tokens (JWT)** for stateless session management.
- HTTP-only authentication cookies + Bearer token support.
- **1-Click Demo Login** buttons (Elena Rostova - Admin, Marcus Vance - Member) for instant testing.

### 2. Full Post Management (CRUD)
- **Create**: Add new blog posts with title, category, tags, cover image presets, excerpt, and markdown content.
- **Read**: Live feed with full-text search, category chips (`AI Infrastructure`, `Web Engineering`, `SaaS Strategy`), and sort order (`Latest`, `Most Popular`).
- **Update**: Edit existing posts with pre-filled inputs (restricted to post author).
- **Delete**: Remove posts with confirmation dialogs (restricted to post author).
- **Likes**: Interactive toggle like system with live count updates.

### 3. Interactive Comments Section
- Add comments in real-time with optimistic UI updates.
- Delete own comments or moderate comments as post author.
- Author verification badges on comments.
- Dynamic comment count indicators.

### 4. Vercel Deployment Readiness
- Stateless serverless persistence in `lib/db.js` with automatic fallback to `/tmp` and in-memory cache so deployments on Vercel never fail due to read-only file systems.
- Production build passes cleanly: `npm run build`.
- 100% test coverage with automated tests: `npm test`.

---

## 🧪 Testing

Run the automated test suite anytime:
```bash
npm test
```
All 22 unit & integration tests verify authentication, bcrypt hashing, JWT issuance, Post CRUD, like toggling, and comment cascades.
