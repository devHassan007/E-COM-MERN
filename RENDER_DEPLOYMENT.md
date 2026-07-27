# Render Deployment Guide (FREE - Supports WebSockets)

## Why Render?
- ✅ **Free tier** with WebSocket support
- ✅ Real-time chat will work
- ✅ Easy deployment from GitHub

## Backend Deployment on Render (FREE)

### Step 1: Create Render Account
Go to [render.com](https://render.com) and sign up (free)

### Step 2: Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `ecommerce-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

4. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   MONGODB_URI=mongodb+srv://samiullahglotar420:malikecomerceappsami@ecommerce.jkzlt.mongodb.net/
   JWT_SECRET=gfjufewyr28r3yrkukwgefjwgfjewggf
   JWT_EXPIRE=5d
   COOKIE_EXPIRE=5
   PORT=10000
   FRONTEND_URL=https://your-frontend.vercel.app
   SMTP_SERVICE=gmail
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_MAIL=samiullahglotar420@gmail.com
   SMTP_PASSWORD=kkiu zvaz qdss dgpx
   ```

5. Click **"Create Web Service"**

6. Wait for deployment (takes ~5 minutes)

7. Copy your backend URL: `https://ecommerce-backend-xxxx.onrender.com`

---

## Frontend Deployment on Vercel (FREE)

1. Go to [vercel.com](https://vercel.com)
2. Add New Project → Import your repo
3. Set **Root Directory**: `frontend`
4. Add Environment Variables (these override your local .env):
   ```
   REACT_APP_API_URL=https://ecommerce-backend-xxxx.onrender.com/api/v1
   REACT_APP_SOCKET_URL=https://ecommerce-backend-xxxx.onrender.com
   ```
   *(Replace with your actual Render backend URL)*

5. Deploy!

**Note**: Your local `.env` file uses `localhost:4000` for development. Vercel environment variables will override these for production.

---

## After Deployment

1. Update `FRONTEND_URL` in Render dashboard with your Vercel frontend URL
2. In MongoDB Atlas → Network Access → Allow `0.0.0.0/0`

---

## Note on Free Tier
- Render free tier spins down after 15 min of inactivity
- First request after sleep takes ~30 seconds (cold start)
- Stays awake while actively used
