# BookMyShow Lite++ - Render Deployment Guide

## Production Setup Complete ✅

### What Was Updated:

#### 1. **server/index.js** - Production Static Files Serving

```javascript
// Serve React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}
```

#### 2. **server/.env** - Updated to Production

- Changed `NODE_ENV=production` ✅
- All credentials ready for deployment

#### 3. **render.yaml** - Automated Deployment Configuration

- Build command: Builds client + installs server deps
- Start command: Runs Express server with static files
- Health check enabled

---

## 🚀 Deployment on Render - Step by Step:

### Option 1: Using render.yaml (Recommended)

1. Push code to GitHub:

   ```bash
   git add .
   git commit -m "Add production build configuration"
   git push origin main
   ```

2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Blueprint"
4. Connect GitHub repository
5. Select branch (main)
6. Click "Create New Blueprint"
7. Render will auto-deploy from render.yaml

### Option 2: Manual Setup on Render

1. Go to [Render.com](https://render.com)
2. Create New Web Service
3. Connect GitHub repository
4. Use these settings:

   **Build Command:**

   ```
   npm install && cd client && npm run build && cd ../server && npm install
   ```

   **Start Command:**

   ```
   cd server && node index.js
   ```

   **Environment Variables:**

   ```
   PORT=10000
   NODE_ENV=production
   MONGO_URI=mongodb+srv://...your_mongodb_uri...
   CLIENT_URL=https://your-app-name.onrender.com
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=7d
   ```

---

## 🔧 Configuration Details:

### Static Files Setup

- **Production**: Express serves React build from `client/dist/`
- **Development**: React dev server at `localhost:5173`, API at `localhost:5000`
- **All routes except `/api/*`** → Served from `index.html` (SPA routing)

### CORS Configuration

- Automatically uses `CLIENT_URL` env variable
- Production: `https://your-render-domain.onrender.com`
- Development: `http://localhost:5173`

### Health Check

- Endpoint: `GET /api/health`
- Returns: `{ status: 'OK', timestamp: ... }`
- Render uses this to verify deployment health

### Build Process

1. Install root dependencies
2. Build React frontend (Vite) → `client/dist/`
3. Install server dependencies
4. Start Express server with static files

---

## 📋 Pre-Deployment Checklist:

- ✅ `index.js` updated with static file serving
- ✅ `.env` set to `NODE_ENV=production`
- ✅ `render.yaml` created with complete config
- ✅ `client/package.json` has build script
- ✅ `server/package.json` has start script
- ✅ All API routes prefixed with `/api`
- ✅ MongoDB Atlas connection string ready
- ✅ JWT secret configured
- ✅ CORS origin set to Render domain

---

## 🌐 Post-Deployment:

After deployment, your app will be available at:

```
https://bookmyshow-server.onrender.com
```

### Update CLIENT_URL

In Render dashboard, update environment variable:

```
CLIENT_URL=https://bookmyshow-server.onrender.com
```

### Test Health Endpoint

```bash
curl https://bookmyshow-server.onrender.com/api/health
# Should return: { "status": "OK", "timestamp": "..." }
```

### View Logs

Render → Services → Your Service → Logs (watch real-time deployment)

---

## 🐛 Common Issues & Solutions:

### 1. Build Fails

**Error**: `client/dist not found`

- **Solution**: Build command includes `npm run build` for client

### 2. CORS Errors on Production

**Error**: `Access to XMLHttpRequest blocked`

- **Solution**: Update `CLIENT_URL` env var in Render dashboard to your Render domain

### 3. Static Files Not Served

**Error**: 404 on `/` route or page refresh

- **Solution**: `express.static()` and catch-all route already added to `index.js`

### 4. MongoDB Connection Fails

**Error**: `MongoDB connection error`

- **Solution**: Verify `MONGO_URI` in Render dashboard, check Atlas IP whitelist

### 5. Port Issues

**Error**: `Port already in use`

- **Solution**: Use `process.env.PORT` (Render assigns dynamic port)

---

## 📊 Architecture After Deployment:

```
Render Edge → Express Server → API Routes → MongoDB
           → Static Files (React Build)
```

**Single Deployment**: Both frontend and backend run on same Render instance

- Frontend: Served as static files
- Backend: Express server at `/api/*`
- Database: MongoDB Atlas

---

## 🎯 Next Steps:

1. Push code to GitHub
2. Connect repository to Render
3. Deploy using render.yaml or manual setup
4. Test all functionality
5. Monitor logs in Render dashboard
6. Update CLIENT_URL after getting production domain

Happy Deploying! 🚀
