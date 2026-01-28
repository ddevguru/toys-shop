<?php
/**
 * API Routing Test
 * Upload to: public_html/backend/test-api-routing.php
 * Visit: https://devloperwala.in/backend/test-api-routing.php
 */

// Set CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$info = [
    'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Not set',
    'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'Not set',
    'path_info' => $_SERVER['PATH_INFO'] ?? 'Not set',
    'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'Not set',
    'api_index_exists' => file_exists(__DIR__ . '/api/index.php'),
    'register_exists' => file_exists(__DIR__ . '/api/auth/register.php'),
    'file_structure' => [
        'backend_root' => __DIR__,
        'api_dir' => __DIR__ . '/api',
        'auth_dir' => __DIR__ . '/api/auth',
    ],
    'test_endpoints' => [
        'api_root' => 'https://devloperwala.in/backend/api/',
        'register_direct' => 'https://devloperwala.in/backend/api/auth/register.php',
        'register_routed' => 'https://devloperwala.in/backend/api/auth/register',
    ]
];

echo json_encode($info, JSON_PRETTY_PRINT);

