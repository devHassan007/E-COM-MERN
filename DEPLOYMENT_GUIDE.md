# Vercel Deployment Guide

This guide walks you through deploying both the backend and frontend of your e-commerce app to Vercel.

## ⚠️ Important Note About Socket.IO

**Vercel serverless functions do NOT support WebSockets.** This means:
- Real-time chat features will NOT work on Vercel
- If you need real-time features, consider deploying the backend to **Railway**, **Render**, or **Fly.io** instead

The REST API endpoints will work normally on Vercel.

---

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/docs/cli) (optional, for CLI deployment)
3. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

---

## Step 1: Deploy the Backend

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

5. Add Environment Variables (click "Environment Variables"):
   ```
   MONGODB_URI=mongodb+srv://samiullahglotar420:malikecomerceappsami@ecommerce.jkzlt.mongodb.net/
   JWT_SECRET=gfjufewyr28r3yrkukwgefjwgfjewggf
   JWT_EXPIRE=5d
   COOKIE_EXPIRE=5
   FRONTEND_URL=https://your-frontend-app.vercel.app
   SMTP_SERVICE=gmail
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_MAIL=samiullahglotar420@gmail.com
   SMTP_PASSWORD=kkiu zvaz qdss dgpx
   ```

6. Click **"Deploy"**

7. After deployment, copy your backend URL (e.g., `https://your-backend-xyz.vercel.app`)

### Option B: Deploy via CLI

```bash
cd backend
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

---

## Step 2: Deploy the Frontend

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and click **"Add New..."** → **"Project"**
2. Import your Git repository (same repo)
3. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` or `react-scripts build`
   - **Output Directory**: `build`

4. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-xyz.vercel.app/api/v1
   REACT_APP_SOCKET_URL=https://your-backend-xyz.vercel.app
   ```
   *(Replace `your-backend-xyz` with your actual backend Vercel URL from Step 1)*

5. Click **"Deploy"**

### Option B: Deploy via CLI

```bash
cd frontend
vercel
```

When prompted, add the environment variables.

---

## Step 3: Update Backend CORS

After both are deployed, update the backend's `FRONTEND_URL` environment variable:

1. Go to your backend project on Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Update `FRONTEND_URL` to your frontend's Vercel URL (e.g., `https://your-frontend-abc.vercel.app`)
4. **Redeploy** the backend for changes to take effect

---

## Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `JWT_EXPIRE` | JWT token expiry | `5d` |
| `COOKIE_EXPIRE` | Cookie expiry in days | `5` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-frontend.vercel.app` |
| `SMTP_SERVICE` | Email service | `gmail` |
| `SMTP_HOST` | SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_MAIL` | Email address | `your-email@gmail.com` |
| `SMTP_PASSWORD` | App password | `your-app-password` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://your-backend.vercel.app/api/v1` |
| `REACT_APP_SOCKET_URL` | Socket.IO URL | `https://your-backend.vercel.app` |

---

## Troubleshooting

### 1. CORS Errors
- Ensure `FRONTEND_URL` in backend matches your frontend's exact Vercel URL
- Make sure there's no trailing slash in the URL

### 2. API Not Working
- Check that `REACT_APP_API_URL` in frontend is correct
- Ensure the backend is deployed and the URL includes `/api/v1`

### 3. Database Connection Errors
- Verify your MongoDB Atlas allows connections from all IPs (0.0.0.0/0) in Network Access settings
- Check that `MONGODB_URI` is correctly set

### 4. Authentication Issues
- Vercel deployments use different domains, which can affect cookies
- Consider using `sameSite: 'none'` and `secure: true` for cookies in production

### 5. Build Failures
- Check Vercel logs for specific errors
- Ensure all dependencies are in `package.json`
- Clear Vercel cache and redeploy

---

## Alternative for Real-Time Features

If you need Socket.IO/WebSocket support, deploy the backend to one of these platforms instead:

1. **Railway** (https://railway.app) - Easy Docker/Node.js deployment
2. **Render** (https://render.com) - Free tier available with WebSocket support
3. **Fly.io** (https://fly.io) - Global deployment with WebSocket support
4. **DigitalOcean App Platform** - Managed platform with WebSocket support

These platforms support persistent connections required for Socket.IO.

---

## Quick Reference Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```
