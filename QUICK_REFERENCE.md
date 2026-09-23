# V6 News - Quick Reference Guide

## 🎯 Project Overview
Full-stack news management platform with role-based approval workflow.

---

## 🔑 Default Users

```
Admin:       admin@news.com     / admin123
Editor:      john@news.com      / editor123
Sub-Editor:  jane@news.com      / editor123
```

---

## 🚀 Quick Start Commands

```bash
# Install everything
npm install && cd client && npm install && cd ../server && npm install && cd ..

# Setup database
cd server && npx prisma migrate dev && npx prisma generate && node seed.js && cd ..



# Run application
npm run dev

# Access: http://localhost:5173
```

---

## 📊 Database Schema Quick View

```
User (id, name, email, password, role)
  └── Articles (many)

Category (id, name)
  └── Articles (many)

Article (id, title, content, summary, status, imageUrl, isBreaking, views, clicks, ...)
  ├── authorId → User
  └── categoryId → Category
```

**Article Status Flow:**
```
PENDING → APPROVED → PUBLISHED
         ↓
      REJECTED
```

---

## 🔌 Essential API Endpoints

```javascript
// Login
POST /api/auth/login
Body: { email, password }
Returns: { token, user }

// Get Articles
GET /api/articles
Headers: Authorization: Bearer <token>

// Create Article
POST /api/articles
Headers: Authorization: Bearer <token>
Body: { title, content, summary, categoryId, isBreaking?, imageUrl? }

// Update Article Status
PATCH /api/articles/:id
Body: { status: "APPROVED" | "PUBLISHED" | "REJECTED" }



// Get Stats
GET /api/stats
Returns: { totalArticles, pendingApproval, activeUsers, breakingNews, trafficData }

// Get Categories
GET /api/categories
```

---

## 🎨 Frontend Routes

```
/login              → Login.jsx (public)
/                   → Dashboard.jsx (admin view)
/editor             → EditorDashboard.jsx
/sub-editor         → SubEditorDashboard.jsx
/articles           → Articles.jsx
```

**Components:**
- `Sidebar.jsx` - Navigation + user info
- `Header.jsx` - Top bar + breadcrumbs
- `SummaryCard.jsx` - Article card
- `EditModal.jsx` - Article editor

---

## 🛠️ Development Commands

```bash
# Frontend only
npm run client
# or
cd client && npm run dev

# Backend only
npm run server
# or
cd server && node index.js

# Database management
cd server
npx prisma studio          # Visual database browser
npx prisma migrate dev     # Create migration
npx prisma generate        # Regenerate client
node seed.js               # Reset & seed data

# Testing
cd server
python test_api.py         # Test API endpoints
python workflow.py         # Test workflow manually
```

---

## 🐛 Common Fixes

**Workflow not working:**
```bash
cd server
rm processed_urls.txt              # Clear processed URLs
pip install feedparser requests beautifulsoup4 python-dotenv
python workflow.py                 # Run manually to see errors
```

**Database errors:**
```bash
cd server
npx prisma generate
npx prisma migrate reset   # ⚠️ Deletes all data
node seed.js
```

**Module not found:**
```bash
npm install
cd client && npm install
cd ../server && npm install
```

**CORS errors:**
- Check `client/vite.config.js` has proxy configured
- Ensure server uses `app.use(cors())`

---

## 📦 Key Dependencies

**Frontend:**
- react, react-dom, react-router-dom
- axios (HTTP)
- framer-motion (animations)
- recharts (charts)
- lucide-react (icons)
- vite (build tool)

**Backend:**
- express (web framework)
- @prisma/client (ORM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- cors, dotenv

**Python:**
- feedparser (RSS parsing)
- requests (HTTP)
- beautifulsoup4 (HTML cleaning)
- python-dotenv (env vars)

---

## 🔐 Environment Variables

Create `server/.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-this-in-production"
PORT=5000
```

---

## 📊 User Roles & Permissions

| Role | Can View | Can Approve | Can Publish | Dashboard |
|------|----------|-------------|-------------|-----------|
| **Sub-Editor** | PENDING | PENDING → APPROVED | ❌ | Queue |
| **Editor** | SUB_APPROVED | SUB_APPROVED → APPROVED | ❌ | Editor |
| **Admin** | APPROVED | ❌ | APPROVED → PUBLISHED | Analytics |

---

## 🎯 Typical Workflows

**Sub-Editor:**
1. Click "AI Refresh" to fetch news
2. Review articles in queue
3. Approve good articles
4. Reject poor quality

**Editor:**
1. Review sub-editor approvals
2. Final quality check
3. Approve for admin posting

**Admin:**
1. Monitor dashboard stats
2. Review editor-approved articles
3. Post to live site
4. Analyze traffic

---

## 📁 Important Files

```
server/
  index.js              # Main API server
  index.js              # Main API server
  seed.js              # Database seeder
  prisma/schema.prisma # Database schema
  .env                 # Environment config
  processed_urls.txt   # Workflow tracking

client/
  src/App.jsx          # Main routing
  src/index.css        # Global styles
  vite.config.js       # Vite config (proxy)

README.md              # This file
README.md              # This file
```

---

## 🚨 Production Checklist

Before deploying:
- [ ] Change JWT_SECRET to strong random string
- [ ] Switch to PostgreSQL/MySQL
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Implement role-based API guards
- [ ] Set up error logging (Sentry)
- [ ] Configure proper CORS origins
- [ ] Add input validation
- [ ] Set up regular database backups
- [ ] Configure CDN for assets
- [ ] Enable caching headers
- [ ] Add monitoring (New Relic, DataDog)

---

## 📞 Quick Support

**Full docs:** See main documentation artifact

---

**Last Updated:** 2026-02-01
