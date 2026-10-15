const productService = require('./products.service');

async function listModels(req, res) {
  const data = await productService.listModels();
  res.json({ success: true, data });
}

async function createModel(req, res) {
  const data = await productService.createModel(req.body);
  res.status(201).json({ success: true, data });
}

async function updateModel(req, res) {
  const data = await productService.updateModel(Number(req.params.id), req.body);
  res.json({ success: true, data });
}

async function updateModelStatus(req, res) {
  const data = await productService.updateModelStatus(Number(req.params.id), req.body.isActive);
  res.json({ success: true, data });
}

async function uploadModelImage(req, res) {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'Missing image file' });
    return;
  }

  const data = await productService.updateModelImage(Number(req.params.id), req.file.filename);
  res.json({ success: true, data });
}

async function listVariants(req, res) {
  const data = await productService.listVariants();
  res.json({ success: true, data });
}

async function createVariant(req, res) {
  const data = await productService.createVariant(req.body);
  res.status(201).json({ success: true, data });
}

async function updateVariant(req, res) {
  const data = await productService.updateVariant(Number(req.params.id), req.body);
  res.json({ success: true, data });
}

async function updateVariantStatus(req, res) {
  const data = await productService.updateVariantStatus(Number(req.params.id), req.body.isActive);
  res.json({ success: true, data });
}

async function listInventory(req, res) {
  const data = await productService.listInventory();
  res.json({ success: true, data });
}

async function createInventoryItem(req, res) {
  const data = await productService.createInventoryItem(req.body);
  res.status(201).json({ success: true, data });
}

module.exports = {
  listModels,
  createModel,
  updateModel,
  updateModelStatus,
  uploadModelImage,
  listVariants,
  createVariant,
  updateVariant,
  updateVariantStatus,
  listInventory,
  createInventoryItem,
};
