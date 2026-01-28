# ACTION REQUIRED - LiteSpeed CORS Fix

## ✅ Good News
- Diagnostic endpoint works: `check-cors.php` ✅
- PHP CORS headers are working ✅
- Server: LiteSpeed detected ✅

## ⚠️ Issue
CORS preflight (OPTIONS) requests might not be reaching PHP files due to routing.

## 🔧 Fix Applied

### 1. Routing Fix
Updated `backend/api/index.php` to handle LiteSpeed path structure correctly.

**What changed:**
- Added path cleaning for `/backend/api/` prefix
- Handles: `backend/api/auth/register` → `auth/register`

### 2. Files to Upload

**CRITICAL - Upload these to cPanel:**

1. **`backend/api/index.php`** (updated routing)
   - Upload to: `public_html/backend/api/index.php`

2. **`.htaccess` for LiteSpeed**
   - Use: `backend/api/.htaccess.litespeed`
   - Upload to: `public_html/backend/api/.htaccess`

3. **Test file** (optional)
   - Upload: `backend/test-api-routing.php`
   - To: `public_html/backend/test-api-routing.php`
   - Visit: `https://devloperwala.in/backend/test-api-routing.php`

## 🧪 Testing Steps

### Step 1: Test API Root
Visit: `https://devloperwala.in/backend/api/`
**Expected:** JSON with API info

### Step 2: Test OPTIONS Request
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
  console.log('✅ Status:', r.status);
  console.log('✅ CORS Origin:', r.headers.get('Access-Control-Allow-Origin'));
  console.log('✅ CORS Methods:', r.headers.get('Access-Control-Allow-Methods'));
  
  // Check if headers are present
  if (r.headers.get('Access-Control-Allow-Origin')) {
    console.log('✅ CORS IS WORKING!');
  } else {
    console.log('❌ CORS headers missing');
  }
});
```

### Step 3: Test Registration
Try to register on your Render site. Should work now!

## 📋 Checklist

- [ ] Upload `backend/api/index.php` (with routing fix)
- [ ] Upload `.htaccess` to `public_html/backend/api/`
- [ ] Test API root: `/backend/api/`
- [ ] Test OPTIONS request (see Step 2)
- [ ] Verify CORS headers in response
- [ ] Test registration on Render site

## 🔍 If Still Not Working

### Check 1: Routing
Visit: `https://devloperwala.in/backend/api/`
- Should show API info
- If 404, routing isn't working

### Check 2: Direct File Access
Try: `https://devloperwala.in/backend/api/auth/register.php`
- If this works, routing is the issue
- We can modify frontend to use direct paths

### Check 3: LiteSpeed Configuration
LiteSpeed might need:
- Virtual Host CORS settings
- Admin panel configuration
- Contact hosting if needed

## 📝 Files Reference

- **Routing fix:** `backend/api/index.php` (updated)
- **LiteSpeed .htaccess:** `backend/api/.htaccess.litespeed`
- **Diagnostic:** `backend/check-cors.php` (already working)
- **Routing test:** `backend/test-api-routing.php` (new)

## 🎯 Expected Result

After uploading:
1. OPTIONS request returns 200
2. Response has `Access-Control-Allow-Origin: *`
3. Registration works on Render site
4. No CORS errors in console

## ⚡ Quick Action

**Upload `backend/api/index.php` to cPanel NOW** - This is the critical fix!

Then test with the OPTIONS request above.

