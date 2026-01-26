# cPanel Deployment Guide - PHP Backend + MySQL Database

## Prerequisites
- cPanel access with PHP support (PHP 7.4+ recommended)
- MySQL database access
- FTP/File Manager access
- Domain name configured

## Step 1: Database Setup

### 1.1 Create Database in cPanel
1. Login to cPanel
2. Go to **MySQL Databases**
3. Create a new database: `toycart_db` (or your preferred name)
4. Create a new MySQL user: `toycart_user`
5. Assign user to database with **ALL PRIVILEGES**
6. Note down:
   - Database name: `cpanelusername_toycart_db`
   - Username: `cpanelusername_toycart_user`
   - Password: (your password)
   - Host: `localhost` (usually)

### 1.2 Import Database Schema
1. Go to **phpMyAdmin** in cPanel
2. Select your database
3. Click **Import** tab
4. Upload `backend/database/schema.sql`
5. Click **Go** to import

### 1.3 Import Products Data
1. In phpMyAdmin, select your database
2. Click **Import** tab again
3. Upload `backend/database/insert_products.sql`
4. Click **Go** to import

## Step 2: Upload Backend Files

### 2.1 Prepare Files
1. Create a folder on your computer: `backend_upload`
2. Copy entire `backend` folder contents to `backend_upload`
3. **Remove/Delete these files** (not needed on production):
   - `router.php`
   - `START_SERVER.bat`
   - `START_SERVER.sh`
   - `test.php`
   - `test-api.php`
   - `test-login.php`
   - `*.md` files (documentation)

### 2.2 Upload via FTP/File Manager
1. Connect via FTP or use cPanel File Manager
2. Navigate to `public_html` (or your domain root)
3. Create folder: `api` (or `backend`)
4. Upload all backend files to this folder

**Recommended Structure:**
```
public_html/
  └── api/
      ├── api/
      ├── config/
      ├── database/
      ├── uploads/
      ├── invoices/
      ├── logs/
      ├── vendor/
      ├── .htaccess
      └── index.php
```

## Step 3: Configure Backend

### 3.1 Update config.php
Edit `api/config/config.php`:

```php
<?php
// Base URLs - REPLACE WITH YOUR DOMAIN
define('BASE_URL', 'https://yourdomain.com');
define('API_BASE_URL', BASE_URL . '/api');

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'cpanelusername_toycart_db'); // Your database name
define('DB_USER', 'cpanelusername_toycart_user'); // Your database user
define('DB_PASS', 'your_database_password'); // Your database password

// JWT Secret - CHANGE THIS TO A RANDOM STRING
define('JWT_SECRET', 'your-super-secret-jwt-key-change-this-now-123456789');

// Google OAuth (if using)
define('GOOGLE_CLIENT_ID', 'your-google-client-id');
define('GOOGLE_CLIENT_SECRET', 'your-google-client-secret');
define('GOOGLE_REDIRECT_URI', BASE_URL . '/api/auth/google/callback');

// File paths
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('INVOICE_DIR', __DIR__ . '/../invoices/');
```

### 3.2 Update database.php
Edit `api/config/database.php`:

```php
<?php
require_once __DIR__ . '/config.php';

$host = 'localhost';
$dbname = 'cpanelusername_toycart_db'; // Your database name
$username = 'cpanelusername_toycart_user'; // Your database user
$password = 'your_database_password'; // Your database password

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}
```

## Step 4: Set File Permissions

### 4.1 Set Permissions via File Manager
1. Go to cPanel File Manager
2. Navigate to your `api` folder
3. Set permissions:
   - `uploads/` folder: **755** (or **777** if 755 doesn't work)
   - `invoices/` folder: **755** (or **777**)
   - `logs/` folder: **755** (or **777**)
   - All PHP files: **644**

### 4.2 Via SSH (if available)
```bash
cd public_html/api
chmod 755 uploads invoices logs
chmod 644 *.php
find . -type f -name "*.php" -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
```

## Step 5: Configure .htaccess

### 5.1 Main .htaccess
Create/Edit `api/.htaccess`:

```apache
# Enable Rewrite Engine
RewriteEngine On

# Set base directory
RewriteBase /api/

# Handle CORS
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    Header set Access-Control-Allow-Credentials "true"
    Header set Access-Control-Max-Age "86400"
</IfModule>

# Handle preflight requests
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]

# Route API requests
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# If accessing root, redirect to api/index.php
RewriteCond %{REQUEST_URI} ^/api/?$
RewriteRule ^(.*)$ api/index.php [QSA,L]

# Security: Deny access to sensitive files
<FilesMatch "\.(sql|md|log|env)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# PHP Settings
<IfModule mod_php7.c>
    php_value upload_max_filesize 10M
    php_value post_max_size 10M
    php_value max_execution_time 300
    php_value max_input_time 300
</IfModule>
```

### 5.2 Root .htaccess (if API is in root)
If you put API in root `public_html/api/`, create `public_html/.htaccess`:

```apache
RewriteEngine On
RewriteBase /

# Route /api/* requests
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/api/index.php [QSA,L]
```

## Step 6: Install Composer Dependencies

### 6.1 Via SSH (Recommended)
```bash
cd public_html/api
php composer.phar install --no-dev --optimize-autoloader
```

### 6.2 Via cPanel Terminal
1. Go to cPanel Terminal
2. Navigate to your API folder
3. Run: `php composer.phar install --no-dev`

### 6.3 Manual Upload
If SSH not available:
1. On your local machine, run: `composer install --no-dev`
2. Upload the `vendor` folder to cPanel

## Step 7: Test Backend

### 7.1 Test API Endpoint
Visit in browser:
```
https://yourdomain.com/api/test.php
```

Should return: `{"status":"ok","message":"API is working"}`

### 7.2 Test Database Connection
Visit:
```
https://yourdomain.com/api/api/products
```

Should return products JSON.

## Step 8: Security Checklist

- [ ] Changed JWT_SECRET to a strong random string
- [ ] Updated database credentials
- [ ] Set correct file permissions
- [ ] Removed test files
- [ ] Updated BASE_URL to your domain
- [ ] Configured .htaccess properly
- [ ] Enabled SSL/HTTPS
- [ ] Set up error logging

## Step 9: Common Issues & Solutions

### Issue: 500 Internal Server Error
**Solution:**
- Check file permissions
- Check .htaccess syntax
- Check PHP error logs in cPanel
- Verify database credentials

### Issue: CORS Errors
**Solution:**
- Check .htaccess CORS headers
- Verify `config/cors.php` is included in all API files
- Check server allows custom headers

### Issue: Database Connection Failed
**Solution:**
- Verify database name format: `cpanelusername_dbname`
- Check username format: `cpanelusername_dbuser`
- Confirm password is correct
- Try `localhost` as host (most cPanel hosts use this)

### Issue: File Upload Not Working
**Solution:**
- Check `uploads/` folder permissions (755 or 777)
- Verify PHP upload settings in .htaccess
- Check PHP error logs

## Step 10: Production URLs

After deployment, your API endpoints will be:
- Base URL: `https://yourdomain.com/api`
- Products: `https://yourdomain.com/api/api/products`
- Auth: `https://yourdomain.com/api/api/auth/login`
- Cart: `https://yourdomain.com/api/api/cart`

**Note:** Update frontend `.env.local` with these URLs.

## Support

If you face issues:
1. Check cPanel error logs
2. Check PHP error logs in `api/logs/error.log`
3. Verify all file paths are correct
4. Test database connection separately

