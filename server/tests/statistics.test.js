const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/config/database');

async function loginAdmin() {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: '123456' });

  return response.body.data.token;
}

describe('Statistics', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('returns dashboard totals derived from the database', async () => {
    const token = await loginAdmin();

    const response = await request(app)
      .get('/api/statistics/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.totalProducts).toBeGreaterThanOrEqual(4);
    expect(response.body.data.totalVariants).toBeGreaterThanOrEqual(6);
    expect(response.body.data.totalInventoryItems).toBeGreaterThanOrEqual(9);
    expect(response.body.data.inStockItems).toBeGreaterThanOrEqual(6);
    expect(response.body.data.soldItems).toBeGreaterThanOrEqual(2);
    expect(response.body.data.inServiceItems).toBeGreaterThanOrEqual(1);
    expect(response.body.data.totalSuppliers).toBeGreaterThanOrEqual(3);
    expect(response.body.data.totalCustomers).toBeGreaterThanOrEqual(3);
    expect(response.body.data.totalRevenue).toBeGreaterThanOrEqual(89979000);
  });

  it('returns inventory summary grouped by variant', async () => {
    const token = await loginAdmin();

    const response = await request(app)
      .get('/api/statistics/inventory')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    const iphone256 = response.body.data.find((item) => item.variantCode === 'IP14PM-8-256-BLACK');
    const samsung256 = response.body.data.find((item) => item.variantCode === 'SGS23U-12-256-BLACK');

    expect(iphone256.inStockItems).toBe(1);
    expect(iphone256.soldItems).toBe(1);
    expect(iphone256.inServiceItems).toBe(0);

    expect(samsung256.inStockItems).toBe(1);
    expect(samsung256.soldItems).toBe(1);
    expect(samsung256.inServiceItems).toBe(0);
  });

  it('returns revenue grouped by sold date', async () => {
    const token = await loginAdmin();

    const response = await request(app)
      .get('/api/statistics/revenue')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    const march8 = response.body.data.find((item) => item.soldDate === '2026-03-08');
    const march12 = response.body.data.find((item) => item.soldDate === '2026-03-12');

    expect(march8.totalOrders).toBe(1);
    expect(march8.totalRevenue).toBe(29990000);

    expect(march12.totalOrders).toBe(1);
    expect(march12.totalRevenue).toBe(59989000);
  });

  it('filters dashboard revenue and revenue summary by date range', async () => {
    const token = await loginAdmin();

    const [dashboardResponse, revenueResponse] = await Promise.all([
      request(app)
        .get('/api/statistics/dashboard?startDate=2026-03-12&endDate=2026-03-12')
        .set('Authorization', `Bearer ${token}`),
      request(app)
        .get('/api/statistics/revenue?startDate=2026-03-12&endDate=2026-03-12')
        .set('Authorization', `Bearer ${token}`),
    ]);

    expect(dashboardResponse.statusCode).toBe(200);
    expect(dashboardResponse.body.success).toBe(true);
    expect(dashboardResponse.body.data.totalRevenue).toBe(59989000);

    expect(revenueResponse.statusCode).toBe(200);
    expect(revenueResponse.body.success).toBe(true);
    expect(revenueResponse.body.data).toHaveLength(1);
    expect(revenueResponse.body.data[0].soldDate).toBe('2026-03-12');
    expect(revenueResponse.body.data[0].totalRevenue).toBe(59989000);
  });

  it('returns 400 when revenue date filter is invalid', async () => {
    const token = await loginAdmin();

    const response = await request(app)
      .get('/api/statistics/revenue?startDate=invalid-date')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid statistics date filter');
  });
});
