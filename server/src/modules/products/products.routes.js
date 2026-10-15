const express = require('express');

const asyncHandler = require('../../utils/async-handler');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validateRequest = require('../../middlewares/validate-request');
const controller = require('./products.controller');
const { uploadProductImage } = require('./products.upload');

const router = express.Router();

router.get('/models', authenticate, authorize('products', 'view'), asyncHandler(controller.listModels));
router.post(
  '/models',
  authenticate,
  authorize('products', 'create'),
  validateRequest(['code', 'name', 'brandId', 'originId', 'operatingSystemId']),
  asyncHandler(controller.createModel)
);
router.put(
  '/models/:id',
  authenticate,
  authorize('products', 'update'),
  validateRequest(['code', 'name', 'brandId', 'originId', 'operatingSystemId']),
  asyncHandler(controller.updateModel)
);
router.patch(
  '/models/:id/status',
  authenticate,
  authorize('products', 'update'),
  validateRequest(['isActive']),
  asyncHandler(controller.updateModelStatus)
);
router.post(
  '/models/:id/image',
  authenticate,
  authorize('products', 'update'),
  uploadProductImage.single('image'),
  asyncHandler(controller.uploadModelImage)
);

router.get(
  '/variants',
  authenticate,
  authorize('products', 'view'),
  asyncHandler(controller.listVariants)
);
router.post(
  '/variants',
  authenticate,
  authorize('products', 'create'),
  validateRequest([
    'code',
    'productModelId',
    'ramId',
    'romId',
    'colorId',
    'purchasePrice',
    'sellingPrice',
  ]),
  asyncHandler(controller.createVariant)
);
router.put(
  '/variants/:id',
  authenticate,
  authorize('products', 'update'),
  validateRequest([
    'code',
    'productModelId',
    'ramId',
    'romId',
    'colorId',
    'purchasePrice',
    'sellingPrice',
  ]),
  asyncHandler(controller.updateVariant)
);
router.patch(
  '/variants/:id/status',
  authenticate,
  authorize('products', 'update'),
  validateRequest(['isActive']),
  asyncHandler(controller.updateVariantStatus)
);

router.get(
  '/inventory',
  authenticate,
  authorize('products', 'view'),
  asyncHandler(controller.listInventory)
);
router.post(
  '/inventory',
  authenticate,
  authorize('products', 'create'),
  validateRequest(['variantId', 'purchaseOrderItemId', 'imei']),
  asyncHandler(controller.createInventoryItem)
);

module.exports = router;
