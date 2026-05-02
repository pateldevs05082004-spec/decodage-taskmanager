# System Overview

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         BROWSER                              │
│                   http://localhost:5173                      │
│                                                              │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Login    │  │ Admin Panel  │  │ Employee Dashboard│   │
│  │   Page     │  │              │  │                   │   │
│  └────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Requests (JWT Token)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER                            │
│                   http://localhost:5000                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API ENDPOINTS                            │  │
│  │                                                       │  │
│  │  POST /api/auth/login        - Login                 │  │
│  │  POST /api/auth/logout       - Logout                │  │
│  │  GET  /api/auth/me           - Get current user      │  │
│  │  POST /api/auth/users        - Create user (admin)   │  │
│  │  GET  /api/auth/users        - List users (admin)    │  │
│  │  DELETE /api/auth/users/:id  - Delete user (admin)   │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           AUTHENTICATION MIDDLEWARE                   │  │
│  │  - Verify JWT Token                                   │  │
│  │  - Check User Role                                    │  │
│  │  - Protect Routes                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           AUTHENTICATION SERVICE                      │  │
│  │  - Hash Passwords (bcrypt)                            │  │
│  │  - Generate JWT Tokens                                │  │
│  │  - Verify Credentials                                 │  │
│  │  - Manage Users                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL Queries
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                       │
│                 decode_age_task_manager                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    users     │  │   sessions   │  │    tasks     │     │
│  │              │  │              │  │              │     │
│  │ - id         │  │ - id         │  │ - id         │     │
│  │ - email      │  │ - user_id    │  │ - description│     │
│  │ - password   │  │ - token      │  │ - deadline   │     │
│  │ - name       │  │ - expires_at │  │ - assigned_to│     │
│  │ - role       │  │              │  │ - status     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
1. USER ENTERS CREDENTIALS
   ↓
2. FRONTEND sends POST /api/auth/login
   {
     "email": "pdev444444@gmail.com",
     "password": "admin123"
   }
   ↓
3. BACKEND verifies password (bcrypt)
   ↓
4. BACKEND generates JWT token
   ↓
5. BACKEND stores session in database
   ↓
6. BACKEND returns token + user info
   {
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "user": {
       "id": "uuid",
       "email": "pdev444444@gmail.com",
       "name": "Admin User",
       "role": "admin"
     }
   }
   ↓
7. FRONTEND stores token in localStorage
   ↓
8. FRONTEND redirects to dashboard
   ↓
9. SUBSEQUENT REQUESTS include token:
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## User Roles

```
┌─────────────────────────────────────────────────────────┐
│                         ADMIN                            │
│                                                          │
│  Permissions:                                            │
│  ✓ Login/Logout                                          │
│  ✓ View own profile                                      │
│  ✓ Create new users (admin or employee)                 │
│  ✓ View all users                                        │
│  ✓ Delete users (except self)                           │
│  ✓ Manage tasks (future)                                │
│                                                          │
│  Default Account:                                        │
│  Email: pdev444444@gmail.com                            │
│  Password: admin123                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                       EMPLOYEE                           │
│                                                          │
│  Permissions:                                            │
│  ✓ Login/Logout                                          │
│  ✓ View own profile                                      │
│  ✓ View assigned tasks (future)                         │
│  ✓ Update task status (future)                          │
│                                                          │
│  ✗ Cannot create users                                   │
│  ✗ Cannot delete users                                   │
│  ✗ Cannot view other users                              │
└─────────────────────────────────────────────────────────┘
```

## Data Flow - Create User

