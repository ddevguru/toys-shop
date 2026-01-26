-- Insert All Products from Frontend into Database
-- Category IDs: 1=Cartoon Characters, 2=Superheroes, 3=Creative, 4=Educational, 5=Plush Toys

USE toy_cart_studio;

-- Creative Category Products
INSERT INTO products (name, slug, description, short_description, price, discount_price, stock_quantity, category_id, main_image, rating, review_count, age_group, material, badge, is_featured, is_active) VALUES
('Classic Wooden Train Set', 'classic-wooden-train-set', 
'A beautiful and durable wooden train set with multiple cars and tracks. Perfect for imaginative play and developing motor skills.',
'Premium wooden train set with multiple cars',
1299.00, NULL, 50, 3, '/hero-toys-1.jpg', 4.5, 60, '5-8 years', 'Eco-friendly wood', 'Best Seller', TRUE, TRUE),

('Creative Building Blocks', 'creative-building-blocks',
'Colorful building blocks that encourage creativity and spatial thinking. Safe for children and compatible with other building sets.',
'Creative building blocks set',
1499.00, 999.00, 75, 3, '/hero-toys-1.jpg', 4.6, 89, '3-5 years', 'Safe plastic', NULL, TRUE, TRUE),

('DIY Craft Kit', 'diy-craft-kit',
'Complete craft kit with all materials needed for creative projects. Includes paints, brushes, papers, and instructions.',
'Complete DIY craft kit',
1299.00, NULL, 60, 3, '/hero-toys-1.jpg', 4.3, 67, '6-12 years', 'Various craft materials', NULL, FALSE, TRUE),

('Creative Master Collection', 'creative-master-collection',
'Everything you need for imaginative building and crafting. Premium quality materials for endless creative possibilities.',
'Everything for creative building and crafting',
1899.00, NULL, 40, 3, '/hero-toys-1.jpg', 4.7, 234, '5+ years', 'Premium materials', 'Best Value', TRUE, TRUE);

-- Superhero Category Products
INSERT INTO products (name, slug, description, short_description, price, discount_price, stock_quantity, category_id, main_image, rating, review_count, age_group, material, badge, is_featured, is_active) VALUES
('Super Hero Action Squad', 'super-hero-action-squad',
'Action-packed superhero figures with multiple accessories. Perfect for role-playing and collecting.',
'Superhero action figures with accessories',
899.00, NULL, 80, 2, '/studio-collection.jpg', 4.8, 48, '6-12 years', 'Premium plastic', 'New', TRUE, TRUE),

('Superhero Action Figures', 'superhero-action-figures',
'Premium articulated superhero figures with amazing detail and multiple points of articulation for dynamic poses.',
'Premium articulated superhero figures',
1999.00, NULL, 65, 2, '/studio-collection.jpg', 4.8, 256, '8-12 years', 'Premium plastic', 'Best Seller', TRUE, TRUE),

('Premium Hero Collection', 'premium-hero-collection',
'Hand-crafted superhero figures with articulated joints. Collector-grade quality with premium packaging.',
'Hand-crafted superhero figures with articulated joints',
3499.00, NULL, 30, 2, '/hero-toys-1.jpg', 4.9, 312, '8+ years', 'Premium materials', 'Limited Edition', TRUE, TRUE),

('Collectible Heroes Pack', 'collectible-heroes-pack',
'Exclusive collection of popular superhero figures. Perfect for collectors and fans.',
'Exclusive superhero collection',
2899.00, NULL, 45, 2, '/studio-collection.jpg', 4.7, 178, '8-12 years', 'Premium plastic', 'Best Seller', TRUE, TRUE);

