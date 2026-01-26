# Setup Guide - Complete Integration

## 🚀 Quick Setup Steps

### 1. Database Setup

```bash
# Import database schema
mysql -u root -p < backend/database/schema.sql

# Import products
mysql -u root -p < backend/database/insert_products.sql
```

### 2. Backend Configuration

Edit `backend/config/database.php`:
```php
private $username = 'root';
private $password = 'your_password';
```

Edit `backend/config/config.php`:
```php
define('BASE_URL', 'http://localhost:8000');
define('JWT_SECRET', 'your-secret-key-here');
```

### 3. Start Backend Server

```bash
cd backend
php -S localhost:8000
```

### 4. Frontend Configuration

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 5. Install Frontend Dependencies

```bash
npm install
# or
pnpm install
```

### 6. Start Frontend

```bash
npm run dev
# or
pnpm dev
```

## 📍 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **Admin Panel:** http://localhost:3000/admin

## 🔐 Default Admin Login

- **Email:** admin@toycartstudio.com
- **Password:** admin123

⚠️ **Change password immediately after first login!**

## ✅ What's Connected

### Main Frontend
- ✅ Shop page fetches products from API
- ✅ Product details from API
- ✅ Cart integration ready
- ✅ Wishlist integration ready
- ✅ Authentication ready

### Admin Panel
- ✅ Dashboard with statistics
- ✅ Product management (CRUD)
- ✅ User management
- ✅ Order management
- ✅ Excel import/export

## 🔧 Troubleshooting

### Products not showing?
1. Check if backend is running on port 8000
2. Verify database has products: `SELECT * FROM products;`
3. Check browser console for API errors
4. Verify `.env.local` has correct API URL

### Admin panel not accessible?
1. Make sure you're logged in as admin
2. Check user role in database
3. Verify JWT token in localStorage

### API errors?
1. Check backend logs
2. Verify database connection
3. Check CORS settings in backend
4. Verify JWT_SECRET is set

## 📝 Next Steps

1. ✅ Database imported
2. ✅ Products inserted
3. ✅ Backend running
4. ✅ Frontend connected
5. 🔄 Test all features
6. 🔄 Add more products
7. 🔄 Configure production settings

## 🎯 Testing Checklist

- [ ] Products load on shop page
- [ ] Product details page works
- [ ] Admin login works
- [ ] Admin can view dashboard
- [ ] Admin can manage products
- [ ] Admin can view users
- [ ] Admin can view orders
- [ ] API endpoints respond correctly

---

**Status: Ready for Testing! 🎉**

