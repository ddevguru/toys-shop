# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Database Setup (2 minutes)

```bash
# Option 1: Using MySQL command line
mysql -u root -p < database/schema.sql

# Option 2: Using phpMyAdmin
# - Open phpMyAdmin
# - Create database: toy_cart_studio
# - Import database/schema.sql
```

### 2. Configure (1 minute)

Edit `config/database.php`:
```php
private $username = 'root';
private $password = 'your_password';
```

Edit `config/config.php`:
```php
define('BASE_URL', 'http://localhost:8000');
define('JWT_SECRET', 'change-this-to-random-string');
```

### 3. Test (2 minutes)

```bash
# Start PHP built-in server
cd backend
php -S localhost:8000

# Test in browser or curl
curl http://localhost:8000/api/products
```

### 4. Default Login

- **Admin Email:** admin@toycartstudio.com
- **Admin Password:** admin123
- **⚠️ Change password immediately!**

---

## 📋 What's Included

✅ Complete MySQL database schema  
✅ User authentication (Signup/Login/Google OAuth)  
✅ Product management (CRUD)  
✅ Cart & Wishlist  
✅ Order processing  
✅ Invoice generation  
✅ Admin panel API  
✅ Excel import/export  
✅ Shipping integration  

---

## 🔗 API Endpoints

- **Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/google`
- **Products:** `/api/products`
- **Cart:** `/api/cart`
- **Wishlist:** `/api/wishlist`
- **Orders:** `/api/orders`
- **Invoices:** `/api/invoices/generate`
- **Admin:** `/api/admin/*`
- **Shipping:** `/api/shipping/*`

See `API_DOCUMENTATION.md` for full details.

---

## 📦 Dependencies (Optional)

For Excel import/export:
```bash
composer require phpoffice/phpspreadsheet
```

For PDF invoices:
```bash
composer require setasign/fpdf
```

Or download manually and place in `lib/` directory.

---

## 🎯 Next Steps

1. ✅ Database setup
2. ✅ Configuration
3. ✅ Test API endpoints
4. 🔄 Connect frontend
5. 🔄 Set up Google OAuth
6. 🔄 Configure shipping
7. 🔄 Production deployment

---

## 📚 Documentation

- `README.md` - Full documentation
- `INSTALLATION.md` - Detailed installation
- `API_DOCUMENTATION.md` - Complete API reference

---

## 🆘 Need Help?

Check `INSTALLATION.md` for troubleshooting or contact support.

