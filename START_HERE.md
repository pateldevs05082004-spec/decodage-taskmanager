# 🚀 START HERE - Complete Setup Guide

## ✅ What's Already Done

- ✅ Backend code with authentication system
- ✅ Frontend with Login, Admin Panel, and Employee Dashboard
- ✅ Database migrations ready
- ✅ Dependencies installed
- ✅ Environment variables configured

## 📋 What You Need to Do

### Step 1: Install PostgreSQL (if not installed)

**Check if installed:**
```bash
psql --version
```

**If not installed:**
1. Download from: https://www.postgresql.org/download/windows/
2. Install with these settings:
   - Password: `postgres` (or remember your password)
   - Port: `5432`
3. Add to PATH: `C:\Program Files\PostgreSQL\16\bin`
4. Restart your terminal

### Step 2: Setup Database

**Option A - Use the setup script (Easiest):**
```bash
setup-database.bat
```

**Option B - Manual setup:**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE decode_age_task_manager;"

# Run migrations
cd backend
npm.cmd run migrate:up
```

### Step 3: Start the Application

**Option A - Start both servers at once:**
```bash
start-all.bat
```

**Option B - Start separately:**

Terminal 1 (Backend):
```bash
start-backend.bat
```

Terminal 2 (Frontend):
```bash
start-frontend.bat
```

### Step 4: Test the Website

1. Open browser: **http://localhost:5173**
2. Login with:
   - Email: `pdev444444@gmail.com`
   - Password: `admin123`

## 🎯 What to Test

### Admin Features
1. ✅ Login as admin
2. ✅ View Admin Panel
3. ✅ Add new user (employee or admin)
4. ✅ View all users
5. ✅ Delete users
6. ✅ Logout

### Employee Features
1. ✅ Login as employee (create one first as admin)
2. ✅ View Employee Dashboard
3. ✅ See profile information
4. ✅ Logout

## 📁 Project Structure

```
taskmanager/
├── backend/
│   ├── src/
│   │   ├── services/auth.service.ts      # Authentication logic
│   │   ├── middleware/auth.middleware.ts # JWT verification
│   │   ├── routes/auth.routes.ts         # API endpoints
│   │   └── index.ts                      # Main server
│   └── migrations/                       # Database migrations
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Login.tsx                 # Login page
│       │   ├── AdminPanel.tsx            # Admin dashboard
│       │   └── EmployeeDashboard.tsx     # Employee dashboard
│       └── App.tsx                       # Main app
├── .env                                  # Environment variables
├── setup-database.bat                    # Database setup script
├── start-all.bat                         # Start both servers
└── START_HERE.md                         # This file
```

## 🔧 Configuration Files

### .env (Already created)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=decode_age_task_manager
DB_USER=postgres
DB_PASSWORD=postgres
DATABASE_URL=postgres://postgres:postgres@localhost:5432/decode_age_task_manager
JWT_SECRET=decode-age-super-secret-jwt-key-2024-change-in-production
```

**Note:** If your PostgreSQL password is different, update `DB_PASSWORD` and `DATABASE_URL`

## 🌐 API Endpoints

### Public
- `POST /api/auth/login` - Login

### Protected (Requires Authentication)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Admin Only
- `POST /api/auth/users` - Create user
- `GET /api/auth/users` - List all users
- `DELETE /api/auth/users/:id` - Delete user

## ❗ Troubleshooting

### "psql is not recognized"
- PostgreSQL not installed or not in PATH
- Install from: https://www.postgresql.org/download/windows/
- Add to PATH: `C:\Program Files\PostgreSQL\16\bin`

### "Database connection failed"
- Check PostgreSQL is running
- Verify password in `.env` file
- Test: `psql -U postgres -d decode_age_task_manager`

### "Port 5000 already in use"
- Change `PORT=5001` in `.env`
- Restart backend

### "Migration failed"
- Make sure database exists
- Check DATABASE_URL in `.env`
- Try: `psql -U postgres -c "DROP DATABASE decode_age_task_manager; CREATE DATABASE decode_age_task_manager;"`

### Frontend shows blank page
- Check browser console for errors
- Make sure backend is running on port 5000
- Clear browser cache and reload

## 📝 Default Credentials

**Admin Account:**
- Email: pdev444444@gmail.com
- Password: admin123

**⚠️ Change this password after first login!**

## 🎉 Success Checklist

- [ ] PostgreSQL installed
- [ ] Database created
- [ ] Migrations run successfully
- [ ] Backend server running (http://localhost:5000)
- [ ] Frontend server running (http://localhost:5173)
- [ ] Can login as admin
- [ ] Can create new users
- [ ] Can login as employee
- [ ] Can logout

## 📚 Additional Documentation

- `QUICK_START.md` - Detailed setup instructions
- `MANUAL_AUTH_SETUP.md` - Authentication system documentation
- `backend/DATABASE_SETUP.md` - Database setup guide

## 🆘 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the error messages in terminal
3. Check browser console for frontend errors
4. Verify all services are running

---

**Ready to start? Run:** `setup-database.bat` then `start-all.bat`
