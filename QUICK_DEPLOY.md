# 🚀 Quick Deployment Guide - ResourceMaster

## Fastest Way to Deploy (15 minutes)

### Step 1: MongoDB Atlas (5 min)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account → Create free cluster (M0)
3. **Database Access**: Create user (save username/password)
4. **Network Access**: Allow from anywhere (0.0.0.0/0)
5. **Connect**: Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/resourcemaster?retryWrites=true&w=majority`

### Step 2: Deploy Backend on Render (5 min)
1. Go to https://render.com → Sign up with GitHub
2. **New** → **Web Service** → Connect GitHub repo
3. Settings:
   - **Name**: `resourcemaster-backend`
   - **Root Directory**: `backend`
   - **Build**: `npm install`
   - **Start**: `npm start`
4. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_atlas_connection_string_here
   JWT_SECRET=change_this_to_random_32_char_string
   JWT_EXPIRES_IN=7d
   EMAIL_USER=motidese122119@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password
   FRONTEND_URL=https://your-frontend.vercel.app (update after step 3)
   ```
5. Click **Create** → Wait for deployment
6. Copy backend URL: `https://resourcemaster-backend.onrender.com`

### Step 3: Deploy Frontend on Vercel (5 min)
1. Go to https://vercel.com → Sign up with GitHub
2. **Add New Project** → Import GitHub repo
3. Settings:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build**: `npm run build`
4. **Environment Variable**:
   ```
   VITE_API_URL=https://resourcemaster-backend.onrender.com/api
   ```
5. Click **Deploy** → Wait 2 minutes
6. Copy frontend URL: `https://your-project.vercel.app`

### Step 4: Update Backend CORS
1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```
3. Redeploy (or it auto-updates)

### Step 5: Seed Database
Create a temporary endpoint or use MongoDB Compass to add initial users:
- Admin: admin@ambouniversity.edu / admin123
- Manager: manager@ambouniversity.edu / manager123
- Staff: staff@ambouniversity.edu / staff123

## ✅ Done! Your app is live!

**Frontend**: https://your-project.vercel.app  
**Backend**: https://resourcemaster-backend.onrender.com

## 🔧 Gmail App Password Setup
1. Google Account → Security → 2-Step Verification (enable)
2. https://myaccount.google.com/apppasswords
3. Generate password for "Mail"
4. Use 16-char password in `EMAIL_PASSWORD`

## 📝 Notes
- Render free tier: Spins down after 15min (first request takes 30-60s)
- Vercel: Always fast, unlimited for personal projects
- MongoDB Atlas: 512MB free storage (enough for hackathon)

## 🆘 Troubleshooting
- **Backend timeout**: Normal on free tier, wait 30-60s
- **CORS error**: Check FRONTEND_URL in backend env vars
- **Can't connect**: Verify MongoDB connection string

---

**Total Cost: $0/month** 💰

