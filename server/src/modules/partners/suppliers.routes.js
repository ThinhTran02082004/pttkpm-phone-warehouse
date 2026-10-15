const express = require('express');

const asyncHandler = require('../../utils/async-handler');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validateRequest = require('../../middlewares/validate-request');
const controller = require('./suppliers.controller');

const router = express.Router();

router.get('/', authenticate, authorize('suppliers', 'view'), asyncHandler(controller.listSuppliers));
router.post(
  '/',
  authenticate,
  authorize('suppliers', 'create'),
  validateRequest(['code', 'name', 'phone']),
  asyncHandler(controller.createSupplier)
);
router.put(
  '/:id',
  authenticate,
  authorize('suppliers', 'update'),
  validateRequest(['code', 'name', 'phone']),
  asyncHandler(controller.updateSupplier)
);
router.patch(
  '/:id/status',
  authenticate,
  authorize('suppliers', 'update'),
  validateRequest(['isActive']),
  asyncHandler(controller.updateSupplierStatus)
);

module.exports = router;
