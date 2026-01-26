# Toy Cart Studio - Backend API

Complete PHP backend for Toy Cart Studio e-commerce platform.

## Features

- ✅ User Authentication (Signup/Login with JWT)
- ✅ Google OAuth Integration
- ✅ Product Management (CRUD)
- ✅ Cart & Wishlist Management
- ✅ Order Processing & Checkout
- ✅ Invoice Generation (PDF)
- ✅ Admin Panel
- ✅ Excel Import/Export for Products
- ✅ Shipping Integration
- ✅ Coupon System
- ✅ Review System

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx with mod_rewrite
- Composer (for dependencies)

## Installation

### 1. Database Setup

```bash
# Import database schema
mysql -u root -p < database/schema.sql
```

Or use phpMyAdmin to import `database/schema.sql`

### 2. Configuration

Edit `config/config.php` and `config/database.php` with your settings:

```php
// config/database.php
private $host = 'localhost';
private $db_name = 'toy_cart_studio';
private $username = 'root';
private $password = 'your_password';

// config/config.php
define('BASE_URL', 'http://localhost:8000');
define('JWT_SECRET', 'your-secret-key-change-this');
define('GOOGLE_CLIENT_ID', 'your-google-client-id');
define('GOOGLE_CLIENT_SECRET', 'your-google-client-secret');
```

### 3. Install Dependencies

For Excel import/export, install PhpSpreadsheet:

```bash
cd backend
composer require phpoffice/phpspreadsheet
```

For PDF generation, install FPDF:

```bash
composer require setasign/fpdf
```

Or download from:
- PhpSpreadsheet: https://github.com/PHPOffice/PhpSpreadsheet
- FPDF: http://www.fpdf.org/

### 4. Directory Permissions

```bash
chmod -R 755 uploads/
chmod -R 755 invoices/
chmod -R 755 logs/
```

### 5. Web Server Setup

#### Apache (.htaccess already configured)

Ensure mod_rewrite is enabled.

#### Nginx

Add to your server block:

```nginx
location /api {
    try_files $uri $uri/ /api/index.php?$query_string;
}
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login/signup

### Products

- `GET /api/products` - List products (with filters)
- `GET /api/products?id={id}` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products?id={id}` - Update product (Admin)
- `DELETE /api/products?id={id}` - Delete product (Admin)

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart?product_id={id}` - Remove from cart

### Wishlist

- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist?product_id={id}` - Remove from wishlist

### Orders

- `GET /api/orders` - Get orders (user's own or all for admin)
- `POST /api/orders` - Create order (checkout)
- `PUT /api/orders?id={id}` - Update order status (Admin)

### Invoices

- `POST /api/invoices/generate` - Generate invoice PDF

### Admin

- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - List users
- `PUT /api/admin/users?id={id}` - Update user
- `DELETE /api/admin/users?id={id}` - Deactivate user
- `POST /api/admin/products/import` - Import products from Excel
- `GET /api/admin/products/export` - Export products to Excel

### Shipping

- `GET /api/shipping/methods` - Get shipping methods
- `POST /api/shipping/methods` - Create shipping method (Admin)
- `POST /api/shipping/calculate` - Calculate shipping cost

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer {token}
```

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## Excel Import Format

Create an Excel file with these columns:

| Column | Required | Description |
|--------|----------|-------------|
| name | Yes | Product name |
| price | Yes | Product price |
| stock_quantity | Yes | Stock quantity |
| sku | No | Product SKU |
| description | No | Full description |
| short_description | No | Short description |
| discount_price | No | Discounted price |
| category | No | Category name or slug |
| age_group | No | Age group (e.g., "5-8 years") |
| material | No | Material description |
| badge | No | Badge text (e.g., "New", "Best Seller") |
| is_featured | No | Yes/No |

See `sample_products_import.xlsx` for template.

## Default Admin Credentials

- Username: `admin`
- Email: `admin@toycartstudio.com`
- Password: `admin123`

**⚠️ IMPORTANT: Change the admin password after first login!**

## File Structure

```
backend/
├── api/
│   ├── auth/          # Authentication endpoints
│   ├── products/      # Product endpoints
│   ├── cart/          # Cart endpoints
│   ├── wishlist/      # Wishlist endpoints
│   ├── orders/        # Order endpoints
│   ├── invoices/      # Invoice generation
│   ├── admin/         # Admin panel endpoints
│   └── shipping/      # Shipping endpoints
├── config/            # Configuration files
├── database/          # Database schema
├── lib/               # Third-party libraries
├── uploads/           # Uploaded files
├── invoices/          # Generated invoices
└── logs/              # Error logs
```

## Security Notes

1. Change `JWT_SECRET` in production
2. Use HTTPS in production
3. Validate all inputs
4. Use prepared statements (already implemented)
5. Set proper file permissions
6. Regularly update dependencies

## Support

For issues or questions, contact: support@toycartstudio.com

