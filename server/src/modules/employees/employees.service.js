const pool = require('../../config/database');
const ApiError = require('../../utils/api-error');

function mapEmployee(row) {
  return {
    ...row,
    isActive: Boolean(row.isActive),
  };
}

async function getEmployeeById(employeeId) {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        code,
        full_name AS fullName,
        gender,
        date_of_birth AS dateOfBirth,
        phone,
        email,
        address,
        avatar_path AS avatarPath,
        is_active AS isActive
      FROM employees
      WHERE id = ?
    `,
    [employeeId]
  );

  if (rows.length === 0) {
    throw new ApiError(404, 'Employee not found');
  }

  return mapEmployee(rows[0]);
}

async function listEmployees() {
  const [rows] = await pool.query(
    `
      SELECT
        e.id,
        e.code,
        e.full_name AS fullName,
        e.gender,
        e.date_of_birth AS dateOfBirth,
        e.phone,
        e.email,
        e.address,
        e.avatar_path AS avatarPath,
        e.is_active AS isActive
      FROM employees e
      ORDER BY e.id
    `
  );

  return rows.map(mapEmployee);
}

async function createEmployee(payload) {
  const { code, fullName, gender, dateOfBirth, phone, email, address } = payload;

  const [duplicateRows] = await pool.query(
    `
      SELECT id
      FROM employees
      WHERE code = ? OR email = ? OR (? IS NOT NULL AND phone = ?)
      LIMIT 1
    `,
    [code, email, phone || null, phone || null]
  );

  if (duplicateRows.length > 0) {
    throw new ApiError(409, 'Employee code, email, or phone already exists');
  }

  const [result] = await pool.query(
    `
      INSERT INTO employees (code, full_name, gender, date_of_birth, phone, email, address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [code, fullName, gender || 'male', dateOfBirth || null, phone || null, email, address || null]
  );

  const [rows] = await pool.query(
    `
      SELECT
        id,
        code,
        full_name AS fullName,
        gender,
        date_of_birth AS dateOfBirth,
        phone,
        email,
        address,
        avatar_path AS avatarPath,
        is_active AS isActive
      FROM employees
      WHERE id = ?
    `,
    [result.insertId]
  );

  return mapEmployee(rows[0]);
}

async function updateEmployee(employeeId, payload) {
  const { code, fullName, gender, dateOfBirth, phone, email, address } = payload;

  await getEmployeeById(employeeId);

  const [duplicateRows] = await pool.query(
    `
      SELECT id
      FROM employees
      WHERE id <> ? AND (code = ? OR email = ? OR (? IS NOT NULL AND phone = ?))
      LIMIT 1
    `,
    [employeeId, code, email, phone || null, phone || null]
  );

  if (duplicateRows.length > 0) {
    throw new ApiError(409, 'Employee code, email, or phone already exists');
  }

  await pool.query(
    `
      UPDATE employees
      SET
        code = ?,
        full_name = ?,
        gender = ?,
        date_of_birth = ?,
        phone = ?,
        email = ?,
        address = ?
      WHERE id = ?
    `,
    [code, fullName, gender || 'male', dateOfBirth || null, phone || null, email, address || null, employeeId]
  );

  return getEmployeeById(employeeId);
}

async function updateEmployeeStatus(employeeId, isActive) {
  await getEmployeeById(employeeId);

  await pool.query('UPDATE employees SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, employeeId]);

  return getEmployeeById(employeeId);
}

module.exports = {
  listEmployees,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
};
