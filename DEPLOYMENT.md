# Deployment Guide - ResourceMaster

This guide covers deploying the ResourceMaster application online.

## 🎯 Recommended Deployment Stack

- **Frontend**: Vercel or Netlify (Free, easy setup)
- **Backend**: Render or Railway (Free tier available)
- **Database**: MongoDB Atlas (Free tier available)

---

## 📋 Pre-Deployment Checklist

1. ✅ Create MongoDB Atlas account and cluster
2. ✅ Set up environment variables
3. ✅ Test application locally
4. ✅ Push code to GitHub

---

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (Free tier: M0)

### 1.2 Configure Database Access
1. Go to **Database Access** → **Add New Database User**
2. Create username and password (save these!)
3. Set user privileges to **Read and write to any database**

### 1.3 Configure Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - Or add specific IPs for better security

### 1.4 Get Connection String
1. Go to **Clusters** → Click **Connect**
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resourcemaster?retryWrites=true&w=majority`

---

## 🚀 Step 2: Deploy Backend (Render.com - Recommended)

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub

### 2.2 Create New Web Service
1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Select the repository
4. Configure:
   - **Name**: `resourcemaster-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.3 Add Environment Variables
In Render dashboard, go to **Environment** and add:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resourcemaster?retryWrites=true&w=majority
JWT_SECRET=your_very_secure_secret_key_here_change_this
JWT_EXPIRES_IN=7d
EMAIL_USER=motidese122119@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
FRONTEND_URL=https://your-frontend-url.vercel.app
TELEGRAM_BOT_TOKEN=your_telegram_bot_token (optional)
TELEGRAM_CHAT_ID=your_chat_id (optional)
```

### 2.4 Deploy
1. Click **Create Web Service**
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL (e.g., `https://resourcemaster-backend.onrender.com`)

### 2.5 Seed Database
After deployment, you can seed the database:
- Option 1: SSH into Render and run `npm run seed`
- Option 2: Create a temporary endpoint to seed (remove after use)
- Option 3: Use MongoDB Compass to manually add users

---

## 🌐 Step 3: Deploy Frontend (Vercel - Recommended)

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### 3.2 Import Project
1. Click **Add New** → **Project**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Add Environment Variables
In Vercel dashboard, go to **Settings** → **Environment Variables**:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Replace `your-backend-url.onrender.com` with your actual Render backend URL.

### 3.4 Deploy
1. Click **Deploy**
2. Wait for deployment (2-3 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`

### 3.5 Update Backend CORS
Update your backend `.env` in Render:
```env
FRONTEND_URL=https://your-project-name.vercel.app
```

---

## 🔄 Alternative: Deploy Backend on Railway

### Railway Setup
1. Go to https://railway.app
2. Sign up with GitHub
3. **New Project** → **Deploy from GitHub**
4. Select repository
5. Add environment variables (same as Render)
6. Railway auto-detects Node.js and deploys

**Advantages**: Faster cold starts than Render

---

## 🔄 Alternative: Deploy Frontend on Netlify

### Netlify Setup
1. Go to https://netlify.com
2. Sign up with GitHub
3. **Add new site** → **Import from Git**
4. Select repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Add environment variable:
   - `VITE_API_URL` = your backend URL

---

## 🔧 Step 4: Update Configuration

### 4.1 Update Backend CORS
Make sure your backend `server.js` allows your frontend domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app',
    'https://your-frontend-url.netlify.app'
  ],
  credentials: true
}));
```

### 4.2 Update Frontend API URL
The frontend will use `VITE_API_URL` from environment variables.

---

## 📧 Step 5: Configure Email (Gmail)

### 5.1 Enable 2-Step Verification
1. Go to Google Account settings
2. Enable 2-Step Verification

### 5.2 Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Generate app password for "Mail"
3. Copy the 16-character password
4. Add to backend environment variables as `EMAIL_PASSWORD`

---

## ✅ Step 6: Test Deployment

1. **Test Frontend**: Visit your Vercel/Netlify URL
2. **Test Backend**: Visit `https://your-backend-url.onrender.com/api/health`
3. **Test Login**: Use demo credentials
4. **Test Features**: Create resources, report maintenance issues

---

## 🐛 Troubleshooting

### Backend not starting
- Check environment variables are set correctly
- Check MongoDB connection string
- View logs in Render/Railway dashboard

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Ensure backend URL is accessible

### Database connection issues
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check connection string has correct password
- Verify database user has correct permissions

### Email not sending
- Verify Gmail App Password is correct
- Check email logs in backend
- Test email configuration locally first

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** ✅ (Already in .gitignore)
2. **Use strong JWT_SECRET** (random string, 32+ characters)
3. **Limit MongoDB IP access** (use specific IPs in production)
4. **Enable HTTPS** (Vercel/Netlify do this automatically)
5. **Regular updates** (keep dependencies updated)

---

## 📊 Monitoring

### Render
- View logs in dashboard
- Set up uptime monitoring
- Configure auto-deploy from GitHub

### Vercel
- View analytics
- Check function logs
- Monitor performance

---

## 🚀 Quick Deploy Commands

### Render (Backend)
```bash
# Already done via dashboard, but you can use CLI:
render deploy
```

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

---

## 💰 Cost Estimate

**Free Tier (Recommended for Hackathon):**
- MongoDB Atlas: Free (512MB storage)
- Render: Free (spins down after 15min inactivity)
- Vercel: Free (unlimited for personal projects)
- **Total: $0/month**

**Paid Options (if needed):**
- Render: $7/month (always-on)
- MongoDB Atlas: $9/month (2GB storage)

---

## 📝 Post-Deployment Checklist

- [ ] Backend is accessible
- [ ] Frontend is accessible
- [ ] Database connection works
- [ ] Login works
- [ ] Can create resources
- [ ] Can report maintenance issues
- [ ] Email notifications work
- [ ] Password reset works
- [ ] Admin can create users

---

## 🆘 Need Help?

Common issues:
1. **Backend timeout**: Render free tier spins down - first request takes 30-60s
2. **CORS errors**: Check frontend URL is in backend CORS config
3. **Environment variables**: Double-check all variables are set correctly

---

**Good luck with your deployment! 🚀**

