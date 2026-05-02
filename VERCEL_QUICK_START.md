# ⚡ Quick Start - Vercel Deployment

**Deploy your Task Manager to Vercel + Neon in 15 minutes!**

---

## 🎯 What You'll Get

- ✅ **Frontend:** React app on Vercel CDN (global, fast)
- ✅ **Backend:** Serverless API functions on Vercel
- ✅ **Database:** PostgreSQL on Neon (512 MB free)
- ✅ **Cost:** $0/month forever
- ✅ **SSL:** Automatic HTTPS
- ✅ **Domain:** Free `.vercel.app` subdomain

---

## 📝 Prerequisites (2 minutes)

1. **GitHub Account** - [Sign up](https://github.com/signup) (free)
2. **Vercel Account** - [Sign up](https://vercel.com/signup) (free, use GitHub)
3. **Neon Account** - [Sign up](https://neon.tech) (free, use GitHub)

---

## 🚀 Deployment Steps

### Step 1: Setup Database (5 minutes)

1. Go to [neon.tech](https://neon.tech) → Sign in with GitHub
2. Click "Create Project"
   - Name: `decode-age-tasks`
   - Region: Choose closest to you
   - Click "Create Project"
3. **Copy the connection string** (save it!)
4. Open **SQL Editor** in Neon dashboard
5. Copy and run this SQL:

```sql
-- Create tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'employee')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  start_time TIMESTAMP,
  deadline TIMESTAMP,
  assigned_to UUID REFERENCES users(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'incomplete',
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_sessions_token ON sessions(token);

-- Insert admin user (password: MANDIP@123)
INSERT INTO users (email, password, name, role)
VALUES (
  'mandip.p@decodeage.com',
  '$2b$10$INLDgXP/ZkpcroAOMihZeuPo84vbrooLUAa6RvOoncIMDWXtZYGsK',
  'Mandip',
  'admin'
);
```

6. Click "Run" ✅

---

### Step 2: Push to GitHub (3 minutes)

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Deploy to Vercel"

# Create GitHub repo and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

### Step 3: Deploy to Vercel (5 minutes)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import" next to your GitHub repository
3. **Configure Project:**
   - Framework: Vite (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run vercel-build`
   - Output Directory: `frontend/dist`

4. **Add Environment Variables:**

   Click "Environment Variables" and add:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Your Neon connection string |
   | `JWT_SECRET` | `decode-age-secret-key-2026` |
   | `NODE_ENV` | `production` |

5. Click **"Deploy"** 🚀

6. Wait 2-3 minutes...

---

## ✅ Test Your Deployment

1. **Open your app:** `https://your-app.vercel.app`

2. **Test API:**
   - Go to: `https://your-app.vercel.app/api/health`
   - Should see: `{"status":"ok","message":"Decode Age Task Manager API"}`

3. **Login:**
   - Email: `mandip.p@decodeage.com`
   - Password: `MANDIP@123`

4. **Create tasks and test!**

---

## 🎉 You're Live!

Your app is now deployed at: `https://your-app.vercel.app`

### What Happens Now?

- ✅ Every `git push` automatically deploys
- ✅ Vercel provides preview URLs for branches
- ✅ Database scales to zero when idle (saves money)
- ✅ SSL certificate auto-renews
- ✅ Global CDN for fast loading

---

## 🔧 Common Issues

### "Database connection failed"
- Check DATABASE_URL in Vercel environment variables
- Ensure it ends with `?sslmode=require`

### "Invalid token"
- Clear browser localStorage
- Login again

### Slow first request
- Normal! Serverless functions have cold starts (~1-2 seconds)
- Subsequent requests are fast

---

## 📊 Monitor Usage

- **Neon:** [console.neon.tech](https://console.neon.tech) → Usage
- **Vercel:** [vercel.com/dashboard](https://vercel.com/dashboard) → Analytics

---

## 🎯 Next Steps

1. **Add custom domain** (optional)
   - Vercel Dashboard → Settings → Domains
   - Add `tasks.decodeage.com`

2. **Create employee accounts**
   - Login as admin
   - Go to Admin Panel → Add User

3. **Invite your team**
   - Share the URL
   - Create accounts for everyone

---

## 💡 Pro Tips

- **Automatic deployments:** Every push to `main` deploys automatically
- **Preview deployments:** Push to other branches for preview URLs
- **Rollback:** Vercel Dashboard → Deployments → Redeploy old version
- **Logs:** Vercel Dashboard → Functions → View logs

---

## 📞 Need Help?

- **Full Guide:** See `VERCEL_DEPLOYMENT_GUIDE.md`
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Neon Docs:** [neon.tech/docs](https://neon.tech/docs)

---

**That's it! You're deployed! 🎉**
