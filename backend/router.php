<?php
/**
 * PHP Built-in Server Router
 * Use this when running: php -S localhost:8000 router.php
 */

// Set CORS headers first
require_once __DIR__ . '/config/cors.php';

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove query string
$path = parse_url($requestUri, PHP_URL_PATH);

// Route API requests
if (strpos($path, '/api/') === 0 || strpos($path, '/api') === 0) {
    // Remove /api prefix
    if (strpos($path, '/api/') === 0) {
        $apiPath = substr($path, 5); // Remove '/api/'
    } else {
        $apiPath = substr($path, 4); // Remove '/api'
    }
    $apiPath = trim($apiPath, '/');
    
    // Update REQUEST_URI for API router
    $_SERVER['ORIGINAL_REQUEST_URI'] = $_SERVER['REQUEST_URI'];
    $_SERVER['REQUEST_URI'] = '/' . $apiPath;
    
    // Route to API index
    require __DIR__ . '/api/index.php';
    exit;
}

// Serve static files if they exist
if ($path !== '/' && file_exists(__DIR__ . $path)) {
    return false; // Serve the file
}

// Default response
http_response_code(200);
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'message' => 'Toy Cart Studio Backend API',
    'version' => '1.0.0',
    'api_url' => '/api',
    'endpoints' => [
        'auth' => '/api/auth/register, /api/auth/login, /api/auth/google',
        'products' => '/api/products',
        'cart' => '/api/cart',
        'wishlist' => '/api/wishlist',
        'orders' => '/api/orders',
        'invoices' => '/api/invoices/generate',
        'admin' => '/api/admin/*',
        'shipping' => '/api/shipping/*'
    ]
]);

