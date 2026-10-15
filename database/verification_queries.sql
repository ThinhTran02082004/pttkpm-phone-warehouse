USE pttkpm_rebuild;

SELECT 'roles_count' AS metric, COUNT(*) AS value FROM roles
UNION ALL
SELECT 'permissions_count', COUNT(*) FROM permissions
UNION ALL
SELECT 'employees_count', COUNT(*) FROM employees
UNION ALL
SELECT 'accounts_count', COUNT(*) FROM accounts
UNION ALL
SELECT 'suppliers_count', COUNT(*) FROM suppliers
UNION ALL
SELECT 'customers_count', COUNT(*) FROM customers
UNION ALL
SELECT 'product_models_count', COUNT(*) FROM product_models
UNION ALL
SELECT 'product_variants_count', COUNT(*) FROM product_variants
UNION ALL
SELECT 'inventory_items_count', COUNT(*) FROM inventory_items
UNION ALL
SELECT 'purchase_orders_count', COUNT(*) FROM purchase_orders
UNION ALL
SELECT 'sales_orders_count', COUNT(*) FROM sales_orders
UNION ALL
SELECT 'service_tickets_count', COUNT(*) FROM service_tickets;

SELECT imei, COUNT(*) AS occurrences
FROM inventory_items
GROUP BY imei
HAVING COUNT(*) > 1;

SELECT item_status, COUNT(*) AS item_count
FROM inventory_items
GROUP BY item_status
ORDER BY item_status;

SELECT
  pv.code AS variant_code,
  SUM(CASE WHEN ii.item_status = 'in_stock' THEN 1 ELSE 0 END) AS in_stock_count,
  SUM(CASE WHEN ii.item_status = 'sold' THEN 1 ELSE 0 END) AS sold_count,
  SUM(CASE WHEN ii.item_status = 'in_service' THEN 1 ELSE 0 END) AS in_service_count
FROM product_variants pv
LEFT JOIN inventory_items ii ON ii.variant_id = pv.id
GROUP BY pv.id, pv.code
ORDER BY pv.code;

SELECT
  so.code AS sales_order_code,
  SUM(soi.line_total) AS order_total,
  COUNT(ii.id) AS linked_imei_count
FROM sales_orders so
LEFT JOIN sales_order_items soi ON soi.sales_order_id = so.id
LEFT JOIN inventory_items ii ON ii.sales_order_item_id = soi.id
GROUP BY so.id, so.code
ORDER BY so.code;
