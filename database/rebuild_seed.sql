SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

USE pttkpm_rebuild;

INSERT INTO roles (code, name, description) VALUES
  ('admin', 'Quản trị viên', 'Toàn quyền hệ thống'),
  ('warehouse_manager', 'Quản lý kho', 'Quản lý sản phẩm, nhập kho, xuất kho'),
  ('sales_staff', 'Nhân viên bán hàng', 'Bán hàng, xuất kho, chăm sóc khách hàng'),
  ('customer_service', 'Nhân viên CSKH', 'Tiếp nhận bảo hành và đổi trả'),
  ('accountant', 'Kế toán', 'Theo dõi báo cáo và thống kê');

INSERT INTO permissions (module_code, action_code, display_name) VALUES
  ('dashboard', 'view', 'Xem tổng quan'),
  ('roles', 'view', 'Xem nhóm quyền'),
  ('roles', 'create', 'Tạo nhóm quyền'),
  ('roles', 'update', 'Sửa nhóm quyền'),
  ('roles', 'delete', 'Xóa nhóm quyền'),
  ('accounts', 'view', 'Xem tài khoản'),
  ('accounts', 'create', 'Tạo tài khoản'),
  ('accounts', 'update', 'Sửa tài khoản'),
  ('accounts', 'delete', 'Xóa tài khoản'),
  ('employees', 'view', 'Xem nhân viên'),
  ('employees', 'create', 'Tạo nhân viên'),
  ('employees', 'update', 'Sửa nhân viên'),
  ('employees', 'delete', 'Xóa nhân viên'),
  ('product_attributes', 'view', 'Xem thuộc tính sản phẩm'),
  ('product_attributes', 'create', 'Tạo thuộc tính sản phẩm'),
  ('product_attributes', 'update', 'Sửa thuộc tính sản phẩm'),
  ('product_attributes', 'delete', 'Xóa thuộc tính sản phẩm'),
  ('products', 'view', 'Xem sản phẩm'),
  ('products', 'create', 'Tạo sản phẩm'),
  ('products', 'update', 'Sửa sản phẩm'),
  ('products', 'delete', 'Xóa sản phẩm'),
  ('suppliers', 'view', 'Xem nhà cung cấp'),
  ('suppliers', 'create', 'Tạo nhà cung cấp'),
  ('suppliers', 'update', 'Sửa nhà cung cấp'),
  ('suppliers', 'delete', 'Xóa nhà cung cấp'),
  ('customers', 'view', 'Xem khách hàng'),
  ('customers', 'create', 'Tạo khách hàng'),
  ('customers', 'update', 'Sửa khách hàng'),
  ('customers', 'delete', 'Xóa khách hàng'),
  ('imports', 'view', 'Xem phiếu nhập'),
  ('imports', 'create', 'Tạo phiếu nhập'),
  ('imports', 'update', 'Sửa phiếu nhập'),
  ('exports', 'view', 'Xem phiếu xuất'),
  ('exports', 'create', 'Tạo phiếu xuất'),
  ('exports', 'update', 'Sửa phiếu xuất'),
  ('services', 'view', 'Xem dịch vụ'),
  ('services', 'create', 'Tạo phiếu dịch vụ'),
  ('services', 'update', 'Sửa phiếu dịch vụ'),
  ('statistics', 'view', 'Xem thống kê'),
  ('statistics', 'export', 'Xuất báo cáo');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p
WHERE r.code = 'admin';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p
WHERE r.code = 'warehouse_manager'
  AND (
    (p.module_code IN ('dashboard', 'product_attributes', 'products', 'suppliers', 'customers', 'imports', 'exports') AND p.action_code IN ('view', 'create', 'update'))
    OR (p.module_code = 'statistics' AND p.action_code = 'view')
  );

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p
WHERE r.code = 'sales_staff'
  AND (
    (p.module_code IN ('dashboard', 'products', 'customers', 'exports', 'services') AND p.action_code IN ('view', 'create', 'update'))
    OR (p.module_code = 'statistics' AND p.action_code = 'view')
  );

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p
WHERE r.code = 'customer_service'
  AND (
    (p.module_code IN ('dashboard', 'customers', 'services', 'products') AND p.action_code IN ('view', 'create', 'update'))
  );

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p
WHERE r.code = 'accountant'
  AND (
    (p.module_code IN ('dashboard', 'statistics', 'imports', 'exports', 'customers', 'suppliers') AND p.action_code IN ('view', 'export'))
  );