-- Plush Category Products
INSERT INTO products (name, slug, description, short_description, price, discount_price, stock_quantity, category_id, main_image, rating, review_count, age_group, material, badge, is_featured, is_active) VALUES
('Pastel Plush Bunny', 'pastel-plush-bunny',
'Soft and cuddly plush bunny toy in beautiful pastel colors. Perfect companion for little ones.',
'Soft and cuddly plush bunny',
599.00, NULL, 100, 5, '/hero-toys-1.jpg', 4.5, 60, '0-2 years', 'Soft fabric', 'Soft', TRUE, TRUE);

-- Educational Category Products
INSERT INTO products (name, slug, description, short_description, price, discount_price, stock_quantity, category_id, main_image, rating, review_count, age_group, material, badge, is_featured, is_active) VALUES
('Space Explorer Rocket', 'space-explorer-rocket',
'Interactive space rocket toy with lights and sounds. Educational and fun, teaching kids about space exploration.',
'Interactive space rocket with lights and sounds',
1499.00, NULL, 55, 4, '/studio-collection.jpg', 4.5, 60, '5-8 years', 'Plastic and metal', 'New', TRUE, TRUE),

('Educational Puzzle Set', 'educational-puzzle-set',
'Brain-teasing puzzle set that develops problem-solving skills and hand-eye coordination.',
'Brain-teasing educational puzzles',
899.00, NULL, 90, 4, '/studio-collection.jpg', 4.4, 145, '3-8 years', 'Cardboard and wood', NULL, TRUE, TRUE),

('Smart Learning Toys', 'smart-learning-toys',
'Interactive learning toys that make education fun. Features multiple learning modes and activities.',
'Interactive learning toys with multiple modes',
2199.00, 1699.00, 70, 4, '/studio-collection.jpg', 4.6, 203, '3-10 years', 'Electronic and plastic', 'New', TRUE, TRUE);

-- Cartoon Category Products
INSERT INTO products (name, slug, description, short_description, price, discount_price, stock_quantity, category_id, main_image, rating, review_count, age_group, material, badge, is_featured, is_active) VALUES
('Cartoon Characters Set', 'cartoon-characters-set',
'A delightful collection of colorful cartoon character figures that bring your favorite shows to life. Perfect for kids aged 5-8.',
'Colorful cartoon character figures collection',
2499.00, 1999.00, 45, 1, '/hero-toys-1.jpg', 4.5, 128, '5-8 years', 'Eco-friendly plastic and fabric', 'New', TRUE, TRUE),

('Premium Character Series', 'premium-character-series',
'Collector-grade cartoon character set with premium packaging. Highly detailed and authentic designs.',
'Collector-grade cartoon character set',
3499.00, 2799.00, 25, 1, '/hero-toys-1.jpg', 4.9, 312, '6+ years', 'Premium materials', 'Limited Edition', TRUE, TRUE),

('Deluxe Character Studio Box', 'deluxe-character-studio-box',
'Collector-grade cartoon character set with premium packaging. Includes exclusive accessories and display case.',
'Collector-grade cartoon character set with premium packaging',
2999.00, NULL, 35, 1, '/studio-collection.jpg', 4.8, 389, '6+ years', 'Premium materials', 'Top Rated', TRUE, TRUE);

-- Additional Products for Complete Store

-- More Creative Products
INSERT INTO products (name, slug, description, short_description, price, discount_price, stock_quantity, category_id, main_image, rating, review_count, age_group, material, badge, is_featured, is_active) VALUES
('Art & Drawing Set', 'art-drawing-set',
'Complete art set with crayons, markers, colored pencils, and sketchbook. Perfect for budding artists.',
'Complete art and drawing set',
799.00, NULL, 85, 3, '/hero-toys-1.jpg', 4.4, 92, '4-10 years', 'Plastic and paper', NULL, FALSE, TRUE),

('Magnetic Building Tiles', 'magnetic-building-tiles',
'Colorful magnetic tiles for building 3D structures. Develops spatial awareness and creativity.',
'3D magnetic building tiles',
1899.00, 1499.00, 55, 3, '/studio-collection.jpg', 4.7, 156, '3-8 years', 'Plastic and magnets', 'New', TRUE, TRUE),

