# Quick CORS Fix - cPanel

## Immediate Fix

### 1. Update .htaccess in Backend Directory

Go to: `public_html/backend/.htaccess` (or wherever your backend is)

**Add/Replace with:**

```apache
RewriteEngine On
RewriteBase /backend/api/

# CORS Headers
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Credentials "true"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    Header always set Access-Control-Max-Age "86400"
</IfModule>

# Handle OPTIONS
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]

# Route API
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/index.php [QSA,L]
```

### 2. Verify File Permissions

- `.htaccess` should be **644**
- Check via File Manager → Right click → Change Permissions

### 3. Test

Open browser console on your Render site and run:

```javascript
fetch('https://devloperwala.in/backend/api/auth/register', {
  method: 'OPTIONS'
}).then(r => {
  console.log('Status:', r.status);
  console.log('CORS Header:', r.headers.get('Access-Control-Allow-Origin'));
});
```

Should return:
- Status: 200
- CORS Header: *

## If Still Not Working

1. **Check if mod_headers is enabled:**
   - Contact hosting support
   - Or create `phpinfo.php` to check

2. **Alternative: Update PHP directly**
   - Edit `backend/config/cors.php`
   - Already updated to handle your Render domain

3. **Check backend URL:**
   - Current: `https://devloperwala.in/backend/api/auth/register`
   - Make sure path is correct

## Your Current Setup

- **Frontend:** `https://toys-shop-rhv5.onrender.com`
- **Backend:** `https://devloperwala.in/backend/api/`

Make sure `.htaccess` is in: `public_html/backend/.htaccess`

