<?php
/**
 * Categories API - CRUD operations
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$payload = JWT::validateToken();

if (!$payload) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

$userId = $payload['user_id'];
$userRole = $payload['role'];
$db = new Database();
$conn = $db->getConnection();

try {
    switch ($method) {
        case 'GET':
            // Get all categories
            $stmt = $conn->query("SELECT * FROM categories ORDER BY name ASC");
            $categories = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $categories
            ]);
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true) ?: [];
            
            // Check if it's an update or delete (has _method)
            if (isset($data['_method'])) {
                if ($data['_method'] === 'PUT') {
                    // Update category
                    $categoryId = $_GET['id'] ?? $data['id'] ?? null;
                    if (!$categoryId) {
                        throw new Exception("Category ID is required");
                    }
                    
                    if ($userRole !== 'admin') {
                        http_response_code(403);
                        echo json_encode(['success' => false, 'message' => 'Admin access required']);
                        exit;
                    }
                    
                    $updateFields = [];
                    $params = [];
                    
                    if (isset($data['name'])) {
                        $updateFields[] = "name = ?";
                        $params[] = $data['name'];
                    }
                    if (isset($data['slug'])) {
                        $updateFields[] = "slug = ?";
                        $params[] = $data['slug'];
                    }
                    if (isset($data['description'])) {
                        $updateFields[] = "description = ?";
                        $params[] = $data['description'];
                    }
                    if (isset($data['is_active'])) {
                        $updateFields[] = "is_active = ?";
                        $params[] = $data['is_active'] ? 1 : 0;
                    }
                    
                    if (empty($updateFields)) {
                        throw new Exception("No fields to update");
                    }
                    
                    $params[] = $categoryId;
                    $sql = "UPDATE categories SET " . implode(', ', $updateFields) . " WHERE id = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->execute($params);
                    
                    echo json_encode([
                        'success' => true,
                        'message' => 'Category updated successfully'
                    ]);
                } elseif ($data['_method'] === 'DELETE') {
                    // Delete category
                    $categoryId = $_GET['id'] ?? $data['id'] ?? null;
                    if (!$categoryId) {
                        throw new Exception("Category ID is required");
                    }
                    
                    if ($userRole !== 'admin') {
                        http_response_code(403);
                        echo json_encode(['success' => false, 'message' => 'Admin access required']);
                        exit;
                    }
                    
                    // Check if category is used by any products
                    $checkStmt = $conn->prepare("SELECT COUNT(*) as count FROM products WHERE category_id = ?");
                    $checkStmt->execute([$categoryId]);
                    $count = $checkStmt->fetch()['count'];
                    
                    if ($count > 0) {
                        throw new Exception("Cannot delete category. It is used by {$count} product(s)");
                    }
                    
                    $stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
                    $stmt->execute([$categoryId]);
                    
                    echo json_encode([
                        'success' => true,
                        'message' => 'Category deleted successfully'
                    ]);
                }
            } else {
                // Create new category
                if ($userRole !== 'admin') {
                    http_response_code(403);
                    echo json_encode(['success' => false, 'message' => 'Admin access required']);
                    exit;
                }
                
                if (empty($data['name']) || empty($data['slug'])) {
                    throw new Exception("Name and slug are required");
                }
                
                // Check if slug already exists
                $checkStmt = $conn->prepare("SELECT id FROM categories WHERE slug = ?");
                $checkStmt->execute([$data['slug']]);
                if ($checkStmt->fetch()) {
                    throw new Exception("Category with this slug already exists");
                }
                
                $stmt = $conn->prepare("
                    INSERT INTO categories (name, slug, description, is_active, created_at)
                    VALUES (?, ?, ?, ?, NOW())
                ");
                $stmt->execute([
                    $data['name'],
                    $data['slug'],
                    $data['description'] ?? '',
                    isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1
                ]);
                
                $categoryId = $conn->lastInsertId();
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Category created successfully',
                    'data' => ['id' => $categoryId]
                ]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
