const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/config/database');

afterAll(async () => {
  await pool.end();
});

describe('GET /api/health', () => {
  it('returns application and database health information', async () => {
    const response = await request(app).get('/api/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe('ok');
    expect(response.body.database.connected).toBe(true);
    expect(response.body.database.name).toBe('pttkpm_rebuild');
  });
});
