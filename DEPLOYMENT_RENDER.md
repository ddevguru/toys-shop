# Render Deployment Guide - Next.js Frontend

## Prerequisites
- GitHub account
- Render account (free tier available)
- Backend API deployed and accessible

## Step 1: Prepare Frontend for Production

### 1.1 Create Production Environment File
Create `.env.production` in root:

```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### 1.2 Update API Configuration
The `lib/api.ts` already uses `process.env.NEXT_PUBLIC_API_URL`, so it will automatically use production URL.

### 1.3 Build Test (Optional)
Test build locally:
```bash
npm run build
npm start
```

## Step 2: Push to GitHub

### 2.1 Initialize Git (if not already)
```bash
git init
git add .
git commit -m "Initial commit for production"
```

### 2.2 Create GitHub Repository
1. Go to GitHub.com
2. Create new repository: `toy-cart-studio-frontend`
3. Don't initialize with README

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/yourusername/toy-cart-studio-frontend.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy on Render

### 3.1 Create New Web Service
1. Login to [Render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub account (if not connected)
4. Select your repository: `toy-cart-studio-frontend`

### 3.2 Configure Build Settings

**Name:** `toy-cart-studio` (or your preferred name)

**Environment:** `Node`

**Build Command:**
```bash
npm install --legacy-peer-deps && npm run build
```

**Start Command:**
```bash
npm start
```

**Note:** We use `--legacy-peer-deps` to handle any peer dependency conflicts.

**Root Directory:** (leave empty, or `./` if needed)

### 3.3 Environment Variables
Click **Environment** tab and add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://yourdomain.com/api` |
| `NODE_ENV` | `production` |

**Important:** Replace `yourdomain.com` with your actual backend domain.

### 3.4 Advanced Settings

**Auto-Deploy:** `Yes` (deploys on every push to main branch)

**Branch:** `main`

**Plan:** `Free` (or choose paid plan)

### 3.5 Create Service
Click **Create Web Service**

## Step 4: Wait for Deployment

1. Render will automatically:
   - Install dependencies
   - Build the Next.js app
   - Deploy to production
2. This takes 5-10 minutes first time
3. You'll see build logs in real-time
4. Once deployed, you'll get a URL like: `https://toy-cart-studio.onrender.com`

## Step 5: Update CORS on Backend

### 5.1 Update Backend CORS
Edit `api/config/config.php` on cPanel:

```php
// CORS Headers - Update with your Render URL
$allowed_origins = [
    'https://toy-cart-studio.onrender.com',
    'https://yourdomain.com', // Your custom domain if you add one
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: *'); // For development
}
```

Or update `.htaccess` on cPanel:

```apache
<IfModule mod_headers.c>
    SetEnvIf Origin "^https://toy-cart-studio\.onrender\.com$" AccessControlAllowOrigin=$0
    Header always set Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    Header always set Access-Control-Allow-Credentials "true"
</IfModule>
```

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain on Render
1. Go to your service settings
2. Click **Custom Domains**
3. Add your domain: `www.yourdomain.com`
4. Follow DNS configuration instructions

### 6.2 Update DNS
Add CNAME record:
- **Type:** CNAME
- **Name:** www (or @)
- **Value:** `toy-cart-studio.onrender.com`

### 6.3 Update Environment Variables
Update `NEXT_PUBLIC_API_URL` if needed.

## Step 7: Verify Deployment

### 7.1 Test Frontend
1. Visit your Render URL
2. Check if homepage loads
3. Test login/register
4. Test product browsing
5. Test cart functionality

### 7.2 Check Console
Open browser DevTools → Console
- Should see no CORS errors
- API calls should go to your backend

### 7.3 Test API Connection
In browser console:
```javascript
fetch('https://yourdomain.com/api/api/products')
  .then(r => r.json())
  .then(console.log)
```

## Step 8: Production Optimizations

### 8.1 Enable Caching
Render automatically handles caching for static assets.

### 8.2 Monitor Performance
- Check Render dashboard for metrics
- Monitor API response times
- Check error logs

### 8.3 Set Up Monitoring (Optional)
- Add error tracking (Sentry, etc.)
- Set up uptime monitoring
- Configure alerts

## Step 9: Common Issues & Solutions

### Issue: Build Fails
**Solution:**
- Check build logs in Render
- Verify all dependencies in `package.json`
- Check for TypeScript errors
- Ensure Node version is compatible

### Issue: CORS Errors
**Solution:**
- Update backend CORS headers
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend allows your Render domain

### Issue: API Calls Fail
**Solution:**
- Verify backend is accessible
- Check API URLs in network tab
- Verify environment variables are set
- Check backend logs

### Issue: Static Assets Not Loading
**Solution:**
- Check `next.config.js` for asset prefix
- Verify image paths
- Check build output

### Issue: Slow First Load
**Solution:**
- Render free tier has cold starts
- Consider paid plan for better performance
- Optimize images and assets
- Enable caching

## Step 10: Continuous Deployment

### 10.1 Auto-Deploy
Render automatically deploys when you push to main branch.

### 10.2 Manual Deploy
1. Go to Render dashboard
2. Click **Manual Deploy**
3. Select branch and commit

### 10.3 Rollback
1. Go to **Deploys** tab
2. Find previous successful deploy
3. Click **Redeploy**

## Step 11: Environment Variables Reference

| Variable | Description | Example |
|---------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://yourdomain.com/api` |
| `NODE_ENV` | Environment mode | `production` |

## Step 12: Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend pushed to GitHub
- [ ] Render service created
- [ ] Environment variables set
- [ ] CORS configured on backend
- [ ] Build successful
- [ ] Frontend accessible
- [ ] API calls working
- [ ] Login/Register working
- [ ] Products loading
- [ ] Cart functionality working
- [ ] Custom domain configured (if needed)

## Support

If you face issues:
1. Check Render build logs
2. Check browser console for errors
3. Verify backend is accessible
4. Check environment variables
5. Review Render documentation

## Render Free Tier Limitations

- **Cold Starts:** First request after inactivity may be slow
- **Sleep:** Service sleeps after 15 minutes of inactivity (free tier)
- **Build Time:** Limited build minutes per month
- **Bandwidth:** Limited bandwidth

**Upgrade to paid plan for:**
- No cold starts
- Always-on service
- More resources
- Better performance

