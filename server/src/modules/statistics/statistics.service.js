const pool = require('../../config/database');

function buildSalesDateWhereClause(dateFilter = null) {
  if (!dateFilter) {
    return {
      clause: '',
      params: [],
    };
  }

  const clauses = [];
  const params = [];

  if (dateFilter.startDate) {
    clauses.push('sold_at >= ?');
    params.push(`${dateFilter.startDate} 00:00:00`);
  }

  if (dateFilter.endDate) {
    clauses.push('sold_at < DATE_ADD(?, INTERVAL 1 DAY)');
    params.push(dateFilter.endDate);
  }

  return {
    clause: clauses.length ? ` AND ${clauses.join(' AND ')}` : '',
    params,
  };
}

async function getDashboardSummary(dateFilter = null) {
  const { clause, params } = buildSalesDateWhereClause(dateFilter);
  const [[row]] = await pool.query(
    `
      SELECT
        (SELECT COUNT(*) FROM product_models WHERE is_active = 1) AS totalProducts,
        (SELECT COUNT(*) FROM product_variants WHERE is_active = 1) AS totalVariants,
        (SELECT COUNT(*) FROM inventory_items) AS totalInventoryItems,
        (SELECT COUNT(*) FROM inventory_items WHERE item_status = 'in_stock') AS inStockItems,
        (SELECT COUNT(*) FROM inventory_items WHERE item_status = 'sold') AS soldItems,
        (SELECT COUNT(*) FROM inventory_items WHERE item_status = 'in_service') AS inServiceItems,
        (SELECT COUNT(*) FROM suppliers WHERE is_active = 1) AS totalSuppliers,
        (SELECT COUNT(*) FROM customers WHERE is_active = 1) AS totalCustomers,
        (
          SELECT COALESCE(SUM(total_amount), 0)
          FROM sales_orders
          WHERE status = 'completed'${clause}
        ) AS totalRevenue,
        (SELECT COUNT(*) FROM service_tickets) AS totalServiceTickets
    `,
    params
  );

  return {
    totalProducts: Number(row.totalProducts),
    totalVariants: Number(row.totalVariants),
    totalInventoryItems: Number(row.totalInventoryItems),
    inStockItems: Number(row.inStockItems),
    soldItems: Number(row.soldItems),
    inServiceItems: Number(row.inServiceItems),
    totalSuppliers: Number(row.totalSuppliers),
    totalCustomers: Number(row.totalCustomers),
    totalRevenue: Number(row.totalRevenue),
    totalServiceTickets: Number(row.totalServiceTickets),
  };
}

async function getInventorySummary() {
  const [rows] = await pool.query(
    `
      SELECT
        pv.id,
        pv.code AS variantCode,
        pm.name AS productName,
        rams.size_gb AS ramGb,
        roms.size_gb AS romGb,
        colors.name AS colorName,
        COUNT(ii.id) AS totalItems,
        SUM(CASE WHEN ii.item_status = 'in_stock' THEN 1 ELSE 0 END) AS inStockItems,
        SUM(CASE WHEN ii.item_status = 'sold' THEN 1 ELSE 0 END) AS soldItems,
        SUM(CASE WHEN ii.item_status = 'in_service' THEN 1 ELSE 0 END) AS inServiceItems
      FROM product_variants pv
      INNER JOIN product_models pm ON pm.id = pv.product_model_id
      INNER JOIN rams ON rams.id = pv.ram_id
      INNER JOIN roms ON roms.id = pv.rom_id
      INNER JOIN colors ON colors.id = pv.color_id
      LEFT JOIN inventory_items ii ON ii.variant_id = pv.id
      GROUP BY
        pv.id,
        pv.code,
        pm.name,
        rams.size_gb,
        roms.size_gb,
        colors.name
      ORDER BY pv.id ASC
    `
  );

  return rows.map((row) => ({
    ...row,
    totalItems: Number(row.totalItems),
    inStockItems: Number(row.inStockItems),
    soldItems: Number(row.soldItems),
    inServiceItems: Number(row.inServiceItems),
  }));
}

async function getRevenueSummary(dateFilter = null) {
  const { clause, params } = buildSalesDateWhereClause(dateFilter);
  const [rows] = await pool.query(
    `
      SELECT
        DATE_FORMAT(sold_at, '%Y-%m-%d') AS soldDate,
        COUNT(*) AS totalOrders,
        SUM(total_amount) AS totalRevenue
      FROM sales_orders
      WHERE status = 'completed'
      ${clause}
      GROUP BY DATE(sold_at)
      ORDER BY DATE(sold_at) ASC
    `,
    params
  );

  return rows.map((row) => ({
    ...row,
    totalOrders: Number(row.totalOrders),
    totalRevenue: Number(row.totalRevenue),
  }));
}

module.exports = {
  getDashboardSummary,
  getInventorySummary,
  getRevenueSummary,
};
