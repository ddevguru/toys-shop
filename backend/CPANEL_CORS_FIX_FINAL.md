# FINAL CORS FIX - cPanel Step by Step

## The Problem
CORS preflight (OPTIONS) requests are failing because headers aren't being sent.

## Solution: Multiple Layers of CORS Protection

### Layer 1: .htaccess Files (2 locations)

#### File 1: `public_html/backend/.htaccess`
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

# Handle OPTIONS
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]

# Route API
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/index.php [QSA,L]
```

#### File 2: `public_html/backend/api/.htaccess`
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

# Handle OPTIONS
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]
```

### Layer 2: PHP Files (Already Updated)

All API files now have CORS headers at the top:
- ✅ `backend/api/index.php`
- ✅ `backend/api/auth/register.php`
- ✅ `backend/api/auth/login.php`

### Layer 3: Test Endpoint

Upload `backend/api/cors-test.php` and test:
```
https://devloperwala.in/backend/api/cors-test.php
```

## Step-by-Step Instructions

### Step 1: Create .htaccess in Backend Root

1. Go to cPanel File Manager
2. Navigate to: `public_html/backend/`
3. Create/Edit: `.htaccess`
4. Copy content from above (File 1)
5. Save
6. Set permissions: **644**

### Step 2: Create .htaccess in API Directory

1. Navigate to: `public_html/backend/api/`
2. Create/Edit: `.htaccess`
3. Copy content from above (File 2)
4. Save
5. Set permissions: **644**

### Step 3: Verify PHP Files

Make sure these files are uploaded with CORS headers:
- `backend/api/index.php` ✅
- `backend/api/auth/register.php` ✅
- `backend/api/auth/login.php` ✅

### Step 4: Test

**Test 1: CORS Test Endpoint**
```
https://devloperwala.in/backend/api/cors-test.php
```
Should return JSON.

**Test 2: OPTIONS Request**
Open browser console on Render site:
```javascript
fetch('https://devloperwala.in/backend/api/auth/register', {
  method: 'OPTIONS'
})
.then(r => {
  console.log('Status:', r.status);
  console.log('Headers:', {
    origin: r.headers.get('Access-Control-Allow-Origin'),
    methods: r.headers.get('Access-Control-Allow-Methods')
  });
});
```

**Expected:**
- Status: 200
- Origin: *
- Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH

## If .htaccess Doesn't Work

### Check 1: Is mod_headers enabled?

Create `test-headers.php`:
```php
<?php
if (function_exists('apache_get_modules')) {
    $modules = apache_get_modules();
    if (in_array('mod_headers', $modules)) {
        echo "mod_headers is ENABLED";
    } else {
        echo "mod_headers is DISABLED - Contact hosting";
    }
} else {
    echo "Cannot check modules - Contact hosting";
}
```

Upload to: `public_html/backend/test-headers.php`
Visit: `https://devloperwala.in/backend/test-headers.php`

### Check 2: Is .htaccess being read?

Add this to `.htaccess`:
```apache
# TEST LINE - If you see this, .htaccess is working
```

Then check if it affects anything. If not, `.htaccess` might be disabled.

### Check 3: Contact Hosting Support

If `.htaccess` doesn't work, contact hosting and ask:
1. Is `mod_headers` enabled?
2. Is `.htaccess` enabled?
3. Can you enable CORS headers for my domain?

## Alternative: PHP-Only Solution

If `.htaccess` doesn't work, all PHP files already have CORS headers. But you need to ensure OPTIONS requests are handled.

Create `public_html/backend/api/.htaccess` with just:
```apache
RewriteEngine On
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ preflight.php [L]
```

And upload `backend/api/preflight.php` (already created).

## Verification Checklist

- [ ] `.htaccess` in `public_html/backend/`
- [ ] `.htaccess` in `public_html/backend/api/`
- [ ] Both files have CORS headers
- [ ] Both files handle OPTIONS
- [ ] File permissions are 644
- [ ] PHP files uploaded with CORS headers
- [ ] cors-test.php uploaded
- [ ] Test endpoint works
- [ ] OPTIONS request returns 200

## Your URLs

- **Backend Root:** `https://devloperwala.in/backend/`
- **API:** `https://devloperwala.in/backend/api/`
- **Register:** `https://devloperwala.in/backend/api/auth/register`
- **Test:** `https://devloperwala.in/backend/api/cors-test.php`

## Still Not Working?

1. **Check error logs:**
   - cPanel → Error Logs
   - Look for Apache errors

2. **Test with curl:**
   ```bash
   curl -X OPTIONS \
     -H "Origin: https://toys-shop-rhv5.onrender.com" \
     -H "Access-Control-Request-Method: POST" \
     -v https://devloperwala.in/backend/api/auth/register
   ```
   Look for `Access-Control-Allow-Origin` in response.

3. **Check response headers:**
   - Open DevTools → Network tab
   - Make OPTIONS request
   - Check Response Headers
   - Should see CORS headers

4. **Contact hosting:**
   - Ask to enable `mod_headers`
   - Ask about `.htaccess` restrictions
   - Provide error logs

