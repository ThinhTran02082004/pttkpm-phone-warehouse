const pool = require('../../config/database');
const ApiError = require('../../utils/api-error');

const attributeConfig = {
  brands: {
    table: 'brands',
    select: 'SELECT id, code, name, is_active AS isActive FROM brands ORDER BY id',
    insertColumns: ['code', 'name'],
  },
  origins: {
    table: 'origins',
    select: 'SELECT id, code, name, is_active AS isActive FROM origins ORDER BY id',
    insertColumns: ['code', 'name'],
  },
  operatingSystems: {
    table: 'operating_systems',
    select:
      'SELECT id, code, name, is_active AS isActive FROM operating_systems ORDER BY id',
    insertColumns: ['code', 'name'],
  },
  colors: {
    table: 'colors',
    select: 'SELECT id, code, name, is_active AS isActive FROM colors ORDER BY id',
    insertColumns: ['code', 'name'],
  },
  rams: {
    table: 'rams',
    select: 'SELECT id, size_gb AS sizeGb, is_active AS isActive FROM rams ORDER BY size_gb',
    insertColumns: ['size_gb'],
  },
  roms: {
    table: 'roms',
    select: 'SELECT id, size_gb AS sizeGb, is_active AS isActive FROM roms ORDER BY size_gb',
    insertColumns: ['size_gb'],
  },
};

function getAttributeDefinition(attributeType) {
  const definition = attributeConfig[attributeType];

  if (!definition) {
    throw new ApiError(404, 'Unsupported attribute type');
  }

  return definition;
}

function normalizeAttributeRow(row) {
  if (!row) {
    return null;
  }

  return {
    ...row,
    isActive: Boolean(row.isActive),
  };
}

async function getAttributeById(attributeType, id) {
  const definition = getAttributeDefinition(attributeType);
  const selectById = definition.select.replace(/ ORDER BY .+$/, ' WHERE id = ?');
  const [rows] = await pool.query(selectById, [id]);

  return normalizeAttributeRow(rows[0]);
}

async function listAttributes(attributeType) {
  const definition = getAttributeDefinition(attributeType);
  const [rows] = await pool.query(definition.select);

  return rows.map(normalizeAttributeRow);
}

async function createAttribute(attributeType, payload) {
  const definition = getAttributeDefinition(attributeType);

  if (attributeType === 'rams' || attributeType === 'roms') {
    const sizeGb = Number(payload.sizeGb);
    const [duplicateRows] = await pool.query(
      `SELECT id FROM ${definition.table} WHERE size_gb = ? LIMIT 1`,
      [sizeGb]
    );

    if (duplicateRows.length > 0) {
      throw new ApiError(409, 'Attribute already exists');
    }

    const [result] = await pool.query(`INSERT INTO ${definition.table} (size_gb) VALUES (?)`, [
      sizeGb,
    ]);

    return getAttributeById(attributeType, result.insertId);
  }

  const code = String(payload.code || '').trim().toLowerCase();
  const name = String(payload.name || '').trim();

  const [duplicateRows] = await pool.query(
    `SELECT id FROM ${definition.table} WHERE code = ? OR name = ? LIMIT 1`,
    [code, name]
  );

  if (duplicateRows.length > 0) {
    throw new ApiError(409, 'Attribute already exists');
  }

  const [result] = await pool.query(
    `INSERT INTO ${definition.table} (${definition.insertColumns.join(', ')}) VALUES (?, ?)`,
    [code, name]
  );

  const [rows] = await pool.query(
    `SELECT id, code, name, is_active AS isActive FROM ${definition.table} WHERE id = ?`,
    [result.insertId]
  );

  return normalizeAttributeRow(rows[0]);
}

async function updateAttribute(attributeType, id, payload) {
  const definition = getAttributeDefinition(attributeType);
  const currentItem = await getAttributeById(attributeType, id);

  if (!currentItem) {
    throw new ApiError(404, 'Attribute not found');
  }

  if (attributeType === 'rams' || attributeType === 'roms') {
    const sizeGb = Number(payload.sizeGb);
    const [duplicateRows] = await pool.query(
      `SELECT id FROM ${definition.table} WHERE size_gb = ? AND id <> ? LIMIT 1`,
      [sizeGb, id]
    );

    if (duplicateRows.length > 0) {
      throw new ApiError(409, 'Attribute already exists');
    }

    await pool.query(`UPDATE ${definition.table} SET size_gb = ? WHERE id = ?`, [sizeGb, id]);
    return getAttributeById(attributeType, id);
  }

  const code = String(payload.code || '').trim().toLowerCase();
  const name = String(payload.name || '').trim();
  const [duplicateRows] = await pool.query(
    `SELECT id FROM ${definition.table} WHERE (code = ? OR name = ?) AND id <> ? LIMIT 1`,
    [code, name, id]
  );

  if (duplicateRows.length > 0) {
    throw new ApiError(409, 'Attribute already exists');
  }

  await pool.query(`UPDATE ${definition.table} SET code = ?, name = ? WHERE id = ?`, [code, name, id]);
  return getAttributeById(attributeType, id);
}

async function updateAttributeStatus(attributeType, id, isActive) {
  const currentItem = await getAttributeById(attributeType, id);

  if (!currentItem) {
    throw new ApiError(404, 'Attribute not found');
  }

  const definition = getAttributeDefinition(attributeType);
  await pool.query(`UPDATE ${definition.table} SET is_active = ? WHERE id = ?`, [isActive ? 1 : 0, id]);

  return getAttributeById(attributeType, id);
}

module.exports = {
  listAttributes,
  createAttribute,
  updateAttribute,
  updateAttributeStatus,
};
