SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET GLOBAL sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''));

DROP DATABASE IF EXISTS pttkpm_rebuild;
CREATE DATABASE pttkpm_rebuild
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pttkpm_rebuild;

CREATE TABLE roles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(500) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  module_code VARCHAR(50) NOT NULL,
  action_code VARCHAR(50) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_permissions_module_action (module_code, action_code)
);

CREATE TABLE role_permissions (
  role_id INT UNSIGNED NOT NULL,
  permission_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_role_permissions_role
    FOREIGN KEY (role_id) REFERENCES roles (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_role_permissions_permission
    FOREIGN KEY (permission_id) REFERENCES permissions (id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE employees (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL DEFAULT 'male',
  date_of_birth DATE NULL,
  phone VARCHAR(20) NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  address VARCHAR(255) NULL,
  avatar_path VARCHAR(255) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id INT UNSIGNED NOT NULL UNIQUE,
  role_id INT UNSIGNED NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('active', 'inactive', 'locked') NOT NULL DEFAULT 'active',
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_accounts_employee
    FOREIGN KEY (employee_id) REFERENCES employees (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_accounts_role
    FOREIGN KEY (role_id) REFERENCES roles (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE suppliers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255) NULL UNIQUE,
  address VARCHAR(255) NULL,
  notes VARCHAR(500) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE customers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255) NULL UNIQUE,
  date_of_birth DATE NULL,
  address VARCHAR(255) NULL,
  notes VARCHAR(500) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE brands (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL UNIQUE,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE origins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL UNIQUE,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE operating_systems (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL UNIQUE,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE rams (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  size_gb INT UNSIGNED NOT NULL UNIQUE,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE roms (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  size_gb INT UNSIGNED NOT NULL UNIQUE,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE colors (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL UNIQUE,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE product_models (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  brand_id INT UNSIGNED NOT NULL,
  origin_id INT UNSIGNED NULL,
  operating_system_id INT UNSIGNED NULL,
  chipset VARCHAR(255) NULL,
  battery_capacity_mah INT UNSIGNED NULL,
  screen_size_inches DECIMAL(4,2) NULL,
  front_camera_mp INT UNSIGNED NULL,
  rear_camera_mp INT UNSIGNED NULL,
  operating_system_version VARCHAR(100) NULL,
  warranty_months INT UNSIGNED NOT NULL DEFAULT 12,
  image_path VARCHAR(255) NULL,
  description TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_models_brand
    FOREIGN KEY (brand_id) REFERENCES brands (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_product_models_origin
    FOREIGN KEY (origin_id) REFERENCES origins (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_product_models_os
    FOREIGN KEY (operating_system_id) REFERENCES operating_systems (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE product_variants (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(80) NOT NULL UNIQUE,
  product_model_id INT UNSIGNED NOT NULL,
  ram_id INT UNSIGNED NOT NULL,
  rom_id INT UNSIGNED NOT NULL,
  color_id INT UNSIGNED NOT NULL,
  purchase_price DECIMAL(12,2) NOT NULL,
  selling_price DECIMAL(12,2) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_product_variants_combo (product_model_id, ram_id, rom_id, color_id),
  CONSTRAINT fk_product_variants_model
    FOREIGN KEY (product_model_id) REFERENCES product_models (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_product_variants_ram
    FOREIGN KEY (ram_id) REFERENCES rams (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_product_variants_rom
    FOREIGN KEY (rom_id) REFERENCES roms (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_product_variants_color
    FOREIGN KEY (color_id) REFERENCES colors (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE purchase_orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  supplier_id INT UNSIGNED NOT NULL,
  created_by_employee_id INT UNSIGNED NOT NULL,
  ordered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  received_at DATETIME NULL,
  status ENUM('draft', 'completed', 'cancelled') NOT NULL DEFAULT 'completed',
  notes VARCHAR(500) NULL,
  total_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_purchase_orders_supplier
    FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_purchase_orders_employee
    FOREIGN KEY (created_by_employee_id) REFERENCES employees (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE purchase_order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  purchase_order_id BIGINT UNSIGNED NOT NULL,
  variant_id INT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  unit_cost DECIMAL(12,2) NOT NULL,
  line_total DECIMAL(14,2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_purchase_order_items_order
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_purchase_order_items_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE sales_orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  customer_id INT UNSIGNED NULL,
  created_by_employee_id INT UNSIGNED NOT NULL,
  sold_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('draft', 'completed', 'cancelled') NOT NULL DEFAULT 'completed',
  notes VARCHAR(500) NULL,
  total_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sales_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_sales_orders_employee
    FOREIGN KEY (created_by_employee_id) REFERENCES employees (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE sales_order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sales_order_id BIGINT UNSIGNED NOT NULL,
  variant_id INT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  line_total DECIMAL(14,2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sales_order_items_order
    FOREIGN KEY (sales_order_id) REFERENCES sales_orders (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_sales_order_items_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE inventory_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  variant_id INT UNSIGNED NOT NULL,
  purchase_order_item_id BIGINT UNSIGNED NOT NULL,
  sales_order_item_id BIGINT UNSIGNED NULL,
  imei VARCHAR(32) NOT NULL UNIQUE,
  item_status ENUM('in_stock', 'reserved', 'sold', 'in_service', 'returned', 'exchanged', 'damaged') NOT NULL DEFAULT 'in_stock',
  warranty_until DATE NULL,
  imported_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sold_at DATETIME NULL,
  notes VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventory_items_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_inventory_items_purchase_item
    FOREIGN KEY (purchase_order_item_id) REFERENCES purchase_order_items (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_inventory_items_sales_item
    FOREIGN KEY (sales_order_item_id) REFERENCES sales_order_items (id)
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE service_tickets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  inventory_item_id BIGINT UNSIGNED NOT NULL,
  customer_id INT UNSIGNED NULL,
  sales_order_id BIGINT UNSIGNED NULL,
  received_by_employee_id INT UNSIGNED NOT NULL,
  handled_by_employee_id INT UNSIGNED NULL,
  ticket_type ENUM('warranty', 'return', 'exchange', 'repair') NOT NULL,
  status ENUM('received', 'inspecting', 'processing', 'completed', 'rejected', 'cancelled') NOT NULL DEFAULT 'received',
  issue_description TEXT NOT NULL,
  resolution_summary TEXT NULL,
  replacement_inventory_item_id BIGINT UNSIGNED NULL,
  refund_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_service_tickets_inventory_item
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_service_tickets_customer
    FOREIGN KEY (customer_id) REFERENCES customers (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_service_tickets_sales_order
    FOREIGN KEY (sales_order_id) REFERENCES sales_orders (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_service_tickets_received_employee
    FOREIGN KEY (received_by_employee_id) REFERENCES employees (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_service_tickets_handled_employee
    FOREIGN KEY (handled_by_employee_id) REFERENCES employees (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_service_tickets_replacement_item
    FOREIGN KEY (replacement_inventory_item_id) REFERENCES inventory_items (id)
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE stock_movements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  inventory_item_id BIGINT UNSIGNED NOT NULL,
  variant_id INT UNSIGNED NOT NULL,
  movement_type ENUM('import', 'export', 'service_in', 'service_return', 'exchange_out', 'exchange_in', 'adjustment') NOT NULL,
  reference_type ENUM('purchase_order', 'sales_order', 'service_ticket', 'adjustment') NOT NULL,
  reference_id BIGINT UNSIGNED NULL,
  quantity INT NOT NULL DEFAULT 1,
  before_status VARCHAR(50) NULL,
  after_status VARCHAR(50) NOT NULL,
  note VARCHAR(500) NULL,
  created_by_employee_id INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_stock_movements_inventory_item
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_stock_movements_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_stock_movements_employee
    FOREIGN KEY (created_by_employee_id) REFERENCES employees (id)
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE activity_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_account_id INT UNSIGNED NULL,
  module_name VARCHAR(100) NOT NULL,
  action_name VARCHAR(100) NOT NULL,
  target_table VARCHAR(100) NULL,
  target_id BIGINT UNSIGNED NULL,
  metadata_json LONGTEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_logs_account
    FOREIGN KEY (actor_account_id) REFERENCES accounts (id)
    ON DELETE SET NULL ON UPDATE CASCADE
);
