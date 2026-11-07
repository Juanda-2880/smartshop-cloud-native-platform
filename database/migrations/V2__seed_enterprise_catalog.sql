-- Reference Copy in database/migrations/V2__seed_enterprise_catalog.sql
-- Synchronized with backend/src/main/resources/db/migration/V2__seed_enterprise_catalog.sql

INSERT INTO users (id, username, email, full_name, role, active, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'admin.smartshop', 'admin@smartshop.io', 'Elena Vance (Platform Admin)', 'ADMIN', TRUE, CURRENT_TIMESTAMP),
('22222222-2222-2222-2222-222222222222', 'manager.smartshop', 'manager@smartshop.io', 'Marcus Sterling (Catalog Manager)', 'MANAGER', TRUE, CURRENT_TIMESTAMP),
('33333333-3333-3333-3333-333333333333', 'customer.smartshop', 'customer@smartshop.io', 'Sofia Chen (Enterprise Customer)', 'CUSTOMER', TRUE, CURRENT_TIMESTAMP);
