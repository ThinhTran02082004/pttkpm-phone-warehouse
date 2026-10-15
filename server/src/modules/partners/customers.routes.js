const express = require('express');

const asyncHandler = require('../../utils/async-handler');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validateRequest = require('../../middlewares/validate-request');
const controller = require('./customers.controller');

const router = express.Router();

router.get('/', authenticate, authorize('customers', 'view'), asyncHandler(controller.listCustomers));
router.post(
  '/',
  authenticate,
  authorize('customers', 'create'),
  validateRequest(['code', 'fullName', 'phone']),
  asyncHandler(controller.createCustomer)
);
router.put(
  '/:id',
  authenticate,
  authorize('customers', 'update'),
  validateRequest(['code', 'fullName', 'phone']),
  asyncHandler(controller.updateCustomer)
);
router.patch(
  '/:id/status',
  authenticate,
  authorize('customers', 'update'),
  validateRequest(['isActive']),
  asyncHandler(controller.updateCustomerStatus)
);

module.exports = router;
