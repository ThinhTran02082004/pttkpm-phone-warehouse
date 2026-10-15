const pool = require('../../config/database');
const ApiError = require('../../utils/api-error');

function ensureUniqueImeis(items) {
  const seen = new Set();

  for (const item of items) {
    for (const imei of item.imeis || []) {
      const normalized = String(imei || '').trim();
      if (seen.has(normalized)) {
        throw new ApiError(409, `Duplicate IMEI in request: ${normalized}`);
      }
      seen.add(normalized);
    }
  }
}

async function listExports() {
  const [rows] = await pool.query(
    `
      SELECT
        so.id,
        so.code,
        so.sold_at AS soldAt,
        so.status,
        so.notes,
        so.total_amount AS totalAmount,
        c.id AS customerId,
        c.code AS customerCode,
        c.full_name AS customerName,
        e.id AS createdByEmployeeId,
        e.full_name AS createdByEmployeeName,
        COUNT(DISTINCT soi.id) AS lineCount,
        COUNT(DISTINCT ii.id) AS inventoryItemCount
      FROM sales_orders so
      LEFT JOIN customers c ON c.id = so.customer_id
      INNER JOIN employees e ON e.id = so.created_by_employee_id
      LEFT JOIN sales_order_items soi ON soi.sales_order_id = so.id
      LEFT JOIN inventory_items ii ON ii.sales_order_item_id = soi.id
      GROUP BY
        so.id,
        so.code,
        so.sold_at,
        so.status,
        so.notes,
        so.total_amount,
        c.id,
        c.code,
        c.full_name,
        e.id,
        e.full_name
      ORDER BY so.id DESC
    `
  );

  return rows.map((row) => ({
    ...row,
    totalAmount: Number(row.totalAmount),
    lineCount: Number(row.lineCount),
    inventoryItemCount: Number(row.inventoryItemCount),
  }));
}

async function createExportOrder(payload, currentUser) {
  const { code, customerId, soldAt, notes, items } = payload;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Export order must contain at least one item');
  }

  ensureUniqueImeis(items);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [[existingOrder]] = await connection.query(
      'SELECT id FROM sales_orders WHERE code = ? LIMIT 1',
      [code]
    );
    if (existingOrder) {
      throw new ApiError(409, 'Export order code already exists');
    }

    if (customerId) {
      const [[customer]] = await connection.query(
        'SELECT id FROM customers WHERE id = ? LIMIT 1',
        [customerId]
      );
      if (!customer) {
        throw new ApiError(404, 'Customer not found');
      }
    }

    let totalAmount = 0;
    for (const item of items) {
      totalAmount += Number(item.unitPrice) * (item.imeis || []).length;
    }

    const [salesOrderResult] = await connection.query(
      `
        INSERT INTO sales_orders (
          code,
          customer_id,
          created_by_employee_id,
          sold_at,
          status,
          notes,
          total_amount
        ) VALUES (?, ?, ?, ?, 'completed', ?, ?)
      `,
      [
        code,
        customerId || null,
        currentUser.employee.id,
        soldAt || new Date(),
        notes || null,
        totalAmount,
      ]
    );

    for (const item of items) {
      const imeis = (item.imeis || []).map((imei) => String(imei || '').trim());
      if (imeis.length === 0) {
        throw new ApiError(400, 'Each export item must contain at least one IMEI');
      }

      const [inventoryRows] = await connection.query(
        `
          SELECT
            id,
            variant_id AS variantId,
            imei,
            item_status AS itemStatus
          FROM inventory_items
          WHERE imei IN (?)
          FOR UPDATE
        `,
        [imeis]
      );

      if (inventoryRows.length !== imeis.length) {
        const foundImeis = new Set(inventoryRows.map((row) => row.imei));
        const missingImei = imeis.find((imei) => !foundImeis.has(imei));
        throw new ApiError(404, `Inventory item not found: ${missingImei}`);
      }

      const mismatchedVariant = inventoryRows.find(
        (inventoryRow) => Number(inventoryRow.variantId) !== Number(item.variantId)
      );
      if (mismatchedVariant) {
        throw new ApiError(
          409,
          `IMEI does not belong to the requested variant: ${mismatchedVariant.imei}`
        );
      }

      const unavailableItem = inventoryRows.find(
        (inventoryRow) => inventoryRow.itemStatus !== 'in_stock'
      );
      if (unavailableItem) {
        throw new ApiError(409, `IMEI is not available for export: ${unavailableItem.imei}`);
      }

      const quantity = inventoryRows.length;
      const lineTotal = Number(item.unitPrice) * quantity;

      const [salesOrderItemResult] = await connection.query(
        `
          INSERT INTO sales_order_items (
            sales_order_id,
            variant_id,
            quantity,
            unit_price,
            line_total
          ) VALUES (?, ?, ?, ?, ?)
        `,
        [salesOrderResult.insertId, item.variantId, quantity, item.unitPrice, lineTotal]
      );

      const inventoryIds = inventoryRows.map((inventoryRow) => inventoryRow.id);
      await connection.query(
        `
          UPDATE inventory_items
          SET
            sales_order_item_id = ?,
            item_status = 'sold',
            sold_at = ?,
            notes = ?
          WHERE id IN (?)
        `,
        [
          salesOrderItemResult.insertId,
          soldAt || new Date(),
          `Da xuat ban theo phieu ${code}`,
          inventoryIds,
        ]
      );

      for (const inventoryRow of inventoryRows) {
        await connection.query(
          `
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
            ) VALUES (?, ?, 'export', 'sales_order', ?, 1, ?, 'sold', ?, ?)
          `,
          [
            inventoryRow.id,
            item.variantId,
            salesOrderResult.insertId,
            inventoryRow.itemStatus,
            `Xuat kho tu phieu ${code}`,
            currentUser.employee.id,
          ]
        );
      }
    }

    await connection.commit();

    const [rows] = await connection.query(
      `
        SELECT
          id,
          code,
          customer_id AS customerId,
          created_by_employee_id AS createdByEmployeeId,
          sold_at AS soldAt,
          status,
          notes,
          total_amount AS totalAmount
        FROM sales_orders
        WHERE id = ?
      `,
      [salesOrderResult.insertId]
    );

    return {
      ...rows[0],
      totalAmount: Number(rows[0].totalAmount),
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  listExports,
  createExportOrder,
};
