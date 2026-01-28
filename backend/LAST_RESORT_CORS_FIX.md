# LAST RESORT CORS FIX - Redirects Still Happening

## Problem
- Redirects STILL happening: `/api/cart` → `/api/cart/`
- Redirected URL returns 404
- CORS headers lost on redirects

## Root Cause
LiteSpeed is adding trailing slashes at server level BEFORE `.htaccess` can intercept. The redirect happens, then the redirected URL doesn't route correctly.

## Solution: Fix Routing to Handle Both Cases

### File 1: `public_html/backend/.htaccess`

**Replace entire file with:**

```apache
# Main .htaccess for backend directory
# Place this in: public_html/backend/.htaccess

RewriteEngine On

# CORS Headers - MUST BE FIRST (including on redirects)
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Credentials "true"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name"
    Header always set Access-Control-Max-Age "86400"
    Header always set Access-Control-Expose-Headers "Content-Length, Content-Type"
</IfModule>

# Handle OPTIONS requests FIRST (before any other rules)
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# Route /api/* requests to api/index.php
# Handle both with and without trailing slash - rewrite internally (no redirect)
RewriteCond %{REQUEST_URI} ^/backend/api/(.+)/$
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.+)/$ api/index.php [QSA,L]

# Route to index.php (without trailing slash)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/index.php [QSA,L]
```

### File 2: `public_html/backend/api/.htaccess`

**Replace entire file with:**

```apache
# CORS Headers via .htaccess
# This file should be in: public_html/backend/api/.htaccess

# Enable Rewrite Engine
RewriteEngine On

# CORS Headers - MUST BE FIRST (including on redirects)
<IfModule mod_headers.c>
    # Allow all origins
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Credentials "true"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name"
    Header always set Access-Control-Max-Age "86400"
    Header always set Access-Control-Expose-Headers "Content-Length, Content-Type"
</IfModule>

# Handle OPTIONS requests FIRST (before any other rules)
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ index.php [QSA,L]

# IMPORTANT: Route ALL requests (with or without trailing slash) to index.php
# Handle trailing slash internally - rewrite to index.php without redirect
RewriteCond %{REQUEST_URI} ^/backend/api/(.+)/$
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.+)/$ index.php [QSA,L]

# Route to index.php (without trailing slash)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

## Key Changes

1. **Both `.htaccess` files** now handle trailing slashes
2. **Internal rewrite** - No redirects, just internal routing
3. **CORS headers always set** - Even if redirect happens
4. **Routing handles both** - `/api/cart` and `/api/cart/` both work

## Upload Checklist

- [ ] Upload `backend/.htaccess` → `public_html/backend/.htaccess`
- [ ] Upload `backend/api/.htaccess` → `public_html/backend/api/.htaccess`
- [ ] Set permissions: 644 for both files
- [ ] Clear browser cache
- [ ] Test on Render site

## Test After Upload

**In browser console (on Render site):**
```javascript
// Test Cart (should work even if redirected)
fetch('https://devloperwala.in/backend/api/cart', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(r => {
    console.log('Status:', r.status);
    console.log('Final URL:', r.url);
    console.log('CORS:', r.headers.get('Access-Control-Allow-Origin'));
    return r.json();
  })
  .then(data => console.log('✅ Cart:', data))
  .catch(e => console.error('❌ Error:', e));
```

## Expected Result

- ✅ Status 200 (even if redirected)
- ✅ CORS headers present
- ✅ Cart/Products/Orders work
- ✅ No 404 errors

## If STILL Not Working

**Contact hosting support IMMEDIATELY:**

> "URGENT: My API endpoints are being redirected with trailing slashes by LiteSpeed, causing CORS and 404 errors. I need you to:
> 
> 1. Disable automatic trailing slash redirects for `/backend/api/` directory
> 2. OR configure LiteSpeed to preserve CORS headers on redirects
> 3. OR add exception rule for API endpoints
> 
> Current issue: `/backend/api/cart` → `/backend/api/cart/` (301 redirect) → 404
> 
> This is breaking my production application."

**Alternative:** Ask them to add this to server config:
```apache
<Directory "/home/yourusername/public_html/backend/api">
    DirectorySlash Off
    Options -MultiViews
</Directory>
```

**The routing now handles both cases - even if redirect happens, it should work!**

