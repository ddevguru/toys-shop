<?php
/**
 * Backend Entry Point - Router
 */

// Get request URI
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove query string
$path = parse_url($requestUri, PHP_URL_PATH);
$path = trim($path, '/');

// Route API requests
if (strpos($path, 'api/') === 0 || strpos($path, 'api') === 0) {
    // Remove 'api' prefix
    $apiPath = str_replace('api/', '', $path);
    $apiPath = str_replace('api', '', $apiPath);
    $apiPath = trim($apiPath, '/');
    
    // Route to API index
    require_once __DIR__ . '/api/index.php';
    exit;
}

// Default response
http_response_code(200);
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'message' => 'Toy Cart Studio Backend API',
    'version' => '1.0.0',
    'api_url' => '/api'
]);

