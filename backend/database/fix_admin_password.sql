-- Fix Admin Password
-- This will update the admin password to match 'admin123'

USE toy_cart_studio;

-- Update admin password hash (password: admin123)
UPDATE users 
SET password_hash = '$2y$10$5p68LP6mbJBRiaEv7DpYA.L/PjjueZscSWfOshwTgh.NmYbluKO5S'
WHERE email = 'admin@toycartstudio.com' OR username = 'admin';

-- Or create admin if doesn't exist
INSERT INTO users (username, email, password_hash, name, role, is_active) 
VALUES ('admin', 'admin@toycartstudio.com', '$2y$10$5p68LP6mbJBRiaEv7DpYA.L/PjjueZscSWfOshwTgh.NmYbluKO5S', 'Admin User', 'admin', TRUE)
ON DUPLICATE KEY UPDATE 
    password_hash = '$2y$10$5p68LP6mbJBRiaEv7DpYA.L/PjjueZscSWfOshwTgh.NmYbluKO5S',
    is_active = TRUE;

-- Verify admin user
SELECT id, username, email, name, role, is_active FROM users WHERE username = 'admin' OR email = 'admin@toycartstudio.com';

