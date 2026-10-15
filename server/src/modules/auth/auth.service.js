const pool = require('../../config/database');
const ApiError = require('../../utils/api-error');
const { comparePassword } = require('../../utils/password');
const { signAccessToken } = require('../../utils/jwt');

async function getPermissionsByRoleId(roleId) {
  const [rows] = await pool.query(
    `
      SELECT p.module_code AS moduleCode, p.action_code AS actionCode, p.display_name AS displayName
      FROM role_permissions rp
      INNER JOIN permissions p ON p.id = rp.permission_id
      WHERE rp.role_id = ?
      ORDER BY p.module_code, p.action_code
    `,
    [roleId]
  );

  return rows;
}

async function getCurrentUserByAccountId(accountId) {
  const [rows] = await pool.query(
    `
      SELECT
        a.id AS accountId,
        a.username,
        a.status AS accountStatus,
        a.last_login_at AS lastLoginAt,
        e.id AS employeeId,
        e.code AS employeeCode,
        e.full_name AS fullName,
        e.email,
        e.phone,
        e.is_active AS employeeActive,
        r.id AS roleId,
        r.code AS roleCode,
        r.name AS roleName,
        r.is_active AS roleActive
      FROM accounts a
      INNER JOIN employees e ON e.id = a.employee_id
      INNER JOIN roles r ON r.id = a.role_id
      WHERE a.id = ?
      LIMIT 1
    `,
    [accountId]
  );

  if (rows.length === 0) {
    return null;
  }

  const currentUser = rows[0];
  const permissions = await getPermissionsByRoleId(currentUser.roleId);

  return {
    account: {
      id: currentUser.accountId,
      username: currentUser.username,
      status: currentUser.accountStatus,
      lastLoginAt: currentUser.lastLoginAt,
    },
    employee: {
      id: currentUser.employeeId,
      code: currentUser.employeeCode,
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone,
      isActive: Boolean(currentUser.employeeActive),
    },
    role: {
      id: currentUser.roleId,
      code: currentUser.roleCode,
      name: currentUser.roleName,
      isActive: Boolean(currentUser.roleActive),
    },
    permissions,
  };
}

async function login(username, password) {
  const [rows] = await pool.query(
    `
      SELECT
        a.id AS accountId,
        a.employee_id AS employeeId,
        a.role_id AS roleId,
        a.username,
        a.password_hash AS passwordHash,
        a.status,
        e.is_active AS employeeActive,
        r.is_active AS roleActive
      FROM accounts a
      INNER JOIN employees e ON e.id = a.employee_id
      INNER JOIN roles r ON r.id = a.role_id
      WHERE a.username = ?
      LIMIT 1
    `,
    [username]
  );

  if (rows.length === 0) {
    throw new ApiError(401, 'Invalid username or password');
  }

  const account = rows[0];
  const isPasswordValid = await comparePassword(password, account.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid username or password');
  }

  if (
    account.status !== 'active' ||
    !Boolean(account.employeeActive) ||
    !Boolean(account.roleActive)
  ) {
    throw new ApiError(403, 'Account is inactive');
  }

  await pool.query('UPDATE accounts SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [
    account.accountId,
  ]);

  const token = signAccessToken({
    accountId: account.accountId,
    employeeId: account.employeeId,
    roleId: account.roleId,
  });

  const currentUser = await getCurrentUserByAccountId(account.accountId);

  return {
    token,
    ...currentUser,
  };
}

module.exports = {
  getCurrentUserByAccountId,
  getPermissionsByRoleId,
  login,
};
