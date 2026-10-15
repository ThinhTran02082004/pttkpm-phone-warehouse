const fs = require('fs');
const path = require('path');
const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/config/database');

const runId = Date.now().toString();
const createdBrandCode = `test-brand-${runId}`;
const updatedBrandCode = `test-brand-${runId}-u`;
const createdModelCode = `TMD${runId.slice(-8)}`;
const updatedModelCode = `TMD${runId.slice(-8)}U`;
const createdVariantCode = `${createdModelCode}-8-128-BLACK`;
const updatedVariantCode = `${createdModelCode}-8-128-WHITE`;
const createdImei = `35${runId.slice(-13)}`;

let createdBrandId;
let createdModelId;
let createdVariantId;
let createdInventoryItemId;
let uploadedImageFilename;

async function loginAdmin() {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: '123456' });

  return response.body.data.token;
}

describe('Product attributes, models, variants, and inventory', () => {
  afterAll(async () => {
    if (createdInventoryItemId) {
      await pool.query('DELETE FROM inventory_items WHERE id = ?', [createdInventoryItemId]);
    }

    if (createdVariantId) {
      await pool.query('DELETE FROM product_variants WHERE id = ?', [createdVariantId]);
    }

    if (createdModelId) {
      await pool.query('DELETE FROM product_models WHERE id = ?', [createdModelId]);
    }

    if (createdBrandId) {
      await pool.query('DELETE FROM brands WHERE id = ?', [createdBrandId]);
    }

    if (uploadedImageFilename) {
      const uploadedFilePath = path.join(
        __dirname,
        '..',
        'images',
        'products',
        uploadedImageFilename
      );

      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }

    await pool.end();
  });

  it('creates, updates, and deactivates a brand attribute', async () => {
    const token = await loginAdmin();

    const createResponse = await request(app)
      .post('/api/product-attributes/brands')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: createdBrandCode,
        name: 'Thuong hieu test',
      });

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body.success).toBe(true);
    createdBrandId = createResponse.body.data.id;

    const duplicateResponse = await request(app)
      .post('/api/product-attributes/brands')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: createdBrandCode,
        name: 'Thuong hieu test',
      });

    expect(duplicateResponse.statusCode).toBe(409);

    const updateResponse = await request(app)
      .put(`/api/product-attributes/brands/${createdBrandId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: updatedBrandCode,
        name: 'Thuong hieu da sua',
      });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.data.code).toBe(updatedBrandCode);
    expect(updateResponse.body.data.name).toBe('Thuong hieu da sua');
    expect(updateResponse.body.data.isActive).toBe(true);

    const statusResponse = await request(app)
      .patch(`/api/product-attributes/brands/${createdBrandId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isActive: false });

    expect(statusResponse.statusCode).toBe(200);
    expect(statusResponse.body.data.isActive).toBe(false);
  });

  it('creates, updates, and deactivates a product model', async () => {
    const token = await loginAdmin();

    const modelResponse = await request(app)
      .post('/api/products/models')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: createdModelCode,
        name: 'San pham test',
        brandId: createdBrandId,
        originId: 2,
        operatingSystemId: 2,
        chipset: 'Snapdragon Test',
        batteryCapacityMah: 5000,
        screenSizeInches: 6.5,
        frontCameraMp: 16,
        rearCameraMp: 50,
        operatingSystemVersion: 'Android Test',
        warrantyMonths: 12,
      });

    expect(modelResponse.statusCode).toBe(201);
    expect(modelResponse.body.success).toBe(true);
    createdModelId = modelResponse.body.data.id;

    const updateResponse = await request(app)
      .put(`/api/products/models/${createdModelId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: updatedModelCode,
        name: 'San pham test da sua',
        brandId: createdBrandId,
        originId: 2,
        operatingSystemId: 2,
        chipset: 'Snapdragon Elite',
        batteryCapacityMah: 5200,
        screenSizeInches: 6.7,
        frontCameraMp: 24,
        rearCameraMp: 108,
        operatingSystemVersion: 'Android Test 2',
        warrantyMonths: 18,
      });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.data.code).toBe(updatedModelCode);
    expect(updateResponse.body.data.name).toBe('San pham test da sua');
    expect(updateResponse.body.data.chipset).toBe('Snapdragon Elite');

    const statusResponse = await request(app)
      .patch(`/api/products/models/${createdModelId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isActive: false });

    expect(statusResponse.statusCode).toBe(200);
    expect(statusResponse.body.data.isActive).toBe(false);
  });

  it('uploads an image for an existing product model', async () => {
    const token = await loginAdmin();

    const uploadResponse = await request(app)
      .post(`/api/products/models/${createdModelId}/image`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', Buffer.from('fake-image-content'), 'model-test.png');

    expect(uploadResponse.statusCode).toBe(200);
    expect(uploadResponse.body.success).toBe(true);
    expect(uploadResponse.body.data.imagePath).toMatch(/^\/api\/images\/products\//);

    uploadedImageFilename = uploadResponse.body.data.imagePath.split('/').pop();
  });

  it('creates, updates, and deactivates a variant while rejecting duplicate combinations', async () => {
    const token = await loginAdmin();

    const variantResponse = await request(app)
      .post('/api/products/variants')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: createdVariantCode,
        productModelId: createdModelId,
        ramId: 2,
        romId: 1,
        colorId: 1,
        purchasePrice: 10000000,
        sellingPrice: 12000000,
      });

    expect(variantResponse.statusCode).toBe(201);
    expect(variantResponse.body.success).toBe(true);
    createdVariantId = variantResponse.body.data.id;

    const duplicateResponse = await request(app)
      .post('/api/products/variants')
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: `${createdVariantCode}-DUP`,
        productModelId: createdModelId,
        ramId: 2,
        romId: 1,
        colorId: 1,
        purchasePrice: 10000000,
        sellingPrice: 12000000,
      });

    expect(duplicateResponse.statusCode).toBe(409);
    expect(duplicateResponse.body.success).toBe(false);

    const updateResponse = await request(app)
      .put(`/api/products/variants/${createdVariantId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        code: updatedVariantCode,
        productModelId: createdModelId,
        ramId: 2,
        romId: 1,
        colorId: 2,
        purchasePrice: 10500000,
        sellingPrice: 12500000,
      });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.data.code).toBe(updatedVariantCode);
    expect(updateResponse.body.data.colorId).toBe(2);
    expect(updateResponse.body.data.sellingPrice).toBe('12500000.00');

    const statusResponse = await request(app)
      .patch(`/api/products/variants/${createdVariantId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isActive: false });

    expect(statusResponse.statusCode).toBe(200);
    expect(statusResponse.body.data.isActive).toBe(false);
  });

  it('creates an inventory item and rejects duplicate imei', async () => {
    const token = await loginAdmin();

    const createResponse = await request(app)
      .post('/api/products/inventory')
      .set('Authorization', `Bearer ${token}`)
      .send({
        variantId: createdVariantId,
        purchaseOrderItemId: 1,
        imei: createdImei,
        warrantyUntil: '2027-12-31',
      });

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body.success).toBe(true);
    createdInventoryItemId = createResponse.body.data.id;

    const duplicateResponse = await request(app)
      .post('/api/products/inventory')
      .set('Authorization', `Bearer ${token}`)
      .send({
        variantId: createdVariantId,
        purchaseOrderItemId: 1,
        imei: createdImei,
        warrantyUntil: '2027-12-31',
      });

    expect(duplicateResponse.statusCode).toBe(409);
    expect(duplicateResponse.body.success).toBe(false);
  });
});
