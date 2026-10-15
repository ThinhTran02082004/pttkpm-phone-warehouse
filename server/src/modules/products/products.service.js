const fs = require('fs');
const path = require('path');

const env = require('../../config/env');
const pool = require('../../config/database');
const ApiError = require('../../utils/api-error');

async function listModels() {
  const [rows] = await pool.query(
    `
      SELECT
        pm.id,
        pm.code,
        pm.name,
        pm.chipset,
        pm.battery_capacity_mah AS batteryCapacityMah,
        pm.screen_size_inches AS screenSizeInches,
        pm.front_camera_mp AS frontCameraMp,
        pm.rear_camera_mp AS rearCameraMp,
        pm.operating_system_version AS operatingSystemVersion,
        pm.warranty_months AS warrantyMonths,
        pm.image_path AS imagePath,
        pm.description,
        pm.is_active AS isActive,
        b.id AS brandId,
        b.name AS brandName,
        o.id AS originId,
        o.name AS originName,
        os.id AS operatingSystemId,
        os.name AS operatingSystemName
      FROM product_models pm
      INNER JOIN brands b ON b.id = pm.brand_id
      LEFT JOIN origins o ON o.id = pm.origin_id
      LEFT JOIN operating_systems os ON os.id = pm.operating_system_id
      ORDER BY pm.id
    `
  );

  return rows.map((row) => ({
    ...row,
    isActive: Boolean(row.isActive),
  }));
}

