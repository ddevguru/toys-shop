# LiteSpeed Server CORS Fix

## Server Detected: LiteSpeed (Not Apache)

Your server is running **LiteSpeed Web Server**, which handles `.htaccess` differently than Apache.

## The Issue

LiteSpeed may not process `.htaccess` mod_headers directives the same way Apache does. However, PHP headers ARE working (as shown by diagnostic).

## Solution: PHP-Based CORS (Recommended for LiteSpeed)

Since PHP headers are working, we'll ensure ALL requests go through PHP files that set CORS headers.

### Step 1: Verify API Routing

The issue might be that OPTIONS requests aren't reaching the PHP files. Let's check the routing.

**Test the actual endpoint:**
```javascript
// In browser console on Render site
fetch('https://devloperwala.in/backend/api/auth/register', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://toys-shop-rhv5.onrender.com',
    'Access-Control-Request-Method': 'POST'
  }
})
.then(r => {
  console.log('Status:', r.status);
  console.log('All Headers:', [...r.headers.entries()]);
});
```

### Step 2: LiteSpeed .htaccess Configuration

LiteSpeed supports `.htaccess` but syntax might differ. Try this:

**File: `public_html/backend/.htaccess`**
```apache
RewriteEngine On

# CORS Headers for LiteSpeed
<IfModule LiteSpeed>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Credentials "true"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin"
</IfModule>

# Handle OPTIONS
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ api/index.php [L]

# Route API
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/index.php [QSA,L]
```

**File: `public_html/backend/api/.htaccess`**
```apache
RewriteEngine On

# CORS Headers for LiteSpeed
<IfModule LiteSpeed>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Credentials "true"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin"
</IfModule>

# Route all requests (including OPTIONS) to index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

### Step 3: Ensure PHP Handles OPTIONS

The `backend/api/index.php` already handles OPTIONS, but let's verify the routing works.

**Test routing:**
Visit: `https://devloperwala.in/backend/api/`
Should show API info JSON.

### Step 4: Direct PHP CORS (Most Reliable)

Since PHP headers work, ensure ALL API endpoints have CORS at the top.

**Already done:**
- ✅ `backend/api/index.php`
- ✅ `backend/api/auth/register.php`
- ✅ `backend/api/auth/login.php`

**Verify these are uploaded to cPanel.**

### Step 5: Test OPTIONS on Actual Endpoint

**In browser console:**
```javascript
fetch('https://devloperwala.in/backend/api/auth/register', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://toys-shop-rhv5.onrender.com',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type'
  }
})
.then(async r => {
  console.log('Status:', r.status);
  console.log('Headers:', {
    'Access-Control-Allow-Origin': r.headers.get('Access-Control-Allow-Origin'),
    'Access-Control-Allow-Methods': r.headers.get('Access-Control-Allow-Methods'),
    'Access-Control-Allow-Headers': r.headers.get('Access-Control-Allow-Headers')
  });
  const text = await r.text();
  console.log('Response:', text);
});
```

**Expected:**
- Status: 200
- Headers should show CORS values
- Response might be empty (for OPTIONS)

## LiteSpeed-Specific Notes

1. **LiteSpeed supports .htaccess** but may need different syntax
2. **PHP headers work** - This is the most reliable method
3. **Check LiteSpeed admin panel** - Some settings might override .htaccess

## Alternative: PHP-Only Solution

If .htaccess doesn't work on LiteSpeed, all PHP files already have CORS headers. The issue might be:

1. **Routing not working** - OPTIONS requests not reaching PHP
2. **File not found** - Check if `register.php` exists
3. **Path incorrect** - Verify URL structure

## Quick Fix: Test Direct File Access

**Test if register.php is accessible:**
```
https://devloperwala.in/backend/api/auth/register.php
```

If this works, the routing might be the issue.

## Verification Steps

1. ✅ Diagnostic endpoint works (`check-cors.php`)
2. ⏳ Test OPTIONS on actual endpoint
3. ⏳ Check if routing works (`/backend/api/`)
4. ⏳ Verify PHP files are uploaded
5. ⏳ Test registration on Render site

## Next Actions

1. **Test OPTIONS on actual endpoint** (see Step 5 above)
2. **Check response headers** in browser DevTools
3. **If no CORS headers in response:**
   - Routing might not be working
   - Try direct file access
   - Check LiteSpeed error logs

4. **If CORS headers present but still failing:**
   - Check browser console for other errors
   - Verify frontend API URL is correct
   - Check network tab for actual request/response

## Your Current Status

✅ PHP CORS headers working (diagnostic confirms)
✅ Server: LiteSpeed
⏳ Need to test actual API endpoint
⏳ Need to verify routing works

## Test Commands

**Test 1: API Root**
```bash
curl https://devloperwala.in/backend/api/
```

**Test 2: OPTIONS on Register**
```bash
curl -X OPTIONS \
  -H "Origin: https://toys-shop-rhv5.onrender.com" \
  -H "Access-Control-Request-Method: POST" \
  -v https://devloperwala.in/backend/api/auth/register
```

**Look for:**
```
< Access-Control-Allow-Origin: *
< HTTP/1.1 200 OK
```

