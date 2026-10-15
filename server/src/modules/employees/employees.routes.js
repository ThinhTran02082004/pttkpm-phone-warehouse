const express = require('express');

const asyncHandler = require('../../utils/async-handler');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validateRequest = require('../../middlewares/validate-request');
const controller = require('./employees.controller');

const router = express.Router();

router.get('/', authenticate, authorize('employees', 'view'), asyncHandler(controller.listEmployees));
router.post(
  '/',
  authenticate,
  authorize('employees', 'create'),
  validateRequest(['code', 'fullName', 'email']),
  asyncHandler(controller.createEmployee)
);
router.put(
  '/:id',
  authenticate,
  authorize('employees', 'update'),
  validateRequest(['code', 'fullName', 'email']),
  asyncHandler(controller.updateEmployee)
);
router.patch(
  '/:id/status',
  authenticate,
  authorize('employees', 'update'),
  validateRequest(['isActive']),
  asyncHandler(controller.updateEmployeeStatus)
);

module.exports = router;
