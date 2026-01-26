<?php
/**
 * Admin - Users Management
 */

// Set CORS headers first
require_once __DIR__ . '/../../../config/cors.php';

require_once __DIR__ . '/../../../config/config.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/jwt.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$payload = JWT::validateToken();

if (!$payload || $payload['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

try {
    switch ($method) {
        case 'GET':
            // Get all users
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : ITEMS_PER_PAGE;
            $offset = ($page - 1) * $limit;

            $where = "1=1";
            $params = [];

            if (isset($_GET['search'])) {
                $where .= " AND (name LIKE ? OR email LIKE ? OR username LIKE ?)";
                $search = "%" . $_GET['search'] . "%";
                $params[] = $search;
                $params[] = $search;
                $params[] = $search;
            }

            if (isset($_GET['role'])) {
                $where .= " AND role = ?";
                $params[] = $_GET['role'];
            }

            $countStmt = $conn->prepare("SELECT COUNT(*) as total FROM users WHERE $where");
            $countStmt->execute($params);
            $total = $countStmt->fetch()['total'];

            $params[] = $limit;
            $params[] = $offset;
            $stmt = $conn->prepare("
                SELECT id, username, email, name, phone, address, city, state, postal_code, country,
                       photo, role, is_active, created_at, updated_at
                FROM users
                WHERE $where
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            ");
            $stmt->execute($params);
            $users = $stmt->fetchAll();

            echo json_encode([
                'success' => true,
                'data' => $users,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'pages' => ceil($total / $limit)
                ]
            ]);
            break;

        case 'PUT':
            // Update user
            if (empty($_GET['id'])) {
                throw new Exception("User ID is required");
            }

            $data = json_decode(file_get_contents('php://input'), true);

            $updateFields = [];
            $params = [];

            $allowedFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'postal_code', 'country', 'role', 'is_active'];

            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateFields[] = "$field = ?";
                    $params[] = $data[$field];
                }
            }

            if (empty($updateFields)) {
                throw new Exception("No fields to update");
            }

            $params[] = $_GET['id'];

            $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);

            // Get updated user
            $stmt = $conn->prepare("
                SELECT id, username, email, name, phone, address, city, state, postal_code, country,
                       photo, role, is_active, created_at, updated_at
                FROM users WHERE id = ?
            ");
            $stmt->execute([$_GET['id']]);
            $user = $stmt->fetch();

            echo json_encode([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ]);
            break;

        case 'DELETE':
            // Delete user (soft delete)
            if (empty($_GET['id'])) {
                throw new Exception("User ID is required");
            }

            $stmt = $conn->prepare("UPDATE users SET is_active = FALSE WHERE id = ?");
            $stmt->execute([$_GET['id']]);

            echo json_encode([
                'success' => true,
                'message' => 'User deactivated successfully'
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

