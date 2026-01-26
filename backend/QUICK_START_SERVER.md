# Quick Start - Backend Server

## 🚀 Start Server (Choose One Method)

### Method 1: Using Router (Recommended)
```bash
cd backend
php -S localhost:8000 router.php
```

### Method 2: Using Batch File (Windows)
Double-click: `START_SERVER.bat`

### Method 3: Using Shell Script (Linux/Mac)
```bash
cd backend
chmod +x START_SERVER.sh
./START_SERVER.sh
```

### Method 4: Direct (if router doesn't work)
```bash
cd backend
php -S localhost:8000
```
Then access: `http://localhost:8000/api/auth/register.php` (direct file)

## ✅ Verify Server is Running

1. Open browser: `http://localhost:8000`
   - Should see API info JSON

2. Test endpoint: `http://localhost:8000/api`
   - Should see API endpoints list

3. Test CORS: `http://localhost:8000/cors-fix.php`
   - Should see: `{"success":true,"message":"CORS is working!"}`

## 🔧 Troubleshooting

### 404 Error on `/api/auth/register`
- Make sure you're using `router.php`:
  ```bash
  php -S localhost:8000 router.php
  ```

### Still Getting 404?
- Try direct file access:
  `http://localhost:8000/api/auth/register.php`

### CORS Still Not Working?
- Check browser console
- Verify `cors.php` is being loaded
- Make sure no output before headers

## 📝 Current Setup

- Router: `backend/router.php`
- API Entry: `backend/api/index.php`
- CORS Handler: `backend/config/cors.php`
- Port: `8000`

## 🎯 Test Registration

Once server is running:
1. Go to: http://localhost:3000/register
2. Fill the form
3. Submit
4. Should work! ✅

