# Backend Setup Instructions

## Current Issue
Request going to `/apiauth/register` instead of `/api/auth/register`

## Solution

### Step 1: Start Backend Server

**Option A: Using PHP Built-in Server (Recommended)**
```bash
cd backend
php -S localhost:8000
```

**Option B: Using XAMPP**
1. Copy `backend` folder to `C:\xampp\htdocs\`
2. Access via: `http://localhost/backend/api/auth/register.php`
3. Update `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost/backend/api
   ```

### Step 2: Verify Backend is Running

Test in browser:
- `http://localhost:8000/test.php` - Should show JSON response
- `http://localhost:8000/api` - Should show API info

### Step 3: Test Registration Endpoint

Using curl:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@test.com\",\"password\":\"test123\",\"name\":\"Test User\",\"phone\":\"1234567890\"}"
```

### Step 4: Check Frontend Configuration

Make sure `.env.local` exists:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 5: Restart Frontend

```bash
npm run dev
```

## Troubleshooting

### Error: `/apiauth/register` not found
- Check if backend server is running on port 8000
- Verify `.env.local` has correct API URL
- Check browser console for actual request URL

### Error: CORS issues
- Backend CORS headers are already set
- Check browser console for CORS errors

### Error: Database connection failed
- Check `backend/config/database.php` credentials
- Make sure MySQL is running
- Verify database `toy_cart_studio` exists

## Quick Test

1. Open browser: `http://localhost:8000/test.php`
2. Should see: `{"success":true,"message":"Backend is working!"}`
3. If this works, backend is running correctly
4. Then test: `http://localhost:8000/api/auth/register` (should show method not allowed for GET, which is correct)

