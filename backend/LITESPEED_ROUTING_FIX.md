# LiteSpeed Routing Fix

## Issue Identified

Your server is **LiteSpeed**, and the routing might not be parsing the path correctly.

The URL structure is:
- Full URL: `https://devloperwala.in/backend/api/auth/register`
- Path received: Might be `backend/api/auth/register` or `api/auth/register`

## Fix Applied

Updated `backend/api/index.php` to handle LiteSpeed path structure:

```php
// Remove /backend/api prefix if present
$path = preg_replace('#^backend/api/#', '', $path);
$path = preg_replace('#^api/#', '', $path);
```

## Testing

### Test 1: API Root
Visit: `https://devloperwala.in/backend/api/`
Should show: API info JSON

### Test 2: OPTIONS Request
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
  const text = await r.text();
  console.log('Response:', text);
});
```

**Expected:**
- Status: 200
- CORS Origin: *
- CORS Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
- Response: Empty or minimal (for OPTIONS)

### Test 3: Direct File Access (If Routing Fails)

If routing doesn't work, try direct access:
```
https://devloperwala.in/backend/api/auth/register.php
```

This bypasses routing and goes directly to the PHP file.

## Files Updated

1. ✅ `backend/api/index.php` - Fixed path parsing for LiteSpeed
2. ✅ `backend/api/.htaccess.litespeed` - LiteSpeed-specific config

## Next Steps

1. **Upload updated `backend/api/index.php`** to cPanel
2. **Update `.htaccess`** in `public_html/backend/api/` (use `.htaccess.litespeed` content)
3. **Test OPTIONS request** (see Test 2 above)
4. **Check response headers** in browser DevTools

## If Still Not Working

### Option 1: Direct File Access

Modify frontend to use direct file paths:
- Instead of: `https://devloperwala.in/backend/api/auth/register`
- Use: `https://devloperwala.in/backend/api/auth/register.php`

### Option 2: Check LiteSpeed Admin Panel

LiteSpeed might have CORS settings in admin panel. Check:
- Virtual Host settings
- CORS configuration
- Header rules

### Option 3: Contact Hosting

Ask hosting support:
1. Is LiteSpeed configured to process .htaccess?
2. Are there any CORS restrictions?
3. Can you enable CORS headers for my domain?

## Verification

After uploading updated files:

1. ✅ Test API root: `/backend/api/`
2. ✅ Test OPTIONS: `/backend/api/auth/register` (OPTIONS method)
3. ✅ Check response headers
4. ✅ Test actual registration on Render site

## Your Current Setup

- **Server:** LiteSpeed
- **Backend URL:** `https://devloperwala.in/backend/api/`
- **Frontend URL:** `https://toys-shop-rhv5.onrender.com`
- **PHP CORS:** Working (diagnostic confirms)
- **Routing:** Needs path fix (already applied)

## Quick Test

**Upload `backend/test-api-routing.php` and visit:**
```
https://devloperwala.in/backend/test-api-routing.php
```

This will show:
- File structure
- Routing paths
- What the server sees

