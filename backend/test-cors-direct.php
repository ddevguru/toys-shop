<?php
/**
 * Direct CORS Test - Upload this to test if PHP CORS works
 * URL: https://devloperwala.in/backend/test-cors-direct.php
 */

// Prevent any output before headers
ob_start();

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name');
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

// Clear output buffer
ob_end_clean();

// Return test response
echo json_encode([
    'success' => true,
    'message' => 'CORS is working via PHP!',
    'method' => $_SERVER['REQUEST_METHOD'],
    'origin' => $_SERVER['HTTP_ORIGIN'] ?? 'Not set',
    'headers_sent' => headers_sent(),
    'cors_headers' => [
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    ],
    'timestamp' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT);

