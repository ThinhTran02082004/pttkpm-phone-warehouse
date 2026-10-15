const ApiError = require('../../utils/api-error');

function normalizeSearchTerm(keyword) {
  return `%${String(keyword || '').trim()}%`;
}

function mapPartnerRow(row) {
  return {
    ...row,
    isActive: Boolean(row.isActive),
  };
}

function validateRequiredPartnerFields(payload, entityName) {
  if (!payload.code || !payload.phone) {
    throw new ApiError(400, `${entityName} code and phone are required`);
  }
}

module.exports = {
  normalizeSearchTerm,
  mapPartnerRow,
  validateRequiredPartnerFields,
};