async function createModel(payload) {
  const {
    code,
    name,
    brandId,
    originId,
    operatingSystemId,
    chipset,
    batteryCapacityMah,
    screenSizeInches,
    frontCameraMp,
    rearCameraMp,
    operatingSystemVersion,
    warrantyMonths,
  } = payload;

  const normalizedCode = String(code || '').trim().toUpperCase();

  const [[existingModel]] = await pool.query(
    'SELECT id FROM product_models WHERE code = ? LIMIT 1',
    [normalizedCode]
  );
  if (existingModel) {
    throw new ApiError(409, 'Product model code already exists');
  }

  const [[brand]] = await pool.query('SELECT id FROM brands WHERE id = ? LIMIT 1', [brandId]);
  if (!brand) {
    throw new ApiError(404, 'Brand not found');
  }

  const [[origin]] = await pool.query('SELECT id FROM origins WHERE id = ? LIMIT 1', [originId]);
  if (!origin) {
    throw new ApiError(404, 'Origin not found');
  }

  const [[operatingSystem]] = await pool.query(
    'SELECT id FROM operating_systems WHERE id = ? LIMIT 1',
    [operatingSystemId]
  );
  if (!operatingSystem) {
    throw new ApiError(404, 'Operating system not found');
  }

  const [result] = await pool.query(
    `
      INSERT INTO product_models (
        code,
        name,
        brand_id,
        origin_id,
        operating_system_id,
        chipset,
        battery_capacity_mah,
        screen_size_inches,
        front_camera_mp,
        rear_camera_mp,
        operating_system_version,
        warranty_months
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      normalizedCode,
      name,
      brandId,
      originId,
      operatingSystemId,
      chipset || null,
      batteryCapacityMah || null,
      screenSizeInches || null,
      frontCameraMp || null,
      rearCameraMp || null,
      operatingSystemVersion || null,
      warrantyMonths || 12,
    ]
  );

  const models = await listModels();
  return models.find((item) => item.id === result.insertId);
}

async function getModelById(id) {
  const models = await listModels();
  return models.find((item) => item.id === id);
}

async function ensureReferenceExists(tableName, id, label) {
  const [[row]] = await pool.query(`SELECT id FROM ${tableName} WHERE id = ? LIMIT 1`, [id]);

  if (!row) {
    throw new ApiError(404, `${label} not found`);
  }
}

async function updateModel(id, payload) {
  const currentModel = await getModelById(id);

  if (!currentModel) {
    throw new ApiError(404, 'Product model not found');
  }

  const {
    code,
    name,
    brandId,
    originId,
    operatingSystemId,
    chipset,
    batteryCapacityMah,
    screenSizeInches,
    frontCameraMp,
    rearCameraMp,
    operatingSystemVersion,
    warrantyMonths,
  } = payload;

  const normalizedCode = String(code || '').trim().toUpperCase();

  const [[existingModel]] = await pool.query(
    'SELECT id FROM product_models WHERE code = ? AND id <> ? LIMIT 1',
    [normalizedCode, id]
  );
  if (existingModel) {
    throw new ApiError(409, 'Product model code already exists');
  }

  await ensureReferenceExists('brands', brandId, 'Brand');
  await ensureReferenceExists('origins', originId, 'Origin');
  await ensureReferenceExists('operating_systems', operatingSystemId, 'Operating system');

  await pool.query(
    `
      UPDATE product_models
      SET
        code = ?,
        name = ?,
        brand_id = ?,
        origin_id = ?,
        operating_system_id = ?,
        chipset = ?,
        battery_capacity_mah = ?,
        screen_size_inches = ?,
        front_camera_mp = ?,
        rear_camera_mp = ?,
        operating_system_version = ?,
        warranty_months = ?
      WHERE id = ?
    `,
    [
      normalizedCode,
      name,
      brandId,
      originId,
      operatingSystemId,
      chipset === undefined ? currentModel.chipset : chipset || null,
      batteryCapacityMah === undefined
        ? currentModel.batteryCapacityMah
        : batteryCapacityMah || null,
      screenSizeInches === undefined ? currentModel.screenSizeInches : screenSizeInches || null,
      frontCameraMp === undefined ? currentModel.frontCameraMp : frontCameraMp || null,
      rearCameraMp === undefined ? currentModel.rearCameraMp : rearCameraMp || null,
      operatingSystemVersion === undefined
        ? currentModel.operatingSystemVersion
        : operatingSystemVersion || null,
      warrantyMonths === undefined ? currentModel.warrantyMonths : warrantyMonths || 12,
      id,
    ]
  );

  return getModelById(id);
}

async function updateModelStatus(id, isActive) {
  const currentModel = await getModelById(id);

  if (!currentModel) {
    throw new ApiError(404, 'Product model not found');
  }

  await pool.query('UPDATE product_models SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, id]);
  return getModelById(id);
}

async function updateModelImage(id, filename) {
  const currentModel = await getModelById(id);

  if (!currentModel) {
    throw new ApiError(404, 'Product model not found');
  }

  const nextImagePath = `/api/images/products/${filename}`;

  if (
    currentModel.imagePath &&
    currentModel.imagePath.startsWith('/api/images/products/') &&
    currentModel.imagePath !== nextImagePath
  ) {
    const previousFilename = path.basename(currentModel.imagePath);
    const previousFilePath = path.resolve(process.cwd(), env.uploadDir, 'products', previousFilename);

    if (fs.existsSync(previousFilePath)) {
      fs.unlinkSync(previousFilePath);
    }
  }

  await pool.query('UPDATE product_models SET image_path = ? WHERE id = ?', [nextImagePath, id]);
  return getModelById(id);
}

async function listVariants() {
  const [rows] = await pool.query(
    `
      SELECT
        pv.id,
        pv.code,
        pv.purchase_price AS purchasePrice,
        pv.selling_price AS sellingPrice,
        pv.is_active AS isActive,
        pm.id AS productModelId,
        pm.code AS productModelCode,
        pm.name AS productModelName,
        r.id AS ramId,
        r.size_gb AS ramSizeGb,
        ro.id AS romId,
        ro.size_gb AS romSizeGb,
        c.id AS colorId,
        c.code AS colorCode,
        c.name AS colorName
      FROM product_variants pv
      INNER JOIN product_models pm ON pm.id = pv.product_model_id
      INNER JOIN rams r ON r.id = pv.ram_id
      INNER JOIN roms ro ON ro.id = pv.rom_id
      INNER JOIN colors c ON c.id = pv.color_id
      ORDER BY pv.id
    `
  );

  return rows.map((row) => ({
    ...row,
    isActive: Boolean(row.isActive),
  }));
}

async function createVariant(payload) {
  const {
    code,
    productModelId,
    ramId,
    romId,
    colorId,
    purchasePrice,
    sellingPrice,
  } = payload;

  const normalizedCode = String(code || '').trim().toUpperCase();

  const [[existingByCode]] = await pool.query(
    'SELECT id FROM product_variants WHERE code = ? LIMIT 1',
    [normalizedCode]
  );
  if (existingByCode) {
    throw new ApiError(409, 'Variant code already exists');
  }

  const [[existingByCombo]] = await pool.query(
    `
      SELECT id
      FROM product_variants
      WHERE product_model_id = ? AND ram_id = ? AND rom_id = ? AND color_id = ?
      LIMIT 1
    `,
    [productModelId, ramId, romId, colorId]
  );
  if (existingByCombo) {
    throw new ApiError(409, 'Variant combination already exists');
  }

  const [result] = await pool.query(
    `
      INSERT INTO product_variants (
        code,
        product_model_id,
        ram_id,
        rom_id,
        color_id,
        purchase_price,
        selling_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [normalizedCode, productModelId, ramId, romId, colorId, purchasePrice, sellingPrice]
  );

  const variants = await listVariants();
  return variants.find((item) => item.id === result.insertId);
}

async function getVariantById(id) {
  const variants = await listVariants();
  return variants.find((item) => item.id === id);
}

async function updateVariant(id, payload) {
  const currentVariant = await getVariantById(id);

  if (!currentVariant) {
    throw new ApiError(404, 'Variant not found');
  }

  const {
    code,
    productModelId,
    ramId,
    romId,
    colorId,
    purchasePrice,
    sellingPrice,
  } = payload;

  const normalizedCode = String(code || '').trim().toUpperCase();

  const [[existingByCode]] = await pool.query(
    'SELECT id FROM product_variants WHERE code = ? AND id <> ? LIMIT 1',
    [normalizedCode, id]
  );
  if (existingByCode) {
    throw new ApiError(409, 'Variant code already exists');
  }

  const [[existingByCombo]] = await pool.query(
    `
      SELECT id
      FROM product_variants
      WHERE product_model_id = ? AND ram_id = ? AND rom_id = ? AND color_id = ? AND id <> ?
      LIMIT 1
    `,
    [productModelId, ramId, romId, colorId, id]
  );
  if (existingByCombo) {
    throw new ApiError(409, 'Variant combination already exists');
  }

  await ensureReferenceExists('product_models', productModelId, 'Product model');
  await ensureReferenceExists('rams', ramId, 'RAM');
  await ensureReferenceExists('roms', romId, 'ROM');
  await ensureReferenceExists('colors', colorId, 'Color');

  await pool.query(
    `
      UPDATE product_variants
      SET
        code = ?,
        product_model_id = ?,
        ram_id = ?,
        rom_id = ?,
        color_id = ?,
        purchase_price = ?,
        selling_price = ?
      WHERE id = ?
    `,
    [normalizedCode, productModelId, ramId, romId, colorId, purchasePrice, sellingPrice, id]
  );

  return getVariantById(id);
}

async function updateVariantStatus(id, isActive) {
  const currentVariant = await getVariantById(id);

  if (!currentVariant) {
    throw new ApiError(404, 'Variant not found');
  }

  await pool.query('UPDATE product_variants SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, id]);
  return getVariantById(id);
}

async function listInventory() {
  const [rows] = await pool.query(
    `
      SELECT
        ii.id,
        ii.imei,
        ii.item_status AS itemStatus,
        ii.warranty_until AS warrantyUntil,
        ii.imported_at AS importedAt,
        ii.sold_at AS soldAt,
        ii.notes,
        pv.id AS variantId,
        pv.code AS variantCode,
        pm.name AS productModelName
      FROM inventory_items ii
      INNER JOIN product_variants pv ON pv.id = ii.variant_id
      INNER JOIN product_models pm ON pm.id = pv.product_model_id
      ORDER BY ii.id
    `
  );

  return rows;
}

async function createInventoryItem(payload) {
  const { variantId, purchaseOrderItemId, imei, warrantyUntil } = payload;
  const normalizedImei = String(imei || '').trim();

  const [[existingByImei]] = await pool.query(
    'SELECT id FROM inventory_items WHERE imei = ? LIMIT 1',
    [normalizedImei]
  );
  if (existingByImei) {
    throw new ApiError(409, 'IMEI already exists');
  }

  const [[variant]] = await pool.query('SELECT id FROM product_variants WHERE id = ? LIMIT 1', [
    variantId,
  ]);
  if (!variant) {
    throw new ApiError(404, 'Variant not found');
  }

  const [[purchaseOrderItem]] = await pool.query(
    'SELECT id FROM purchase_order_items WHERE id = ? LIMIT 1',
    [purchaseOrderItemId]
  );
  if (!purchaseOrderItem) {
    throw new ApiError(404, 'Purchase order item not found');
  }

  const [result] = await pool.query(
    `
      INSERT INTO inventory_items (
        variant_id,
        purchase_order_item_id,
        imei,
        item_status,
        warranty_until,
        imported_at
      ) VALUES (?, ?, ?, 'in_stock', ?, CURRENT_TIMESTAMP)
    `,
    [variantId, purchaseOrderItemId, normalizedImei, warrantyUntil || null]
  );

  const inventory = await listInventory();
  return inventory.find((item) => item.id === result.insertId);
}

module.exports = {
  listModels,
  createModel,
  updateModel,
  updateModelStatus,
  updateModelImage,
  listVariants,
  createVariant,
  updateVariant,
  updateVariantStatus,
  listInventory,
  createInventoryItem,
};
