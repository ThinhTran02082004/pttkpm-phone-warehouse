const pool = require('../../config/database');
const ApiError = require('../../utils/api-error');
const { hashPassword } = require('../../utils/password');

async function getAccountById(accountId) {
  const [rows] = await pool.query(
    `
      SELECT
        a.id,
        a.username,
        a.status,
        a.last_login_at AS lastLoginAt,
        e.id AS employeeId,
        e.code AS employeeCode,
        e.full_name AS employeeName,
        r.id AS roleId,
        r.code AS roleCode,
        r.name AS roleName
      FROM accounts a
      INNER JOIN employees e ON e.id = a.employee_id
      INNER JOIN roles r ON r.id = a.role_id
      WHERE a.id = ?
    `,
    [accountId]
  );

  if (rows.length === 0) {
    throw new ApiError(404, 'Account not found');
  }

  return rows[0];
}

async function listAccounts() {
  const [rows] = await pool.query(
    `
      SELECT
        a.id,
        a.username,
        a.status,
        a.last_login_at AS lastLoginAt,
        e.id AS employeeId,
        e.code AS employeeCode,
        e.full_name AS employeeName,
        r.id AS roleId,
        r.code AS roleCode,
        r.name AS roleName
      FROM accounts a
      INNER JOIN employees e ON e.id = a.employee_id
      INNER JOIN roles r ON r.id = a.role_id
      ORDER BY a.id
    `
  );

  return rows;
}

async function createAccount(payload) {
  const { employeeId, roleId, username, password } = payload;

  const [[employee]] = await pool.query('SELECT id FROM employees WHERE id = ? LIMIT 1', [
    employeeId,
  ]);
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  const [[role]] = await pool.query('SELECT id FROM roles WHERE id = ? LIMIT 1', [roleId]);
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  const [[existingByEmployee]] = await pool.query(
    'SELECT id FROM accounts WHERE employee_id = ? LIMIT 1',
    [employeeId]
  );
  if (existingByEmployee) {
    throw new ApiError(409, 'Employee already has an account');
  }

  const [[existingByUsername]] = await pool.query(
    'SELECT id FROM accounts WHERE username = ? LIMIT 1',
    [username]
  );
  if (existingByUsername) {
    throw new ApiError(409, 'Username already exists');
  }

  const passwordHash = await hashPassword(password);

  const [result] = await pool.query(
    `
      INSERT INTO accounts (employee_id, role_id, username, password_hash, status)
      VALUES (?, ?, ?, ?, 'active')
    `,
    [employeeId, roleId, username, passwordHash]
  );

  const [rows] = await pool.query(
    `
      SELECT
        a.id,
        a.username,
        a.status,
        e.id AS employeeId,
        e.code AS employeeCode,
        e.full_name AS employeeName,
        r.id AS roleId,
        r.code AS roleCode,
        r.name AS roleName
      FROM accounts a
      INNER JOIN employees e ON e.id = a.employee_id
      INNER JOIN roles r ON r.id = a.role_id
      WHERE a.id = ?
    `,
    [result.insertId]
  );

  return rows[0];
}

async function updateAccount(accountId, payload) {
  const { roleId, username, password } = payload;

  const existingAccount = await getAccountById(accountId);

  const [[role]] = await pool.query('SELECT id FROM roles WHERE id = ? LIMIT 1', [roleId]);
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  const [[existingByUsername]] = await pool.query(
    'SELECT id FROM accounts WHERE username = ? AND id <> ? LIMIT 1',
    [username, accountId]
  );
  if (existingByUsername) {
    throw new ApiError(409, 'Username already exists');
  }

  let passwordHash = null;
  if (password) {
    passwordHash = await hashPassword(password);
  }

  await pool.query(
    `
      UPDATE accounts
      SET
        role_id = ?,
        username = ?,
        password_hash = COALESCE(?, password_hash)
      WHERE id = ?
    `,
    [roleId, username, passwordHash, accountId]
  );

  return getAccountById(accountId);
}

async function updateAccountStatus(accountId, status) {
  const allowedStatuses = ['active', 'inactive', 'locked'];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid account status');
  }

  await getAccountById(accountId);

  await pool.query('UPDATE accounts SET status = ? WHERE id = ?', [status, accountId]);

  return getAccountById(accountId);
}

module.exports = {
  listAccounts,
  createAccount,
  updateAccount,
  updateAccountStatus,
};
