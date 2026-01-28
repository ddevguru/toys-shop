# URGENT LITESPEED FIX - Redirects Still Happening

## Problem
- Redirects are STILL happening: `/api/cart` → `/api/cart/`
- CORS headers lost on redirects
- `DirectorySlash Off` not working on LiteSpeed

## Root Cause
LiteSpeed is adding trailing slashes at server level BEFORE `.htaccess` can handle it. The `DirectorySlash Off` directive might not be supported or not working.

## Solution: Fix Routing to Handle Trailing Slashes

### File 1: `public_html/backend/api/.htaccess`

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

# IMPORTANT: Route ALL requests to index.php (including those with trailing slashes)
# This ensures PHP handles CORS headers for all requests
# Handle both /cart and /cart/ - rewrite internally (no redirect)
RewriteCond %{REQUEST_URI} ^/backend/api/(.+)/$
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.+)/$ index.php [QSA,L]

# Route to index.php (without trailing slash)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

### Alternative: Contact Hosting Support

If redirects continue, contact your hosting provider and ask them to:

1. **Disable automatic trailing slash redirects** for `/backend/api/` directory
2. **Or** ensure CORS headers are preserved on redirects
3. **Or** configure LiteSpeed to not add trailing slashes to API endpoints

### Temporary Workaround: Fix Frontend URLs

If redirects can't be prevented, ensure frontend doesn't trigger them:

**Check `lib/api.ts` - make sure URLs don't have trailing slashes:**

```typescript
// Ensure endpoint doesn't end with /
const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
const cleanEndpoint = normalizedEndpoint.replace(/\/$/, ''); // Remove trailing slash
const fullUrl = `${cleanBaseUrl}${cleanEndpoint}`;
```

## Upload Checklist

- [ ] Upload `backend/api/.htaccess` → `public_html/backend/api/.htaccess`
- [ ] Set permissions: 644
- [ ] Test: Check Network tab - should see single request (no 301 redirect)
- [ ] If still redirecting: Contact hosting support

## Test After Upload

**In browser console (on Render site):**
```javascript
// Check Network tab - should see:
// 1. Single request to /api/cart (status 200)
// 2. NOT a redirect (301) to /api/cart/

fetch('https://devloperwala.in/backend/api/cart', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(r => {
    console.log('Status:', r.status);
    console.log('URL:', r.url); // Should be /api/cart, not /api/cart/
    console.log('CORS:', r.headers.get('Access-Control-Allow-Origin'));
    return r.json();
  })
  .then(data => console.log('✅ Cart:', data))
  .catch(e => console.error('❌ Error:', e));
```

## Expected Result

- ✅ Single request (no redirect)
- ✅ Status 200 (not 301)
- ✅ CORS headers present
- ✅ Cart/Products/Orders work

## If Still Not Working

**Contact hosting support with this message:**

> "I need to disable automatic trailing slash redirects for my API directory `/backend/api/`. Currently, requests to `/backend/api/cart` are being redirected to `/backend/api/cart/` which is causing CORS issues. Please disable `DirectorySlash` or ensure CORS headers are preserved on redirects."

**The key change:** Routing now handles trailing slashes internally without redirecting!

