# Fix Admin Login Issue

## Problem
Login showing "Invalid email or password" for admin credentials.

## Solution

### Step 1: Update Admin Password in Database

Run this SQL query in your MySQL:

```sql
USE toy_cart_studio;

UPDATE users 
SET password_hash = '$2y$10$5p68LP6mbJBRiaEv7DpYA.L/PjjueZscSWfOshwTgh.NmYbluKO5S'
WHERE email = 'admin@toycartstudio.com' OR username = 'admin';
```

Or import the fix file:
```bash
mysql -u root -p toy_cart_studio < backend/database/fix_admin_password.sql
```

### Step 2: Test Login

1. Open: `http://localhost:8000/test-login.php`
   - Should show password verification test results

2. Try login again:
   - Email: `admin@toycartstudio.com`
   - Password: `admin123`

### Step 3: Verify Database

Check if admin user exists:
```sql
SELECT id, username, email, name, role, is_active 
FROM users 
WHERE username = 'admin' OR email = 'admin@toycartstudio.com';
```

## Alternative: Create New Admin

If admin doesn't exist, create one:
```sql
INSERT INTO users (username, email, password_hash, name, role, is_active) 
VALUES (
    'admin', 
    'admin@toycartstudio.com', 
    '$2y$10$5p68LP6mbJBRiaEv7DpYA.L/PjjueZscSWfOshwTgh.NmYbluKO5S', 
    'Admin User', 
    'admin', 
    TRUE
);
```

## Password Hash
- Password: `admin123`
- Hash: `$2y$10$5p68LP6mbJBRiaEv7DpYA.L/PjjueZscSWfOshwTgh.NmYbluKO5S`

## After Fix
1. Login should work
2. You'll be redirected to home page
3. Admin panel accessible at `/admin`

