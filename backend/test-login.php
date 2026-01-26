<?php
/**
 * Test Login Endpoint
 */

// Set CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/jwt.php';

header('Content-Type: application/json');

// Test password verification
$testPassword = 'admin123';
$testHash = '$2y$10$5p68LP6mbJBRiaEv7DpYA.L/PjjueZscSWfOshwTgh.NmYbluKO5S';

$db = new Database();
$conn = $db->getConnection();

// Check admin user
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ? OR username = ?");
$stmt->execute(['admin@toycartstudio.com', 'admin']);
$user = $stmt->fetch();

$result = [
    'password_test' => password_verify($testPassword, $testHash),
    'user_exists' => $user ? true : false,
    'user_active' => $user ? $user['is_active'] : false,
    'password_match' => $user ? password_verify($testPassword, $user['password_hash']) : false,
    'user_email' => $user ? $user['email'] : null,
    'user_role' => $user ? $user['role'] : null,
];

echo json_encode($result, JSON_PRETTY_PRINT);

