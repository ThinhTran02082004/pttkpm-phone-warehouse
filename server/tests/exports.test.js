const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/config/database');

const runId = Date.now().toString();
const importCode = `PO-E-${runId.slice(-8)}`;
const exportCode = `SO-E-${runId.slice(-8)}`;
const failedExportCode = `SO-F-${runId.slice(-8)}`;
const imeiForSale = `91${runId.slice(-13)}`;
const imeiRemaining = `92${runId.slice(-13)}`;

async function loginAdmin() {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: '123456' });

  return response.body.data.token;
}

describe('Export orders', () => {
  afterAll(async () => {
    const [inventoryRows] = await pool.query(
      'SELECT id FROM inventory_items WHERE imei IN (?, ?)',
      [imeiForSale, imeiRemaining]
    );
    const inventoryIds = inventoryRows.map((row) => row.id);

    if (inventoryIds.length > 0) {
      await pool.query('DELETE FROM stock_movements WHERE inventory_item_id IN (?)', [inventoryIds]);
      await pool.query('DELETE FROM inventory_items WHERE id IN (?)', [inventoryIds]);
    }

    const [salesOrderRows] = await pool.query(
      'SELECT id FROM sales_orders WHERE code IN (?, ?)',
      [exportCode, failedExportCode]
    );
    const salesOrderIds = salesOrderRows.map((row) => row.id);

    if (salesOrderIds.length > 0) {
      await pool.query('DELETE FROM sales_order_items WHERE sales_order_id IN (?)', [salesOrderIds]);
      await pool.query('DELETE FROM sales_orders WHERE id IN (?)', [salesOrderIds]);
    }

    const [purchaseOrderRows] = await pool.query(
      'SELECT id FROM purchase_orders WHERE code = ?',
      [importCode]
    );
    const purchaseOrderIds = purchaseOrderRows.map((row) => row.id);

    if (purchaseOrderIds.length > 0) {
      await pool.query('DELETE FROM purchase_order_items WHERE purchase_order_id IN (?)', [purchaseOrderIds]);
      await pool.query('DELETE FROM purchase_orders WHERE id IN (?)', [purchaseOrderIds]);
    }

    await pool.end();
  });

  it('exports in-stock imei and marks it as sold', async () => {
    const token = await loginAdmin();

    const importResponse = await request(app)
      .post('/api/imports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: importCode,
        supplierId: 1,
        orderedAt: '2026-03-21 09:00:00',
        receivedAt: '2026-03-21 09:15:00',
        notes: 'Lô nhập cho test xuất kho',
        items: [
          {
            variantId: 1,
            unitCost: 25000000,
            imeis: [imeiForSale, imeiRemaining],
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
        soldAt: '2026-03-21 10:00:00',
        notes: 'Phiếu xuất test',
        items: [
          {
            variantId: 1,
            unitPrice: 29990000,
            imeis: [imeiForSale],
          },
        ],
      });

    expect(exportResponse.statusCode).toBe(201);
    expect(exportResponse.body.success).toBe(true);
    expect(exportResponse.body.data.code).toBe(exportCode);
    expect(exportResponse.body.data.totalAmount).toBe(29990000);

    const [[soldInventory]] = await pool.query(
      'SELECT item_status, sold_at FROM inventory_items WHERE imei = ? LIMIT 1',
      [imeiForSale]
    );

    expect(soldInventory.item_status).toBe('sold');
    expect(soldInventory.sold_at).not.toBeNull();

    const [[remainingInventory]] = await pool.query(
      'SELECT item_status FROM inventory_items WHERE imei = ? LIMIT 1',
      [imeiRemaining]
    );

    expect(remainingInventory.item_status).toBe('in_stock');
  });

  it('rolls back when trying to export an imei that is already sold', async () => {
    const token = await loginAdmin();

    const failedResponse = await request(app)
      .post('/api/exports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: failedExportCode,
        customerId: 2,
        soldAt: '2026-03-21 11:00:00',
        notes: 'Phiếu xuất phải rollback',
        items: [
          {
            variantId: 1,
            unitPrice: 29990000,
            imeis: [imeiForSale],
          },
        ],
      });

    expect(failedResponse.statusCode).toBe(409);
    expect(failedResponse.body.success).toBe(false);

    const [[failedOrder]] = await pool.query(
      'SELECT id FROM sales_orders WHERE code = ? LIMIT 1',
      [failedExportCode]
    );
    expect(failedOrder).toBeUndefined();

    const [[stillSoldItem]] = await pool.query(
      'SELECT item_status FROM inventory_items WHERE imei = ? LIMIT 1',
      [imeiForSale]
    );
    expect(stillSoldItem.item_status).toBe('sold');
  });
});
