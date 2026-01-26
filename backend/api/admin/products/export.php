<?php
/**
 * Admin - Excel Product Export
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

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $db = new Database();
    $conn = $db->getConnection();

    // Get all products
    $stmt = $conn->prepare("
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
    ");
    $stmt->execute();
    $products = $stmt->fetchAll();

    // Create Excel file
    require_once __DIR__ . '/../../../lib/PhpSpreadsheet/vendor/autoload.php';

    $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

    // Set headers
    $headers = [
        'ID', 'Name', 'SKU', 'Description', 'Short Description', 'Price', 'Discount Price',
        'Stock Quantity', 'Category', 'Age Group', 'Material', 'Badge', 'Weight', 'Dimensions',
        'Is Featured', 'Is Active', 'Rating', 'Review Count', 'Created At'
    ];

    $col = 'A';
    foreach ($headers as $header) {
        $sheet->setCellValue($col . '1', $header);
        $sheet->getStyle($col . '1')->getFont()->setBold(true);
        $col++;
    }

    // Add data
    $row = 2;
    foreach ($products as $product) {
        $col = 'A';
        $sheet->setCellValue($col++, $product['id']);
        $sheet->setCellValue($col++, $product['name']);
        $sheet->setCellValue($col++, $product['sku'] ?? '');
        $sheet->setCellValue($col++, $product['description'] ?? '');
        $sheet->setCellValue($col++, $product['short_description'] ?? '');
        $sheet->setCellValue($col++, $product['price']);
        $sheet->setCellValue($col++, $product['discount_price'] ?? '');
        $sheet->setCellValue($col++, $product['stock_quantity']);
        $sheet->setCellValue($col++, $product['category_name'] ?? '');
        $sheet->setCellValue($col++, $product['age_group'] ?? '');
        $sheet->setCellValue($col++, $product['material'] ?? '');
        $sheet->setCellValue($col++, $product['badge'] ?? '');
        $sheet->setCellValue($col++, $product['weight'] ?? '');
        $sheet->setCellValue($col++, $product['dimensions'] ?? '');
        $sheet->setCellValue($col++, $product['is_featured'] ? 'Yes' : 'No');
        $sheet->setCellValue($col++, $product['is_active'] ? 'Yes' : 'No');
        $sheet->setCellValue($col++, $product['rating']);
        $sheet->setCellValue($col++, $product['review_count']);
        $sheet->setCellValue($col++, $product['created_at']);
        $row++;
    }

    // Auto-size columns
    foreach (range('A', $col) as $columnID) {
        $sheet->getColumnDimension($columnID)->setAutoSize(true);
    }

    // Generate filename
    $filename = 'products_export_' . date('Y-m-d_His') . '.xlsx';
    $filepath = UPLOAD_DIR . 'exports/' . $filename;

    if (!file_exists(dirname($filepath))) {
        mkdir(dirname($filepath), 0755, true);
    }

    $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
    $writer->save($filepath);

    echo json_encode([
        'success' => true,
        'message' => 'Products exported successfully',
        'file_url' => BASE_URL . '/uploads/exports/' . $filename,
        'filename' => $filename
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

