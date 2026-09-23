<div align="center">

# 📰 V6 News — The Newsroom, Reimagined

### *What if the morning editorial meeting ran itself?*

<br/>

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socket.io)](https://socket.io)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![SQLite](https://img.shields.io/badge/SQLite-Dev%20DB-003B57?style=for-the-badge&logo=sqlite)](https://sqlite.org)

<br/>

> **V6 News** is a full-stack AI-assisted news management platform built around the idea that modern newsrooms shouldn't be bottlenecked by manual processes. Articles flow through a structured 3-tier editorial pipeline — automatically fetched, reviewed, approved, and published — all in real time.

<br/>

---

</div>

## 🧭 The Story Behind This Build

Every digital newsroom faces the same invisible enemy: **the approval gap** — the time between a story breaking and it going live.

Traditional CMS tools are either too rigid (one-size-fits-all) or too fragile (no workflow). The result? Editors chasing sub-editors on Slack, articles sitting in limbo, and breaking news... that isn't breaking anymore.

**V6 News** was built to close that gap.

The idea was simple: build a lightweight, self-contained newsroom OS — where AI fetches stories, a sub-editor reviews them in seconds, an editor validates, and an admin publishes — with every status change reflected across all screens *instantly*, no refresh needed.

---

## ⚡ 60-Second Demo

```bash
# Clone & install
git clone https://github.com/your-username/v6-news.git
cd v6-news
npm install && cd client && npm install && cd ../server && npm install && cd ..

# Bootstrap the database
cd server
npx prisma migrate dev
npx prisma generate
node prisma/seed.js
cd ..

# Launch
npm run dev
```

> 🌐 Open **http://localhost:3000** — the newsroom is live.

### 🔑 Default Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| 👑 Admin | `admin@news.com` | `admin123` | Full platform + analytics |
| ✍️ Editor | `john@news.com` | `editor123` | Editorial review queue |
| ⚡ Sub-Editor | `jane@news.com` | `editor123` | AI queue + Flash Mode |

---

## 🏗️ Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                       │
│                                                             │
│   Login  →  Dashboard  →  Editor  →  Sub-Editor  →  Users  │
│                          Recharts      Flash Mode           │
│                       Framer Motion    AI Refresh           │
└────────────────────────────┬────────────────────────────────┘
                             │  HTTP + WebSocket (Socket.io)
┌────────────────────────────▼────────────────────────────────┐
│                     SERVER (Express 5)                      │
│                                                             │
│   /api/auth    /api/articles    /api/stats    /api/users    │
│                                                             │
│   JWT Auth ─── Role Guard ─── Prisma ORM ─── Socket.io     │
└────────────────────────────┬────────────────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │      SQLite (dev.db)        │
              │   Users · Articles · Cats   │
              └─────────────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │  n8n Webhook (port 5678)    │
              │  AI News Fetch Workflow     │
              └─────────────────────────────┘
```

---

## 🔄 The Editorial Pipeline

This is the heart of V6 News. Every article travels a defined path — no skipping steps, no chaos.

```
  [AI Fetch / n8n Workflow]
           │
           ▼
      UNDER_REVIEW  ◄── Sub-Editor reviews here (Flash Mode)
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
 APPROVED      REJECTED  ─── Article is discarded
    │
    ▼
 APPROVED  ◄── Editor does a final quality gate
    │
    ▼
 PUBLISHED  ◄── Admin hits the green button
    │
    ▼
  🌍 Live Site
```

**The brilliance of this flow:**
- Sub-Editors see *only* `UNDER_REVIEW` articles — zero noise
- Editors see *only* articles that passed Sub-Editor review
- Admins have the final say and the analytics overview
- Real-time Socket.io events push updates to every open tab *instantly*

---

## 🛠️ Tech Stack, Explained

### Frontend — *Why these choices?*

| Tool | Why |
|---|---|
| **React 18** | Component-driven UI, concurrent features for snappiness |
| **Vite 5** | Sub-second HMR — no waiting during development |
| **React Router v6** | Nested routing per role (`/`, `/editor`, `/sub-editor`) |
| **Framer Motion** | Article cards animate in/out — the UI *breathes* |
| **Recharts** | Traffic analytics dashboard with real live data points |
| **Socket.io Client** | Receives `article_new`, `article_updated`, `traffic_update` events live |
| **Axios** | HTTP client with clean interceptor support |
| **Lucide Icons** | Clean, consistent iconography |
| **Tailwind CSS** | Utility-first — fast to build, easy to maintain |

### Backend — *Why these choices?*

| Tool | Why |
|---|---|
| **Express 5** | Mature, minimal, fast — handles async errors natively |
| **Prisma ORM** | Type-safe DB queries, auto-generated client, studio included |
| **SQLite** | Zero-config for local dev; swap to PostgreSQL for prod |
| **JWT** | Stateless auth — scales horizontally |
| **bcryptjs** | Industry-standard password hashing (salt rounds = 10) |
| **Socket.io** | Bidirectional events push stats and article changes instantly |
| **dotenv** | Clean env management |

---

## 📁 Project Structure

```
v6-news/
│
├── 📦 package.json              ← Root: orchestrates client + server via concurrently
│
├── 🖥️  client/
│   ├── index.html
│   ├── vite.config.js           ← Proxy /api → :5000
│   └── src/
│       ├── App.jsx              ← Routes: role-based redirect logic
│       ├── index.css            ← Global styles + animations
│       ├── components/
│       │   ├── Sidebar.jsx      ← Nav + user session info
│       │   ├── Header.jsx       ← Top bar + breadcrumbs
│       │   ├── SummaryCard.jsx  ← Article preview card
│       │   └── EditModal.jsx    ← Inline article editor
│       ├── pages/
│       │   ├── Login.jsx        ← Auth form
│       │   ├── Dashboard.jsx    ← Admin: stats + charts + publish queue
│       │   ├── EditorDashboard.jsx    ← Editor: review + approve/reject
│       │   ├── SubEditorDashboard.jsx ← Sub-editor: Flash Mode AI queue
│       │   ├── Articles.jsx     ← Full article management
│       │   └── Users.jsx        ← Admin user management
│       ├── context/             ← Auth context
│       └── hooks/               ← Custom React hooks
│
└── ⚙️  server/
    ├── index.js                 ← All API routes + Socket.io server
    ├── .env                     ← DATABASE_URL, JWT_SECRET, PORT
    └── prisma/
        ├── schema.prisma        ← DB models: User, Category, Article
        ├── seed.js              ← Seeds 3 users + categories
        └── dev.db               ← SQLite database (auto-generated)
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | ❌ | Any | Authenticate, returns JWT |
| `GET` | `/api/stats` | ✅ | Any | Dashboard metrics + traffic chart |
| `GET` | `/api/articles` | ✅ | Any | Fetch articles (filter by `?status=`) |
| `POST` | `/api/articles` | ✅ | Any | Create new article |
| `PATCH` | `/api/articles/:id` | ✅ | Any | Update article status/content |
| `GET` | `/api/categories` | ❌ | Any | List all categories |
| `GET` | `/api/users` | ✅ | ADMIN | List all users |
| `POST` | `/api/users` | ✅ | ADMIN | Create new user |
| `DELETE` | `/api/users/:id` | ✅ | ADMIN | Remove user |
| `POST` | `/api/workflow/trigger` | ✅ | Any | Fire n8n webhook → AI news fetch |

> All protected routes require `Authorization: Bearer <token>` header.

---

## 🗄️ Database Schema

```prisma
model User {
  id       Int       @id @default(autoincrement())
  name     String
  email    String    @unique
  password String                        // bcrypt hashed
  role     String    @default("SUB_EDITOR") // ADMIN | EDITOR | SUB_EDITOR
  isActive Boolean   @default(true)
  articles Article[]
}

model Category {
  id       Int       @id @default(autoincrement())
  name     String    @unique              // Technology | Global | Finance | Science
  articles Article[]
}

model Article {
  id         Int       @id @default(autoincrement())
  title      String
  content    String    @default("")
  summary    String?
  status     String    @default("UNDER_REVIEW") // PENDING | UNDER_REVIEW | APPROVED | REJECTED | PUBLISHED
  imageUrl   String?
  isBreaking Boolean   @default(false)
  views      Int       @default(0)
  clicks     Int       @default(0)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  author     User?     @relation(...)
  category   Category? @relation(...)
}
```

**Entity Relationships:**

```
User ──(1:N)──► Article ◄──(N:1)── Category
```

---

## ⚡ Real-Time Events (Socket.io)

| Event | Emitted When | Received By |
|---|---|---|
| `article_new` | New article created | All connected dashboards |
| `article_updated` | Article status changes | All connected dashboards |
| `stats_update` | Any article change | Dashboard stats widgets |
| `traffic_update` | Every 5 seconds (simulated) | Admin traffic chart |

No polling. No manual refresh. Changes happen and *everyone sees them*.

---

## 🛠️ Development Commands

```bash
# Run everything
npm run dev                        # Starts server (:5000) + client (:3000) concurrently

# Individual
npm run server                     # Express backend only
npm run client                     # Vite frontend only

# Database
cd server
npx prisma studio                  # Visual DB browser → http://localhost:5555
npx prisma migrate dev             # Apply schema changes
npx prisma generate                # Regenerate Prisma Client
node prisma/seed.js                # Re-seed users + categories

# Nuke & reset (⚠️ destroys all data)
npx prisma migrate reset && node prisma/seed.js
```

---

## 🔒 Security Considerations

| Area | Current (Dev) | Production Recommendation |
|---|---|---|
| JWT Secret | Hardcoded fallback | Strong random string via env |
| Database | SQLite file | PostgreSQL / PlanetScale |
| CORS | `origin: "*"` | Restrict to your domain |
| Password Hashing | bcrypt, 10 rounds | ✅ Good as-is |
| HTTPS | None | Nginx / Caddy reverse proxy |
| Rate Limiting | None | `express-rate-limit` |
| Input Validation | Minimal | `zod` / `joi` schema validation |

---

## 🚀 Deployment Checklist

```
Infrastructure:
  [ ] Set JWT_SECRET to a 64-char random string
  [ ] Switch DATABASE_URL to PostgreSQL connection string
  [ ] Run `npx prisma migrate deploy` (not dev)
  [ ] Configure CORS to your production domain

Security:
  [ ] Add express-rate-limit middleware
  [ ] Add input validation (zod recommended)
  [ ] Set up HTTPS (Caddy / Let's Encrypt)
  [ ] Enable structured logging (Winston / Pino)

Monitoring:
  [ ] Integrate Sentry for error tracking
  [ ] Set up uptime monitoring (Better Uptime / UptimeRobot)
  [ ] Configure DB backups (automated)
```

---

## 🗺️ What's Next — Roadmap

```
Phase 1 — Core (Done ✅)
  ✅ Role-based auth (JWT)
  ✅ 3-tier editorial workflow
  ✅ Real-time updates (Socket.io)
  ✅ AI fetch via n8n webhook
  ✅ Analytics dashboard (Recharts)
  ✅ Flash Mode for Sub-Editors

Phase 2 — Enhancement
  [ ] Rich text editor (TipTap / Quill)
  [ ] Image upload (S3 / Cloudinary)
  [ ] Email notifications on article status change
  [ ] Article scheduling (publish at future time)
  [ ] Revision history with diff view

Phase 3 — Scale
  [ ] Migrate to PostgreSQL
  [ ] Redis caching layer
  [ ] CDN for media assets
  [ ] Multi-language support (i18n)
  [ ] Mobile app (React Native)
  [ ] Dark mode
```

---

## 🙏 Acknowledgments

| Tool | Credit |
|---|---|
| 📡 [n8n](https://n8n.io) | Workflow automation — powers the AI news fetch pipeline |
| 🎨 [Lucide](https://lucide.dev) | Icon system |
| 📊 [Recharts](https://recharts.org) | Analytics charts |
| 🎞️ [Framer Motion](https://www.framer.com/motion) | UI animations |
| 🗺️ [Prisma](https://www.prisma.io) | The ORM that makes DB work feel like magic |

---

<div align="center">

**Built with curiosity, caffeine, and a conviction that newsrooms deserve better tools.**

*React · Express · Prisma · Socket.io · n8n*

</div>
