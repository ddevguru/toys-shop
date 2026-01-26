# Installation Guide

## Step-by-Step Installation

### 1. Prerequisites

- PHP 7.4+ with extensions: PDO, JSON, GD, ZIP
- MySQL 5.7+ or MariaDB 10.3+
- Apache with mod_rewrite OR Nginx
- Composer (optional, for dependencies)

### 2. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE toy_cart_studio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import schema
mysql -u root -p toy_cart_studio < database/schema.sql
```

### 3. Configure Database

Edit `config/database.php`:

```php
private $host = 'localhost';
private $db_name = 'toy_cart_studio';
private $username = 'your_db_user';
private $password = 'your_db_password';
```

### 4. Configure Application

Edit `config/config.php`:

```php
// Base URL
define('BASE_URL', 'http://your-domain.com');

// JWT Secret (generate a strong random string)
define('JWT_SECRET', 'your-very-long-random-secret-key-here');

// Google OAuth (get from Google Cloud Console)
define('GOOGLE_CLIENT_ID', 'your-google-client-id');
define('GOOGLE_CLIENT_SECRET', 'your-google-client-secret');
```

### 5. Install Dependencies

```bash
cd backend
composer install
```

Or manually download:
- PhpSpreadsheet: https://github.com/PHPOffice/PhpSpreadsheet
- FPDF: http://www.fpdf.org/

Place in `lib/PhpSpreadsheet/` and `lib/fpdf/`

### 6. Set Permissions

```bash
chmod -R 755 uploads/
chmod -R 755 invoices/
chmod -R 755 logs/
mkdir -p uploads/products uploads/users uploads/exports
```

### 7. Web Server Configuration

#### Apache

Ensure `.htaccess` is enabled:

```apache
<Directory /path/to/backend>
    AllowOverride All
</Directory>
```

#### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/backend;
    
    location /api {
        try_files $uri $uri/ /api/index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

### 8. Test Installation

```bash
# Test database connection
php -r "require 'config/database.php'; \$db = new Database(); \$conn = \$db->getConnection(); echo 'Connected!';"

# Test API endpoint
curl http://localhost/api/products
```

### 9. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://your-domain.com/api/auth/google/callback`
6. Copy Client ID and Secret to `config/config.php`

### 10. First Login

1. Default admin credentials:
   - Email: `admin@toycartstudio.com`
   - Password: `admin123`

2. **IMPORTANT**: Change admin password immediately!

### 11. Import Sample Products (Optional)

Use the Excel template to import products via admin panel.

## Troubleshooting

### Database Connection Error

- Check MySQL is running
- Verify credentials in `config/database.php`
- Ensure database exists

### 500 Internal Server Error

- Check PHP error logs
- Verify file permissions
- Check `.htaccess` is working (Apache)
- Enable error display temporarily for debugging

### File Upload Issues

- Check `uploads/` directory permissions
- Verify `upload_max_filesize` in php.ini
- Check `post_max_size` in php.ini

### JWT Token Issues

- Verify `JWT_SECRET` is set
- Check token expiration time
- Ensure Authorization header format: `Bearer {token}`

## Production Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Change admin password
- [ ] Enable HTTPS
- [ ] Set proper file permissions
- [ ] Disable error display
- [ ] Set up proper logging
- [ ] Configure backup strategy
- [ ] Set up monitoring
- [ ] Update all dependencies
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Configure email service
- [ ] Set up payment gateway
- [ ] Configure shipping API

