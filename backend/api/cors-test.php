<?php
/**
 * CORS Test Endpoint
 * Use this to test if CORS is working: https://devloperwala.in/backend/api/cors-test.php
 */

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Return CORS test response
echo json_encode([
    'success' => true,
    'message' => 'CORS is working!',
    'method' => $_SERVER['REQUEST_METHOD'],
    'origin' => $_SERVER['HTTP_ORIGIN'] ?? 'Not set',
    'headers' => [
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    ],
    'timestamp' => date('Y-m-d H:i:s')
]);

