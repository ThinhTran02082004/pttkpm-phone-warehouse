const pool = require('../../config/database');
const ApiError = require('../../utils/api-error');

function addMonths(dateInput, months) {
  const date = new Date(dateInput);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

function ensureUniqueImeis(items) {
  const seen = new Set();

  for (const item of items) {
    const imeis = normalizeImeis(item.imeis);

    if (imeis.length === 0) {
      throw new ApiError(400, 'Each import item must contain at least one IMEI');
    }

    for (const normalized of imeis) {
      if (seen.has(normalized)) {
        throw new ApiError(409, `Duplicate IMEI in request: ${normalized}`);
      }
      seen.add(normalized);
    }
  }
}

function normalizeImeis(imeis) {
  return (imeis || [])
    .map((imei) => String(imei || '').trim())
    .filter(Boolean);
}

async function listImports() {
  const [rows] = await pool.query(
    `
      SELECT
        po.id,
        po.code,
        po.ordered_at AS orderedAt,
        po.received_at AS receivedAt,
        po.status,
        po.notes,
        po.total_amount AS totalAmount,
        s.id AS supplierId,
        s.code AS supplierCode,
        s.name AS supplierName,
        e.id AS createdByEmployeeId,
        e.full_name AS createdByEmployeeName,
        COUNT(DISTINCT poi.id) AS lineCount,
        COUNT(DISTINCT ii.id) AS inventoryItemCount
      FROM purchase_orders po
      INNER JOIN suppliers s ON s.id = po.supplier_id
      INNER JOIN employees e ON e.id = po.created_by_employee_id
      LEFT JOIN purchase_order_items poi ON poi.purchase_order_id = po.id
      LEFT JOIN inventory_items ii ON ii.purchase_order_item_id = poi.id
      GROUP BY
        po.id,
        po.code,
        po.ordered_at,
        po.received_at,
        po.status,
        po.notes,
        po.total_amount,
        s.id,
        s.code,
        s.name,
        e.id,
        e.full_name
      ORDER BY po.id DESC
    `
  );

  return rows.map((row) => ({
    ...row,
    totalAmount: Number(row.totalAmount),
    lineCount: Number(row.lineCount),
    inventoryItemCount: Number(row.inventoryItemCount),
  }));
}

async function createImportOrder(payload, currentUser) {
  const { code, supplierId, orderedAt, receivedAt, notes, items } = payload;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Import order must contain at least one item');
  }

  ensureUniqueImeis(items);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [[existingOrder]] = await connection.query(
      'SELECT id FROM purchase_orders WHERE code = ? LIMIT 1',
      [code]
    );
    if (existingOrder) {
      throw new ApiError(409, 'Import order code already exists');
    }

    const [[supplier]] = await connection.query(
      'SELECT id FROM suppliers WHERE id = ? LIMIT 1',
      [supplierId]
    );
    if (!supplier) {
      throw new ApiError(404, 'Supplier not found');
    }

    let totalAmount = 0;
    for (const item of items) {
      totalAmount += Number(item.unitCost) * normalizeImeis(item.imeis).length;
    }

    const [purchaseOrderResult] = await connection.query(
      `
        INSERT INTO purchase_orders (
          code,
          supplier_id,
          created_by_employee_id,
          ordered_at,
          received_at,
          status,
          notes,
          total_amount
        ) VALUES (?, ?, ?, ?, ?, 'completed', ?, ?)
      `,
      [
        code,
        supplierId,
        currentUser.employee.id,
        orderedAt || new Date(),
        receivedAt || orderedAt || new Date(),
        notes || null,
        totalAmount,
      ]
    );

    for (const item of items) {
      const imeis = normalizeImeis(item.imeis);

      const [[variant]] = await connection.query(
        `
          SELECT
            pv.id,
            pm.warranty_months AS warrantyMonths
          FROM product_variants pv
          INNER JOIN product_models pm ON pm.id = pv.product_model_id
          WHERE pv.id = ?
          LIMIT 1
        `,
        [item.variantId]
      );
      if (!variant) {
        throw new ApiError(404, 'Variant not found');
      }

      const [existingImeiRows] = await connection.query(
        'SELECT imei FROM inventory_items WHERE imei IN (?)',
        [imeis]
      );
      if (existingImeiRows.length > 0) {
        throw new ApiError(409, `IMEI already exists: ${existingImeiRows[0].imei}`);
      }

      const quantity = imeis.length;
      const lineTotal = Number(item.unitCost) * quantity;

      const [purchaseOrderItemResult] = await connection.query(
        `
          INSERT INTO purchase_order_items (
            purchase_order_id,
            variant_id,
            quantity,
            unit_cost,
            line_total
          ) VALUES (?, ?, ?, ?, ?)
        `,
        [purchaseOrderResult.insertId, item.variantId, quantity, item.unitCost, lineTotal]
      );

      for (const imei of imeis) {
        const warrantyUntil = addMonths(receivedAt || orderedAt || new Date(), variant.warrantyMonths);

        const [inventoryResult] = await connection.query(
          `
            INSERT INTO inventory_items (
              variant_id,
              purchase_order_item_id,
              imei,
              item_status,
              warranty_until,
              imported_at
            ) VALUES (?, ?, ?, 'in_stock', ?, ?)
          `,
          [
            item.variantId,
            purchaseOrderItemResult.insertId,
            imei,
            warrantyUntil,
            receivedAt || orderedAt || new Date(),
          ]
        );

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
            ) VALUES (?, ?, 'import', 'purchase_order', ?, 1, NULL, 'in_stock', ?, ?)
          `,
          [
            inventoryResult.insertId,
            item.variantId,
            purchaseOrderResult.insertId,
            `Nhập kho từ phiếu ${code}`,
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
          supplier_id AS supplierId,
          created_by_employee_id AS createdByEmployeeId,
          ordered_at AS orderedAt,
          received_at AS receivedAt,
          status,
          notes,
          total_amount AS totalAmount
        FROM purchase_orders
        WHERE id = ?
      `,
      [purchaseOrderResult.insertId]
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
  listImports,
  createImportOrder,
};
