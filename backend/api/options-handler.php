<?php
/**
 * Universal OPTIONS Handler
 * This file handles ALL OPTIONS requests
 * Route all OPTIONS requests to this file via .htaccess
 */

// Prevent any output
ob_start();

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
header('Access-Control-Expose-Headers: Content-Length, Content-Type');

// Clear output buffer
ob_clean();

// Return 200 OK
http_response_code(200);
header('Content-Length: 0');

exit;

