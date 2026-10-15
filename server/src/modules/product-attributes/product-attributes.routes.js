const express = require('express');

const asyncHandler = require('../../utils/async-handler');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validateRequest = require('../../middlewares/validate-request');
const controller = require('./product-attributes.controller');

const router = express.Router();

router.get(
  '/:attributeType',
  authenticate,
  authorize('product_attributes', 'view'),
  asyncHandler(controller.listAttributes)
);

router.post(
  '/:attributeType',
  authenticate,
  authorize('product_attributes', 'create'),
  asyncHandler(controller.createAttribute)
);
router.put(
  '/:attributeType/:id',
  authenticate,
  authorize('product_attributes', 'update'),
  asyncHandler(controller.updateAttribute)
);
router.patch(
  '/:attributeType/:id/status',
  authenticate,
  authorize('product_attributes', 'update'),
  validateRequest(['isActive']),
  asyncHandler(controller.updateAttributeStatus)
);

module.exports = router;
