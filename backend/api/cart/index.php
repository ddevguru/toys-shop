<?php
/**
 * Cart API - Add, Remove, Update, Get
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
            // Get user's cart
            $stmt = $conn->prepare("
                SELECT c.*, p.name, p.price, p.discount_price, p.main_image, p.stock_quantity,
                       (SELECT COALESCE(p.discount_price, p.price) * c.quantity) as subtotal
                FROM cart c
                JOIN products p ON c.product_id = p.id
                WHERE c.user_id = ? AND p.is_active = TRUE
            ");
            $stmt->execute([$userId]);
            $cartItems = $stmt->fetchAll();

            $total = 0;
            foreach ($cartItems as &$item) {
                $itemPrice = $item['discount_price'] ?? $item['price'];
                $item['subtotal'] = $itemPrice * $item['quantity'];
                $total += $item['subtotal'];
            }

            echo json_encode([
                'success' => true,
                'data' => $cartItems,
                'total' => $total
            ]);
            break;

        case 'POST':
            // Add to cart
            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data['product_id'])) {
                throw new Exception("Product ID is required");
            }

            $productId = $data['product_id'];
            $quantity = $data['quantity'] ?? 1;

            // Check if product exists and is available
            $stmt = $conn->prepare("SELECT id, stock_quantity, is_active FROM products WHERE id = ?");
            $stmt->execute([$productId]);
            $product = $stmt->fetch();

            if (!$product || !$product['is_active']) {
                throw new Exception("Product not found or unavailable");
            }

            if ($product['stock_quantity'] < $quantity) {
                throw new Exception("Insufficient stock available");
            }

            // Check if item already in cart
            $stmt = $conn->prepare("SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$userId, $productId]);
            $existing = $stmt->fetch();

            if ($existing) {
                $newQuantity = $existing['quantity'] + $quantity;
                if ($newQuantity > $product['stock_quantity']) {
                    throw new Exception("Cannot add more items. Stock limit reached");
                }
                $stmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
                $stmt->execute([$newQuantity, $existing['id']]);
            } else {
                $stmt = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
                $stmt->execute([$userId, $productId, $quantity]);
            }

            echo json_encode([
                'success' => true,
                'message' => 'Item added to cart'
            ]);
            break;

        case 'PUT':
            // Update cart item quantity
            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data['product_id']) || !isset($data['quantity'])) {
                throw new Exception("Product ID and quantity are required");
            }

            $productId = $data['product_id'];
            $quantity = (int)$data['quantity'];

            if ($quantity <= 0) {
                // Remove item
                $stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
                $stmt->execute([$userId, $productId]);
            } else {
                // Check stock
                $stmt = $conn->prepare("SELECT stock_quantity FROM products WHERE id = ?");
                $stmt->execute([$productId]);
                $product = $stmt->fetch();

                if (!$product || $quantity > $product['stock_quantity']) {
                    throw new Exception("Insufficient stock available");
                }

                $stmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?");
                $stmt->execute([$quantity, $userId, $productId]);
            }

            echo json_encode([
                'success' => true,
                'message' => 'Cart updated'
            ]);
            break;

        case 'DELETE':
            // Remove from cart
            if (empty($_GET['product_id'])) {
                throw new Exception("Product ID is required");
            }

            $stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$userId, $_GET['product_id']]);

            echo json_encode([
                'success' => true,
                'message' => 'Item removed from cart'
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

