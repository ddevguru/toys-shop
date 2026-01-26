<?php
/**
 * Invoice Download Endpoint - Serves invoice files
 */

// Set CORS headers first
require_once __DIR__ . '/../../config/cors.php';

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

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
    if (empty($_GET['order_id'])) {
        throw new Exception("Order ID is required");
    }

    $orderId = (int)$_GET['order_id'];

    // Get invoice
    $invoiceStmt = $conn->prepare("
        SELECT i.*, o.user_id as order_user_id
        FROM invoices i
        JOIN orders o ON i.order_id = o.id
        WHERE i.order_id = ?
    ");
    $invoiceStmt->execute([$orderId]);
    $invoice = $invoiceStmt->fetch();

    if (!$invoice) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Invoice not found']);
        exit;
    }

    // Check permission
    if ($userRole !== 'admin' && $invoice['order_user_id'] != $userId) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Access denied']);
        exit;
    }

    $filePath = __DIR__ . '/../../' . $invoice['file_path'];

    // Check if file exists and is valid
    if (!file_exists($filePath)) {
        // Try to find HTML version by invoice number
        $invoiceNumber = $invoice['invoice_number'];
        $htmlPath = __DIR__ . '/../../invoices/invoice_' . $invoiceNumber . '.html';
        if (file_exists($htmlPath)) {
            $filePath = $htmlPath;
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Invoice file not found']);
            exit;
        }
    } else {
        // Check if PDF is incomplete (too small or just header)
        if (strpos($filePath, '.pdf') !== false) {
            $fileSize = filesize($filePath);
            // If PDF is less than 1KB, it's likely incomplete
            if ($fileSize < 1024) {
                // Try to find HTML version
                $htmlPath = str_replace('.pdf', '.html', $filePath);
                if (file_exists($htmlPath)) {
                    $filePath = $htmlPath;
                } else {
                    // Try by invoice number
                    $invoiceNumber = $invoice['invoice_number'];
                    $htmlPath = __DIR__ . '/../../invoices/invoice_' . $invoiceNumber . '.html';
                    if (file_exists($htmlPath)) {
                        $filePath = $htmlPath;
                    }
                    // If HTML not found, still serve PDF but it will be incomplete
                }
            }
        }
    }

    // Determine content type based on file extension
    $contentType = 'text/html';
    $fileExtension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    
    if ($fileExtension === 'pdf') {
        $contentType = 'application/pdf';
    } elseif ($fileExtension === 'html' || $fileExtension === 'htm') {
        $contentType = 'text/html; charset=utf-8';
    }

    // Set CORS headers explicitly (cors.php might not set them for file downloads)
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type');
    
    // Set headers for download
    header('Content-Type: ' . $contentType);
    header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
    header('Content-Length: ' . filesize($filePath));
    header('Cache-Control: must-revalidate');
    header('Pragma: public');

    // Clear any output buffering
    if (ob_get_level()) {
        ob_end_clean();
    }

    // Output file
    readfile($filePath);
    exit;

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