('Pottery Wheel Kit', 'pottery-wheel-kit',
'Beginner-friendly pottery wheel with clay and tools. Create beautiful ceramic pieces.',
'Pottery wheel with clay and tools',
2499.00, NULL, 30, 3, '/hero-toys-1.jpg', 4.6, 78, '8+ years', 'Plastic and ceramic', NULL, FALSE, TRUE);

-- More Superhero Products
INSERT INTO products (name, slug, description, short_description, price, discount_price, stock_quantity, category_id, main_image, rating, review_count, age_group, material, badge, is_featured, is_active) VALUES
('Superhero Mask Set', 'superhero-mask-set',
'Collection of popular superhero masks with capes. Perfect for dress-up and role play.',
'Superhero masks and capes set',
699.00, NULL, 95, 2, '/studio-collection.jpg', 4.3, 112, '4-10 years', 'Fabric and plastic', NULL, FALSE, TRUE),

('Hero Battle Arena', 'hero-battle-arena',
'Interactive battle arena playset with multiple heroes and villains. Includes accessories and vehicles.',
'Interactive superhero battle playset',
3999.00, 3299.00, 25, 2, '/hero-toys-1.jpg', 4.8, 201, '6-12 years', 'Plastic', 'Best Seller', TRUE, TRUE),

('Villain Collection Set', 'villain-collection-set',
'Collectible villain figures with detailed accessories. Perfect for completing your superhero collection.',
'Collectible villain figures set',
1799.00, NULL, 40, 2, '/studio-collection.jpg', 4.5, 134, '8+ years', 'Premium plastic', NULL, FALSE, TRUE);

-- More Plush Products
INSERT INTO products (name, slug, description, short_description, price, discount_price, stock_quantity, category_id, main_image, rating, review_count, age_group, material, badge, is_featured, is_active) VALUES
('Giant Teddy Bear', 'giant-teddy-bear',
'Extra large cuddly teddy bear. Perfect for hugs and bedtime companion.',
'Extra large cuddly teddy bear',
1299.00, NULL, 35, 5, '/hero-toys-1.jpg', 4.6, 89, '0-5 years', 'Soft plush fabric', 'Soft', TRUE, TRUE),

('Plush Animal Collection', 'plush-animal-collection',
'Set of 6 adorable plush animals including bear, bunny, elephant, and more.',
'Set of 6 plush animals',
1499.00, 1199.00, 60, 5, '/studio-collection.jpg', 4.5, 167, '0-3 years', 'Soft fabric', 'New', TRUE, TRUE),

('Musical Plush Toy', 'musical-plush-toy',
'Interactive plush toy that plays lullabies and soothing sounds. Perfect for bedtime.',
'Musical plush with lullabies',
899.00, NULL, 70, 5, '/hero-toys-1.jpg', 4.4, 98, '0-2 years', 'Soft fabric and electronics', NULL, FALSE, TRUE);

-- More Educational Products
INSERT INTO products (name, slug, description, short_description, price, discount_price, stock_quantity, category_id, main_image, rating, review_count, age_group, material, badge, is_featured, is_active) VALUES
('Science Experiment Kit', 'science-experiment-kit',
'Fun science experiments for kids. Includes safe chemicals and detailed instructions.',
'Safe science experiments kit',
1599.00, NULL, 50, 4, '/studio-collection.jpg', 4.6, 145, '8-14 years', 'Plastic and chemicals', NULL, TRUE, TRUE),

('Math Learning Board', 'math-learning-board',
'Interactive math board with numbers and operations. Makes learning math fun and engaging.',
'Interactive math learning board',
1299.00, 999.00, 65, 4, '/hero-toys-1.jpg', 4.5, 123, '5-10 years', 'Wood and magnets', 'New', TRUE, TRUE),

