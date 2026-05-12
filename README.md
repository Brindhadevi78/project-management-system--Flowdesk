# FlowDesk - Project Management System

A full-stack project management application built with React, Express, and SQLite.

## Features

✅ **Authentication** - Login/Register with JWT tokens  
✅ **Dashboard** - Real-time stats, task overview, project cards  
✅ **Projects** - Create, edit, delete projects with progress tracking  
✅ **Tasks** - Full CRUD with priority, status, due dates, filters  
✅ **Team** - Add/edit/remove team members  
✅ **Profile** - Edit user information  
✅ **Settings** - Preferences, data export, theme options  
✅ **Search** - Real-time task search across all pages  
✅ **Calendar** - Live calendar with month navigation  
✅ **SQLite Database** - All data persisted to database  

## Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- Phosphor Icons

**Backend:**
- Express.js
- SQLite (better-sqlite3)
- JWT Authentication
- bcryptjs for password hashing

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

You need to run **both** the backend server and frontend dev server:

### 1. Start the Backend Server (Terminal 1)

```bash
npm run server
```

Server will run on `http://localhost:3001`

### 2. Start the Frontend (Terminal 2)

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## First Time Setup

1. Open `http://localhost:5173` in your browser
2. Click "Sign up" to create a new account
3. Fill in your name, email, and password
4. You'll be automatically logged in

## Database

The SQLite database (`pms.db`) is automatically created in the `server/` folder on first run.

**Tables:**
- `users` - User accounts
- `projects` - Projects with progress tracking
- `tasks` - Tasks with priorities, due dates, status

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Environment Variables

Already configured in `.env`:
```
VITE_SUPABASE_URL=https://ihhsrcrfsaatkjxuvxzu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

(Note: These are not used since we switched to SQLite)

## Project Structure

```
project-management-sys/
├── server/
│   ├── db.js           # Database initialization
│   ├── index.js        # Express server & API routes
│   ├── package.json    # Server config (CommonJS)
│   └── pms.db          # SQLite database (auto-generated)
├── src/
│   ├── components/     # Reusable components
│   ├── context/        # React Context (Auth, App state)
│   ├── lib/            # API client
│   ├── pages/          # Page components
│   └── App.jsx         # Main app component
├── package.json
└── README.md
```

## Features Breakdown

### Dashboard
- Active/Completed/Overdue task counts
- Featured project cards with progress bars
- Add/Edit/Delete/Complete tasks
- Toggle between Active and Completed tabs

### Projects
- Create projects with custom colors and icons
- Track progress with slider
- Filter by priority (high/medium/low)
- Real task count per project

### Tasks
- Full task management with CRUD
- Filter by status, priority, project
- Sort by date, priority, title
- Inline complete/edit/delete

### Team
- Add team members with name, role, email
- Edit member details and status
- Remove members
- Status indicators (online/away/offline)

### Profile
- Edit name, role, email, phone, location
- Custom initials
- View task/project stats
- Logout button

### Settings
- Theme preferences (dark mode coming soon)
- Notification toggles
- Export data as JSON
- Clear cache
- Delete all data
- Logout

## Security

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- Protected API routes with middleware
- SQL injection prevention with prepared statements

## Development

```bash
# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Notes

- Team members are stored in localStorage (not in database yet)
- Settings preferences stored in localStorage
- JWT secret should be changed in production (`server/index.js`)
- Database is created automatically on first server start

## License

MIT
