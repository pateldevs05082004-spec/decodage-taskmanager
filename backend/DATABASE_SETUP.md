# Database Setup Guide

This guide will help you set up PostgreSQL and run the database migrations for the Decode Age Task Manager.

## Prerequisites

- PostgreSQL 12 or higher installed
- Node.js and npm installed

## Installation Steps

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE decode_age_task_manager;

# Exit psql
\q
```

Alternatively, use the command line:
```bash
createdb -U postgres decode_age_task_manager
```

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env` in the root directory:
```bash
cp .env.example .env
```

Update the database configuration in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=decode_age_task_manager
DB_USER=postgres
DB_PASSWORD=your_actual_password

DATABASE_URL=postgres://postgres:your_actual_password@localhost:5432/decode_age_task_manager
```

### 4. Run Migrations

From the backend directory:
```bash
cd backend
npm run migrate:up
```

You should see output indicating successful migration:
```
> migrate:up
> node-pg-migrate up

1_create-users-table
2_create-tasks-table
3_create-sessions-table
```

### 5. Verify Setup

Start the backend server:
```bash
npm run dev
```

You should see:
```
✓ Database connection established
Backend server running on port 5000
```

## Migration Commands

- **Run all pending migrations:**
  ```bash
  npm run migrate:up
  ```

- **Rollback last migration:**
  ```bash
  npm run migrate:down
  ```

- **Create a new migration:**
  ```bash
  npm run migrate:create <migration-name>
  ```

## Database Schema

The migrations create three tables:

### users
- Stores user information from Microsoft Entra ID
- Includes role-based access control (admin/employee)

### tasks
- Stores task information with assignments
- Foreign keys to users table
- Automatic unassignment when employee is deleted

### sessions
- Stores authentication sessions
- Linked to users with cascade delete

See `migrations/README.md` for detailed schema information.

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running: `pg_isready`
- Check the port: `psql -U postgres -p 5432`

### Authentication Failed
- Verify password in `.env` matches PostgreSQL user password
- Check `pg_hba.conf` for authentication settings

### Database Does Not Exist
- Create the database: `createdb decode_age_task_manager`
- Or use psql: `CREATE DATABASE decode_age_task_manager;`

### Migration Errors
- Check DATABASE_URL format in `.env`
- Ensure database exists before running migrations
- Check PostgreSQL logs for detailed error messages

## Testing Database Connection

Run the database connection tests:
```bash
npm test -- src/db/connection.test.ts
```

This will verify:
- Database connection is established
- Queries execute successfully
- Connection pooling works
- Transaction support functions correctly
