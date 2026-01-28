<?php
/**
 * Orders API - Create, Get, Update
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
$userRole = $payload['role'];
$db = new Database();
$conn = $db->getConnection();

try {
    switch ($method) {
        case 'GET':
            // Check if requesting a single order by ID
            if (isset($_GET['id']) && $_GET['id'] !== '' && $_GET['id'] !== 'NaN' && is_numeric($_GET['id'])) {
                $orderId = (int)$_GET['id'];
                $stmt = $conn->prepare("
                    SELECT o.*, u.name as user_name, u.email as user_email
                    FROM orders o
                    JOIN users u ON o.user_id = u.id
                    WHERE o.id = ?
                ");
                $stmt->execute([$orderId]);
                $order = $stmt->fetch();

                if (!$order) {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'message' => 'Order not found']);
                    exit;
                }

                // Check permission (user can only view their own orders, admin can view any)
                if ($userRole !== 'admin' && $order['user_id'] != $userId) {
                    http_response_code(403);
                    echo json_encode(['success' => false, 'message' => 'Access denied']);
                    exit;
                }

                // Get order items
                $itemsStmt = $conn->prepare("
                    SELECT oi.*, p.main_image
                    FROM order_items oi
                    LEFT JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = ?
                ");
                $itemsStmt->execute([$orderId]);
                $order['items'] = $itemsStmt->fetchAll();

                echo json_encode([
                    'success' => true,
                    'data' => $order
                ]);
                exit;
            }

            // Get orders (user's own orders or all orders for admin)
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : ITEMS_PER_PAGE;
            $offset = ($page - 1) * $limit;

            if ($userRole === 'admin') {
                $where = "1=1";
                $params = [];
                
                if (isset($_GET['user_id'])) {
                    $where .= " AND o.user_id = ?";
                    $params[] = $_GET['user_id'];
                }
                
                if (isset($_GET['status'])) {
                    $where .= " AND o.order_status = ?";
                    $params[] = $_GET['status'];
                }

                $countStmt = $conn->prepare("SELECT COUNT(*) as total FROM orders o WHERE $where");
                $countStmt->execute($params);
                $total = $countStmt->fetch()['total'];

                $params[] = $limit;
                $params[] = $offset;
                $stmt = $conn->prepare("
                    SELECT o.*, u.name as user_name, u.email as user_email
                    FROM orders o
                    JOIN users u ON o.user_id = u.id
                    WHERE $where
                    ORDER BY o.created_at DESC
                    LIMIT ? OFFSET ?
                ");
                $stmt->execute($params);
            } else {
                $countStmt = $conn->prepare("SELECT COUNT(*) as total FROM orders WHERE user_id = ?");
                $countStmt->execute([$userId]);
                $total = $countStmt->fetch()['total'];

                $stmt = $conn->prepare("
                    SELECT * FROM orders
                    WHERE user_id = ?
                    ORDER BY created_at DESC
                    LIMIT ? OFFSET ?
                ");
                $stmt->execute([$userId, $limit, $offset]);
            }

            $orders = $stmt->fetchAll();

            // Get order items for each order
            foreach ($orders as &$order) {
                $itemsStmt = $conn->prepare("
                    SELECT oi.*, p.main_image
                    FROM order_items oi
                    LEFT JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = ?
                ");
                $itemsStmt->execute([$order['id']]);
                $order['items'] = $itemsStmt->fetchAll();
            }

            echo json_encode([
                'success' => true,
                'data' => $orders,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'pages' => ceil($total / $limit)
                ]
            ]);
            break;

        case 'POST':
            // Create order (checkout)
            $data = json_decode(file_get_contents('php://input'), true);

            $required = ['shipping_address', 'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_phone'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    throw new Exception("Field '$field' is required");
                }
            }

            // Get cart items
            $cartStmt = $conn->prepare("
                SELECT c.*, p.name, p.price, p.discount_price, p.stock_quantity
                FROM cart c
                JOIN products p ON c.product_id = p.id
                WHERE c.user_id = ? AND p.is_active = TRUE
            ");
            $cartStmt->execute([$userId]);
            $cartItems = $cartStmt->fetchAll();

            if (empty($cartItems)) {
                throw new Exception("Cart is empty");
            }

            // Validate stock and calculate totals
            $subtotal = 0;
            foreach ($cartItems as $item) {
                $itemPrice = $item['discount_price'] ?? $item['price'];
                
                if ($item['quantity'] > $item['stock_quantity']) {
                    throw new Exception("Insufficient stock for product: " . $item['name']);
                }
                
                $subtotal += $itemPrice * $item['quantity'];
            }

            // Calculate shipping cost
            $shippingCost = 0;
            if (isset($data['shipping_method_id'])) {
                $shippingStmt = $conn->prepare("SELECT cost FROM shipping_methods WHERE id = ? AND is_active = TRUE");
                $shippingStmt->execute([$data['shipping_method_id']]);
                $shipping = $shippingStmt->fetch();
                if ($shipping) {
                    $shippingCost = $shipping['cost'];
                }
            }

            // Apply coupon if provided
            $discountAmount = 0;
            if (!empty($data['coupon_code'])) {
                $couponStmt = $conn->prepare("
                    SELECT * FROM coupons 
                    WHERE code = ? AND is_active = TRUE 
                    AND (valid_from IS NULL OR valid_from <= NOW())
                    AND (valid_until IS NULL OR valid_until >= NOW())
                ");
                $couponStmt->execute([$data['coupon_code']]);
                $coupon = $couponStmt->fetch();

                if ($coupon) {
                    // Check usage limit
                    if ($coupon['usage_limit'] && $coupon['used_count'] >= $coupon['usage_limit']) {
                        throw new Exception("Coupon usage limit reached");
                    }

                    // Check minimum purchase
                    if ($coupon['min_purchase'] && $subtotal < $coupon['min_purchase']) {
                        throw new Exception("Minimum purchase amount not met");
                    }

                    // Check if user already used this coupon
                    $userCouponStmt = $conn->prepare("SELECT id FROM user_coupons WHERE user_id = ? AND coupon_id = ?");
                    $userCouponStmt->execute([$userId, $coupon['id']]);
                    if ($userCouponStmt->fetch()) {
                        throw new Exception("Coupon already used");
                    }

                    // Calculate discount
                    if ($coupon['discount_type'] === 'percentage') {
                        $discountAmount = ($subtotal * $coupon['discount_value']) / 100;
                        if ($coupon['max_discount'] && $discountAmount > $coupon['max_discount']) {
                            $discountAmount = $coupon['max_discount'];
                        }
                    } else {
                        $discountAmount = $coupon['discount_value'];
                    }
                } else {
                    throw new Exception("Invalid coupon code");
                }
            }

            $taxAmount = ($subtotal - $discountAmount) * 0.18; // 18% GST
            $totalAmount = $subtotal - $discountAmount + $shippingCost + $taxAmount;

            // Generate order number
            $orderNumber = 'ORD-' . date('Ymd') . '-' . strtoupper(uniqid());

            // Start transaction
            $conn->beginTransaction();

            try {
                // Create order
                $orderStmt = $conn->prepare("
                    INSERT INTO orders (
                        order_number, user_id, total_amount, subtotal, shipping_cost,
                        discount_amount, tax_amount, payment_method, payment_status,
                        shipping_address, shipping_city, shipping_state, shipping_postal_code,
                        shipping_country, shipping_phone, billing_address, notes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");

                $orderStmt->execute([
                    $orderNumber,
                    $userId,
                    $totalAmount,
                    $subtotal,
                    $shippingCost,
                    $discountAmount,
                    $taxAmount,
                    $data['payment_method'] ?? 'cash_on_delivery',
                    'pending',
                    $data['shipping_address'],
                    $data['shipping_city'],
                    $data['shipping_state'],
                    $data['shipping_postal_code'],
                    $data['shipping_country'] ?? 'India',
                    $data['shipping_phone'],
                    $data['billing_address'] ?? $data['shipping_address'],
                    $data['notes'] ?? null
                ]);

                $orderId = $conn->lastInsertId();

                // Create order items and update stock
                foreach ($cartItems as $item) {
                    $itemPrice = $item['discount_price'] ?? $item['price'];
                    $itemSubtotal = $itemPrice * $item['quantity'];

                    $itemStmt = $conn->prepare("
                        INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal)
                        VALUES (?, ?, ?, ?, ?, ?)
                    ");
                    $itemStmt->execute([
                        $orderId,
                        $item['product_id'],
                        $item['name'],
                        $itemPrice,
                        $item['quantity'],
                        $itemSubtotal
                    ]);

                    // Update product stock
                    $updateStockStmt = $conn->prepare("
                        UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?
                    ");
                    $updateStockStmt->execute([$item['quantity'], $item['product_id']]);
                }

                // Record coupon usage
                if (!empty($data['coupon_code']) && isset($coupon)) {
                    $userCouponStmt = $conn->prepare("
                        INSERT INTO user_coupons (user_id, coupon_id, order_id) VALUES (?, ?, ?)
                    ");
                    $userCouponStmt->execute([$userId, $coupon['id'], $orderId]);

                    // Update coupon used count
                    $updateCouponStmt = $conn->prepare("
                        UPDATE coupons SET used_count = used_count + 1 WHERE id = ?
                    ");
                    $updateCouponStmt->execute([$coupon['id']]);
                }

                // Clear cart
                $clearCartStmt = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
                $clearCartStmt->execute([$userId]);

                $conn->commit();

                // Get created order
                $orderStmt = $conn->prepare("SELECT * FROM orders WHERE id = ?");
                $orderStmt->execute([$orderId]);
                $order = $orderStmt->fetch();

                $itemsStmt = $conn->prepare("
                    SELECT oi.*, p.main_image
                    FROM order_items oi
                    LEFT JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = ?
                ");
                $itemsStmt->execute([$orderId]);
                $order['items'] = $itemsStmt->fetchAll();

                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Order created successfully',
                    'data' => $order
                ]);

            } catch (Exception $e) {
                $conn->rollBack();
                throw $e;
            }
            break;

        case 'PUT':
            // Update order status (Admin only)
            if ($userRole !== 'admin') {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Admin access required']);
                exit;
            }

            if (empty($_GET['id'])) {
                throw new Exception("Order ID is required");
            }

            $data = json_decode(file_get_contents('php://input'), true);

            $updateFields = [];
            $params = [];

            if (isset($data['order_status'])) {
                $updateFields[] = "order_status = ?";
                $params[] = $data['order_status'];
            }

            if (isset($data['payment_status'])) {
                $updateFields[] = "payment_status = ?";
                $params[] = $data['payment_status'];
            }

            if (isset($data['tracking_number'])) {
                $updateFields[] = "tracking_number = ?";
                $params[] = $data['tracking_number'];
            }

            if (empty($updateFields)) {
                throw new Exception("No fields to update");
            }

            $params[] = $_GET['id'];

            $sql = "UPDATE orders SET " . implode(', ', $updateFields) . " WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);

            // Get updated order
            $stmt = $conn->prepare("SELECT * FROM orders WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $order = $stmt->fetch();

            echo json_encode([
                'success' => true,
                'message' => 'Order updated successfully',
                'data' => $order
            ]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }

} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

