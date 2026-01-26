<?php
/**
 * Wishlist API - Add, Remove, Get
 */

// Set CORS headers first
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
$db = new Database();
$conn = $db->getConnection();

try {
    switch ($method) {
        case 'GET':
            // Get user's wishlist
            $stmt = $conn->prepare("
                SELECT w.*, p.name, p.price, p.discount_price, p.main_image, p.category_id,
                       c.name as category_name, c.slug as category_slug
                FROM wishlist w
                JOIN products p ON w.product_id = p.id
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE w.user_id = ? AND p.is_active = TRUE
                ORDER BY w.created_at DESC
            ");
            $stmt->execute([$userId]);
            $wishlistItems = $stmt->fetchAll();

            echo json_encode([
                'success' => true,
                'data' => $wishlistItems
            ]);
            break;

        case 'POST':
            // Add to wishlist
            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data['product_id'])) {
                throw new Exception("Product ID is required");
            }

            $productId = $data['product_id'];

            // Check if product exists
            $stmt = $conn->prepare("SELECT id, is_active FROM products WHERE id = ?");
            $stmt->execute([$productId]);
            $product = $stmt->fetch();

            if (!$product || !$product['is_active']) {
                throw new Exception("Product not found or unavailable");
            }

            // Check if already in wishlist
            $stmt = $conn->prepare("SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$userId, $productId]);
            if ($stmt->fetch()) {
                throw new Exception("Product already in wishlist");
            }

            $stmt = $conn->prepare("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)");
            $stmt->execute([$userId, $productId]);

            echo json_encode([
                'success' => true,
                'message' => 'Item added to wishlist'
            ]);
            break;

        case 'DELETE':
            // Remove from wishlist
            if (empty($_GET['product_id'])) {
                throw new Exception("Product ID is required");
            }

            $stmt = $conn->prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$userId, $_GET['product_id']]);

            echo json_encode([
                'success' => true,
                'message' => 'Item removed from wishlist'
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

