<?php
/**
 * Test API Endpoint
 */

// Set CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'message' => 'API is accessible!',
    'request_uri' => $_SERVER['REQUEST_URI'],
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'path_info' => $_SERVER['PATH_INFO'] ?? 'none',
    'script_name' => $_SERVER['SCRIPT_NAME'],
]);

