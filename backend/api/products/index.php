<?php
/**
 * Products API - List, Get, Create, Update, Delete
 */

// Set CORS headers first
require_once __DIR__ . '/../../config/cors.php';

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$db = new Database();
$conn = $db->getConnection();

try {
    switch ($method) {
        case 'GET':
            // Get all products or single product
            if (isset($_GET['id'])) {
                // Get single product
                $stmt = $conn->prepare("
                    SELECT p.*, c.name as category_name, c.slug as category_slug
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE p.id = ? AND p.is_active = TRUE
                ");
                $stmt->execute([$_GET['id']]);
                $product = $stmt->fetch();

                if (!$product) {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'message' => 'Product not found']);
                    exit;
                }

                // Decode JSON fields
                if ($product['images']) {
                    $product['images'] = json_decode($product['images'], true);
                }
                if ($product['features']) {
                    $product['features'] = json_decode($product['features'], true);
                }

                echo json_encode(['success' => true, 'data' => $product]);
            } else {
                // Get all products with filters
                $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : ITEMS_PER_PAGE;
                $offset = ($page - 1) * $limit;
                
                $category = $_GET['category'] ?? null;
                $search = $_GET['search'] ?? null;
                $minPrice = $_GET['min_price'] ?? null;
                $maxPrice = $_GET['max_price'] ?? null;
                $featured = $_GET['featured'] ?? null;
                $sortBy = $_GET['sort_by'] ?? 'created_at';
                $sortOrder = $_GET['sort_order'] ?? 'DESC';

                $where = ["p.is_active = TRUE"];
                $params = [];

                if ($category) {
                    $where[] = "c.slug = ?";
                    $params[] = $category;
                }

                if ($search) {
                    $where[] = "(p.name LIKE ? OR p.description LIKE ?)";
                    $params[] = "%$search%";
                    $params[] = "%$search%";
                }

                if ($minPrice) {
                    $where[] = "p.price >= ?";
                    $params[] = $minPrice;
                }

                if ($maxPrice) {
                    $where[] = "p.price <= ?";
                    $params[] = $maxPrice;
                }

                if ($featured === 'true') {
                    $where[] = "p.is_featured = TRUE";
                }

                $whereClause = implode(' AND ', $where);
                $allowedSort = ['created_at', 'price', 'name', 'rating'];
                $sortBy = in_array($sortBy, $allowedSort) ? $sortBy : 'created_at';
                $sortOrder = strtoupper($sortOrder) === 'ASC' ? 'ASC' : 'DESC';

                // Get total count
                $countStmt = $conn->prepare("
                    SELECT COUNT(*) as total
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE $whereClause
                ");
                $countStmt->execute($params);
                $total = $countStmt->fetch()['total'];

                // Get products
                $stmt = $conn->prepare("
                    SELECT p.*, c.name as category_name, c.slug as category_slug
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE $whereClause
                    ORDER BY p.$sortBy $sortOrder
                    LIMIT ? OFFSET ?
                ");
                
                $params[] = $limit;
                $params[] = $offset;
                $stmt->execute($params);
                $products = $stmt->fetchAll();

                // Decode JSON fields
                foreach ($products as &$product) {
                    if ($product['images']) {
                        $product['images'] = json_decode($product['images'], true);
                    }
                    if ($product['features']) {
                        $product['features'] = json_decode($product['features'], true);
                    }
                }

                echo json_encode([
                    'success' => true,
                    'data' => $products,
                    'pagination' => [
                        'page' => $page,
                        'limit' => $limit,
                        'total' => $total,
                        'pages' => ceil($total / $limit)
                    ]
                ]);
            }
            break;

        case 'POST':
            // Create product (Admin only)
            $payload = JWT::validateToken();
            if (!$payload || $payload['role'] !== 'admin') {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Admin access required']);
                exit;
            }

            $data = json_decode(file_get_contents('php://input'), true);

            $required = ['name', 'price', 'stock_quantity'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    throw new Exception("Field '$field' is required");
                }
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

            // Handle images
            $images = [];
            $mainImage = null;
            
            if (isset($data['images']) && is_array($data['images'])) {
                $images = $data['images'];
                $mainImage = $images[0] ?? null;
            }

            // Handle file uploads
            if (isset($_FILES['images'])) {
                $uploadedImages = [];
                foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                    if ($_FILES['images']['error'][$key] === UPLOAD_ERR_OK) {
                        $file = [
                            'tmp_name' => $tmpName,
                            'name' => $_FILES['images']['name'][$key],
                            'size' => $_FILES['images']['size'][$key],
                            'type' => $_FILES['images']['type'][$key]
                        ];

                        if ($file['size'] > MAX_FILE_SIZE) {
                            continue;
                        }

                        $finfo = finfo_open(FILEINFO_MIME_TYPE);
                        $mimeType = finfo_file($finfo, $file['tmp_name']);
                        finfo_close($finfo);

                        if (!in_array($mimeType, ALLOWED_IMAGE_TYPES)) {
                            continue;
                        }

                        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
                        $filename = uniqid('product_') . '.' . $extension;
                        $uploadPath = UPLOAD_DIR . 'products/' . $filename;

                        if (!file_exists(dirname($uploadPath))) {
                            mkdir(dirname($uploadPath), 0755, true);
                        }

                        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
                            $imagePath = 'uploads/products/' . $filename;
                            $uploadedImages[] = $imagePath;
                            if (!$mainImage) {
                                $mainImage = $imagePath;
                            }
                        }
                    }
                }
                $images = array_merge($images, $uploadedImages);
            }

            $stmt = $conn->prepare("
                INSERT INTO products (
                    name, slug, description, short_description, sku, price, discount_price,
                    stock_quantity, category_id, images, main_image, age_group, material,
                    features, badge, weight, dimensions, is_featured, meta_title, meta_description
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                $data['category_id'] ?? null,
                json_encode($images),
                $mainImage,
                $data['age_group'] ?? null,
                $data['material'] ?? null,
                isset($data['features']) ? json_encode($data['features']) : null,
                $data['badge'] ?? null,
                $data['weight'] ?? null,
                $data['dimensions'] ?? null,
                $data['is_featured'] ?? false,
                $data['meta_title'] ?? null,
                $data['meta_description'] ?? null
            ]);

            $productId = $conn->lastInsertId();

            $stmt = $conn->prepare("
                SELECT p.*, c.name as category_name, c.slug as category_slug
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = ?
            ");
            $stmt->execute([$productId]);
            $product = $stmt->fetch();

            if ($product['images']) {
                $product['images'] = json_decode($product['images'], true);
            }
            if ($product['features']) {
                $product['features'] = json_decode($product['features'], true);
            }

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product
            ]);
            break;

        case 'PUT':
            // Update product (Admin only)
            $payload = JWT::validateToken();
            if (!$payload || $payload['role'] !== 'admin') {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Admin access required']);
                exit;
            }

            if (empty($_GET['id'])) {
                throw new Exception("Product ID is required");
            }

            $data = json_decode(file_get_contents('php://input'), true);

            // Build update query
            $updateFields = [];
            $params = [];

            $allowedFields = [
                'name', 'description', 'short_description', 'sku', 'price', 'discount_price',
                'stock_quantity', 'category_id', 'age_group', 'material', 'badge',
                'weight', 'dimensions', 'is_featured', 'is_active', 'meta_title', 'meta_description'
            ];

            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateFields[] = "$field = ?";
                    $params[] = $data[$field];
                }
            }

            // Handle images update
            if (isset($data['images']) && is_array($data['images'])) {
                $updateFields[] = "images = ?";
                $params[] = json_encode($data['images']);
                if (!empty($data['images'][0])) {
                    $updateFields[] = "main_image = ?";
                    $params[] = $data['images'][0];
                }
            }

            if (isset($data['features']) && is_array($data['features'])) {
                $updateFields[] = "features = ?";
                $params[] = json_encode($data['features']);
            }

            if (empty($updateFields)) {
                throw new Exception("No fields to update");
            }

            $params[] = $_GET['id'];

            $sql = "UPDATE products SET " . implode(', ', $updateFields) . " WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);

            // Get updated product
            $stmt = $conn->prepare("
                SELECT p.*, c.name as category_name, c.slug as category_slug
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = ?
            ");
            $stmt->execute([$_GET['id']]);
            $product = $stmt->fetch();

            if ($product['images']) {
                $product['images'] = json_decode($product['images'], true);
            }
            if ($product['features']) {
                $product['features'] = json_decode($product['features'], true);
            }

            echo json_encode([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $product
            ]);
            break;

        case 'DELETE':
            // Delete product (Admin only)
            $payload = JWT::validateToken();
            if (!$payload || $payload['role'] !== 'admin') {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Admin access required']);
                exit;
            }

            if (empty($_GET['id'])) {
                throw new Exception("Product ID is required");
            }

            // Soft delete - set is_active to false
            $stmt = $conn->prepare("UPDATE products SET is_active = FALSE WHERE id = ?");
            $stmt->execute([$_GET['id']]);

            echo json_encode([
                'success' => true,
                'message' => 'Product deleted successfully'
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