INSERT INTO employees (code, full_name, gender, date_of_birth, phone, email, address) VALUES
  ('EMP001', 'Nguyễn Thị Mai', 'female', '1993-04-15', '0912345678', 'maitn@company.com', 'Quận 1, TP.HCM'),
  ('EMP002', 'Trần Văn Nam', 'male', '1991-06-20', '0912345679', 'namtv@company.com', 'Quận 9, TP.HCM'),
  ('EMP003', 'Lê Thị Hoa', 'female', '1994-09-10', '0912345680', 'hoalt@company.com', 'Thủ Đức, TP.HCM'),
  ('EMP004', 'Phạm Văn Tuấn', 'male', '1990-11-05', '0912345681', 'tuanpv@company.com', 'Quận 10, TP.HCM'),
  ('EMP005', 'Hoàng Thị Lan', 'female', '1992-02-28', '0912345682', 'lanht@company.com', 'Gò Vấp, TP.HCM');

INSERT INTO accounts (employee_id, role_id, username, password_hash, status) VALUES
  (1, 1, 'admin', '$2b$10$8NH6H4fHtwUvPOXGYUyv3eQodLo.tLnxRY8REUX62XRardgUWuN1K', 'active'),
  (2, 2, 'warehouse01', '$2b$10$8NH6H4fHtwUvPOXGYUyv3eQodLo.tLnxRY8REUX62XRardgUWuN1K', 'active'),
  (3, 3, 'sales01', '$2b$10$8NH6H4fHtwUvPOXGYUyv3eQodLo.tLnxRY8REUX62XRardgUWuN1K', 'active'),
  (4, 5, 'accountant01', '$2b$10$8NH6H4fHtwUvPOXGYUyv3eQodLo.tLnxRY8REUX62XRardgUWuN1K', 'active'),
  (5, 4, 'cskh01', '$2b$10$8NH6H4fHtwUvPOXGYUyv3eQodLo.tLnxRY8REUX62XRardgUWuN1K', 'active');

INSERT INTO suppliers (code, name, phone, email, address, notes) VALUES
  ('SUP001', 'Apple Việt Nam', '0901234567', 'apple@vietnam.com', 'Quận 1, TP.HCM', 'Nhà cung cấp iPhone chính'),
  ('SUP002', 'Samsung Việt Nam', '0901234568', 'samsung@vietnam.com', 'Quận 1, TP.HCM', 'Nhà cung cấp Samsung'),
  ('SUP003', 'Xiaomi Store', '0901234569', 'xiaomi@store.vn', 'Quận 5, TP.HCM', 'Nhà cung cấp Xiaomi');

INSERT INTO customers (code, full_name, phone, email, date_of_birth, address) VALUES
  ('CUS001', 'Nguyễn Văn A', '0987654321', 'nguyenvana@gmail.com', '1990-05-15', 'Quận 9, TP.HCM'),
  ('CUS002', 'Trần Thị B', '0987654322', 'tranthib@gmail.com', '1995-08-20', 'Thủ Đức, TP.HCM'),
  ('CUS003', 'Lê Văn C', '0987654323', 'levanc@gmail.com', '1988-03-10', 'Gò Vấp, TP.HCM');

INSERT INTO brands (code, name) VALUES
  ('apple', 'Apple'),
  ('samsung', 'Samsung'),
  ('xiaomi', 'Xiaomi'),
  ('oppo', 'Oppo');

INSERT INTO origins (code, name) VALUES
  ('vn', 'Việt Nam'),
  ('cn', 'Trung Quốc'),
  ('kr', 'Hàn Quốc'),
  ('us', 'Mỹ');

INSERT INTO operating_systems (code, name) VALUES
  ('ios', 'iOS'),
  ('android', 'Android');

INSERT INTO rams (size_gb) VALUES (6), (8), (12);

INSERT INTO roms (size_gb) VALUES (128), (256), (512);

INSERT INTO colors (code, name) VALUES
  ('black', 'Đen'),
  ('white', 'Trắng'),
  ('gold', 'Vàng'),
  ('blue', 'Xanh');

