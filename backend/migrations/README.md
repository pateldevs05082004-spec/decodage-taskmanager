# Database Migrations

This directory contains database migrations for the Decode Age Task Manager.

## Setup

1. Ensure PostgreSQL is installed and running
2. Create the database:
   ```bash
   createdb decode_age_task_manager
   ```
3. Copy `.env.example` to `.env` and update the database credentials
4. Run migrations:
   ```bash
   npm run migrate:up
   ```

## Migration Scripts

- `npm run migrate:up` - Run all pending migrations
- `npm run migrate:down` - Rollback the last migration
- `npm run migrate:create <name>` - Create a new migration file

## Migration Files

1. **1_create-users-table.js** - Creates the users table with indexes
   - Stores user information from Microsoft Entra ID
   - Includes role-based access control (admin/employee)
   - Indexes on email, entra_id, and role

2. **2_create-tasks-table.js** - Creates the tasks table with foreign keys
   - Stores task information with assignments
   - Foreign keys to users table for assigned_to and created_by
   - Indexes on assigned_to, status, deadline, and created_by
   - ON DELETE SET NULL for assigned_to (unassigns tasks when employee deleted)

3. **3_create-sessions-table.js** - Creates the sessions table
   - Stores authentication sessions
   - Foreign key to users table with CASCADE delete
   - Indexes on user_id and expires_at

## Database Schema

### Users Table
- `id` (UUID, primary key)
- `email` (VARCHAR(255), unique, not null)
- `role` (VARCHAR(20), not null, CHECK: 'admin' or 'employee')
- `entra_id` (VARCHAR(255), unique, not null)
- `created_at` (TIMESTAMP, default: CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP, default: CURRENT_TIMESTAMP)

### Tasks Table
- `id` (UUID, primary key)
- `description` (VARCHAR(500), not null)
- `deadline` (TIMESTAMP, not null)
- `assigned_to` (UUID, foreign key to users.id, ON DELETE SET NULL)
- `created_by` (UUID, foreign key to users.id, not null)
- `status` (VARCHAR(20), not null, default: 'incomplete', CHECK: 'incomplete' or 'complete')
- `completed_at` (TIMESTAMP, nullable)
- `created_at` (TIMESTAMP, default: CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP, default: CURRENT_TIMESTAMP)

### Sessions Table
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to users.id, ON DELETE CASCADE, not null)
- `access_token` (TEXT, not null)
- `refresh_token` (TEXT, not null)
- `expires_at` (TIMESTAMP, not null)
- `created_at` (TIMESTAMP, default: CURRENT_TIMESTAMP)

## Connection Pooling

The database connection module (`src/db/connection.ts`) provides:
- Connection pooling with pg Pool (max 20 connections)
- Automatic connection management
- Query execution with logging
- Transaction support via `getClient()`
- Connection health checks
- Graceful shutdown support
