<?php
/**
 * Admin - Excel Product Import
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

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("Please upload a valid Excel file");
    }

    $file = $_FILES['file'];
    $filePath = $file['tmp_name'];
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($extension, ['xlsx', 'xls', 'csv'])) {
        throw new Exception("Invalid file format. Please upload Excel (.xlsx, .xls) or CSV file");
    }

    // Read Excel file
    require_once __DIR__ . '/../../../lib/PhpSpreadsheet/vendor/autoload.php';

    $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($filePath);
    $worksheet = $spreadsheet->getActiveSheet();
    $rows = $worksheet->toArray();

    if (count($rows) < 2) {
        throw new Exception("Excel file must contain at least a header row and one data row");
    }

    // Get header row
    $headers = array_map('strtolower', array_map('trim', $rows[0]));
    $requiredHeaders = ['name', 'price', 'stock_quantity'];
    
    foreach ($requiredHeaders as $header) {
        if (!in_array($header, $headers)) {
            throw new Exception("Missing required column: $header");
        }
    }

    $db = new Database();
    $conn = $db->getConnection();
    $conn->beginTransaction();

    $successCount = 0;
    $errorCount = 0;
    $errors = [];

    // Process data rows
    for ($i = 1; $i < count($rows); $i++) {
        $row = $rows[$i];
        
        // Skip empty rows
        if (empty(array_filter($row))) {
            continue;
        }

        $data = [];
        foreach ($headers as $index => $header) {
            $data[$header] = isset($row[$index]) ? trim($row[$index]) : '';
        }

        try {
            // Validate required fields
            if (empty($data['name']) || empty($data['price']) || !isset($data['stock_quantity'])) {
                throw new Exception("Row " . ($i + 1) . ": Missing required fields");
            }

            // Generate slug
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['name'])));
            $baseSlug = $slug;
            $counter = 1;
            while (true) {
                $stmt = $conn->prepare("SELECT id FROM products WHERE slug = ?");
                $stmt->execute([$slug]);
                if (!$stmt->fetch()) {
                    break;
                }
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            // Get category ID if category name provided
            $categoryId = null;
            if (!empty($data['category'])) {
                $stmt = $conn->prepare("SELECT id FROM categories WHERE name = ? OR slug = ? LIMIT 1");
                $stmt->execute([$data['category'], strtolower(str_replace(' ', '-', $data['category']))]);
                $category = $stmt->fetch();
                if ($category) {
                    $categoryId = $category['id'];
                }
            }

            // Insert product
            $stmt = $conn->prepare("
                INSERT INTO products (
                    name, slug, description, short_description, sku, price, discount_price,
                    stock_quantity, category_id, age_group, material, badge, is_featured
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $data['name'],
                $slug,
                $data['description'] ?? null,
                $data['short_description'] ?? null,
                $data['sku'] ?? null,
                $data['price'],
                $data['discount_price'] ?? null,
                $data['stock_quantity'],
                $categoryId,
                $data['age_group'] ?? null,
                $data['material'] ?? null,
                $data['badge'] ?? null,
                isset($data['is_featured']) && strtolower($data['is_featured']) === 'yes' ? 1 : 0
            ]);

            $successCount++;

        } catch (Exception $e) {
            $errorCount++;
            $errors[] = "Row " . ($i + 1) . ": " . $e->getMessage();
        }
    }

    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => "Import completed. Success: $successCount, Errors: $errorCount",
        'success_count' => $successCount,
        'error_count' => $errorCount,
        'errors' => $errors
    ]);

} catch (Exception $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

