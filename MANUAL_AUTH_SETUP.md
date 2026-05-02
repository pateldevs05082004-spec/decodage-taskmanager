# Manual Authentication Setup Guide

This application has been configured with manual email/password authentication instead of Microsoft Entra ID.

## Features

- **Manual Login**: Users log in with email and password
- **Admin Panel**: Admin users can add and manage other users
- **Role-Based Access**: Admin and Employee roles with different permissions
- **JWT Authentication**: Secure token-based authentication
- **Session Management**: Persistent sessions stored in database

## Default Admin Account

- **Email**: pdev444444@gmail.com
- **Password**: admin123
- **Role**: Admin

**Important**: Change the admin password after first login!

## Setup Instructions

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Backend Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=decode_age_task_manager
DB_USER=postgres
DB_PASSWORD=your_password_here

# Database URL for migrations
DATABASE_URL=postgres://postgres:your_password_here@localhost:5432/decode_age_task_manager

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Set Up Database

Make sure PostgreSQL is running, then create the database:

```bash
createdb decode_age_task_manager
```

### 4. Run Migrations

```bash
cd backend
npm run migrate:up
```

This will create:
- `users` table (with password field)
- `tasks` table
- `sessions` table (with JWT tokens)
- Default admin user (pdev444444@gmail.com)

### 5. Generate Admin Password Hash (Optional)

If you want to change the default admin password before running migrations:

```bash
cd backend
npx tsx scripts/hash-password.ts
```

Copy the generated hash and update `backend/migrations/4_seed-admin-user.js`.

### 6. Start the Application

**Option 1: Run both frontend and backend together**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 7. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with email and password
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/logout` - Logout (requires authentication)
- `GET /api/auth/me` - Get current user info (requires authentication)

### User Management (Admin Only)

- `POST /api/auth/users` - Create a new user
  ```json
  {
    "email": "newuser@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "employee"
  }
  ```

- `GET /api/auth/users` - Get all users
- `DELETE /api/auth/users/:id` - Delete a user

## Usage Flow

### Admin Workflow

1. Login with admin credentials (pdev444444@gmail.com / admin123)
2. You'll see the Admin Panel
3. Click "Add User" to create new users
4. Fill in user details (name, email, password, role)
5. New users can now log in with their credentials
6. Manage users (view list, delete users)

### Employee Workflow

1. Admin creates an employee account
2. Employee logs in with provided credentials
3. Employee sees their dashboard
4. Employee can view their profile and tasks

## Database Schema

### users table
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Unique email address
- `password` (VARCHAR) - Bcrypt hashed password
- `name` (VARCHAR) - User's full name
- `role` (VARCHAR) - 'admin' or 'employee'
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### sessions table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `token` (TEXT) - JWT token
- `expires_at` (TIMESTAMP) - Token expiration
- `created_at` (TIMESTAMP)

### tasks table
- `id` (UUID) - Primary key
- `description` (VARCHAR)
- `deadline` (TIMESTAMP)
- `assigned_to` (UUID) - Foreign key to users
- `created_by` (UUID) - Foreign key to users
- `status` (VARCHAR) - 'incomplete' or 'complete'
- `completed_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Security Features

- **Password Hashing**: Bcrypt with 10 salt rounds
- **JWT Tokens**: Signed tokens with 7-day expiration
- **Session Storage**: Tokens stored in database for validation
- **Role-Based Access**: Middleware to protect admin routes
- **CORS Protection**: Configured for local development

## Troubleshooting

### Cannot login with admin credentials

1. Check if migrations ran successfully:
   ```bash
   cd backend
   npm run migrate:up
   ```

2. Verify admin user exists:
   ```bash
   psql -d decode_age_task_manager -c "SELECT email, role FROM users WHERE email = 'pdev444444@gmail.com';"
   ```

3. If user doesn't exist, run migration 4 again:
   ```bash
   npm run migrate:down
   npm run migrate:up
   ```

### "Invalid token" errors

1. Clear browser localStorage
2. Login again
3. Check JWT_SECRET is set in .env

### Database connection errors

1. Verify PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Check database exists:
   ```bash
   psql -l | grep decode_age
   ```

3. Verify .env credentials match PostgreSQL user

### CORS errors

1. Make sure backend is running on port 5000
2. Make sure frontend is running on port 3000
3. Check CORS configuration in backend/src/index.ts

## Next Steps

1. Change the default admin password
2. Add more users through the admin panel
3. Implement task management features
4. Add password change functionality
5. Implement password reset via email
6. Add user profile editing
7. Enhance security with rate limiting

## Production Deployment

Before deploying to production:

1. Change JWT_SECRET to a strong random string
2. Use environment variables for all sensitive data
3. Enable HTTPS
4. Configure CORS for your production domain
5. Set up proper database backups
6. Implement rate limiting
7. Add logging and monitoring
8. Consider adding 2FA for admin accounts

