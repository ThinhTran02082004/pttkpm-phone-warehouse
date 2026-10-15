const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/config/database');

const runId = Date.now().toString();
const createdSupplierCodes = new Set();
const createdSupplierPhones = new Set();
const createdSupplierEmails = new Set();
const createdCustomerCodes = new Set();
const createdCustomerPhones = new Set();
const createdCustomerEmails = new Set();

async function loginAdmin() {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: '123456' });

  return response.body.data.token;
}

async function deleteRows(tableName, columnName, values) {
  if (values.length === 0) {
    return;
  }

  const placeholders = values.map(() => '?').join(', ');
  await pool.query(`DELETE FROM ${tableName} WHERE ${columnName} IN (${placeholders})`, values);
}

describe('Suppliers and customers', () => {
  afterAll(async () => {
    await deleteRows('suppliers', 'email', Array.from(createdSupplierEmails));
    await deleteRows('suppliers', 'phone', Array.from(createdSupplierPhones));
    await deleteRows('suppliers', 'code', Array.from(createdSupplierCodes));
    await deleteRows('customers', 'email', Array.from(createdCustomerEmails));
    await deleteRows('customers', 'phone', Array.from(createdCustomerPhones));
    await deleteRows('customers', 'code', Array.from(createdCustomerCodes));
    await pool.end();
  });

  it('creates a supplier and rejects duplicate phone/email', async () => {
    const token = await loginAdmin();
    const supplierCode = `SUPT${runId.slice(-6)}`;
    const supplierPhone = `08${runId.slice(-8)}`;
    const supplierEmail = `supplier${runId}@example.com`;

    createdSupplierCodes.add(supplierCode);
    createdSupplierPhones.add(supplierPhone);
    createdSupplierEmails.add(supplierEmail);

    const createResponse = await request(app)
      .post('/api/suppliers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: supplierCode,
        name: 'Nha cung cap test',
        phone: supplierPhone,
        email: supplierEmail,
        address: 'Quan 1, TP.HCM',
        notes: 'Du lieu test',
      });

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body.success).toBe(true);

    const duplicateResponse = await request(app)
      .post('/api/suppliers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: `${supplierCode}-DUP`,
        name: 'Nha cung cap test 2',
        phone: supplierPhone,
        email: supplierEmail,
      });

    expect(duplicateResponse.statusCode).toBe(409);
    expect(duplicateResponse.body.success).toBe(false);
  });

  it('updates and deactivates a supplier', async () => {
    const token = await loginAdmin();
    const supplierCode = `SUPU${runId.slice(-6)}`;
    const supplierPhone = `091${runId.slice(-7)}`;
    const supplierEmail = `supplier-update-${runId}@example.com`;
    const updatedEmail = `supplier-update-${runId}-new@example.com`;

    createdSupplierCodes.add(supplierCode);
    createdSupplierPhones.add(supplierPhone);
    createdSupplierEmails.add(supplierEmail);
    createdSupplierEmails.add(updatedEmail);

    const createResponse = await request(app)
      .post('/api/suppliers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: supplierCode,
        name: 'Nha cung cap sua',
        phone: supplierPhone,
        email: supplierEmail,
      });

    expect(createResponse.statusCode).toBe(201);

    const supplierId = createResponse.body.data.id;

    const updateResponse = await request(app)
      .put(`/api/suppliers/${supplierId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: supplierCode,
        name: 'Nha cung cap sua moi',
        phone: supplierPhone,
        email: updatedEmail,
      });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.data.name).toBe('Nha cung cap sua moi');
    expect(updateResponse.body.data.email).toBe(updatedEmail);

    const statusResponse = await request(app)
      .patch(`/api/suppliers/${supplierId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isActive: false });

    expect(statusResponse.statusCode).toBe(200);
    expect(statusResponse.body.data.isActive).toBe(false);
  });

  it('creates a customer and supports searching by keyword', async () => {
    const token = await loginAdmin();
    const customerCode = `CUST${runId.slice(-6)}`;
    const customerPhone = `07${runId.slice(-8)}`;
    const customerEmail = `customer${runId}@example.com`;

    createdCustomerCodes.add(customerCode);
    createdCustomerPhones.add(customerPhone);
    createdCustomerEmails.add(customerEmail);

    const createResponse = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: customerCode,
        fullName: 'Khach hang test',
        phone: customerPhone,
        email: customerEmail,
        dateOfBirth: '1998-10-10',
        address: 'Thu Duc, TP.HCM',
      });

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body.success).toBe(true);

    const searchResponse = await request(app)
      .get(`/api/customers?q=${customerCode}`)
      .set('Authorization', `Bearer ${token}`);

    expect(searchResponse.statusCode).toBe(200);
    expect(
      searchResponse.body.data.some((item) => item.code === customerCode)
    ).toBe(true);
  });

  it('updates and deactivates a customer', async () => {
    const token = await loginAdmin();
    const customerCode = `CUSU${runId.slice(-6)}`;
    const customerPhone = `093${runId.slice(-7)}`;
    const customerEmail = `customer-update-${runId}@example.com`;
    const updatedEmail = `customer-update-${runId}-new@example.com`;

    createdCustomerCodes.add(customerCode);
    createdCustomerPhones.add(customerPhone);
    createdCustomerEmails.add(customerEmail);
    createdCustomerEmails.add(updatedEmail);

    const createResponse = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: customerCode,
        fullName: 'Khach hang sua',
        phone: customerPhone,
        email: customerEmail,
      });

    expect(createResponse.statusCode).toBe(201);

    const customerId = createResponse.body.data.id;

    const updateResponse = await request(app)
      .put(`/api/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: customerCode,
        fullName: 'Khach hang sua moi',
        phone: customerPhone,
        email: updatedEmail,
      });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.data.fullName).toBe('Khach hang sua moi');
    expect(updateResponse.body.data.email).toBe(updatedEmail);

    const statusResponse = await request(app)
      .patch(`/api/customers/${customerId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isActive: false });

    expect(statusResponse.statusCode).toBe(200);
    expect(statusResponse.body.data.isActive).toBe(false);
  });
});
