const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'flowdesk_secret_change_in_production';

app.use(cors());
app.use(express.json());

// ─── AUTH MIDDLEWARE ───────────────────────────────────────────────────────────
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: 'All fields required' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(400).json({ error: 'Email already registered' });

  const hashed = bcrypt.hashSync(password, 10);
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const result = db.prepare(
    'INSERT INTO users (email, password, name, initials) VALUES (?, ?, ?, ?)'
  ).run(email, hashed, name, initials);

  const user = db.prepare('SELECT id, email, name, role, initials, bio, phone, location FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, user });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid email or password' });

  const { password: _, ...safeUser } = user;
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, user: safeUser });
});

app.get('/api/auth/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, email, name, role, initials, bio, phone, location FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.put('/api/auth/profile', auth, (req, res) => {
  const { name, role, bio, phone, location, initials } = req.body;
  db.prepare(
    'UPDATE users SET name=?, role=?, bio=?, phone=?, location=?, initials=? WHERE id=?'
  ).run(name, role, bio, phone, location, initials, req.user.id);
  const user = db.prepare('SELECT id, email, name, role, initials, bio, phone, location FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

// ─── PROJECTS ROUTES ──────────────────────────────────────────────────────────
app.get('/api/projects', auth, (req, res) => {
  const projects = db.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(projects.map(p => ({ ...p, members: p.members ? JSON.parse(p.members) : [] })));
});

app.post('/api/projects', auth, (req, res) => {
  const { title, description, color, icon, progress, status, priority, due_date, members } = req.body;
  const result = db.prepare(
    'INSERT INTO projects (user_id, title, description, color, icon, progress, status, priority, due_date, members) VALUES (?,?,?,?,?,?,?,?,?,?)'
  ).run(req.user.id, title, description, color, icon, progress || 0, status || 'active', priority || 'medium', due_date, JSON.stringify(members || []));
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
  res.json({ ...project, members: JSON.parse(project.members || '[]') });
});

app.put('/api/projects/:id', auth, (req, res) => {
  const { title, description, color, icon, progress, status, priority, due_date, members } = req.body;
  db.prepare(
    'UPDATE projects SET title=?, description=?, color=?, icon=?, progress=?, status=?, priority=?, due_date=?, members=? WHERE id=? AND user_id=?'
  ).run(title, description, color, icon, progress, status, priority, due_date, JSON.stringify(members || []), req.params.id, req.user.id);
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  res.json({ ...project, members: JSON.parse(project.members || '[]') });
});

app.delete('/api/projects/:id', auth, (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

// ─── TASKS ROUTES ─────────────────────────────────────────────────────────────
app.get('/api/tasks', auth, (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(tasks);
});

app.post('/api/tasks', auth, (req, res) => {
  const { title, description, color, initial, priority, status, due_date, when_scheduled, project_id } = req.body;
  const result = db.prepare(
    'INSERT INTO tasks (user_id, project_id, title, description, color, initial, priority, status, due_date, when_scheduled) VALUES (?,?,?,?,?,?,?,?,?,?)'
  ).run(req.user.id, project_id || null, title, description, color, initial, priority || 'medium', status || 'active', due_date, when_scheduled || 'today');
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.json(task);
});

app.put('/api/tasks/:id', auth, (req, res) => {
  const { title, description, color, initial, priority, status, due_date, when_scheduled, project_id } = req.body;
  db.prepare(
    'UPDATE tasks SET title=?, description=?, color=?, initial=?, priority=?, status=?, due_date=?, when_scheduled=?, project_id=? WHERE id=? AND user_id=?'
  ).run(title, description, color, initial, priority, status, due_date, when_scheduled, project_id || null, req.params.id, req.user.id);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json(task);
});

app.delete('/api/tasks/:id', auth, (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

// ─── BULK DELETE ROUTES ───────────────────────────────────────────────────────
app.delete('/api/tasks', auth, (req, res) => {
  db.prepare('DELETE FROM tasks WHERE user_id = ?').run(req.user.id);
  res.json({ success: true });
});

app.delete('/api/projects', auth, (req, res) => {
  db.prepare('DELETE FROM projects WHERE user_id = ?').run(req.user.id);
  res.json({ success: true });
});

// ─── SERVE FRONTEND (must be after all API routes) ────────────────────────────
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 FlowDesk running on port ${PORT}`));
