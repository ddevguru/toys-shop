<?php
/**
 * Shipping Cost Calculator
 */

// Set CORS headers first
require_once __DIR__ . '/../../config/cors.php';

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['shipping_method_id'])) {
        throw new Exception("Shipping method ID is required");
    }

    $db = new Database();
    $conn = $db->getConnection();

    $stmt = $conn->prepare("SELECT * FROM shipping_methods WHERE id = ? AND is_active = TRUE");
    $stmt->execute([$data['shipping_method_id']]);
    $method = $stmt->fetch();

    if (!$method) {
        throw new Exception("Shipping method not found");
    }

    // Calculate shipping cost based on method
    $shippingCost = $method['cost'];

    // You can add additional logic here based on:
    // - Weight of products
    // - Distance to destination
    // - Special handling requirements
    // etc.

    echo json_encode([
        'success' => true,
        'data' => [
            'shipping_method_id' => $method['id'],
            'shipping_method_name' => $method['name'],
            'cost' => (float)$shippingCost,
            'estimated_days' => $method['estimated_days']
        ]
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

