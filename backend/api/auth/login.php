<?php
/**
 * User Login Endpoint
 */

// Set CORS headers first
require_once __DIR__ . '/../../config/cors.php';

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['email']) || empty($data['password'])) {
        throw new Exception("Email and password are required");
    }

    $db = new Database();
    $conn = $db->getConnection();

    // Get user
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? OR username = ?");
    $stmt->execute([$data['email'], $data['email']]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new Exception("Invalid email or password");
    }

    // Check if user is active
    if (!$user['is_active']) {
        throw new Exception("Account is deactivated. Please contact support");
    }

    // Verify password
    if (empty($user['password_hash'])) {
        // If no password hash (Google user), check if password matches
        if (!empty($data['password'])) {
            throw new Exception("Invalid email or password");
        }
    } else {
        if (!password_verify($data['password'], $user['password_hash'])) {
            throw new Exception("Invalid email or password");
        }
    }

    // Generate JWT token
    $token = JWT::encode([
        'user_id' => $user['id'],
        'username' => $user['username'],
        'email' => $user['email'],
        'role' => $user['role']
    ]);

    // Remove password hash from response
    unset($user['password_hash']);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'token' => $token,
        'user' => $user
    ]);

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

