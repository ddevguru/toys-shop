<?php
/**
 * Admin Analytics API - Sales, Profit, Product Sales
 */

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

    // Get date range (default: last 12 months)
    $months = isset($_GET['months']) ? (int)$_GET['months'] : 12;

    // Sales by month (revenue)
    $stmt = $conn->prepare("
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') as month,
            DATE_FORMAT(created_at, '%b %Y') as month_label,
            SUM(total_amount) as revenue,
            COUNT(*) as orders
        FROM orders
        WHERE payment_status IN ('completed', 'paid')
        AND created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month ASC
    ");
    $stmt->execute([$months]);
    $salesByMonth = $stmt->fetchAll();

    // Product sales (top selling products)
    $stmt = $conn->prepare("
        SELECT 
            p.id,
            p.name,
            p.price,
            p.discount_price,
            SUM(oi.quantity) as total_sold,
            SUM(oi.subtotal) as total_revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.payment_status IN ('completed', 'paid')
        AND o.created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
        GROUP BY p.id, p.name, p.price, p.discount_price
        ORDER BY total_sold DESC
        LIMIT 20
    ");
    $stmt->execute([$months]);
    $productSales = $stmt->fetchAll();

    // Profit calculation (revenue - cost)
    // Assuming we have a cost_price field or calculating from discount
    $stmt = $conn->prepare("
        SELECT 
            DATE_FORMAT(o.created_at, '%Y-%m') as month,
            DATE_FORMAT(o.created_at, '%b %Y') as month_label,
            SUM(o.total_amount) as revenue,
            SUM(o.subtotal) as subtotal,
            SUM(o.tax_amount) as tax,
            SUM(o.shipping_cost) as shipping,
            SUM(o.discount_amount) as discount,
            COUNT(*) as orders
        FROM orders o
        WHERE o.payment_status IN ('completed', 'paid')
        AND o.created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
        GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
        ORDER BY month ASC
    ");
    $stmt->execute([$months]);
    $profitData = $stmt->fetchAll();

    // Calculate profit (assuming 30% margin on subtotal as cost)
    foreach ($profitData as &$row) {
        $cost = $row['subtotal'] * 0.7; // 70% of subtotal is cost, 30% is profit
        $row['cost'] = $cost;
        $row['profit'] = $row['revenue'] - $cost;
        $row['profit_margin'] = $row['revenue'] > 0 ? ($row['profit'] / $row['revenue']) * 100 : 0;
    }

    // User purchase history summary
    $stmt = $conn->prepare("
        SELECT 
            u.id,
            u.name,
            u.email,
            COUNT(DISTINCT o.id) as total_orders,
            SUM(o.total_amount) as total_spent,
            MAX(o.created_at) as last_order_date
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id AND o.payment_status IN ('completed', 'paid')
        WHERE u.role = 'user'
        GROUP BY u.id, u.name, u.email
        HAVING total_orders > 0
        ORDER BY total_spent DESC
        LIMIT 50
    ");
    $stmt->execute();
    $userPurchaseHistory = $stmt->fetchAll();

    // Payment method breakdown
    $stmt = $conn->prepare("
        SELECT 
            payment_method,
            COUNT(*) as count,
            SUM(total_amount) as total
        FROM orders
        WHERE payment_status IN ('completed', 'paid')
        AND created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
        GROUP BY payment_method
    ");
    $stmt->execute([$months]);
    $paymentMethods = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => [
            'sales_by_month' => $salesByMonth,
            'product_sales' => $productSales,
            'profit_data' => $profitData,
            'user_purchase_history' => $userPurchaseHistory,
            'payment_methods' => $paymentMethods
        ]
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

