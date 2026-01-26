# URGENT CORS FIX - Step by Step

## Current Error
```
Access to fetch at 'https://devloperwala.in/backend/api/auth/register' 
from origin 'https://toys-shop-rhv5.onrender.com' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check
```

## IMMEDIATE FIX - Do This Now

### Step 1: Update .htaccess File

1. **Go to cPanel File Manager**
2. **Navigate to:** `public_html/backend/` (or wherever your backend is)
3. **Open/Create:** `.htaccess` file
4. **Replace ALL content with this:**

```apache
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

# Handle OPTIONS preflight requests FIRST
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]

# Route API requests
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# If accessing root, redirect to api/index.php
RewriteCond %{REQUEST_URI} ^/backend/api/?$
RewriteRule ^(.*)$ api/index.php [QSA,L]

# PHP Settings
<IfModule mod_php7.c>
    php_value upload_max_filesize 10M
    php_value post_max_size 10M
    php_value max_execution_time 300
    php_value max_input_time 300
</IfModule>

# Security
<FilesMatch "\.(sql|md|log|env|bak)$">
    Order allow,deny
    Deny from all
</FilesMatch>
```

5. **Save the file**
6. **Set permissions to 644**

### Step 2: Test CORS Endpoint

1. **Upload `cors-test.php`** to: `public_html/backend/api/cors-test.php`
2. **Test in browser:**
   ```
   https://devloperwala.in/backend/api/cors-test.php
   ```
3. **Should return JSON with CORS info**

### Step 3: Test OPTIONS Request

Open browser console on your Render site and run:

```javascript
fetch('https://devloperwala.in/backend/api/auth/register', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://toys-shop-rhv5.onrender.com',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type'
  }
})
.then(r => {
  console.log('Status:', r.status);
  console.log('CORS Origin:', r.headers.get('Access-Control-Allow-Origin'));
  console.log('CORS Methods:', r.headers.get('Access-Control-Allow-Methods'));
  return r.text();
})
.then(console.log);
```

**Expected Result:**
- Status: 200
- CORS Origin: *
- CORS Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH

### Step 4: Verify API Files

Make sure all API files have CORS at the top:

**Check:** `backend/api/auth/register.php`
```php
<?php
// CORS headers FIRST
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');

// Handle OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Then include other files
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/config.php';
// ... rest of code
```

## Alternative: If .htaccess Not Working

### Option 1: Add CORS in PHP directly

Edit `backend/api/auth/register.php` - Add at the VERY TOP:

```php
<?php
// CORS - MUST BE FIRST LINE
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// ... rest of your code
```

### Option 2: Check Apache Configuration

If `.htaccess` is not working, you might need to:

1. **Enable mod_headers:**
   - Contact hosting support
   - Or check in cPanel → Apache Configuration

2. **Check if .htaccess is being read:**
   - Add a test line: `# CORS TEST`
   - If it doesn't work, .htaccess might be disabled

## Quick Verification Checklist

- [ ] `.htaccess` file exists in `backend/` directory
- [ ] `.htaccess` has CORS headers at the top
- [ ] OPTIONS handler is in `.htaccess`
- [ ] File permissions are 644
- [ ] Test endpoint works: `/backend/api/cors-test.php`
- [ ] OPTIONS request returns 200
- [ ] All API files have CORS headers in PHP

## Still Not Working?

1. **Check error logs:**
   - cPanel → Error Logs
   - Look for Apache/PHP errors

2. **Test with curl:**
   ```bash
   curl -X OPTIONS \
     -H "Origin: https://toys-shop-rhv5.onrender.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -v https://devloperwala.in/backend/api/auth/register
   ```

3. **Check response headers:**
   - Should see `Access-Control-Allow-Origin: *`
   - Should see `Access-Control-Allow-Methods: ...`

4. **Contact hosting support:**
   - Ask to enable `mod_headers`
   - Ask if `.htaccess` is enabled
   - Ask about CORS restrictions

## Your URLs

- **Frontend:** https://toys-shop-rhv5.onrender.com
- **Backend:** https://devloperwala.in/backend/api/
- **Test Endpoint:** https://devloperwala.in/backend/api/cors-test.php