('World Map Puzzle', 'world-map-puzzle',
'Large world map puzzle with 500 pieces. Educational and fun geography learning.',
'500 piece world map puzzle',
899.00, NULL, 80, 4, '/studio-collection.jpg', 4.4, 156, '6-12 years', 'Cardboard', NULL, FALSE, TRUE),

('Coding Robot Kit', 'coding-robot-kit',
'Programmable robot that teaches coding basics. Perfect introduction to STEM learning.',
'Programmable coding robot',
2999.00, 2499.00, 35, 4, '/hero-toys-1.jpg', 4.8, 189, '8+ years', 'Plastic and electronics', 'Best Seller', TRUE, TRUE);

-- More Cartoon Products
INSERT INTO products (name, slug, description, short_description, price, discount_price, stock_quantity, category_id, main_image, rating, review_count, age_group, material, badge, is_featured, is_active) VALUES
('Animated Character Plush', 'animated-character-plush',
'Official licensed plush toys of popular cartoon characters. Soft and huggable.',
'Official cartoon character plush',
799.00, NULL, 90, 1, '/studio-collection.jpg', 4.5, 203, '3-8 years', 'Soft plush', NULL, FALSE, TRUE),

('Cartoon Playhouse', 'cartoon-playhouse',
'Large playhouse featuring favorite cartoon characters. Perfect for imaginative play.',
'Cartoon character playhouse',
4999.00, 3999.00, 15, 1, '/hero-toys-1.jpg', 4.7, 67, '3-8 years', 'Fabric and plastic', 'Limited Edition', TRUE, TRUE),

('Character Action Playset', 'character-action-playset',
'Action-packed playset with cartoon characters, vehicles, and accessories.',
'Cartoon character action playset',
2299.00, NULL, 45, 1, '/studio-collection.jpg', 4.6, 134, '5-10 years', 'Plastic', NULL, TRUE, TRUE);

-- Outdoor Category Products
INSERT INTO products (name, slug, description, short_description, price, discount_price, stock_quantity, category_id, main_image, rating, review_count, age_group, material, badge, is_featured, is_active) VALUES
('Kids Bicycle', 'kids-bicycle',
'Sturdy and safe bicycle for kids. Adjustable seat and training wheels included.',
'Kids bicycle with training wheels',
3499.00, 2999.00, 20, 6, '/hero-toys-1.jpg', 4.7, 89, '4-8 years', 'Metal and rubber', 'Best Seller', TRUE, TRUE),

('Scooter Set', 'scooter-set',
'3-wheel scooter with safety features. Perfect for outdoor fun and exercise.',
'3-wheel safety scooter',
1299.00, NULL, 55, 6, '/studio-collection.jpg', 4.5, 112, '3-8 years', 'Metal and plastic', NULL, TRUE, TRUE),

('Outdoor Play Tent', 'outdoor-play-tent',
'Colorful play tent for backyard adventures. Easy to set up and fold.',
'Outdoor play tent',
1999.00, 1599.00, 40, 6, '/hero-toys-1.jpg', 4.6, 78, '3-10 years', 'Fabric and poles', 'New', TRUE, TRUE),

('Water Play Table', 'water-play-table',
'Interactive water play table with accessories. Perfect for summer fun.',
'Water play table with accessories',
2499.00, NULL, 30, 6, '/studio-collection.jpg', 4.4, 95, '2-6 years', 'Plastic', NULL, FALSE, TRUE),

('Soccer Ball Set', 'soccer-ball-set',
'Complete soccer set with ball, goal, and cones. Perfect for outdoor sports.',
'Soccer ball and goal set',
899.00, NULL, 75, 6, '/hero-toys-1.jpg', 4.5, 134, '5-12 years', 'Rubber and fabric', NULL, FALSE, TRUE);

-- Update product images to JSON format
UPDATE products SET images = JSON_ARRAY(main_image) WHERE images IS NULL;

