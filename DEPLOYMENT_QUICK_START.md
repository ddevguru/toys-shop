# Quick Deployment Guide - ToyCart Studio

## Overview
- **Backend:** cPanel (PHP + MySQL)
- **Frontend:** Render (Next.js)

## Quick Steps

### Backend (cPanel) - 30 minutes

1. **Create Database**
   - cPanel → MySQL Databases
   - Create DB: `toycart_db`
   - Create User: `toycart_user`
   - Grant ALL privileges

2. **Import Database**
   - phpMyAdmin → Select DB → Import
   - Upload `backend/database/schema.sql`
   - Upload `backend/database/insert_products.sql`

3. **Upload Files**
   - FTP/File Manager → `public_html/api/`
   - Upload entire `backend` folder contents

4. **Configure**
   - Edit `api/config/config.php`:
     - Update `BASE_URL` to your domain
     - Update database credentials
     - Change `JWT_SECRET`
   - Edit `api/config/database.php`:
     - Update DB credentials

5. **Set Permissions**
   - `uploads/` → 755
   - `invoices/` → 755
   - `logs/` → 755

6. **Test**
   - Visit: `https://yourdomain.com/api/api/products`
   - Should return JSON

### Frontend (Render) - 15 minutes

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Production ready"
   git remote add origin https://github.com/yourusername/repo.git
   git push -u origin main
   ```

2. **Deploy on Render**
   - New → Web Service
   - Connect GitHub repo
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Environment: `NEXT_PUBLIC_API_URL=https://yourdomain.com/api`

3. **Update Backend CORS**
   - Edit `api/config/config.php`
   - Add Render URL to allowed origins

4. **Test**
   - Visit Render URL
   - Test login, products, cart

## Important URLs

**Backend API:**
- Base: `https://yourdomain.com/api`
- Products: `https://yourdomain.com/api/api/products`
- Auth: `https://yourdomain.com/api/api/auth/login`

**Frontend:**
- Render: `https://your-app.onrender.com`
- Custom: `https://www.yourdomain.com` (if configured)

## Configuration Files

### Backend: `api/config/config.php`
```php
define('BASE_URL', 'https://yourdomain.com');
define('API_BASE_URL', BASE_URL . '/api');
define('DB_NAME', 'cpanelusername_toycart_db');
define('DB_USER', 'cpanelusername_toycart_user');
define('DB_PASS', 'your_password');
define('JWT_SECRET', 'your-secret-key');
```

### Frontend: `.env.production` (or Render Environment)
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

## Common Issues

**500 Error:**
- Check file permissions
- Check .htaccess
- Check PHP error logs

**CORS Error:**
- Update backend CORS headers
- Verify API URL in frontend

**Database Error:**
- Check credentials format: `cpanelusername_dbname`
- Verify user has privileges
- Check host (usually `localhost`)

**Build Fails:**
- Check Node version
- Check dependencies
- Review build logs

## Support Files

- `DEPLOYMENT_CPANEL.md` - Detailed cPanel guide
- `DEPLOYMENT_RENDER.md` - Detailed Render guide
- `backend/README.md` - Backend documentation

## Next Steps

1. ✅ Deploy backend to cPanel
2. ✅ Deploy frontend to Render
3. ✅ Test all functionality
4. ✅ Configure custom domain (optional)
5. ✅ Set up monitoring (optional)
6. ✅ Enable SSL/HTTPS (if not auto)

## Production Checklist

- [ ] Backend deployed
- [ ] Database imported
- [ ] Config files updated
- [ ] Permissions set
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] CORS configured
- [ ] SSL enabled
- [ ] Tested login/register
- [ ] Tested products
- [ ] Tested cart
- [ ] Tested checkout
- [ ] Admin panel working

