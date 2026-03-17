import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-wedding-key';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize SQLite Database
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}
const db = new Database(path.join(dbDir, 'database.sqlite'));

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS invitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    slug TEXT UNIQUE,
    data TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS wishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invitation_slug TEXT,
    name TEXT,
    message TEXT,
    attendance TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const info = stmt.run(name, email, hashedPassword);
    
    const token = jwt.sign({ id: info.lastInsertRowid, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: info.lastInsertRowid, name, email } });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email) as any;

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

app.get('/api/auth/me', authenticateToken, (req: any, res) => {
  const stmt = db.prepare('SELECT id, name, email FROM users WHERE id = ?');
  const user = stmt.get(req.user.id);
  if (user) {
    res.json({ user });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/api/invitation', authenticateToken, (req: any, res) => {
  const stmt = db.prepare('SELECT data, slug FROM invitations WHERE user_id = ?');
  const invitation = stmt.get(req.user.id) as any;
  if (invitation) {
    res.json({ data: JSON.parse(invitation.data), slug: invitation.slug });
  } else {
    res.json({ data: null });
  }
});

app.post('/api/invitation', authenticateToken, (req: any, res) => {
  const { data } = req.body;
  const slug = `${data.bride.nickname.toLowerCase()}-${data.groom.nickname.toLowerCase()}-${req.user.id}`;
  
  const stmt = db.prepare('INSERT INTO invitations (user_id, slug, data) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, slug = excluded.slug');
  stmt.run(req.user.id, slug, JSON.stringify(data));
  
  res.json({ success: true, slug });
});

app.get('/api/invitation/:slug', (req, res) => {
  const stmt = db.prepare('SELECT data FROM invitations WHERE slug = ?');
  const invitation = stmt.get(req.params.slug) as any;
  if (invitation) {
    res.json({ data: JSON.parse(invitation.data) });
  } else {
    res.status(404).json({ error: 'Invitation not found' });
  }
});

app.get('/api/wishes/:slug', (req, res) => {
  const stmt = db.prepare('SELECT * FROM wishes WHERE invitation_slug = ? ORDER BY created_at DESC');
  const wishes = stmt.all(req.params.slug);
  res.json({ wishes });
});

app.post('/api/wishes/:slug', (req, res) => {
  const { name, message, attendance } = req.body;
  const stmt = db.prepare('INSERT INTO wishes (invitation_slug, name, message, attendance) VALUES (?, ?, ?, ?)');
  stmt.run(req.params.slug, name, message, attendance);
  res.json({ success: true });
});

// Vite Middleware for Development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
