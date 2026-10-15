const supplierService = require('./suppliers.service');

async function listSuppliers(req, res) {
  const data = await supplierService.listSuppliers(req.query.q);
  res.json({ success: true, data });
}

async function createSupplier(req, res) {
  const data = await supplierService.createSupplier(req.body);
  res.status(201).json({ success: true, data });
}

async function updateSupplier(req, res) {
  const data = await supplierService.updateSupplier(req.params.id, req.body);
  res.json({ success: true, data });
}

async function updateSupplierStatus(req, res) {
  const data = await supplierService.updateSupplierStatus(req.params.id, req.body.isActive);
  res.json({ success: true, data });
}

module.exports = {
  listSuppliers,
  createSupplier,
  updateSupplier,
  updateSupplierStatus,
};
