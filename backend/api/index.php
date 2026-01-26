<?php
/**
 * API Router - Main Entry Point
 */

// Set CORS headers FIRST - before anything else
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

// Handle preflight OPTIONS request IMMEDIATELY
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include CORS config (for additional setup)
require_once __DIR__ . '/../config/cors.php';

// Get request URI (may be modified by router)
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove query string
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove leading slash
$path = ltrim($path, '/');

// Clean path (router already removed /api prefix)
$path = trim($path, '/');

// Route to appropriate endpoint
$segments = explode('/', $path);

if (empty($segments[0])) {
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'message' => 'Toy Cart Studio API',
        'version' => '1.0.0',
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
    exit;
}

// Route based on first segment
$route = $segments[0];

switch ($route) {
    case 'auth':
        if (isset($segments[1])) {
            $file = __DIR__ . '/auth/' . $segments[1] . '.php';
            if (file_exists($file)) {
                require $file;
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
            }
        }
        break;

    case 'products':
        require __DIR__ . '/products/index.php';
        break;

    case 'cart':
        require __DIR__ . '/cart/index.php';
        break;

    case 'wishlist':
        require __DIR__ . '/wishlist/index.php';
        break;

    case 'orders':
        require __DIR__ . '/orders/index.php';
        break;

    case 'invoices':
        if (isset($segments[1])) {
            if ($segments[1] === 'generate') {
                require __DIR__ . '/invoices/generate.php';
            } elseif ($segments[1] === 'download') {
                require __DIR__ . '/invoices/download.php';
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        }
        break;

    case 'admin':
        if (isset($segments[1])) {
            if ($segments[1] === 'dashboard') {
                require __DIR__ . '/admin/dashboard.php';
            } elseif ($segments[1] === 'analytics') {
                require __DIR__ . '/admin/analytics.php';
            } elseif ($segments[1] === 'users') {
                require __DIR__ . '/admin/users/index.php';
            } elseif ($segments[1] === 'products') {
                if (isset($segments[2])) {
                    if ($segments[2] === 'import') {
                        require __DIR__ . '/admin/products/import.php';
                    } elseif ($segments[2] === 'export') {
                        require __DIR__ . '/admin/products/export.php';
                    } else {
                        http_response_code(404);
                        echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
                    }
                } else {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
                }
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        }
        break;

    case 'categories':
        require __DIR__ . '/categories/index.php';
        break;

    case 'shipping':
        if (isset($segments[1])) {
            if ($segments[1] === 'methods') {
                require __DIR__ . '/shipping/methods.php';
            } elseif ($segments[1] === 'calculate') {
                require __DIR__ . '/shipping/calculate.php';
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
}

