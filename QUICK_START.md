# Quick Start Guide

## Prerequisites Installation

### 1. Install PostgreSQL

**Download and Install:**
1. Go to https://www.postgresql.org/download/windows/
2. Download the PostgreSQL installer (version 14 or higher)
3. Run the installer
4. During installation:
   - Set password for postgres user: `postgres` (or remember your password)
   - Keep default port: `5432`
   - Install all components

**Verify Installation:**
```bash
# Add PostgreSQL to PATH (if not automatically added)
# Default location: C:\Program Files\PostgreSQL\16\bin

# Test installation
psql --version
```

### 2. Create Database

Open Command Prompt or PowerShell and run:

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql prompt, create database:
CREATE DATABASE decode_age_task_manager;

# Exit psql
\q
```

Or use this one-liner:
```bash
psql -U postgres -c "CREATE DATABASE decode_age_task_manager;"
```

## Setup Steps

### 1. Configure Environment

The `.env` file has been created with default settings. If your PostgreSQL password is different from `postgres`, update it:

```env
DB_PASSWORD=your_actual_password
DATABASE_URL=postgres://postgres:your_actual_password@localhost:5432/decode_age_task_manager
```

### 2. Run Database Migrations

```bash
cd backend
npm.cmd run migrate:up
```

This will create all tables and the admin user.

### 3. Start Backend Server

In one terminal:
```bash
cd backend
npm.cmd run dev
```

You should see:
```
✓ Database connection established
Backend server running on port 5000
```

### 4. Start Frontend Server

In another terminal:
```bash
cd frontend
npm.cmd run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173
```

### 5. Access the Application

Open your browser and go to: **http://localhost:5173**

Login with:
- **Email**: pdev444444@gmail.com
- **Password**: admin123

## Troubleshooting

### PostgreSQL Not Found
- Make sure PostgreSQL is installed
- Add PostgreSQL bin directory to PATH
- Restart your terminal after installation

### Database Connection Failed
- Check if PostgreSQL service is running
- Verify password in `.env` file
- Test connection: `psql -U postgres -d decode_age_task_manager`

### Port Already in Use
- Backend (5000): Change `PORT` in `.env`
- Frontend (5173): Vite will automatically use next available port

### Migration Errors
- Make sure database exists: `psql -U postgres -l | findstr decode_age`
- Check DATABASE_URL in `.env` is correct
- Try dropping and recreating database if needed

## What You Can Test

### As Admin (pdev444444@gmail.com)
1. Login with admin credentials
2. View the Admin Panel
3. Click "Add User" button
4. Create a new employee:
   - Name: Test Employee
   - Email: employee@test.com
   - Password: test123
   - Role: Employee
5. See the new user in the user list
6. Logout

### As Employee
1. Login with employee credentials (employee@test.com / test123)
2. View the Employee Dashboard
3. See your profile information
4. Logout

### Test User Management
1. Login as admin
2. Create multiple users
3. Try deleting a user (not yourself)
4. Verify user is removed from list

## Next Steps After Testing

1. Change admin password
2. Implement task management features
3. Add more security features
4. Deploy to production

