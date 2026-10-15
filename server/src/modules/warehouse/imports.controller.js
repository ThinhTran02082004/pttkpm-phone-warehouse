const importService = require('./imports.service');

async function listImports(req, res) {
  const data = await importService.listImports();
  res.json({ success: true, data });
}

async function createImportOrder(req, res) {
  const data = await importService.createImportOrder(req.body, req.user);
  res.status(201).json({ success: true, data });
}

module.exports = {
  listImports,
  createImportOrder,
};
