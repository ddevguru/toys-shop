<?php
/**
 * CORS Diagnostic Tool
 * Upload this to: public_html/backend/check-cors.php
 * Visit: https://devloperwala.in/backend/check-cors.php
 */

// Start output buffering
ob_start();

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json');

// Handle OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_clean();
    http_response_code(200);
    header('Content-Length: 0');
    exit;
}

// Clear buffer
ob_end_clean();

// Diagnostic info
$info = [
    'success' => true,
    'message' => 'CORS Diagnostic',
    'method' => $_SERVER['REQUEST_METHOD'],
    'origin' => $_SERVER['HTTP_ORIGIN'] ?? 'Not set',
    'referer' => $_SERVER['HTTP_REFERER'] ?? 'Not set',
    'headers_sent' => headers_sent(),
    'response_code' => http_response_code(),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'mod_headers_check' => 'Check .htaccess or contact hosting',
    'cors_headers_set' => [
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    ],
    'test_instructions' => [
        '1. Test OPTIONS: curl -X OPTIONS -H "Origin: https://toys-shop-rhv5.onrender.com" -v https://devloperwala.in/backend/check-cors.php',
        '2. Check response headers for Access-Control-Allow-Origin',
        '3. If not present, .htaccess or mod_headers may not be working'
    ]
];

echo json_encode($info, JSON_PRETTY_PRINT);

