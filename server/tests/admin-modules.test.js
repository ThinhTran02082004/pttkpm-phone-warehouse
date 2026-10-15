const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/config/database');

const runId = Date.now().toString();
const trackedEmployeeEmails = new Set();
const trackedAccountUsernames = new Set();
const trackedRoleCodes = new Set();

async function loginAsAdmin() {
  const response = await request(app).post('/api/auth/login').send({
    username: 'admin',
    password: '123456',
  });

  return response.body.data.token;
}

async function deleteTrackedRows(tableName, columnName, values) {
  if (values.length === 0) {
    return;
  }

  const placeholders = values.map(() => '?').join(', ');
  await pool.query(`DELETE FROM ${tableName} WHERE ${columnName} IN (${placeholders})`, values);
}

describe('Admin master data CRUD', () => {
  afterAll(async () => {
    await deleteTrackedRows('accounts', 'username', Array.from(trackedAccountUsernames));
    await deleteTrackedRows('roles', 'code', Array.from(trackedRoleCodes));
    await deleteTrackedRows('employees', 'email', Array.from(trackedEmployeeEmails));
    await pool.end();
  });

  it('updates and deactivates an employee', async () => {
    const token = await loginAsAdmin();
    const initialEmail = `employee-${runId}@company.com`;
    const updatedEmail = `employee-${runId}-updated@company.com`;

    trackedEmployeeEmails.add(initialEmail);
    trackedEmployeeEmails.add(updatedEmail);

    const createResponse = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: `EMP${runId.slice(-5)}`,
        fullName: 'Nguyen Van Sua',
        gender: 'male',
        phone: `09${runId.slice(-8)}`,
        email: initialEmail,
      });

    expect(createResponse.statusCode).toBe(201);

    const employeeId = createResponse.body.data.id;

    const updateResponse = await request(app)
      .put(`/api/employees/${employeeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: `EMP${runId.slice(-5)}U`,
        fullName: 'Nguyen Van Sua Moi',
        gender: 'other',
        phone: `08${runId.slice(-8)}`,
        email: updatedEmail,
      });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.data.fullName).toBe('Nguyen Van Sua Moi');
    expect(updateResponse.body.data.email).toBe(updatedEmail);
    expect(updateResponse.body.data.isActive).toBe(true);

    const statusResponse = await request(app)
      .patch(`/api/employees/${employeeId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isActive: false });

    expect(statusResponse.statusCode).toBe(200);
    expect(statusResponse.body.data.isActive).toBe(false);
  });

  it('updates and deactivates a role', async () => {
    const token = await loginAsAdmin();
    const initialCode = `role_${runId.slice(-5)}`;
    const updatedCode = `role_${runId.slice(-5)}_u`;

    trackedRoleCodes.add(initialCode);
    trackedRoleCodes.add(updatedCode);

    const createResponse = await request(app)
      .post('/api/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: initialCode,
        name: 'Vai tro tam',
        description: 'Mo ta cu',
      });

    expect(createResponse.statusCode).toBe(201);

    const roleId = createResponse.body.data.id;

    const updateResponse = await request(app)
      .put(`/api/roles/${roleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: updatedCode,
        name: 'Vai tro da sua',
        description: 'Mo ta moi',
      });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.data.code).toBe(updatedCode);
    expect(updateResponse.body.data.name).toBe('Vai tro da sua');

    const statusResponse = await request(app)
      .patch(`/api/roles/${roleId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isActive: false });

    expect(statusResponse.statusCode).toBe(200);
    expect(statusResponse.body.data.isActive).toBe(false);
  });

  it('updates and locks an account', async () => {
    const token = await loginAsAdmin();
    const employeeEmail = `account-employee-${runId}@company.com`;
    const username = `acc${runId.slice(-5)}`;
    const updatedUsername = `acc${runId.slice(-5)}u`;

    trackedEmployeeEmails.add(employeeEmail);
    trackedAccountUsernames.add(username);
    trackedAccountUsernames.add(updatedUsername);

    const employeeResponse = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: `ACE${runId.slice(-5)}`,
        fullName: 'Nhan vien tai khoan',
        gender: 'female',
        phone: `07${runId.slice(-8)}`,
        email: employeeEmail,
      });

    expect(employeeResponse.statusCode).toBe(201);

    const accountResponse = await request(app)
      .post('/api/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        employeeId: employeeResponse.body.data.id,
        roleId: 2,
        username,
        password: '123456',
      });

    expect(accountResponse.statusCode).toBe(201);

    const accountId = accountResponse.body.data.id;

    const updateResponse = await request(app)
      .put(`/api/accounts/${accountId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        roleId: 3,
        username: updatedUsername,
        password: '654321',
      });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.data.username).toBe(updatedUsername);
    expect(updateResponse.body.data.roleId).toBe(3);

    const statusResponse = await request(app)
      .patch(`/api/accounts/${accountId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'locked' });

    expect(statusResponse.statusCode).toBe(200);
    expect(statusResponse.body.data.status).toBe('locked');
  });
});
