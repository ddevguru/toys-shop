# Testing CORS on Windows

## Correct curl Commands for Windows

### Option 1: PowerShell (Recommended)

**Test OPTIONS Request:**
```powershell
curl -X OPTIONS -H "Origin: https://toys-shop-rhv5.onrender.com" -H "Access-Control-Request-Method: POST" -v https://devloperwala.in/backend/api/auth/register
```

**Test Diagnostic Endpoint:**
```powershell
curl -X OPTIONS -H "Origin: https://toys-shop-rhv5.onrender.com" -v https://devloperwala.in/backend/check-cors.php
```

**Test GET Request:**
```powershell
curl https://devloperwala.in/backend/check-cors.php
```

### Option 2: CMD (Command Prompt)

**Test OPTIONS Request:**
```cmd
curl -X OPTIONS -H "Origin: https://toys-shop-rhv5.onrender.com" -H "Access-Control-Request-Method: POST" -v https://devloperwala.in/backend/api/auth/register
```

**Note:** In CMD, use double quotes, not escaped quotes.

### Option 3: Browser Console (Easiest)

**Open your Render site in browser, then open Console (F12) and run:**

```javascript
// Test 1: Diagnostic endpoint
fetch('https://devloperwala.in/backend/check-cors.php', {
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

// Test 2: Actual register endpoint
fetch('https://devloperwala.in/backend/api/auth/register', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://toys-shop-rhv5.onrender.com',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type'
  }
})
.then(async r => {
  console.log('Register Endpoint - Status:', r.status);
  console.log('Register Endpoint - CORS Origin:', r.headers.get('Access-Control-Allow-Origin'));
  console.log('Register Endpoint - CORS Methods:', r.headers.get('Access-Control-Allow-Methods'));
  
  if (r.headers.get('Access-Control-Allow-Origin')) {
    console.log('✅ CORS IS WORKING!');
  } else {
    console.log('❌ CORS headers missing');
  }
});
```

## What to Look For

**In curl output, look for:**
```
< HTTP/1.1 200 OK
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
```

**In browser console, look for:**
- Status: 200
- CORS Origin: *
- CORS Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH

## Quick Test URLs

Just visit these in your browser:

1. **Diagnostic:** https://devloperwala.in/backend/check-cors.php
   - Should show JSON

2. **API Root:** https://devloperwala.in/backend/api/
   - Should show API info JSON

3. **Direct Register:** https://devloperwala.in/backend/api/auth/register.php
   - Might show error (needs POST), but should not show 404

## Expected Results

✅ **If CORS is working:**
- OPTIONS returns 200
- Response has `Access-Control-Allow-Origin: *`
- Registration works on Render site

❌ **If CORS is NOT working:**
- OPTIONS might return 200 but no CORS headers
- Or OPTIONS returns 404/500
- Registration fails with CORS error

## Next Steps

1. **Test with browser console** (easiest method)
2. **Check response headers** in DevTools → Network tab
3. **If headers present:** CORS is working!
4. **If headers missing:** Check .htaccess or contact hosting

