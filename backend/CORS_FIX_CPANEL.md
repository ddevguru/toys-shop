# CORS Fix for cPanel Deployment

## Problem
CORS errors when frontend (Render) tries to access backend (cPanel):
```
Access to fetch at 'https://devloperwala.in/backend/api/auth/register' 
from origin 'https://toys-shop-rhv5.onrender.com' 
has been blocked by CORS policy
```

## Solution

### Step 1: Update .htaccess File

1. **Locate your backend directory on cPanel**
   - Usually: `public_html/backend/` or `public_html/api/`

2. **Create/Edit `.htaccess` file** in your backend root directory
   - Use File Manager or FTP
   - Copy contents from `backend/.htaccess.production`

3. **Update RewriteBase** according to your structure:
   ```apache
   # If API is at: yourdomain.com/backend/api/
   RewriteBase /backend/api/
   
   # OR if API is at: yourdomain.com/api/
   RewriteBase /api/
   ```

### Step 2: Update CORS Headers in .htaccess

Make sure these headers are set:

```apache
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Credentials "true"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    Header always set Access-Control-Max-Age "86400"
</IfModule>
```

### Step 3: Handle OPTIONS Preflight Requests

Add this to `.htaccess`:

```apache
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]
```

### Step 4: Verify PHP CORS Configuration

Check that `backend/config/cors.php` is included in all API files:

```php
// At the top of every API file (e.g., register.php, login.php)
require_once __DIR__ . '/../../config/cors.php';
```

### Step 5: Test CORS

1. **Test from browser console:**
   ```javascript
   fetch('https://devloperwala.in/backend/api/auth/register', {
     method: 'OPTIONS',
     headers: {
       'Origin': 'https://toys-shop-rhv5.onrender.com'
     }
   })
   .then(r => {
     console.log('CORS Headers:', r.headers.get('Access-Control-Allow-Origin'));
   });
   ```

2. **Check response headers:**
   - Should see `Access-Control-Allow-Origin: *`
   - Should see `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH`

## Alternative: Specific Domain CORS (More Secure)

Instead of `*`, allow only your Render domain:

```apache
<IfModule mod_headers.c>
    SetEnvIf Origin "^https://toys-shop-rhv5\.onrender\.com$" AccessControlAllowOrigin=$0
    Header always set Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
    Header always set Access-Control-Allow-Credentials "true"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin"
</IfModule>
```

## Common Issues

### Issue 1: Headers not being sent
**Solution:**
- Check if `mod_headers` is enabled in cPanel
- Verify `.htaccess` is in correct directory
- Check file permissions (should be 644)

### Issue 2: OPTIONS request failing
**Solution:**
- Add explicit OPTIONS handler in `.htaccess`
- Check PHP error logs
- Verify RewriteEngine is On

### Issue 3: Still getting CORS errors
**Solution:**
- Clear browser cache
- Check browser DevTools → Network tab → Headers
- Verify backend URL is correct
- Test with curl:
  ```bash
  curl -H "Origin: https://toys-shop-rhv5.onrender.com" \
       -H "Access-Control-Request-Method: POST" \
       -H "Access-Control-Request-Headers: Content-Type" \
       -X OPTIONS \
       https://devloperwala.in/backend/api/auth/register \
       -v
  ```

## Quick Fix Checklist

- [ ] `.htaccess` file exists in backend directory
- [ ] CORS headers are set in `.htaccess`
- [ ] OPTIONS request handler is configured
- [ ] `mod_headers` module is enabled
- [ ] `cors.php` is included in all API files
- [ ] File permissions are correct (644 for .htaccess)
- [ ] Tested with browser console
- [ ] Verified response headers

## Testing

After applying fixes, test:

1. **Registration:**
   ```javascript
   fetch('https://devloperwala.in/backend/api/auth/register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       name: 'Test',
       email: 'test@test.com',
       username: 'testuser',
       password: 'test123'
     })
   })
   .then(r => r.json())
   .then(console.log);
   ```

2. **Login:**
   ```javascript
   fetch('https://devloperwala.in/backend/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: 'test@test.com',
       password: 'test123'
     })
   })
   .then(r => r.json())
   .then(console.log);
   ```

## Support

If still not working:
1. Check cPanel error logs
2. Check PHP error logs in `backend/logs/error.log`
3. Verify Apache modules are enabled
4. Contact hosting support to enable `mod_headers`

