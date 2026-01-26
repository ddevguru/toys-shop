# Testing Backend API

## ✅ Server Status
Server is running with router: `php -S localhost:8000 router.php`

## 🧪 Test Endpoints

### 1. Test Root
Open in browser: `http://localhost:8000`
- Should show API info

### 2. Test API Root
Open: `http://localhost:8000/api`
- Should show API endpoints list

### 3. Test CORS
Open: `http://localhost:8000/cors-fix.php`
- Should show: `{"success":true,"message":"CORS is working!"}`

### 4. Test Registration Endpoint (GET - will show method error, that's OK)
Open: `http://localhost:8000/api/auth/register`
- Should show: `{"success":false,"message":"Method not allowed"}`
- This is correct! (POST required)

### 5. Test Registration (POST)
Use browser console or Postman:
```javascript
fetch('http://localhost:8000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'testuser',
    email: 'test@test.com',
    password: 'test123',
    name: 'Test User',
    phone: '1234567890'
  })
})
.then(r => r.json())
.then(console.log)
```

## 🔍 Debugging

### Check Router is Working
1. Open: `http://localhost:8000/test-api.php`
2. Should see request details

### Check API Router
1. Open: `http://localhost:8000/api`
2. Should see endpoints list

### Check Auth Endpoint
1. Open: `http://localhost:8000/api/auth/register`
2. GET request should show "Method not allowed" (correct)
3. POST request should work

## ⚠️ Common Issues

### 404 Error
- Make sure server is running with router: `php -S localhost:8000 router.php`
- Check router.php exists in backend folder

### CORS Error
- Check browser console
- Verify cors.php is being loaded
- Check all API files include cors.php

### Database Error
- Check database credentials in config/database.php
- Make sure MySQL is running
- Verify database exists: `toy_cart_studio`

## ✅ Expected Behavior

1. **GET /api/auth/register** → `{"success":false,"message":"Method not allowed"}`
2. **POST /api/auth/register** (with data) → `{"success":true,"token":"...","user":{...}}`
3. **OPTIONS /api/auth/register** → `200 OK` (CORS preflight)

