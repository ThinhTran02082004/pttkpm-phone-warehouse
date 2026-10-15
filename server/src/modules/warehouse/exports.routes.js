const express = require('express');

const asyncHandler = require('../../utils/async-handler');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validateRequest = require('../../middlewares/validate-request');
const controller = require('./exports.controller');

const router = express.Router();

router.get('/', authenticate, authorize('exports', 'view'), asyncHandler(controller.listExports));
router.post(
  '/',
  authenticate,
  authorize('exports', 'create'),
  validateRequest(['code', 'items']),
  asyncHandler(controller.createExportOrder)
);

module.exports = router;
