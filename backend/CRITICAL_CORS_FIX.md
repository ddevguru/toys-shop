# CRITICAL CORS FIX - Upload These Files NOW

## Problem
OPTIONS requests to `/backend/api/auth/register` are not getting CORS headers.

## Root Cause
The OPTIONS request is not reaching `index.php` which sets CORS headers.

## Solution: Fix .htaccess Routing

### File 1: `public_html/backend/.htaccess` (CRITICAL)

**Create/Update this file with:**

```apache
RewriteEngine On

# CORS Headers
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Credentials "true"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    Header always set Access-Control-Max-Age "86400"
</IfModule>

# Route /api/* requests to api/index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# Handle OPTIONS requests
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^api/(.*)$ api/index.php [QSA,L]
```

### File 2: `public_html/backend/api/.htaccess` (CRITICAL)

**Update this file with:**

```apache
RewriteEngine On

# CORS Headers
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Credentials "true"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    Header always set Access-Control-Max-Age "86400"
</IfModule>

# IMPORTANT: Route ALL requests (including OPTIONS) to index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]

# Also explicitly handle OPTIONS to ensure it reaches index.php
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ index.php [QSA,L]
```

## Why This Works

1. **Backend .htaccess** routes `/api/*` to `api/index.php`
2. **API .htaccess** routes all requests (including OPTIONS) to `index.php`
3. **index.php** sets CORS headers FIRST, then handles OPTIONS immediately
4. This ensures OPTIONS requests get CORS headers

## Upload Checklist

- [ ] Upload `backend/.htaccess` to `public_html/backend/.htaccess`
- [ ] Upload `backend/api/.htaccess` to `public_html/backend/api/.htaccess`
- [ ] Set permissions: 644 for both files
- [ ] Verify `backend/api/index.php` is uploaded (already has CORS code)

## Test After Upload

**In browser console (on Render site):**
```javascript
fetch('https://devloperwala.in/backend/api/auth/register', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://toys-shop-rhv5.onrender.com',
    'Access-Control-Request-Method': 'POST'
  }
})
.then(async r => {
  console.log('Status:', r.status);
  console.log('CORS Origin:', r.headers.get('Access-Control-Allow-Origin'));
  console.log('CORS Methods:', r.headers.get('Access-Control-Allow-Methods'));
  
  if (r.headers.get('Access-Control-Allow-Origin')) {
    console.log('✅✅✅ CORS IS WORKING! ✅✅✅');
  } else {
    console.log('❌ Still not working - check .htaccess files');
  }
});
```

## Expected Result

- Status: 200
- CORS Origin: *
- CORS Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
- Registration should work!

## Files Ready

✅ `backend/.htaccess` - Created
✅ `backend/api/.htaccess` - Updated
✅ `backend/api/index.php` - Already has CORS code

**Just upload the 2 .htaccess files and test!**

