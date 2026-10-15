const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/config/database');

const runId = Date.now().toString();
const employeeCode = `EMP${runId.slice(-5)}`;
const createdEmployeeEmail = `nguyenvantest${runId}@company.com`;
const createdUsername = `testaccount${runId.slice(-5)}`;
const createdPhone = `09${runId.slice(-8)}`;

async function login(username, password) {
  const response = await request(app).post('/api/auth/login').send({ username, password });
  return response;
}

describe('Authentication and RBAC', () => {
  afterAll(async () => {
    await pool.query('DELETE FROM employees WHERE email = ?', [createdEmployeeEmail]);
    await pool.end();
  });

  it('allows a valid account to log in and fetch the current user', async () => {
    const loginResponse = await login('admin', '123456');

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.data.token).toBeTruthy();

    const meResponse = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.data.token}`);

    expect(meResponse.statusCode).toBe(200);
    expect(meResponse.body.data.account.username).toBe('admin');
    expect(meResponse.body.data.role.code).toBe('admin');
    expect(meResponse.body.data.employee.fullName).toBe('Nguyễn Thị Mai');
    expect(meResponse.body.data.role.name).toBe('Quản trị viên');
  });

  it('rejects invalid credentials', async () => {
    const loginResponse = await login('admin', 'wrong-password');

    expect(loginResponse.statusCode).toBe(401);
    expect(loginResponse.body.success).toBe(false);
  });

  it('prevents a warehouse manager from creating a new role', async () => {
    const loginResponse = await login('warehouse01', '123456');
    const token = loginResponse.body.data.token;

    const response = await request(app)
      .post('/api/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: 'temporary_role',
        name: 'Vai trò tạm',
        description: 'Không nên được tạo bởi quản lý kho',
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('allows admin to create an employee and an account', async () => {
    const loginResponse = await login('admin', '123456');
    const token = loginResponse.body.data.token;

    const employeeResponse = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: employeeCode,
        fullName: 'Nguyễn Văn Test',
        gender: 'male',
        dateOfBirth: '1995-01-01',
        phone: createdPhone,
        email: createdEmployeeEmail,
        address: 'Quận 7, TP.HCM',
      });

    expect(employeeResponse.statusCode).toBe(201);
    expect(employeeResponse.body.success).toBe(true);

    const accountResponse = await request(app)
      .post('/api/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        employeeId: employeeResponse.body.data.id,
        roleId: 2,
        username: createdUsername,
        password: '123456',
      });

    expect(accountResponse.statusCode).toBe(201);
    expect(accountResponse.body.success).toBe(true);

    const listResponse = await request(app)
      .get('/api/accounts')
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.statusCode).toBe(200);
    expect(
      listResponse.body.data.some((account) => account.username === createdUsername)
    ).toBe(true);
  });
});
