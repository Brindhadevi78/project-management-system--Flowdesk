const Database = require('better-sqlite3');
const path = require('path');

// On Render, use /tmp for writable storage. Locally use server/ folder.
const dbPath = process.env.NODE_ENV === 'production'
  ? '/tmp/pms.db'
  : path.join(__dirname, 'pms.db');

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'User',
    initials TEXT,
    bio TEXT,
    phone TEXT,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#ff9b44',
    icon TEXT DEFAULT 'ph-briefcase',
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    priority TEXT DEFAULT 'medium',
    due_date TEXT,
    members TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    project_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3b5998',
    initial TEXT,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'active',
    due_date TEXT,
    when_scheduled TEXT DEFAULT 'today',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
  CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
  CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
`);

console.log('✅ Database initialized at', dbPath);

module.exports = db;
