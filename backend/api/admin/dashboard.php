<?php
/**
 * Admin Dashboard Statistics
 */

// Set CORS headers first
require_once __DIR__ . '/../../config/cors.php';

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$payload = JWT::validateToken();

if (!$payload || $payload['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $db = new Database();
    $conn = $db->getConnection();

    // Total users
    $stmt = $conn->query("SELECT COUNT(*) as total FROM users WHERE role = 'user'");
    $totalUsers = $stmt->fetch()['total'];

    // Total products
    $stmt = $conn->query("SELECT COUNT(*) as total FROM products");
    $totalProducts = $stmt->fetch()['total'];

    // Total orders
    $stmt = $conn->query("SELECT COUNT(*) as total FROM orders");
    $totalOrders = $stmt->fetch()['total'];

    // Total revenue
    $stmt = $conn->query("SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'paid'");
    $totalRevenue = $stmt->fetch()['total'] ?? 0;

    // Pending orders
    $stmt = $conn->query("SELECT COUNT(*) as total FROM orders WHERE order_status = 'pending'");
    $pendingOrders = $stmt->fetch()['total'];

    // Low stock products
    $stmt = $conn->query("SELECT COUNT(*) as total FROM products WHERE stock_quantity < 10 AND is_active = TRUE");
    $lowStockProducts = $stmt->fetch()['total'];

    // Recent orders
    $stmt = $conn->prepare("
        SELECT o.*, u.name as user_name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 10
    ");
    $stmt->execute();
    $recentOrders = $stmt->fetchAll();

    // Sales by month (last 6 months)
    $stmt = $conn->prepare("
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') as month,
            SUM(total_amount) as revenue,
            COUNT(*) as orders
        FROM orders
        WHERE payment_status = 'paid'
        AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month ASC
    ");
    $stmt->execute();
    $salesByMonth = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => [
            'total_users' => (int)$totalUsers,
            'total_products' => (int)$totalProducts,
            'total_orders' => (int)$totalOrders,
            'total_revenue' => (float)$totalRevenue,
            'pending_orders' => (int)$pendingOrders,
            'low_stock_products' => (int)$lowStockProducts,
            'recent_orders' => $recentOrders,
            'sales_by_month' => $salesByMonth
        ]
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

