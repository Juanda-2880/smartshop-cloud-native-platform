-- ============================================================================
-- Flyway Migration V2: Seed Enterprise Users, Categories, Products, Cart & Order
-- ============================================================================

INSERT INTO users (id, username, email, full_name, role, active, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'admin.smartshop', 'admin@smartshop.io', 'Elena Vance (Platform Admin)', 'ADMIN', TRUE, CURRENT_TIMESTAMP),
('22222222-2222-2222-2222-222222222222', 'manager.smartshop', 'manager@smartshop.io', 'Marcus Sterling (Catalog Manager)', 'MANAGER', TRUE, CURRENT_TIMESTAMP),
('33333333-3333-3333-3333-333333333333', 'customer.smartshop', 'customer@smartshop.io', 'Sofia Chen (Enterprise Customer)', 'CUSTOMER', TRUE, CURRENT_TIMESTAMP);

INSERT INTO categories (id, name, slug, description, active) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Cloud Edge Hardware', 'cloud-edge-hardware', 'High-density compute nodes and edge appliances for Kubernetes clusters', TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Developer Workstations', 'developer-workstations', 'Ultra-fast engineering laptops, mechanical keyboards, and 5K displays', TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Zero-Trust Security', 'zero-trust-security', 'FIDO2 hardware tokens and biometric authentication modules', TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Telemetry & Networking', 'telemetry-networking', '10GbE managed switches and hardware telemetry sensors', TRUE);

INSERT INTO products (id, sku, name, description, price, stock_quantity, category_id, category_name, image_url, featured, active, created_at) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'SKU-K8S-BLADE-01', 'SmartShop KubeBlade X1 Edge Server', 'Compact 16-core ARM64/x86 hybrid bare-metal node pre-tuned for Kubernetes 1.34 & eBPF.', 1499.00, 45, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Cloud Edge Hardware', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80', TRUE, TRUE, CURRENT_TIMESTAMP),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'SKU-DEV-PRO-16', 'LinearBook Pro 16 M-Ultra Workstation', '64GB unified memory, 2TB NVMe Gen5 SSD, nano-texture OLED display for cloud architects.', 2899.00, 20, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Developer Workstations', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80', TRUE, TRUE, CURRENT_TIMESTAMP),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'SKU-SEC-OIDC-99', 'Aegis FIDO2 OIDC Hardware Security Key', 'FIPS 140-3 Level 3 certified USB-C & NFC cryptographic key with native Keycloak 26 passkey support.', 89.00, 150, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Zero-Trust Security', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80', FALSE, TRUE, CURRENT_TIMESTAMP),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 'SKU-NET-10G-08', 'PulseCore 10GbE L3 Managed Telemetry Switch', '8-port 10G SFP+ switch with native Prometheus OpenMetrics exporter and sFlow streaming.', 649.00, 32, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Telemetry & Networking', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80', TRUE, TRUE, CURRENT_TIMESTAMP);

INSERT INTO carts (id, user_id, total_amount, updated_at) VALUES
('cccccccc-cccc-cccc-cccc-ccccccccccc1', '33333333-3333-3333-3333-333333333333', 178.00, CURRENT_TIMESTAMP);

INSERT INTO cart_items (id, cart_id, product_id, product_name, sku, unit_price, quantity, subtotal) VALUES
('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Aegis FIDO2 OIDC Hardware Security Key', 'SKU-SEC-OIDC-99', 89.00, 2, 178.00);

INSERT INTO orders (id, order_number, user_id, total_amount, status, shipping_address, created_at) VALUES
('dddddddd-dddd-dddd-dddd-ddddddddddd1', 'ORD-K8S00001', '33333333-3333-3333-3333-333333333333', 1499.00, 'DELIVERED', '742 Cloud Native Blvd, Suite 400, San Francisco, CA', CURRENT_TIMESTAMP);

INSERT INTO order_items (id, order_id, product_id, product_name, sku, unit_price, quantity, subtotal) VALUES
('dddddddd-dddd-dddd-dddd-ddddddddddd2', 'dddddddd-dddd-dddd-dddd-ddddddddddd1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'SmartShop KubeBlade X1 Edge Server', 'SKU-K8S-BLADE-01', 1499.00, 1, 1499.00);
