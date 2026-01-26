<?php
/**
 * Invoice Generation Endpoint
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
    // Support both GET and POST
    if ($method === 'GET') {
        if (empty($_GET['order_id'])) {
            throw new Exception("Order ID is required");
        }
        $orderId = (int)$_GET['order_id'];
    } else if ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['order_id'])) {
            throw new Exception("Order ID is required");
        }
        $orderId = (int)$data['order_id'];
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        exit;
    }

    // Get order
    $orderStmt = $conn->prepare("
        SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
    ");
    $orderStmt->execute([$orderId]);
    $order = $orderStmt->fetch();

    if (!$order) {
        throw new Exception("Order not found");
    }

    // Check permission (user can only generate invoice for their own orders, admin can generate for any)
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
    $items = $itemsStmt->fetchAll();

    // Check if invoice already exists
    $invoiceStmt = $conn->prepare("SELECT * FROM invoices WHERE order_id = ?");
    $invoiceStmt->execute([$orderId]);
    $existingInvoice = $invoiceStmt->fetch();

    if ($existingInvoice) {
        $existingFilePath = __DIR__ . '/../../' . $existingInvoice['file_path'];
        // Check if file exists and is valid (not incomplete PDF)
        $fileExists = file_exists($existingFilePath);
        $isValid = true;
        
        if ($fileExists && strpos($existingFilePath, '.pdf') !== false) {
            // Check if PDF is incomplete (less than 1KB)
            $isValid = filesize($existingFilePath) >= 1024;
        }
        
        // If invoice exists and is valid, return it
        if ($fileExists && $isValid) {
            echo json_encode([
                'success' => true,
                'message' => 'Invoice already exists',
                'invoice_url' => BASE_URL . '/' . $existingInvoice['file_path'],
                'invoice_download_url' => BASE_URL . '/api/invoices/download?order_id=' . $orderId,
                'invoice_number' => $existingInvoice['invoice_number']
            ]);
            exit;
        }
        // If invoice exists but file is invalid, regenerate it
    }

    // Generate invoice number
    $invoiceNumber = 'INV-' . date('Ymd') . '-' . strtoupper(uniqid());

    // Generate HTML Invoice (can be converted to PDF using browser print)
    $html = generateInvoiceHTML($invoiceNumber, $order, $items);
    
    // Save HTML invoice (HTML works better and can be printed as PDF by browser)
    $filename = 'invoice_' . $invoiceNumber . '.html';
    $filepath = INVOICE_DIR . $filename;
    file_put_contents($filepath, $html);
    
    // Use HTML invoice (users can print to PDF from browser)
    $relativePath = 'invoices/' . $filename;

    // Save or update invoice record
    if ($existingInvoice) {
        // Update existing invoice record with new file path
        $updateStmt = $conn->prepare("
            UPDATE invoices 
            SET invoice_number = ?, file_path = ?
            WHERE order_id = ?
        ");
        $updateStmt->execute([$invoiceNumber, $relativePath, $orderId]);
    } else {
        // Insert new invoice record
        $invoiceStmt = $conn->prepare("
            INSERT INTO invoices (invoice_number, order_id, user_id, file_path)
            VALUES (?, ?, ?, ?)
        ");
        $invoiceStmt->execute([$invoiceNumber, $orderId, $userId, $relativePath]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Invoice generated successfully',
        'invoice_url' => BASE_URL . '/' . $relativePath,
        'invoice_download_url' => BASE_URL . '/api/invoices/download?order_id=' . $orderId,
        'invoice_number' => $invoiceNumber
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

function generateInvoiceHTML($invoiceNumber, $order, $items) {
    $orderDate = date('d M Y', strtotime($order['created_at']));
    $orderTime = date('h:i A', strtotime($order['created_at']));
    
    $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ' . htmlspecialchars($invoiceNumber) . ' - ToyCart Studio</title>
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap");
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: "Poppins", Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            color: #333;
            line-height: 1.6;
        }
        
        .invoice-container {
            max-width: 900px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        
        .invoice-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .invoice-header::before {
            content: "";
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 3s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        .logo {
            font-size: 42px;
            font-weight: 800;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            position: relative;
            z-index: 1;
        }
        
        .invoice-title {
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 3px;
            opacity: 0.95;
            position: relative;
            z-index: 1;
        }
        
        .invoice-body {
            padding: 40px;
        }
        
        .invoice-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
            padding: 25px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
        }
        
        .meta-box {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .meta-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .meta-value {
            font-size: 18px;
            font-weight: 700;
            color: #333;
        }
        
        .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .detail-box {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 12px;
            border-left: 4px solid #667eea;
        }
        
        .detail-box h3 {
            color: #667eea;
            font-size: 16px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }
        
        .detail-box p {
            margin: 8px 0;
            color: #555;
            font-size: 14px;
        }
        
        .detail-box strong {
            color: #333;
            font-weight: 600;
        }
        
        .items-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 30px 0;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .items-table thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .items-table th {
            padding: 18px 20px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .items-table th.text-right {
            text-align: right;
        }
        
        .items-table tbody tr {
            border-bottom: 1px solid #f0f0f0;
            transition: background 0.3s;
        }
        
        .items-table tbody tr:hover {
            background: #f8f9fa;
        }
        
        .items-table tbody tr:last-child {
            border-bottom: none;
        }
        
        .items-table td {
            padding: 18px 20px;
            color: #555;
            font-size: 14px;
        }
        
        .items-table td:first-child {
            font-weight: 600;
            color: #333;
        }
        
        .items-table .text-right {
            text-align: right;
            font-weight: 600;
            color: #667eea;
        }
        
        .totals-section {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 30px;
            border-radius: 15px;
            margin-top: 30px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            font-size: 15px;
            color: #555;
        }
        
        .total-row.total-final {
            border-top: 3px solid #667eea;
            margin-top: 15px;
            padding-top: 20px;
            font-size: 24px;
            font-weight: 800;
            color: #333;
        }
        
        .total-row.total-final span:last-child {
            color: #667eea;
            font-size: 28px;
        }
        
        .total-row.discount {
            color: #10b981;
        }
        
        .invoice-footer {
            background: #2d3748;
            color: white;
            padding: 30px 40px;
            text-align: center;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .footer-section h4 {
            font-size: 14px;
            margin-bottom: 10px;
            color: #a0aec0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .footer-section p {
            font-size: 13px;
            color: #cbd5e0;
        }
        
        .footer-bottom {
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 20px;
            margin-top: 20px;
            font-size: 12px;
            color: #a0aec0;
        }
        
        .status-badge {
            display: inline-block;
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .status-paid {
            background: #10b981;
            color: white;
        }
        
        .status-pending {
            background: #f59e0b;
            color: white;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .invoice-container {
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <div class="logo">🎮 TOY CART STUDIO</div>
            <div class="invoice-title">TAX INVOICE</div>
        </div>
        
        <div class="invoice-body">
            <div class="invoice-meta">
                <div class="meta-box">
                    <div class="meta-label">Invoice Number</div>
                    <div class="meta-value">' . htmlspecialchars($invoiceNumber) . '</div>
                </div>
                <div class="meta-box">
                    <div class="meta-label">Order Number</div>
                    <div class="meta-value">' . htmlspecialchars($order['order_number']) . '</div>
                </div>
                <div class="meta-box">
                    <div class="meta-label">Invoice Date</div>
                    <div class="meta-value">' . $orderDate . '</div>
                </div>
                <div class="meta-box">
                    <div class="meta-label">Payment Status</div>
                    <div class="meta-value">
                        <span class="status-badge ' . (strtolower($order['payment_status']) === 'completed' || strtolower($order['payment_status']) === 'paid' ? 'status-paid' : 'status-pending') . '">
                            ' . ucfirst($order['payment_status']) . '
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="invoice-details">
                <div class="detail-box">
                    <h3>Bill From</h3>
                    <p><strong>ToyCart Studio</strong></p>
                    <p>123 Toy Street, Fun City</p>
                    <p>Mumbai, Maharashtra - 400001</p>
                    <p>Email: support@toycartstudio.com</p>
                    <p>Phone: +91 1800-TOYCART</p>
                    <p>GSTIN: 27AABCT1234Q1Z5</p>
                </div>
                
                <div class="detail-box">
                    <h3>Bill To</h3>
                    <p><strong>' . htmlspecialchars($order['user_name']) . '</strong></p>
                    <p>' . htmlspecialchars($order['user_email']) . '</p>';
    
    if ($order['user_phone']) {
        $html .= '<p>Phone: ' . htmlspecialchars($order['user_phone']) . '</p>';
    }
    
    $html .= '<p>' . htmlspecialchars($order['shipping_address']) . '</p>
                    <p>' . htmlspecialchars($order['shipping_city']) . ', ' . htmlspecialchars($order['shipping_state']) . '</p>
                    <p>PIN: ' . htmlspecialchars($order['shipping_postal_code']) . '</p>
                </div>
            </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 5%;">#</th>
                        <th style="width: 45%;">Product Name</th>
                        <th style="width: 15%;" class="text-right">Quantity</th>
                        <th style="width: 17.5%;" class="text-right">Unit Price</th>
                        <th style="width: 17.5%;" class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>';
    
    $itemNumber = 1;
    foreach ($items as $item) {
        $html .= '<tr>
            <td>' . $itemNumber . '</td>
            <td><strong>' . htmlspecialchars($item['product_name']) . '</strong></td>
            <td class="text-right">' . $item['quantity'] . '</td>
            <td class="text-right">₹' . number_format($item['product_price'], 2) . '</td>
            <td class="text-right">₹' . number_format($item['subtotal'], 2) . '</td>
        </tr>';
        $itemNumber++;
    }
    
    $html .= '</tbody>
            </table>
            
            <div class="totals-section">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>₹' . number_format($order['subtotal'], 2) . '</span>
                </div>';
    
    if ($order['discount_amount'] > 0) {
        $html .= '<div class="total-row discount">
            <span>Discount:</span>
            <span>-₹' . number_format($order['discount_amount'], 2) . '</span>
        </div>';
    }
    
    $html .= '<div class="total-row">
                    <span>Shipping Charges:</span>
                    <span>₹' . number_format($order['shipping_cost'], 2) . '</span>
                </div>
                <div class="total-row">
                    <span>GST (18%):</span>
                    <span>₹' . number_format($order['tax_amount'], 2) . '</span>
                </div>
                <div class="total-row total-final">
                    <span>Grand Total:</span>
                    <span>₹' . number_format($order['total_amount'], 2) . '</span>
                </div>
            </div>
        </div>
        
        <div class="invoice-footer">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>Payment Method</h4>
                    <p>' . ucfirst($order['payment_method']) . '</p>
                </div>
                <div class="footer-section">
                    <h4>Order Status</h4>
                    <p>' . ucfirst($order['order_status']) . '</p>
                </div>
                <div class="footer-section">
                    <h4>Contact Us</h4>
                    <p>support@toycartstudio.com</p>
                    <p>+91 1800-TOYCART</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p><strong>Thank you for shopping with ToyCart Studio!</strong></p>
                <p>This is a computer-generated invoice and does not require a signature.</p>
                <p style="margin-top: 10px;">Generated on ' . $orderDate . ' at ' . $orderTime . '</p>
            </div>
        </div>
    </div>
</body>
</html>';
    
    return $html;
}

