# Deployment Guide - Cheapest Options

## Admin Credentials
- **Email:** mandip.p@decodeage.com
- **Password:** MANDIP@123

---

## Best Deployment Options (Cheapest to Most Expensive)

### Option 1: **Vercel (Frontend) + Railway (Backend + DB)** ⭐ RECOMMENDED
**Cost:** ~$5-10/month

#### Why This?
- Vercel: FREE for frontend (React/Vite)
- Railway: $5/month for backend + PostgreSQL
- Easy setup, automatic deployments
- Good performance

#### Setup Steps:

**1. Deploy Frontend to Vercel (FREE)**
```bash
# Install Vercel CLI
npm i -g vercel

# In frontend folder
cd frontend
vercel

# Follow prompts:
# - Set up and deploy: Yes
# - Which scope: Your account
# - Link to existing project: No
# - Project name: decode-age-task-manager
# - Directory: ./
# - Override settings: No
```

**2. Deploy Backend + Database to Railway ($5/month)**
- Go to [railway.app](https://railway.app)
- Sign up with GitHub
- Click "New Project" → "Deploy PostgreSQL"
- Click "New" → "Empty Service"
- Connect your GitHub repo
- Set root directory to `/backend`
- Add environment variables:
  ```
  DB_HOST=<postgres-host-from-railway>
  DB_PORT=5432
  DB_NAME=railway
  DB_USER=postgres
  DB_PASSWORD=<from-railway>
  JWT_SECRET=your-super-secret-key-change-this
  PORT=5000
  ```
- Deploy!

**3. Update Frontend API URL**
In `frontend/src/components/*`, replace:
```typescript
'http://localhost:5000/api/...'
```
with:
```typescript
'https://your-backend.railway.app/api/...'
```

Or better, use environment variables:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

---

### Option 2: **Render (All-in-One)** 
**Cost:** $7/month (Web Service) + $7/month (PostgreSQL) = $14/month

#### Setup:
1. Go to [render.com](https://render.com)
2. Create PostgreSQL database ($7/month)
3. Create Web Service for backend ($7/month)
4. Create Static Site for frontend (FREE)

---

### Option 3: **Fly.io (Backend + DB) + Vercel (Frontend)**
**Cost:** ~$5-8/month

#### Setup:
1. Frontend on Vercel (FREE)
2. Backend + PostgreSQL on Fly.io
   ```bash
   flyctl launch
   flyctl postgres create
   flyctl deploy
   ```

---

### Option 4: **DigitalOcean App Platform**
**Cost:** $12/month (includes everything)

#### Setup:
1. Go to [digitalocean.com](https://digitalocean.com)
2. Create App
3. Connect GitHub repo
4. Add PostgreSQL database
5. Deploy

---

### Option 5: **AWS Free Tier** (Most Complex)
**Cost:** FREE for 12 months, then ~$10-15/month

#### Components:
- EC2 t2.micro (FREE tier)
- RDS PostgreSQL (FREE tier)
- S3 for frontend (FREE tier)

**Not recommended unless you know AWS well**

---

## Recommended: Vercel + Railway Setup

### Step-by-Step Guide

#### 1. Prepare Your Code

**Create `vercel.json` in frontend folder:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Create `.env.production` in frontend:**
```env
VITE_API_URL=https://your-backend.railway.app
```

**Update API calls to use environment variable:**
Create `frontend/src/config/api.ts`:
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

Then in components, replace:
```typescript
fetch('http://localhost:5000/api/tasks', ...)
```
with:
```typescript
import { API_URL } from '../config/api';
fetch(`${API_URL}/api/tasks`, ...)
```

#### 2. Deploy Backend to Railway

1. **Sign up at [railway.app](https://railway.app)**

2. **Create PostgreSQL Database:**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Copy connection details

3. **Deploy Backend:**
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Set root directory: `/backend`
   - Add environment variables:
     ```
     DB_HOST=<from-postgres-service>
     DB_PORT=5432
     DB_NAME=railway
     DB_USER=postgres
     DB_PASSWORD=<from-postgres-service>
     JWT_SECRET=change-this-to-random-string
     PORT=5000
     NODE_ENV=production
     ```

4. **Run Migrations:**
   - In Railway dashboard, go to your backend service
   - Click "Settings" → "Deploy"
   - Add custom start command:
     ```bash
     npm run migrate && npm start
     ```

5. **Get Backend URL:**
   - Railway will give you a URL like: `https://your-app.railway.app`

#### 3. Deploy Frontend to Vercel

1. **Update API URL in code** (see step 1 above)

2. **Deploy:**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Set Environment Variable in Vercel:**
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend.railway.app`
   - Redeploy

#### 4. Configure CORS on Backend

Update `backend/src/index.ts`:
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app'
  ],
  credentials: true
}));
```

---

## Cost Comparison

| Option | Monthly Cost | Ease of Setup | Performance |
|--------|-------------|---------------|-------------|
| Vercel + Railway | $5-10 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Render | $14 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Fly.io + Vercel | $5-8 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| DigitalOcean | $12 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| AWS Free Tier | $0-15 | ⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Can login with admin credentials
- [ ] Can create tasks
- [ ] Can edit/delete tasks
- [ ] Database persists data
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] HTTPS enabled (automatic on Vercel/Railway)
- [ ] Change JWT_SECRET to something secure
- [ ] Consider changing admin password

---

## Troubleshooting

### Frontend can't connect to backend
- Check CORS settings
- Verify API_URL environment variable
- Check browser console for errors

### Database connection fails
- Verify DATABASE_URL in Railway
- Check if migrations ran successfully
- Look at Railway logs

### 502 Bad Gateway
- Backend might be starting up (wait 30 seconds)
- Check Railway logs for errors
- Verify PORT environment variable

---

## Monitoring & Maintenance

### Railway
- Check logs: Railway Dashboard → Service → Logs
- Monitor usage: Dashboard → Usage
- Set up alerts for downtime

### Vercel
- Check deployments: Vercel Dashboard → Deployments
- Monitor performance: Analytics tab
- Set up custom domain (optional)

---

## Scaling Later

When you need more:
1. **Railway:** Upgrade to $20/month for more resources
2. **Add Redis:** For session management ($5/month on Railway)
3. **CDN:** Vercel includes this automatically
4. **Database Backups:** Railway Pro includes automatic backups

---

## Security Recommendations

1. **Change JWT_SECRET** to a long random string
2. **Enable 2FA** on Railway and Vercel accounts
3. **Use strong passwords** for database
4. **Regular backups** of PostgreSQL
5. **Monitor logs** for suspicious activity
6. **Rate limiting** (add later if needed)

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Your backend logs: Railway Dashboard
- Your frontend logs: Vercel Dashboard

---

**Total Setup Time:** ~30 minutes
**Monthly Cost:** ~$5-10
**Difficulty:** Easy ⭐⭐⭐⭐⭐
