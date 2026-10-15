const pool = require('../../config/database');
const ApiError = require('../../utils/api-error');

function mapRole(row) {
  return {
    ...row,
    isActive: Boolean(row.isActive),
    permissionCount: Number(row.permissionCount || 0),
  };
}

async function getRoleById(roleId) {
  const [rows] = await pool.query(
    `
      SELECT
        r.id,
        r.code,
        r.name,
        r.description,
        r.is_active AS isActive,
        COUNT(rp.permission_id) AS permissionCount
      FROM roles r
      LEFT JOIN role_permissions rp ON rp.role_id = r.id
      WHERE r.id = ?
      GROUP BY r.id, r.code, r.name, r.description, r.is_active
    `,
    [roleId]
  );

  if (rows.length === 0) {
    throw new ApiError(404, 'Role not found');
  }

  return mapRole(rows[0]);
}

async function listRoles() {
  const [rows] = await pool.query(
    `
      SELECT
        r.id,
        r.code,
        r.name,
        r.description,
        r.is_active AS isActive,
        COUNT(rp.permission_id) AS permissionCount
      FROM roles r
      LEFT JOIN role_permissions rp ON rp.role_id = r.id
      GROUP BY r.id, r.code, r.name, r.description, r.is_active
      ORDER BY r.id
    `
  );

  return rows.map(mapRole);
}

async function createRole(payload) {
  const { code, name, description } = payload;
  const normalizedCode = String(code || '').trim().toLowerCase();

  const [existingRows] = await pool.query('SELECT id FROM roles WHERE code = ? LIMIT 1', [
    normalizedCode,
  ]);

  if (existingRows.length > 0) {
    throw new ApiError(409, 'Role code already exists');
  }

  const [result] = await pool.query(
    'INSERT INTO roles (code, name, description) VALUES (?, ?, ?)',
    [normalizedCode, name, description || null]
  );

  const [rows] = await pool.query(
    'SELECT id, code, name, description, is_active AS isActive FROM roles WHERE id = ?',
    [result.insertId]
  );

  return mapRole(rows[0]);
}

async function updateRole(roleId, payload) {
  const { code, name, description } = payload;
  const normalizedCode = String(code || '').trim().toLowerCase();

  await getRoleById(roleId);

  const [existingRows] = await pool.query(
    'SELECT id FROM roles WHERE code = ? AND id <> ? LIMIT 1',
    [normalizedCode, roleId]
  );

  if (existingRows.length > 0) {
    throw new ApiError(409, 'Role code already exists');
  }

  await pool.query(
    'UPDATE roles SET code = ?, name = ?, description = ? WHERE id = ?',
    [normalizedCode, name, description || null, roleId]
  );

  return getRoleById(roleId);
}

async function updateRoleStatus(roleId, isActive) {
  await getRoleById(roleId);

  await pool.query('UPDATE roles SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, roleId]);

  return getRoleById(roleId);
}

module.exports = {
  listRoles,
  createRole,
  updateRole,
  updateRoleStatus,
};
