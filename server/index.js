const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev, restrict in prod
        methods: ["GET", "POST", "PATCH"]
    }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES ---

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });

    if (!user.isActive) {
        return res.status(403).json({ error: 'Account is inactive. Please contact support.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// --- USER MANAGEMENT ROUTES (ADMIN ONLY) ---

app.get('/api/users', authenticateToken, async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.sendStatus(403);
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, isActive: true }
    });
    res.json(users);
});

app.post('/api/users', authenticateToken, async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.sendStatus(403);
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role }
        });
        res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        res.status(400).json({ error: 'User already exists or invalid data' });
    }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.sendStatus(403);
    try {
        await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
        res.sendStatus(204);
    } catch (err) {
        res.status(400).json({ error: 'Error deleting user' });
    }
});

// --- DASHBOARD STATS ---

app.get('/api/stats', authenticateToken, async (req, res) => {
    const totalArticles = await prisma.article.count();
    const pendingApproval = await prisma.article.count({ where: { status: 'UNDER_REVIEW' } });
    const activeUsers = await prisma.user.count({ where: { isActive: true } });
    const breakingNews = await prisma.article.count({ where: { isBreaking: true } });

    // Mock traffic data for the chart
    const trafficData = [
        { name: 'Mon', views: 12000, clicks: 3000 },
        { name: 'Tue', views: 13500, clicks: 3500 },
        { name: 'Wed', views: 15000, clicks: 4000 },
        { name: 'Thu', views: 14000, clicks: 3800 },
        { name: 'Fri', views: 16500, clicks: 4400 },
        { name: 'Sat', views: 18000, clicks: 4800 },
        { name: 'Sun', views: 20000, clicks: 5200 },
    ];

    res.json({
        totalArticles,
        pendingApproval,
        activeUsers,
        breakingNews,
        trafficData
    });
});

// --- ARTICLES ---

app.get('/api/articles', authenticateToken, async (req, res) => {
    const { status } = req.query;
    const where = status ? { status } : {};

    const articles = await prisma.article.findMany({
        where,
        include: { author: { select: { name: true } }, category: true },
        orderBy: { createdAt: 'desc' }
    });
    res.json(articles);
});

// Alias for the user's requested endpoint pattern
app.get('/api/news/list.php', authenticateToken, async (req, res) => {
    const { status } = req.query;
    const where = status ? { status: status.toUpperCase() } : {};

    const articles = await prisma.article.findMany({
        where,
        include: { author: { select: { name: true } }, category: true },
        orderBy: { createdAt: 'desc' }
    });
    res.json(articles);
});

app.post('/api/articles', authenticateToken, async (req, res) => {
    const { title, content, summary, categoryId, isBreaking, imageUrl, status } = req.body;
    const article = await prisma.article.create({
        data: {
            title,
            content: content || "",
            summary,
            categoryId: categoryId ? parseInt(categoryId) : 1,
            authorId: req.user ? req.user.id : null,
            isBreaking: isBreaking || false,
            imageUrl: imageUrl || null,
            status: status || (req.user?.role === 'ADMIN' ? 'PUBLISHED' : 'UNDER_REVIEW')
        },
        include: { author: { select: { name: true } }, category: true }
    });

    io.emit('article_new', article); // Real-time update
    io.emit('stats_update'); // Trigger stats refresh

    res.json(article);
});

app.patch('/api/articles/:id', authenticateToken, async (req, res) => {
    const { status, title, content, summary } = req.body;
    const article = await prisma.article.update({
        where: { id: parseInt(req.params.id) },
        data: { status, title, content, summary },
        include: { author: { select: { name: true } }, category: true }
    });

    io.emit('article_updated', article); // Real-time update
    io.emit('stats_update'); // Trigger stats refresh

    res.json(article);
});

// --- WORKFLOW WEBHOOK TRIGGER ---

app.post('/api/workflow/trigger', authenticateToken, async (req, res) => {
    try {
        // Trigger the external webhook with a standard simple payload
        const response = await fetch("http://localhost:5678/webhook-test/trigger-news-summary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                source: "sub_editor_refresh"
            })
        });

        const data = await response.json();
        console.log("Webhook triggered:", data);

        // Send success response back to the client
        res.json({ success: true, data });
    } catch (err) {
        console.error("Workflow trigger error:", err);
        // Send error response back to the client
        res.status(500).json({ error: 'Error fetching news, please try again' });
    }
});

// --- CATEGORIES ---

app.get('/api/categories', async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
});

// Simulated Traffic Update (every 5 seconds)
setInterval(() => {
    const newViews = Math.floor(Math.random() * 500) + 100;
    io.emit('traffic_update', { views: newViews });
}, 5000);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
