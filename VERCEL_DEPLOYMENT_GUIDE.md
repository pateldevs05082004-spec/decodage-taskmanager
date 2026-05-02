# 🚀 Vercel + Neon Deployment Guide

Complete step-by-step guide to deploy your Task Manager to Vercel (frontend + backend) with Neon PostgreSQL database - **100% FREE**.

---

## 📋 Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Neon account (sign up at [neon.tech](https://neon.tech))

---

## Part 1: Setup Neon PostgreSQL Database (5 minutes)

### Step 1: Create Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Click "Sign Up" (free, no credit card required)
3. Sign up with GitHub or email

### Step 2: Create Database

1. Click "Create Project"
2. **Project Name:** `decode-age-tasks`
3. **Region:** Choose closest to your users (e.g., US East, EU West)
4. **PostgreSQL Version:** 16 (latest)
5. Click "Create Project"

### Step 3: Get Connection String

1. After project creation, you'll see the connection details
2. Copy the **Connection String** (looks like this):
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. **SAVE THIS** - you'll need it for Vercel

### Step 4: Run Database Migrations

1. Open the **SQL Editor** in Neon dashboard
2. Copy and paste the following SQL (run each section separately):

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'employee')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  start_time TIMESTAMP,
  deadline TIMESTAMP,
  assigned_to UUID REFERENCES users(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'incomplete' CHECK (status IN ('incomplete', 'complete')),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
```

3. Click "Run" to execute

### Step 5: Seed Admin User

Run this SQL to create the admin account:

```sql
-- Insert admin user (password: MANDIP@123)
INSERT INTO users (email, password, name, role)
VALUES (
  'mandip.p@decodeage.com',
  '$2b$10$YourHashedPasswordHere',
  'Mandip',
  'admin'
);
```

**Note:** You'll need to hash the password first. Run this locally:

```bash
cd backend
npm run hash-password
# Enter password: MANDIP@123
# Copy the hashed password and replace $2b$10$YourHashedPasswordHere above
```

Or use this pre-hashed password for `MANDIP@123`:
```
$2b$10$INLDgXP/ZkpcroAOMihZeuPo84vbrooLUAa6RvOoncIMDWXtZYGsK
```

✅ **Database Setup Complete!**

---

## Part 2: Deploy to Vercel (10 minutes)

### Step 1: Push Code to GitHub

1. Create a new repository on GitHub
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit - Vercel deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Import Project to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Click "Import"

### Step 3: Configure Build Settings

Vercel should auto-detect the settings, but verify:

- **Framework Preset:** Vite
- **Root Directory:** `./` (leave as root)
- **Build Command:** `npm run vercel-build`
- **Output Directory:** `frontend/dist`

### Step 4: Add Environment Variables

Click "Environment Variables" and add these:

| Name | Value | Notes |
|------|-------|-------|
| `DATABASE_URL` | Your Neon connection string | From Step 3 above |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this` | Generate a random string |
| `NODE_ENV` | `production` | Set to production |

**To generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for deployment
3. You'll get a URL like: `https://your-app.vercel.app`

✅ **Deployment Complete!**

---

## Part 3: Test Your Deployment

### Step 1: Test API

Open your browser and go to:
```
https://your-app.vercel.app/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Decode Age Task Manager API"
}
```

### Step 2: Test Login

1. Go to `https://your-app.vercel.app`
2. Login with:
   - **Email:** `mandip.p@decodeage.com`
   - **Password:** `MANDIP@123`

### Step 3: Create Test User

1. Login as admin
2. Go to Admin Panel
3. Create a test employee user
4. Test task creation and assignment

---

## 🎯 Post-Deployment Configuration

### Update Frontend API URL (if needed)

If your frontend is making requests to `localhost`, update it:

1. Check `frontend/src/App.tsx` or API configuration
2. The API should automatically use relative URLs (`/api/...`)
3. Vercel will route `/api/*` to serverless functions automatically

### Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `tasks.decodeage.com`)
3. Follow DNS configuration instructions
4. Vercel provides free SSL certificates

---

## 📊 Monitoring & Limits

### Neon Free Tier Limits:
- ✅ 512 MB storage (enough for millions of tasks)
- ✅ 100 compute hours/month (scales to zero when idle)
- ✅ 1 GB RAM
- ✅ Unlimited databases
- ⚠️ Database pauses after 5 minutes of inactivity (wakes up in ~1 second)

### Vercel Free Tier Limits:
- ✅ 100 GB bandwidth/month
- ✅ 100 hours serverless execution/month
- ✅ 6,000 build minutes/month
- ✅ Unlimited API requests
- ⚠️ 10-second timeout per function
- ⚠️ No commercial use on Hobby plan

### Monitor Usage:
- **Neon:** Dashboard → Usage
- **Vercel:** Dashboard → Analytics

---

## 🔧 Troubleshooting

### Issue: "Database connection failed"

**Solution:**
1. Check DATABASE_URL in Vercel environment variables
2. Ensure connection string includes `?sslmode=require`
3. Verify Neon database is active (not paused)

### Issue: "Invalid token" errors

**Solution:**
1. Check JWT_SECRET is set in Vercel
2. Clear browser localStorage and login again
3. Verify JWT_SECRET is the same across all deployments

### Issue: "Function timeout"

**Solution:**
1. Optimize database queries (add indexes)
2. Reduce data fetched per request
3. Consider upgrading to Vercel Pro ($20/month) for 60s timeout

### Issue: Cold starts (slow first request)

**Solution:**
- This is normal for serverless functions
- First request after inactivity takes 1-3 seconds
- Subsequent requests are fast
- Consider Vercel Pro for always-warm functions

### Issue: CORS errors

**Solution:**
1. Check `api/_lib/middleware.ts` has correct CORS headers
2. Verify frontend is making requests to same domain
3. Check browser console for specific CORS error

---

## 🔄 Updating Your Deployment

### Automatic Deployments:

Every time you push to GitHub, Vercel automatically:
1. Pulls latest code
2. Runs build
3. Deploys new version
4. Zero downtime

### Manual Deployment:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## 💰 Cost Breakdown

| Service | Plan | Cost | What You Get |
|---------|------|------|--------------|
| **Neon** | Free | $0/month | 512 MB DB, 100 compute hours |
| **Vercel** | Hobby | $0/month | Hosting, CDN, SSL, 100 GB bandwidth |
| **Total** | | **$0/month** | Full production app |

### When to Upgrade:

**Upgrade to Vercel Pro ($20/month) if:**
- You need commercial use
- You exceed 100 GB bandwidth
- You need longer function timeouts (60s)
- You want always-warm functions

**Upgrade to Neon Pro ($25/month) if:**
- You exceed 512 MB storage
- You need more compute hours
- You want always-on database (no pause)

---

## 🎉 Success Checklist

- [ ] Neon database created and migrations run
- [ ] Admin user seeded
- [ ] Code pushed to GitHub
- [ ] Vercel project created and linked
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] API health check passes
- [ ] Login works
- [ ] Tasks can be created and assigned
- [ ] Custom domain configured (optional)

---

## 📞 Support

### Neon Support:
- Docs: [neon.tech/docs](https://neon.tech/docs)
- Discord: [neon.tech/discord](https://neon.tech/discord)

### Vercel Support:
- Docs: [vercel.com/docs](https://vercel.com/docs)
- Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## 🚀 Next Steps

1. **Add more employees** - Create employee accounts in Admin Panel
2. **Test task workflows** - Create, assign, complete tasks
3. **Monitor usage** - Check Neon and Vercel dashboards
4. **Custom domain** - Add your company domain
5. **Backup strategy** - Neon provides automatic backups

---

**Congratulations! Your Task Manager is now live on Vercel + Neon! 🎉**

Access your app at: `https://your-app.vercel.app`