INSERT INTO product_models (
  code,
  name,
  brand_id,
  origin_id,
  operating_system_id,
  chipset,
  battery_capacity_mah,
  screen_size_inches,
  front_camera_mp,
  rear_camera_mp,
  operating_system_version,
  warranty_months,
  image_path,
  description
) VALUES
  ('IP14PM', 'iPhone 14 Pro Max', 1, 4, 1, 'A16 Bionic', 4323, 6.70, 12, 48, 'iOS 16', 12, '/api/images/products/iphone14promax.png', 'Mẫu điện thoại cao cấp của Apple'),
  ('SGS23U', 'Samsung Galaxy S23 Ultra', 2, 3, 2, 'Snapdragon 8 Gen 2', 5000, 6.80, 12, 200, 'Android 13', 12, '/api/images/products/galaxys23ultra.png', 'Mẫu flagship Samsung'),
  ('XRN12', 'Xiaomi Redmi Note 12', 3, 2, 2, 'Snapdragon 685', 5000, 6.67, 13, 48, 'Android 12', 12, '/api/images/products/redminote12.png', 'Mẫu tầm trung của Xiaomi'),
  ('OPR8P', 'Oppo Reno 8 Pro', 4, 2, 2, 'MediaTek Dimensity 8100', 4500, 6.70, 32, 50, 'Android 12', 12, '/api/images/products/opporeno8pro.png', 'Mẫu Oppo phân khúc cận cao cấp');

INSERT INTO product_variants (
  code,
  product_model_id,
  ram_id,
  rom_id,
  color_id,
  purchase_price,
  selling_price
) VALUES
  ('IP14PM-8-256-BLACK', 1, 2, 2, 1, 25000000, 29990000),
  ('IP14PM-8-512-GOLD', 1, 2, 3, 3, 28000000, 32990000),
  ('SGS23U-12-256-BLACK', 2, 3, 2, 1, 22000000, 26990000),
  ('SGS23U-12-512-WHITE', 2, 3, 3, 2, 24000000, 28990000),
  ('XRN12-8-128-BLUE', 3, 2, 1, 4, 5000000, 5990000),
  ('OPR8P-12-256-BLACK', 4, 3, 2, 1, 12000000, 14990000);

INSERT INTO purchase_orders (code, supplier_id, created_by_employee_id, ordered_at, received_at, status, notes, total_amount) VALUES
  ('PO0001', 1, 2, '2026-03-01 08:30:00', '2026-03-01 09:00:00', 'completed', 'Nhập lô iPhone đầu tháng', 82990000),
  ('PO0002', 2, 2, '2026-03-05 10:15:00', '2026-03-05 11:00:00', 'completed', 'Nhập lô Samsung', 73000000),
  ('PO0003', 3, 2, '2026-03-10 13:45:00', '2026-03-10 14:10:00', 'completed', 'Nhập lô Xiaomi và Oppo', 22000000);

INSERT INTO purchase_order_items (purchase_order_id, variant_id, quantity, unit_cost, line_total) VALUES
  (1, 1, 2, 25000000, 50000000),
  (1, 2, 1, 32990000, 32990000),
  (2, 3, 2, 22000000, 44000000),
  (2, 4, 1, 29000000, 29000000),
  (3, 5, 2, 5000000, 10000000),
  (3, 6, 1, 12000000, 12000000);

INSERT INTO sales_orders (code, customer_id, created_by_employee_id, sold_at, status, notes, total_amount) VALUES
  ('SO0001', 1, 3, '2026-03-08 10:30:00', 'completed', 'Bán iPhone 14 Pro Max', 29990000),
  ('SO0002', 2, 3, '2026-03-12 15:20:00', 'completed', 'Bán iPhone và Samsung', 59989000);

INSERT INTO sales_order_items (sales_order_id, variant_id, quantity, unit_price, line_total) VALUES
  (1, 1, 1, 29990000, 29990000),
  (2, 2, 1, 32990000, 32990000),
  (2, 3, 1, 26999000, 26999000);

