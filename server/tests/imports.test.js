const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/config/database');

const runId = Date.now().toString();
const importCodeSuccess = `PO-T-${runId.slice(-8)}`;
const importCodeRollback = `PO-R-${runId.slice(-8)}`;
const importCodeEmptyImeis = `PO-E-${runId.slice(-8)}`;
const successImei1 = `86${runId.slice(-13)}`;
const successImei2 = `87${runId.slice(-13)}`;
const rollbackImei = `88${runId.slice(-13)}`;

async function loginAdmin() {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: '123456' });

  return response.body.data.token;
}

describe('Import orders', () => {
  afterAll(async () => {
    const [inventoryRows] = await pool.query(
      'SELECT id FROM inventory_items WHERE imei IN (?, ?, ?)',
      [successImei1, successImei2, rollbackImei]
    );
    const inventoryIds = inventoryRows.map((row) => row.id);

    if (inventoryIds.length > 0) {
      await pool.query('DELETE FROM stock_movements WHERE inventory_item_id IN (?)', [inventoryIds]);
      await pool.query('DELETE FROM inventory_items WHERE id IN (?)', [inventoryIds]);
    }

    const [purchaseOrderRows] = await pool.query(
      'SELECT id FROM purchase_orders WHERE code IN (?, ?, ?)',
      [importCodeSuccess, importCodeRollback, importCodeEmptyImeis]
    );
    const purchaseOrderIds = purchaseOrderRows.map((row) => row.id);

    if (purchaseOrderIds.length > 0) {
      await pool.query('DELETE FROM purchase_order_items WHERE purchase_order_id IN (?)', [purchaseOrderIds]);
      await pool.query('DELETE FROM purchase_orders WHERE id IN (?)', [purchaseOrderIds]);
    }

    await pool.end();
  });

  it('creates an import order and inserts inventory items plus stock movements', async () => {
    const token = await loginAdmin();

    const response = await request(app)
      .post('/api/imports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: importCodeSuccess,
        supplierId: 1,
        orderedAt: '2026-03-20 14:00:00',
        receivedAt: '2026-03-20 14:30:00',
        notes: 'Phiếu nhập test thành công',
        items: [
          {
            variantId: 1,
            unitCost: 25000000,
            imeis: [successImei1, successImei2],
          },
        ],
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.code).toBe(importCodeSuccess);
    expect(response.body.data.totalAmount).toBe(50000000);

    const [inventoryRows] = await pool.query(
      'SELECT imei, item_status FROM inventory_items WHERE imei IN (?, ?)',
      [successImei1, successImei2]
    );

    expect(inventoryRows).toHaveLength(2);
    expect(inventoryRows.every((item) => item.item_status === 'in_stock')).toBe(true);

    const [movementRows] = await pool.query(
      'SELECT movement_type FROM stock_movements WHERE note = ?',
      ['Nhập kho từ phiếu ' + importCodeSuccess]
    );

    expect(movementRows).toHaveLength(2);
    expect(movementRows.every((item) => item.movement_type === 'import')).toBe(true);
  });

  it('rolls back the whole import order when one imei already exists', async () => {
    const token = await loginAdmin();

    const response = await request(app)
      .post('/api/imports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: importCodeRollback,
        supplierId: 1,
        orderedAt: '2026-03-20 15:00:00',
        receivedAt: '2026-03-20 15:15:00',
        notes: 'Phiếu nhập test rollback',
        items: [
          {
            variantId: 3,
            unitCost: 22000000,
            imeis: ['353123456789001', rollbackImei],
          },
        ],
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);

    const [[purchaseOrder]] = await pool.query(
      'SELECT id FROM purchase_orders WHERE code = ? LIMIT 1',
      [importCodeRollback]
    );
    expect(purchaseOrder).toBeUndefined();

    const [[inventoryItem]] = await pool.query(
      'SELECT id FROM inventory_items WHERE imei = ? LIMIT 1',
      [rollbackImei]
    );
    expect(inventoryItem).toBeUndefined();
  });

  it('rejects an import item when the imei list is empty after validation', async () => {
    const token = await loginAdmin();

    const response = await request(app)
      .post('/api/imports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: importCodeEmptyImeis,
        supplierId: 1,
        orderedAt: '2026-03-20 16:00:00',
        receivedAt: '2026-03-20 16:15:00',
        notes: 'Phiếu nhập test IMEI rỗng',
        items: [
          {
            variantId: 1,
            unitCost: 25000000,
            imeis: [],
          },
        ],
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/IMEI/i);

    const [[purchaseOrder]] = await pool.query(
      'SELECT id FROM purchase_orders WHERE code = ? LIMIT 1',
      [importCodeEmptyImeis]
    );
    expect(purchaseOrder).toBeUndefined();
  });
});
