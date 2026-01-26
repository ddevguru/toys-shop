<?php
/**
 * Google OAuth Login/Signup Endpoint
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

    if (empty($data['google_token']) || empty($data['google_id']) || empty($data['email'])) {
        throw new Exception("Google authentication data is required");
    }

    // Verify Google token (you should implement proper Google token verification)
    // For now, we'll trust the client data, but in production, verify with Google API
    
    $db = new Database();
    $conn = $db->getConnection();

    // Check if user exists with Google ID
    $stmt = $conn->prepare("SELECT * FROM users WHERE google_id = ? OR email = ?");
    $stmt->execute([$data['google_id'], $data['email']]);
    $user = $stmt->fetch();

    if ($user) {
        // Update Google ID if not set
        if (!$user['google_id']) {
            $stmt = $conn->prepare("UPDATE users SET google_id = ?, google_email = ?, email_verified = TRUE WHERE id = ?");
            $stmt->execute([$data['google_id'], $data['email'], $user['id']]);
        }

        // Update photo if provided
        if (!empty($data['photo']) && empty($user['photo'])) {
            $stmt = $conn->prepare("UPDATE users SET photo = ? WHERE id = ?");
            $stmt->execute([$data['photo'], $user['id']]);
        }
    } else {
        // Create new user
        $username = str_replace('@', '_', $data['email']);
        $username = preg_replace('/[^a-zA-Z0-9_]/', '', $username);
        
        // Ensure unique username
        $baseUsername = $username;
        $counter = 1;
        while (true) {
            $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
            $stmt->execute([$username]);
            if (!$stmt->fetch()) {
                break;
            }
            $username = $baseUsername . $counter;
            $counter++;
        }

        $stmt = $conn->prepare("
            INSERT INTO users (username, email, google_id, google_email, name, photo, email_verified, is_active)
            VALUES (?, ?, ?, ?, ?, ?, TRUE, TRUE)
        ");

        $stmt->execute([
            $username,
            $data['email'],
            $data['google_id'],
            $data['email'],
            $data['name'] ?? $username,
            $data['photo'] ?? null
        ]);

        $userId = $conn->lastInsertId();

        // Get created user
        $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
    }

    // Check if user is active
    if (!$user['is_active']) {
        throw new Exception("Account is deactivated. Please contact support");
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
        'message' => 'Google authentication successful',
        'token' => $token,
        'user' => $user
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

