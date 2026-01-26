<?php
/**
 * User Registration Endpoint
 */

// Set CORS headers FIRST - before anything else
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

// Handle preflight OPTIONS request IMMEDIATELY
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include CORS config (for additional setup)
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

    // Validate required fields
    $required = ['username', 'email', 'password', 'name', 'phone'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            throw new Exception("Field '$field' is required");
        }
    }

    // Validate email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    // Validate password strength
    if (strlen($data['password']) < 6) {
        throw new Exception("Password must be at least 6 characters");
    }

    $db = new Database();
    $conn = $db->getConnection();

    // Check if username or email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$data['username'], $data['email']]);
    if ($stmt->fetch()) {
        throw new Exception("Username or email already exists");
    }

    // Hash password
    $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

    // Handle photo upload
    $photoPath = null;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['photo'];
        
        // Validate file
        if ($file['size'] > MAX_FILE_SIZE) {
            throw new Exception("File size exceeds maximum limit");
        }
        
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mimeType, ALLOWED_IMAGE_TYPES)) {
            throw new Exception("Invalid file type. Only images are allowed");
        }
        
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('user_') . '.' . $extension;
        $uploadPath = UPLOAD_DIR . 'users/' . $filename;
        
        if (!file_exists(dirname($uploadPath))) {
            mkdir(dirname($uploadPath), 0755, true);
        }
        
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            $photoPath = 'uploads/users/' . $filename;
        }
    }

    // Insert user
    $stmt = $conn->prepare("
        INSERT INTO users (username, email, password_hash, name, phone, address, city, state, postal_code, country, photo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['username'],
        $data['email'],
        $passwordHash,
        $data['name'],
        $data['phone'],
        $data['address'] ?? null,
        $data['city'] ?? null,
        $data['state'] ?? null,
        $data['postal_code'] ?? null,
        $data['country'] ?? 'India',
        $photoPath
    ]);

    $userId = $conn->lastInsertId();

    // Generate JWT token
    $token = JWT::encode([
        'user_id' => $userId,
        'username' => $data['username'],
        'email' => $data['email'],
        'role' => 'user'
    ]);

    // Get user data
    $stmt = $conn->prepare("SELECT id, username, email, name, phone, address, city, state, postal_code, country, photo, role, created_at FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    // Remove password hash from response
    unset($user['password_hash']);

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'User registered successfully',
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

