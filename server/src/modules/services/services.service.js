const pool = require('../../config/database');
const ApiError = require('../../utils/api-error');

async function getServiceTicketById(connection, serviceTicketId) {
  const [rows] = await connection.query(
    `
      SELECT
        st.id,
        st.code,
        st.ticket_type AS ticketType,
        st.status,
        st.issue_description AS issueDescription,
        st.resolution_summary AS resolutionSummary,
        st.refund_amount AS refundAmount,
        st.received_at AS receivedAt,
        st.completed_at AS completedAt,
        ii.id AS inventoryItemId,
        ii.imei,
        c.id AS customerId,
        c.full_name AS customerName,
        so.id AS salesOrderId,
        so.code AS salesOrderCode,
        e1.id AS receivedByEmployeeId,
        e1.full_name AS receivedByEmployeeName,
        e2.id AS handledByEmployeeId,
        e2.full_name AS handledByEmployeeName
      FROM service_tickets st
      INNER JOIN inventory_items ii ON ii.id = st.inventory_item_id
      LEFT JOIN customers c ON c.id = st.customer_id
      LEFT JOIN sales_orders so ON so.id = st.sales_order_id
      INNER JOIN employees e1 ON e1.id = st.received_by_employee_id
      LEFT JOIN employees e2 ON e2.id = st.handled_by_employee_id
      WHERE st.id = ?
      LIMIT 1
    `,
    [serviceTicketId]
  );

  if (!rows[0]) {
    return null;
  }

  return {
    ...rows[0],
    refundAmount: Number(rows[0].refundAmount),
  };
}

async function listServiceTickets() {
  const [rows] = await pool.query(
    `
      SELECT
        st.id,
        st.code,
        st.ticket_type AS ticketType,
        st.status,
        st.issue_description AS issueDescription,
        st.resolution_summary AS resolutionSummary,
        st.refund_amount AS refundAmount,
        st.received_at AS receivedAt,
        st.completed_at AS completedAt,
        ii.id AS inventoryItemId,
        ii.imei,
        c.id AS customerId,
        c.full_name AS customerName,
        so.id AS salesOrderId,
        so.code AS salesOrderCode,
        e1.id AS receivedByEmployeeId,
        e1.full_name AS receivedByEmployeeName,
        e2.id AS handledByEmployeeId,
        e2.full_name AS handledByEmployeeName
      FROM service_tickets st
      INNER JOIN inventory_items ii ON ii.id = st.inventory_item_id
      LEFT JOIN customers c ON c.id = st.customer_id
      LEFT JOIN sales_orders so ON so.id = st.sales_order_id
      INNER JOIN employees e1 ON e1.id = st.received_by_employee_id
      LEFT JOIN employees e2 ON e2.id = st.handled_by_employee_id
      ORDER BY st.id DESC
    `
  );

  return rows.map((row) => ({
    ...row,
    refundAmount: Number(row.refundAmount),
  }));
}

