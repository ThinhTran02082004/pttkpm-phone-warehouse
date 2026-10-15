const express = require('express');

const asyncHandler = require('../../utils/async-handler');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validateRequest = require('../../middlewares/validate-request');
const controller = require('./accounts.controller');

const router = express.Router();

router.get('/', authenticate, authorize('accounts', 'view'), asyncHandler(controller.listAccounts));
router.post(
  '/',
  authenticate,
  authorize('accounts', 'create'),
  validateRequest(['employeeId', 'roleId', 'username', 'password']),
  asyncHandler(controller.createAccount)
);
router.put(
  '/:id',
  authenticate,
  authorize('accounts', 'update'),
  validateRequest(['roleId', 'username']),
  asyncHandler(controller.updateAccount)
);
router.patch(
  '/:id/status',
  authenticate,
  authorize('accounts', 'update'),
  validateRequest(['status']),
  asyncHandler(controller.updateAccountStatus)
);

module.exports = router;
