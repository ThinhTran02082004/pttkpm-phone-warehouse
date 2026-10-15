const express = require('express');

const asyncHandler = require('../../utils/async-handler');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validateRequest = require('../../middlewares/validate-request');
const controller = require('./imports.controller');

const router = express.Router();

router.get('/', authenticate, authorize('imports', 'view'), asyncHandler(controller.listImports));
router.post(
  '/',
  authenticate,
  authorize('imports', 'create'),
  validateRequest(['code', 'supplierId', 'items']),
  asyncHandler(controller.createImportOrder)
);

module.exports = router;