async function createServiceTicket(payload, currentUser) {
  const { code, imei, ticketType, issueDescription, receivedAt, handledByEmployeeId } = payload;
  const normalizedImei = String(imei || '').trim();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [[existingTicket]] = await connection.query(
      'SELECT id FROM service_tickets WHERE code = ? LIMIT 1',
      [code]
    );
    if (existingTicket) {
      throw new ApiError(409, 'Service ticket code already exists');
    }

    const [[inventoryItem]] = await connection.query(
      `
        SELECT
          ii.id,
          ii.variant_id AS variantId,
          ii.item_status AS itemStatus,
          ii.sales_order_item_id AS salesOrderItemId,
          so.id AS salesOrderId,
          so.customer_id AS customerId
        FROM inventory_items ii
        LEFT JOIN sales_order_items soi ON soi.id = ii.sales_order_item_id
        LEFT JOIN sales_orders so ON so.id = soi.sales_order_id
        WHERE ii.imei = ?
        LIMIT 1
        FOR UPDATE
      `,
      [normalizedImei]
    );

    if (!inventoryItem) {
      throw new ApiError(404, `Inventory item not found: ${normalizedImei}`);
    }

    if (inventoryItem.itemStatus !== 'sold') {
      throw new ApiError(409, `IMEI is not eligible for service: ${normalizedImei}`);
    }

    if (!inventoryItem.salesOrderId) {
      throw new ApiError(409, 'Service ticket requires a sold device linked to a sales order');
    }

    if (handledByEmployeeId) {
      const [[handledEmployee]] = await connection.query(
        'SELECT id FROM employees WHERE id = ? LIMIT 1',
        [handledByEmployeeId]
      );
      if (!handledEmployee) {
        throw new ApiError(404, 'Handled employee not found');
      }
    }

    const [serviceTicketResult] = await connection.query(
      `
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
          received_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'received', ?, ?)
      `,
      [
        code,
        inventoryItem.id,
        inventoryItem.customerId || null,
        inventoryItem.salesOrderId,
        currentUser.employee.id,
        handledByEmployeeId || null,
        ticketType,
        issueDescription,
        receivedAt || new Date(),
      ]
    );

    await connection.query(
      `
        UPDATE inventory_items
        SET item_status = 'in_service'
        WHERE id = ?
      `,
      [inventoryItem.id]
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
        ) VALUES (?, ?, 'service_in', 'service_ticket', ?, 1, ?, 'in_service', ?, ?)
      `,
      [
        inventoryItem.id,
        inventoryItem.variantId,
        serviceTicketResult.insertId,
        inventoryItem.itemStatus,
        `Tiep nhan bao hanh theo phieu ${code}`,
        currentUser.employee.id,
      ]
    );

    await connection.commit();
    return getServiceTicketById(connection, serviceTicketResult.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateServiceTicketStatus(serviceTicketId, payload, currentUser) {
  const { status, resolutionSummary, completedAt } = payload;
  const finalStatuses = new Set(['completed', 'rejected', 'cancelled']);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [[serviceTicket]] = await connection.query(
      `
        SELECT
          st.id,
          st.code,
          st.status,
          st.inventory_item_id AS inventoryItemId,
          ii.variant_id AS variantId,
          ii.item_status AS inventoryStatus
        FROM service_tickets st
        INNER JOIN inventory_items ii ON ii.id = st.inventory_item_id
        WHERE st.id = ?
        LIMIT 1
        FOR UPDATE
      `,
      [serviceTicketId]
    );

    if (!serviceTicket) {
      throw new ApiError(404, 'Service ticket not found');
    }

    await connection.query(
      `
        UPDATE service_tickets
        SET
          status = ?,
          resolution_summary = ?,
          handled_by_employee_id = COALESCE(handled_by_employee_id, ?),
          completed_at = ?
        WHERE id = ?
      `,
      [
        status,
        resolutionSummary || null,
        currentUser.employee.id,
        finalStatuses.has(status) ? completedAt || new Date() : null,
        serviceTicketId,
      ]
    );

    if (finalStatuses.has(status)) {
      if (serviceTicket.inventoryStatus !== 'in_service') {
        throw new ApiError(409, 'Inventory item is not currently in service');
      }

      await connection.query(
        `
          UPDATE inventory_items
          SET item_status = 'sold'
          WHERE id = ?
        `,
        [serviceTicket.inventoryItemId]
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
          ) VALUES (?, ?, 'service_return', 'service_ticket', ?, 1, ?, 'sold', ?, ?)
        `,
        [
          serviceTicket.inventoryItemId,
          serviceTicket.variantId,
          serviceTicket.id,
          serviceTicket.inventoryStatus,
          `Hoan tat phieu dich vu ${serviceTicket.code}`,
          currentUser.employee.id,
        ]
      );
    }

    await connection.commit();
    return getServiceTicketById(connection, serviceTicketId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  listServiceTickets,
  createServiceTicket,
  updateServiceTicketStatus,
};
