const pool = require('../../config/database');
const ApiError = require('../../utils/api-error');
const {
  normalizeSearchTerm,
  mapPartnerRow,
  validateRequiredPartnerFields,
} = require('./partners.shared');

async function getCustomerById(customerId) {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        code,
        full_name AS fullName,
        phone,
        email,
        date_of_birth AS dateOfBirth,
        address,
        notes,
        is_active AS isActive,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM customers
      WHERE id = ?
    `,
    [customerId]
  );

  if (rows.length === 0) {
    throw new ApiError(404, 'Customer not found');
  }

  return mapPartnerRow(rows[0]);
}

async function listCustomers(keyword = '') {
  const hasKeyword = String(keyword || '').trim().length > 0;
  const [rows] = await pool.query(
    `
      SELECT
        id,
        code,
        full_name AS fullName,
        phone,
        email,
        date_of_birth AS dateOfBirth,
        address,
        notes,
        is_active AS isActive,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM customers
      WHERE (? = 0)
         OR code LIKE ?
         OR full_name LIKE ?
         OR phone LIKE ?
         OR COALESCE(email, '') LIKE ?
      ORDER BY id
    `,
    hasKeyword
      ? [1, normalizeSearchTerm(keyword), normalizeSearchTerm(keyword), normalizeSearchTerm(keyword), normalizeSearchTerm(keyword)]
      : [0, '', '', '', '']
  );

  return rows.map(mapPartnerRow);
}

async function createCustomer(payload) {
  validateRequiredPartnerFields(payload, 'Customer');

  const code = String(payload.code || '').trim().toUpperCase();
  const fullName = String(payload.fullName || '').trim();
  const phone = String(payload.phone || '').trim();
  const email = payload.email ? String(payload.email).trim().toLowerCase() : null;

  const [duplicateRows] = await pool.query(
    `
      SELECT id
      FROM customers
      WHERE code = ?
         OR phone = ?
         OR (? IS NOT NULL AND email = ?)
      LIMIT 1
    `,
    [code, phone, email, email]
  );

  if (duplicateRows.length > 0) {
    throw new ApiError(409, 'Customer code, phone, or email already exists');
  }

  const [result] = await pool.query(
    `
      INSERT INTO customers (code, full_name, phone, email, date_of_birth, address, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      code,
      fullName,
      phone,
      email,
      payload.dateOfBirth || null,
      payload.address || null,
      payload.notes || null,
    ]
  );

  const [rows] = await pool.query(
    `
      SELECT
        id,
        code,
        full_name AS fullName,
        phone,
        email,
        date_of_birth AS dateOfBirth,
        address,
        notes,
        is_active AS isActive,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM customers
      WHERE id = ?
    `,
    [result.insertId]
  );

  return mapPartnerRow(rows[0]);
}

async function updateCustomer(customerId, payload) {
  validateRequiredPartnerFields(payload, 'Customer');

  const code = String(payload.code || '').trim().toUpperCase();
  const fullName = String(payload.fullName || '').trim();
  const phone = String(payload.phone || '').trim();
  const email = payload.email ? String(payload.email).trim().toLowerCase() : null;

  await getCustomerById(customerId);

  const [duplicateRows] = await pool.query(
    `
      SELECT id
      FROM customers
      WHERE id <> ?
        AND (
          code = ?
          OR phone = ?
          OR (? IS NOT NULL AND email = ?)
        )
      LIMIT 1
    `,
    [customerId, code, phone, email, email]
  );

  if (duplicateRows.length > 0) {
    throw new ApiError(409, 'Customer code, phone, or email already exists');
  }

  await pool.query(
    `
      UPDATE customers
      SET code = ?, full_name = ?, phone = ?, email = ?, date_of_birth = ?, address = ?, notes = ?
      WHERE id = ?
    `,
    [
      code,
      fullName,
      phone,
      email,
      payload.dateOfBirth || null,
      payload.address || null,
      payload.notes || null,
      customerId,
    ]
  );

  return getCustomerById(customerId);
}

async function updateCustomerStatus(customerId, isActive) {
  await getCustomerById(customerId);

  await pool.query('UPDATE customers SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, customerId]);

  return getCustomerById(customerId);
}

module.exports = {
  listCustomers,
  createCustomer,
  updateCustomer,
  updateCustomerStatus,
};
