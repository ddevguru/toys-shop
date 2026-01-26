<?php
/**
 * CORS Configuration - Include this at the top of all API files
 */

// Get the origin from request
$origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '*';

// Allowed origins (add your Render domain here)
$allowed_origins = [
    'https://toys-shop-rhv5.onrender.com',
    'https://toys-shop.onrender.com',
    'http://localhost:3000',
    'http://localhost:3001',
];

// Check if origin is allowed, or use wildcard for development
$cors_origin = '*';
if (in_array($origin, $allowed_origins)) {
    $cors_origin = $origin;
}

// Set CORS headers first (before any output)
if (!headers_sent()) {
    header('Access-Control-Allow-Origin: ' . $cors_origin);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
    header('Access-Control-Expose-Headers: Content-Length, Content-Type');
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

