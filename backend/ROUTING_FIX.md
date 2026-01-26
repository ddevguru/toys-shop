# Backend Routing Fix

## Issue
Requests going to `/apiauth/register` instead of `/api/auth/register`

## Solution

### Option 1: Use Backend Router (Recommended)
Start PHP server from backend directory:
```bash
cd backend
php -S localhost:8000
```

Then access: `http://localhost:8000/api/auth/register`

### Option 2: Direct File Access
If using XAMPP, place backend in htdocs and access:
`http://localhost/toy-cart-studio-frontend/backend/api/auth/register.php`

### Option 3: Update .env.local
Make sure `.env.local` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Testing
Test the endpoint directly:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123","name":"Test User","phone":"1234567890"}'
```

## Current Setup
- Backend entry: `backend/index.php` or `backend/api/index.php`
- API routes: `backend/api/auth/register.php`
- Frontend API: `lib/api.ts` uses `http://localhost:8000/api`

