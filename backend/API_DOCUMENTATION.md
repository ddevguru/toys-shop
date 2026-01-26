# API Documentation

## Base URL
```
http://your-domain.com/api
```

## Authentication

Most endpoints require JWT authentication. Include token in Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "9876543210",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postal_code": "400001",
  "country": "India"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": { ... }
}
```

### Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { ... }
}
```

### Google OAuth
**POST** `/api/auth/google`

**Request Body:**
```json
{
  "google_token": "google_oauth_token",
  "google_id": "google_user_id",
  "email": "user@gmail.com",
  "name": "User Name",
  "photo": "https://photo-url.com"
}
```

---

## Products

### Get Products
**GET** `/api/products`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `category` - Category slug
- `search` - Search term
- `min_price` - Minimum price
- `max_price` - Maximum price
- `featured` - true/false
- `sort_by` - created_at, price, name, rating
- `sort_order` - ASC/DESC

**Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Get Single Product
**GET** `/api/products?id={id}`

### Create Product (Admin)
**POST** `/api/products`

**Request Body:**
```json
{
  "name": "Product Name",
  "price": 1299.00,
  "stock_quantity": 50,
  "description": "Full description",
  "category_id": 1,
  "images": ["url1", "url2"]
}
```

### Update Product (Admin)
**PUT** `/api/products?id={id}`

### Delete Product (Admin)
**DELETE** `/api/products?id={id}`

---

## Cart

### Get Cart
**GET** `/api/cart`

**Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "total": 5000.00
}
```

### Add to Cart
**POST** `/api/cart`

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

### Update Cart Item
**PUT** `/api/cart`

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 3
}
```

### Remove from Cart
**DELETE** `/api/cart?product_id={id}`

---

## Wishlist

### Get Wishlist
**GET** `/api/wishlist`

### Add to Wishlist
**POST** `/api/wishlist`

**Request Body:**
```json
{
  "product_id": 1
}
```

### Remove from Wishlist
**DELETE** `/api/wishlist?product_id={id}`

---

## Orders

### Get Orders
**GET** `/api/orders`

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `status` - Order status (admin only)
- `user_id` - User ID (admin only)

### Create Order (Checkout)
**POST** `/api/orders`

**Request Body:**
```json
{
  "shipping_address": "123 Main St",
  "shipping_city": "Mumbai",
  "shipping_state": "Maharashtra",
  "shipping_postal_code": "400001",
  "shipping_phone": "9876543210",
  "shipping_method_id": 1,
  "payment_method": "cash_on_delivery",
  "coupon_code": "DISCOUNT10"
}
```

### Update Order Status (Admin)
**PUT** `/api/orders?id={id}`

**Request Body:**
```json
{
  "order_status": "shipped",
  "payment_status": "paid",
  "tracking_number": "TRACK123456"
}
```

---

## Invoices

### Generate Invoice
**POST** `/api/invoices/generate`

**Request Body:**
```json
{
  "order_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invoice generated successfully",
  "invoice_url": "http://domain.com/invoices/invoice_INV-20240101-ABC123.html",
  "invoice_number": "INV-20240101-ABC123"
}
```

---

## Admin Endpoints

### Dashboard Statistics
**GET** `/api/admin/dashboard`

**Response:**
```json
{
  "success": true,
  "data": {
    "total_users": 150,
    "total_products": 200,
    "total_orders": 500,
    "total_revenue": 500000.00,
    "pending_orders": 10,
    "low_stock_products": 5,
    "recent_orders": [ ... ],
    "sales_by_month": [ ... ]
  }
}
```

### Get Users
**GET** `/api/admin/users`

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `search` - Search term
- `role` - user/admin

### Update User
**PUT** `/api/admin/users?id={id}`

**Request Body:**
```json
{
  "name": "Updated Name",
  "is_active": true,
  "role": "user"
}
```

### Deactivate User
**DELETE** `/api/admin/users?id={id}`

### Import Products
**POST** `/api/admin/products/import`

**Request:** Multipart form data with `file` field (Excel/CSV)

**Response:**
```json
{
  "success": true,
  "message": "Import completed. Success: 50, Errors: 2",
  "success_count": 50,
  "error_count": 2,
  "errors": [ ... ]
}
```

### Export Products
**GET** `/api/admin/products/export`

**Response:**
```json
{
  "success": true,
  "message": "Products exported successfully",
  "file_url": "http://domain.com/uploads/exports/products_export_2024-01-01.xlsx",
  "filename": "products_export_2024-01-01.xlsx"
}
```

---

## Shipping

### Get Shipping Methods
**GET** `/api/shipping/methods`

### Create Shipping Method (Admin)
**POST** `/api/shipping/methods`

**Request Body:**
```json
{
  "name": "Express Shipping",
  "description": "Fast delivery",
  "cost": 99.00,
  "estimated_days": 3
}
```

### Calculate Shipping
**POST** `/api/shipping/calculate`

**Request Body:**
```json
{
  "shipping_method_id": 1
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting implemented. Recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Notes

1. All prices are in Indian Rupees (₹)
2. All dates are in ISO 8601 format
3. File uploads limited to 5MB
4. JWT tokens expire after 24 hours
5. Admin endpoints require admin role

