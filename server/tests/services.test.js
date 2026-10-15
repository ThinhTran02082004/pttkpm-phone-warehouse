const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/config/database');

const runId = Date.now().toString();
const importCode = `PO-S-${runId.slice(-8)}`;
const exportCode = `SO-S-${runId.slice(-8)}`;
const serviceCode = `SV-S-${runId.slice(-8)}`;
const serviceImei = `93${runId.slice(-13)}`;
const importCodeCompleted = `PO-C-${runId.slice(-8)}`;
const exportCodeCompleted = `SO-C-${runId.slice(-8)}`;
const serviceCodeCompleted = `SV-C-${runId.slice(-8)}`;
const serviceImeiCompleted = `94${runId.slice(-13)}`;
const unknownImei = `99${runId.slice(-13)}`;

async function loginAdmin() {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: '123456' });

  return response.body.data.token;
}

describe('Service tickets', () => {
  afterAll(async () => {
    const [serviceRows] = await pool.query(
      'SELECT id FROM service_tickets WHERE code IN (?, ?)',
      [serviceCode, serviceCodeCompleted]
    );
    const serviceIds = serviceRows.map((row) => row.id);

    if (serviceIds.length > 0) {
      await pool.query('DELETE FROM service_tickets WHERE id IN (?)', [serviceIds]);
    }

    const [inventoryRows] = await pool.query(
      'SELECT id FROM inventory_items WHERE imei IN (?, ?)',
      [serviceImei, serviceImeiCompleted]
    );
    const inventoryIds = inventoryRows.map((row) => row.id);

    if (inventoryIds.length > 0) {
      await pool.query('DELETE FROM stock_movements WHERE inventory_item_id IN (?)', [inventoryIds]);
      await pool.query('DELETE FROM inventory_items WHERE id IN (?)', [inventoryIds]);
    }

    const [salesOrderRows] = await pool.query(
      'SELECT id FROM sales_orders WHERE code IN (?, ?)',
      [exportCode, exportCodeCompleted]
    );
    const salesOrderIds = salesOrderRows.map((row) => row.id);

    if (salesOrderIds.length > 0) {
      await pool.query('DELETE FROM sales_order_items WHERE sales_order_id IN (?)', [salesOrderIds]);
      await pool.query('DELETE FROM sales_orders WHERE id IN (?)', [salesOrderIds]);
    }

    const [purchaseOrderRows] = await pool.query(
      'SELECT id FROM purchase_orders WHERE code IN (?, ?)',
      [importCode, importCodeCompleted]
    );
    const purchaseOrderIds = purchaseOrderRows.map((row) => row.id);

    if (purchaseOrderIds.length > 0) {
      await pool.query('DELETE FROM purchase_order_items WHERE purchase_order_id IN (?)', [purchaseOrderIds]);
      await pool.query('DELETE FROM purchase_orders WHERE id IN (?)', [purchaseOrderIds]);
    }

    await pool.end();
  });

  it('rejects opening a service ticket for an unknown imei', async () => {
    const token = await loginAdmin();

    const response = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: serviceCode,
        imei: unknownImei,
        ticketType: 'warranty',
        issueDescription: 'May khong len nguon',
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('creates a service ticket for a sold imei and moves it into service', async () => {
    const token = await loginAdmin();

    const importResponse = await request(app)
      .post('/api/imports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: importCode,
        supplierId: 1,
        orderedAt: '2026-03-21 13:00:00',
        receivedAt: '2026-03-21 13:15:00',
        notes: 'Lo nhap cho test bao hanh',
        items: [
          {
            variantId: 1,
            unitCost: 25000000,
            imeis: [serviceImei],
          },
        ],
      });

    expect(importResponse.statusCode).toBe(201);

    const exportResponse = await request(app)
      .post('/api/exports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: exportCode,
        customerId: 1,
        soldAt: '2026-03-21 14:00:00',
        notes: 'Ban may cho khach de mo phieu bao hanh',
        items: [
          {
            variantId: 1,
            unitPrice: 29990000,
            imeis: [serviceImei],
          },
        ],
      });

    expect(exportResponse.statusCode).toBe(201);

    const serviceResponse = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: serviceCode,
        imei: serviceImei,
        ticketType: 'warranty',
        issueDescription: 'Man hinh bi soc va may nong bat thuong',
        receivedAt: '2026-03-22 09:00:00',
        handledByEmployeeId: 5,
      });

    expect(serviceResponse.statusCode).toBe(201);
    expect(serviceResponse.body.success).toBe(true);
    expect(serviceResponse.body.data.code).toBe(serviceCode);
    expect(serviceResponse.body.data.imei).toBe(serviceImei);
    expect(serviceResponse.body.data.ticketType).toBe('warranty');
    expect(serviceResponse.body.data.customerId).toBe(1);

    const [[serviceTicket]] = await pool.query(
      `
        SELECT
          customer_id AS customerId,
          sales_order_id AS salesOrderId,
          status,
          inventory_item_id AS inventoryItemId
        FROM service_tickets
        WHERE code = ?
        LIMIT 1
      `,
      [serviceCode]
    );

    expect(serviceTicket.customerId).toBe(1);
    expect(serviceTicket.salesOrderId).toBeTruthy();
    expect(serviceTicket.status).toBe('received');

    const [[inventoryItem]] = await pool.query(
      'SELECT item_status FROM inventory_items WHERE imei = ? LIMIT 1',
      [serviceImei]
    );

    expect(inventoryItem.item_status).toBe('in_service');

    const [movementRows] = await pool.query(
      `
        SELECT movement_type, after_status
        FROM stock_movements
        WHERE inventory_item_id = ? AND movement_type = 'service_in'
      `,
      [serviceTicket.inventoryItemId]
    );

    expect(movementRows).toHaveLength(1);
    expect(movementRows[0].after_status).toBe('in_service');
  });

  it('completes a service ticket and returns the imei status to sold', async () => {
    const token = await loginAdmin();

    const importResponse = await request(app)
      .post('/api/imports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: importCodeCompleted,
        supplierId: 1,
        orderedAt: '2026-03-23 08:00:00',
        receivedAt: '2026-03-23 08:15:00',
        notes: 'Lo nhap cho test hoan tat bao hanh',
        items: [
          {
            variantId: 1,
            unitCost: 25000000,
            imeis: [serviceImeiCompleted],
          },
        ],
      });

    expect(importResponse.statusCode).toBe(201);

    const exportResponse = await request(app)
      .post('/api/exports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: exportCodeCompleted,
        customerId: 2,
        soldAt: '2026-03-23 09:00:00',
        notes: 'Ban may cho khach de test dong phieu bao hanh',
        items: [
          {
            variantId: 1,
            unitPrice: 29990000,
            imeis: [serviceImeiCompleted],
          },
        ],
      });

    expect(exportResponse.statusCode).toBe(201);

    const serviceResponse = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: serviceCodeCompleted,
        imei: serviceImeiCompleted,
        ticketType: 'repair',
        issueDescription: 'Khong nhan sim',
        receivedAt: '2026-03-24 10:00:00',
      });

    expect(serviceResponse.statusCode).toBe(201);

    const completeResponse = await request(app)
      .patch(`/api/services/${serviceResponse.body.data.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'completed',
        resolutionSummary: 'Da ve sinh khay sim va cap nhat phan mem',
        completedAt: '2026-03-24 16:30:00',
      });

    expect(completeResponse.statusCode).toBe(200);
    expect(completeResponse.body.success).toBe(true);
    expect(completeResponse.body.data.status).toBe('completed');
    expect(completeResponse.body.data.imei).toBe(serviceImeiCompleted);

    const [[completedTicket]] = await pool.query(
      `
        SELECT
          status,
          resolution_summary AS resolutionSummary,
          completed_at AS completedAt,
          inventory_item_id AS inventoryItemId
        FROM service_tickets
        WHERE code = ?
        LIMIT 1
      `,
      [serviceCodeCompleted]
    );

    expect(completedTicket.status).toBe('completed');
    expect(completedTicket.resolutionSummary).toBe(
      'Da ve sinh khay sim va cap nhat phan mem'
    );
    expect(completedTicket.completedAt).not.toBeNull();

    const [[inventoryItem]] = await pool.query(
      'SELECT item_status FROM inventory_items WHERE imei = ? LIMIT 1',
      [serviceImeiCompleted]
    );

    expect(inventoryItem.item_status).toBe('sold');

    const [movementRows] = await pool.query(
      `
        SELECT movement_type, after_status
        FROM stock_movements
        WHERE inventory_item_id = ? AND movement_type = 'service_return'
      `,
      [completedTicket.inventoryItemId]
    );

    expect(movementRows).toHaveLength(1);
    expect(movementRows[0].after_status).toBe('sold');
  });
});