INSERT INTO inventory_items (
  variant_id,
  purchase_order_item_id,
  sales_order_item_id,
  imei,
  item_status,
  warranty_until,
  imported_at,
  sold_at,
  notes
) VALUES
  (1, 1, 1, '353123456789001', 'sold', '2027-03-08', '2026-03-01 09:00:00', '2026-03-08 10:30:00', 'Đã bán cho khách hàng CUS001'),
  (1, 1, NULL, '353123456789002', 'in_stock', '2027-03-01', '2026-03-01 09:00:00', NULL, 'Tồn kho sẵn sàng bán'),
  (2, 2, 2, '353123456789003', 'in_service', '2027-03-12', '2026-03-01 09:00:00', '2026-03-12 15:20:00', 'Đang tiếp nhận bảo hành'),
  (3, 3, 3, '352234567890001', 'sold', '2027-03-12', '2026-03-05 11:00:00', '2026-03-12 15:20:00', 'Đã bán cho khách hàng CUS002'),
  (3, 3, NULL, '352234567890002', 'in_stock', '2027-03-05', '2026-03-05 11:00:00', NULL, 'Tồn kho'),
  (4, 4, NULL, '352234567890003', 'in_stock', '2027-03-05', '2026-03-05 11:00:00', NULL, 'Tồn kho'),
  (5, 5, NULL, '351345678901001', 'in_stock', '2027-03-10', '2026-03-10 14:10:00', NULL, 'Tồn kho'),
  (5, 5, NULL, '351345678901002', 'in_stock', '2027-03-10', '2026-03-10 14:10:00', NULL, 'Tồn kho'),
  (6, 6, NULL, '350456789012001', 'in_stock', '2027-03-10', '2026-03-10 14:10:00', NULL, 'Tồn kho');

INSERT INTO service_tickets (
  code,
  inventory_item_id,
  customer_id,
  sales_order_id,
  received_by_employee_id,
  handled_by_employee_id,
  ticket_type,
  status,
  issue_description,
  resolution_summary,
  replacement_inventory_item_id,
  refund_amount,
  received_at,
  completed_at
) VALUES
  ('SV0001', 3, 2, 2, 5, 5, 'warranty', 'processing', 'Khách hàng phản ánh máy nóng và hao pin nhanh', NULL, NULL, 0, '2026-03-15 09:30:00', NULL);

INSERT INTO stock_movements (
  inventory_item_id,
  variant_id,
  movement_type,
  reference_type,
  reference_id,
  quantity,
  before_status,
  after_status,
  note,
  created_by_employee_id
) VALUES
  (1, 1, 'import', 'purchase_order', 1, 1, NULL, 'in_stock', 'Nhập kho từ PO0001', 2),
  (2, 1, 'import', 'purchase_order', 1, 1, NULL, 'in_stock', 'Nhập kho từ PO0001', 2),
  (3, 2, 'import', 'purchase_order', 1, 1, NULL, 'in_stock', 'Nhập kho từ PO0001', 2),
  (4, 3, 'import', 'purchase_order', 2, 1, NULL, 'in_stock', 'Nhập kho từ PO0002', 2),
  (5, 3, 'import', 'purchase_order', 2, 1, NULL, 'in_stock', 'Nhập kho từ PO0002', 2),
  (6, 4, 'import', 'purchase_order', 2, 1, NULL, 'in_stock', 'Nhập kho từ PO0002', 2),
  (7, 5, 'import', 'purchase_order', 3, 1, NULL, 'in_stock', 'Nhập kho từ PO0003', 2),
  (8, 5, 'import', 'purchase_order', 3, 1, NULL, 'in_stock', 'Nhập kho từ PO0003', 2),
  (9, 6, 'import', 'purchase_order', 3, 1, NULL, 'in_stock', 'Nhập kho từ PO0003', 2),
  (1, 1, 'export', 'sales_order', 1, 1, 'in_stock', 'sold', 'Xuất bán theo SO0001', 3),
  (3, 2, 'export', 'sales_order', 2, 1, 'in_stock', 'sold', 'Xuất bán theo SO0002', 3),
  (4, 3, 'export', 'sales_order', 2, 1, 'in_stock', 'sold', 'Xuất bán theo SO0002', 3),
  (3, 2, 'service_in', 'service_ticket', 1, 1, 'sold', 'in_service', 'Tiếp nhận bảo hành SV0001', 5);

INSERT INTO activity_logs (actor_account_id, module_name, action_name, target_table, target_id, metadata_json) VALUES
  (1, 'auth', 'seed_admin', 'accounts', 1, '{"message":"Seeded administrator account"}'),
  (2, 'imports', 'seed_purchase_order', 'purchase_orders', 1, '{"code":"PO0001"}'),
  (3, 'exports', 'seed_sales_order', 'sales_orders', 2, '{"code":"SO0002"}'),
  (5, 'services', 'seed_service_ticket', 'service_tickets', 1, '{"code":"SV0001"}');
