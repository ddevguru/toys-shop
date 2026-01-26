<?php
/**
 * Shipping Methods API
 */

// Set CORS headers first
require_once __DIR__ . '/../../config/cors.php';

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$db = new Database();
$conn = $db->getConnection();

try {
    switch ($method) {
        case 'GET':
            // Get all active shipping methods
            $stmt = $conn->prepare("
                SELECT * FROM shipping_methods
                WHERE is_active = TRUE
                ORDER BY cost ASC
            ");
            $stmt->execute();
            $methods = $stmt->fetchAll();

            echo json_encode([
                'success' => true,
                'data' => $methods
            ]);
            break;

        case 'POST':
            // Create shipping method (Admin only)
            $payload = JWT::validateToken();
            if (!$payload || $payload['role'] !== 'admin') {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Admin access required']);
                exit;
            }

            $data = json_decode(file_get_contents('php://input'), true);

            $required = ['name', 'cost'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    throw new Exception("Field '$field' is required");
                }
            }

            $stmt = $conn->prepare("
                INSERT INTO shipping_methods (name, description, cost, estimated_days, is_active)
                VALUES (?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $data['name'],
                $data['description'] ?? null,
                $data['cost'],
                $data['estimated_days'] ?? null,
                $data['is_active'] ?? true
            ]);

            $methodId = $conn->lastInsertId();

            $stmt = $conn->prepare("SELECT * FROM shipping_methods WHERE id = ?");
            $stmt->execute([$methodId]);
            $method = $stmt->fetch();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Shipping method created successfully',
                'data' => $method
            ]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