```
ADMIN PANEL
    │
    │ 1. Admin clicks "Add User"
    │ 2. Fills form: name, email, password, role
    │ 3. Clicks "Create User"
    ▼
FRONTEND
    │
    │ POST /api/auth/users
    │ Headers: { Authorization: Bearer <token> }
    │ Body: { email, password, name, role }
    ▼
BACKEND - Auth Middleware
    │
    │ 1. Verify JWT token
    │ 2. Check user is admin
    ▼
BACKEND - Auth Service
    │
    │ 1. Hash password with bcrypt
    │ 2. Insert into database
    ▼
DATABASE
    │
    │ INSERT INTO users (email, password, name, role)
    │ VALUES (...)
    ▼
BACKEND
    │
    │ Return new user (without password)
    ▼
FRONTEND
    │
    │ 1. Show success message
    │ 2. Refresh user list
    │ 3. Clear form
    ▼
ADMIN PANEL
    │
    │ New user appears in list
```

## Security Features

```
┌─────────────────────────────────────────────────────────┐
│                    PASSWORD SECURITY                     │
│                                                          │
│  Plain Password: "admin123"                              │
│       ↓                                                  │
│  Bcrypt Hash (10 rounds):                                │
│  "$2b$10$OdDxiMjHeOgaYuJajuoffOut/1mUsmJT..."          │
│       ↓                                                  │
│  Stored in Database                                      │
│                                                          │
│  ✓ Cannot be reversed                                    │
│  ✓ Each hash is unique (salt)                           │
│  ✓ Slow to brute force                                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     JWT TOKEN                            │
│                                                          │
│  Header:                                                 │
│  { "alg": "HS256", "typ": "JWT" }                       │
│                                                          │
│  Payload:                                                │
│  {                                                       │
│    "id": "user-uuid",                                    │
│    "email": "user@example.com",                         │
│    "role": "admin",                                      │
│    "iat": 1234567890,                                    │
│    "exp": 1234567890                                     │
│  }                                                       │
│                                                          │
│  Signature:                                              │
│  HMACSHA256(base64(header) + "." + base64(payload),     │
│             JWT_SECRET)                                  │
│                                                          │
│  ✓ Signed with secret key                               │
│  ✓ Cannot be tampered                                   │
│  ✓ Expires after 7 days                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  ROLE-BASED ACCESS                       │
│                                                          │
│  Request → Middleware → Check Token → Check Role        │
│                                                          │
│  Admin Routes:                                           │
│  - requireAdmin middleware                               │
│  - Returns 403 if not admin                             │
│                                                          │
│  Protected Routes:                                       │
│  - authenticateToken middleware                          │
│  - Returns 401 if no token                              │
│  - Returns 403 if invalid token                         │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
taskmanager/
│
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   └── auth.service.ts          ← Business logic
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts       ← JWT verification
│   │   ├── routes/
│   │   │   └── auth.routes.ts           ← API endpoints
│   │   ├── db/
│   │   │   ├── connection.ts            ← Database pool
│   │   │   └── index.ts
│   │   └── index.ts                     ← Express server
│   ├── migrations/
│   │   ├── 1_create-users-table.js      ← Users schema
│   │   ├── 2_create-tasks-table.js      ← Tasks schema
│   │   ├── 3_create-sessions-table.js   ← Sessions schema
│   │   └── 4_seed-admin-user.js         ← Default admin
│   └── package.json
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Login.tsx                ← Login form
│       │   ├── AdminPanel.tsx           ← Admin UI
│       │   └── EmployeeDashboard.tsx    ← Employee UI
│       ├── App.tsx                      ← Main router
│       └── main.tsx                     ← Entry point
│
├── .env                                 ← Configuration
├── setup-database.bat                   ← Setup script
├── start-all.bat                        ← Start script
└── START_HERE.md                        ← Instructions
```

## Technology Stack

```
Frontend:
  - React 18
  - TypeScript
  - Vite (build tool)
  - Native CSS (inline styles)

Backend:
  - Node.js
  - Express
  - TypeScript
  - bcrypt (password hashing)
  - jsonwebtoken (JWT)
  - pg (PostgreSQL client)

Database:
  - PostgreSQL 14+
  - node-pg-migrate (migrations)

Development:
  - tsx (TypeScript execution)
  - Vitest (testing)
  - ESLint (linting)
  - Prettier (formatting)
```

---

This system provides a complete authentication solution with role-based access control, ready for production use after proper security hardening.
