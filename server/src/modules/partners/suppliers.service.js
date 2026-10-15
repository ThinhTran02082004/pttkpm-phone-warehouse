const pool = require('../../config/database');
const ApiError = require('../../utils/api-error');
const {
  normalizeSearchTerm,
  mapPartnerRow,
  validateRequiredPartnerFields,
} = require('./partners.shared');

async function getSupplierById(supplierId) {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        code,
        name,
        phone,
        email,
        address,
        notes,
        is_active AS isActive,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM suppliers
      WHERE id = ?
    `,
    [supplierId]
  );

  if (rows.length === 0) {
    throw new ApiError(404, 'Supplier not found');
  }

  return mapPartnerRow(rows[0]);
}

async function listSuppliers(keyword = '') {
  const hasKeyword = String(keyword || '').trim().length > 0;
  const [rows] = await pool.query(
    `
      SELECT
        id,
        code,
        name,
        phone,
        email,
        address,
        notes,
        is_active AS isActive,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM suppliers
      WHERE (? = 0)
         OR code LIKE ?
         OR name LIKE ?
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

async function createSupplier(payload) {
  validateRequiredPartnerFields(payload, 'Supplier');

  const code = String(payload.code || '').trim().toUpperCase();
  const name = String(payload.name || '').trim();
  const phone = String(payload.phone || '').trim();
  const email = payload.email ? String(payload.email).trim().toLowerCase() : null;

  const [duplicateRows] = await pool.query(
    `
      SELECT id
      FROM suppliers
      WHERE code = ?
         OR phone = ?
         OR (? IS NOT NULL AND email = ?)
      LIMIT 1
    `,
    [code, phone, email, email]
  );

  if (duplicateRows.length > 0) {
    throw new ApiError(409, 'Supplier code, phone, or email already exists');
  }

  const [result] = await pool.query(
    `
      INSERT INTO suppliers (code, name, phone, email, address, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [code, name, phone, email, payload.address || null, payload.notes || null]
  );

  const [rows] = await pool.query(
    `
      SELECT
        id,
        code,
        name,
        phone,
        email,
        address,
        notes,
        is_active AS isActive,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM suppliers
      WHERE id = ?
    `,
    [result.insertId]
  );

  return mapPartnerRow(rows[0]);
}

async function updateSupplier(supplierId, payload) {
  validateRequiredPartnerFields(payload, 'Supplier');

  const code = String(payload.code || '').trim().toUpperCase();
  const name = String(payload.name || '').trim();
  const phone = String(payload.phone || '').trim();
  const email = payload.email ? String(payload.email).trim().toLowerCase() : null;

  await getSupplierById(supplierId);

  const [duplicateRows] = await pool.query(
    `
      SELECT id
      FROM suppliers
      WHERE id <> ?
        AND (
          code = ?
          OR phone = ?
          OR (? IS NOT NULL AND email = ?)
        )
      LIMIT 1
    `,
    [supplierId, code, phone, email, email]
  );

  if (duplicateRows.length > 0) {
    throw new ApiError(409, 'Supplier code, phone, or email already exists');
  }

  await pool.query(
    `
      UPDATE suppliers
      SET code = ?, name = ?, phone = ?, email = ?, address = ?, notes = ?
      WHERE id = ?
    `,
    [code, name, phone, email, payload.address || null, payload.notes || null, supplierId]
  );

  return getSupplierById(supplierId);
}

async function updateSupplierStatus(supplierId, isActive) {
  await getSupplierById(supplierId);

  await pool.query('UPDATE suppliers SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, supplierId]);

  return getSupplierById(supplierId);
}

module.exports = {
  listSuppliers,
  createSupplier,
  updateSupplier,
  updateSupplierStatus,
};
