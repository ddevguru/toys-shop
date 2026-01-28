<?php
/**
 * Preflight Handler - Handles OPTIONS requests
 * This file should be called for all OPTIONS requests
 */

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
header('Access-Control-Expose-Headers: Content-Length, Content-Type');

// Return 200 for OPTIONS requests
http_response_code(200);
exit;

