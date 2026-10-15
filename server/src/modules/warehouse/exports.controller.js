const exportService = require('./exports.service');

async function listExports(req, res) {
  const data = await exportService.listExports();
  res.json({ success: true, data });
}

async function createExportOrder(req, res) {
  const data = await exportService.createExportOrder(req.body, req.user);
  res.status(201).json({ success: true, data });
}

module.exports = {
  listExports,
  createExportOrder,
};
