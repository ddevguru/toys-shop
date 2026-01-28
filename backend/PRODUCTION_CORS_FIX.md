# PRODUCTION CORS FIX - URGENT

## Problem
- CORS errors on production: `No 'Access-Control-Allow-Origin' header`
- Requests being redirected (trailing slash issue)
- Products, Cart, Orders APIs failing

## Root Cause
1. Trailing slash redirects happening BEFORE CORS headers
2. `.htaccess` redirects losing CORS headers
3. Routing not handling both `/api/products` and `/api/products/`

## Solution: Upload These 3 Files

### File 1: `public_html/backend/.htaccess`

**Replace entire file with:**

```apache
# Main .htaccess for backend directory
# Place this in: public_html/backend/.htaccess

RewriteEngine On

# CORS Headers - MUST BE FIRST
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Credentials "true"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name"
    Header always set Access-Control-Max-Age "86400"
    Header always set Access-Control-Expose-Headers "Content-Length, Content-Type"
</IfModule>

# Prevent trailing slash redirects for API endpoints
RewriteCond %{REQUEST_URI} ^/backend/api/(.+)/$
RewriteCond %{REQUEST_METHOD} !OPTIONS
RewriteRule ^api/(.+)/$ /backend/api/$1 [R=301,L]

# Handle OPTIONS requests FIRST (before any redirects)
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# Route /api/* requests to api/index.php (without trailing slash redirect)
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

# CORS Headers - MUST BE FIRST
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

# IMPORTANT: Route ALL requests to index.php
# This ensures PHP handles CORS headers for all requests
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

### File 3: `public_html/backend/api/index.php`

**Update the path parsing section (around line 34-50):**

Find this section:
```php
// Get request URI (may be modified by router)
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove query string
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove leading slash
$path = ltrim($path, '/');

// For LiteSpeed/cPanel: Remove /backend/api prefix if present
// Path might be: backend/api/auth/register or api/auth/register or auth/register
$path = preg_replace('#^backend/api/#', '', $path);
$path = preg_replace('#^api/#', '', $path);

// Clean path
$path = trim($path, '/');
```

Replace with:
```php
// Get request URI (may be modified by router)
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove query string
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove leading slash
$path = ltrim($path, '/');

// For LiteSpeed/cPanel: Remove /backend/api prefix if present
// Path might be: backend/api/auth/register or api/auth/register or auth/register
$path = preg_replace('#^backend/api/#', '', $path);
$path = preg_replace('#^api/#', '', $path);

// Remove trailing slash (handle both /api/products and /api/products/)
$path = rtrim($path, '/');

// Clean path
$path = trim($path, '/');
```

## What Changed

1. **Backend `.htaccess`:**
   - Added trailing slash handling
   - OPTIONS handled FIRST
   - More complete CORS headers

2. **API `.htaccess`:**
   - OPTIONS handled FIRST (before other rules)
   - Ensures all requests reach `index.php`

3. **API `index.php`:**
   - Removes trailing slashes from paths
   - Handles both `/api/products` and `/api/products/`

## Upload Checklist

- [ ] Upload `backend/.htaccess` → `public_html/backend/.htaccess`
- [ ] Upload `backend/api/.htaccess` → `public_html/backend/api/.htaccess`
- [ ] Upload `backend/api/index.php` → `public_html/backend/api/index.php`
- [ ] Set permissions: 644 for all files

## Test After Upload

**In browser console (on Render site):**
```javascript
// Test Products API
fetch('https://devloperwala.in/backend/api/products')
  .then(r => r.json())
  .then(data => console.log('✅ Products:', data))
  .catch(e => console.error('❌ Error:', e));

// Test Cart API
fetch('https://devloperwala.in/backend/api/cart', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(r => r.json())
  .then(data => console.log('✅ Cart:', data))
  .catch(e => console.error('❌ Error:', e));
```

## Expected Result

- ✅ Products load on shop page
- ✅ Cart syncs properly
- ✅ Orders can be placed
- ✅ No CORS errors in console

## If Still Not Working

1. Check file permissions (should be 644)
2. Verify files are uploaded correctly
3. Clear browser cache
4. Check server error logs in cPanel

**These fixes handle trailing slashes and ensure CORS headers are ALWAYS set!**


