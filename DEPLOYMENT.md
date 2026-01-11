# Deployment Guide - Utility Management System

This guide covers deploying both the client (frontend) and server (backend) to production.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com)
- [MySQL Database](https://planetscale.com or other cloud MySQL provider)
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally

---

## 🗄️ Database Setup

### 1. Set Up MySQL Database

Choose a cloud MySQL provider:
- **PlanetScale** (Recommended) - Free tier available
- **Railway** - Free tier available
- **AWS RDS** - Production grade
- **Google Cloud SQL** - Production grade

### 2. Run Database Schema

Connect to your database and execute the schema:

```bash
# From the project root
mysql -h YOUR_HOST -u YOUR_USER -p YOUR_DATABASE < server/database/schema.sql
```

Or use your database provider's console to run the SQL schema.

### 3. Note Database Connection Details

You'll need:
- `DB_HOST` - Database host
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `DB_PORT` - Database port (usually 3306)

---

## 🚀 Server Deployment (Backend API)

### Step 1: Prepare Server for Deployment

1. Navigate to the server directory:
```bash
cd server
```

2. Ensure `package.json` has the correct start script:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Step 2: Create `vercel.json` in Server Directory

Create `server/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 3: Deploy Server to Vercel

1. **Via Vercel CLI:**
```bash
cd server
npm install -g vercel
vercel
```

2. **Via Vercel Dashboard:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository
   - Set root directory to `server`
   - Configure environment variables (see below)
   - Deploy

### Step 4: Configure Server Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
NODE_ENV=production
PORT=3000
```

**Important:** Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Note Your API URL

After deployment, Vercel will provide a URL like:
```
https://your-api-name.vercel.app
```

Save this URL - you'll need it for the client deployment.

---

## 🎨 Client Deployment (Frontend)

### Step 1: Update API URL

1. Create `client/.env.production`:

```env
VITE_API_URL=https://your-api-name.vercel.app/api
```

Replace `your-api-name.vercel.app` with your actual server URL from Step 5 above.

### Step 2: Verify Build Configuration

Ensure `client/vite.config.js` has proper configuration:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### Step 3: Create `vercel.json` in Client Directory

Create `client/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures React Router works properly with client-side routing.

### Step 4: Deploy Client to Vercel

1. **Via Vercel CLI:**
```bash
cd client
vercel
```

2. **Via Vercel Dashboard:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository
   - Set root directory to `client`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Configure environment variables
   - Deploy

### Step 5: Configure Client Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
VITE_API_URL=https://your-api-name.vercel.app/api
```

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings

Update `server/app.js` to allow your client domain:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-client-app.vercel.app', // Add your Vercel client URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Redeploy the server after making this change.

### 2. Test Your Application

Visit your client URL: `https://your-client-app.vercel.app`

**Default Login Credentials:**

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Manager | `manager` | `manager123` |
| Field Officer | `officer` | `officer123` |
| Cashier | `cashier` | `cashier123` |

### 3. Verify API Connection

Open browser console and check:
- No CORS errors
- API requests are successful
- Login works properly

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

1. Connect your repository to Vercel
2. Configure branches:
   - **Production**: `main` branch
   - **Preview**: All other branches

3. Every push will trigger automatic deployment

### Manual Deployment

```bash
# Deploy server
cd server
vercel --prod

# Deploy client
cd client
vercel --prod
```

---

## 🛠️ Troubleshooting

### Issue: API Not Connecting

**Solution:**
1. Check environment variables in Vercel dashboard
2. Verify API URL in client `.env.production`
3. Check CORS settings in server

### Issue: Database Connection Failed

**Solution:**
1. Verify database credentials
2. Check if database allows connections from Vercel IPs
3. Ensure database is running and accessible

### Issue: 404 on Page Refresh

**Solution:**
- Ensure `client/vercel.json` has the rewrite rule for SPA routing

### Issue: Build Failing

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json`
3. Test build locally: `npm run build`

---

## 📊 Environment Variables Checklist

### Server (.env)
- [ ] `DB_HOST`
- [ ] `DB_USER`
- [ ] `DB_PASSWORD`
- [ ] `DB_NAME`
- [ ] `DB_PORT`
- [ ] `JWT_SECRET`
- [ ] `NODE_ENV=production`

### Client (.env.production)
- [ ] `VITE_API_URL`

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong JWT secrets** - Minimum 32 characters
3. **Enable HTTPS only** - Vercel provides this by default
4. **Rotate secrets regularly** - Update JWT_SECRET periodically
5. **Monitor logs** - Check Vercel logs for suspicious activity

---

## 📱 Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel
4. Update CORS settings with new domain

---

## 📈 Monitoring

### View Logs

```bash
# Server logs
vercel logs https://your-api-name.vercel.app

# Client logs
vercel logs https://your-client-app.vercel.app
```

### Performance Monitoring

- Vercel provides analytics in the dashboard
- Check response times, bandwidth usage
- Monitor error rates

---

## 🎯 Production Checklist

Before going live:

- [ ] Database schema deployed
- [ ] Server deployed and accessible
- [ ] Client deployed and accessible
- [ ] All environment variables configured
- [ ] CORS properly configured
- [ ] Login functionality tested
- [ ] API endpoints tested
- [ ] Mobile responsiveness verified
- [ ] Error handling tested
- [ ] Security headers configured
- [ ] Custom domain configured (if applicable)

---

## 📞 Support

For issues:
1. Check Vercel logs
2. Review environment variables
3. Verify database connection
4. Check CORS configuration

---

## 🚀 Quick Deploy Commands

```bash
# One-time setup
npm install -g vercel

# Deploy server
cd server
vercel --prod

# Deploy client  
cd client
vercel --prod
```

**Done!** Your Utility Management System is now live! 🎉
