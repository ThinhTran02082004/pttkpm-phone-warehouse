const attributeService = require('./product-attributes.service');

async function listAttributes(req, res) {
  const data = await attributeService.listAttributes(req.params.attributeType);
  res.json({ success: true, data });
}

async function createAttribute(req, res) {
  const data = await attributeService.createAttribute(req.params.attributeType, req.body);
  res.status(201).json({ success: true, data });
}

async function updateAttribute(req, res) {
  const data = await attributeService.updateAttribute(
    req.params.attributeType,
    Number(req.params.id),
    req.body
  );
  res.json({ success: true, data });
}

async function updateAttributeStatus(req, res) {
  const data = await attributeService.updateAttributeStatus(
    req.params.attributeType,
    Number(req.params.id),
    req.body.isActive
  );
  res.json({ success: true, data });
}

module.exports = {
  listAttributes,
  createAttribute,
  updateAttribute,
  updateAttributeStatus,
};
