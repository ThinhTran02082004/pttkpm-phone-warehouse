const express = require('express');

const asyncHandler = require('../../utils/async-handler');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validateRequest = require('../../middlewares/validate-request');
const controller = require('./roles.controller');

const router = express.Router();

router.get('/', authenticate, authorize('roles', 'view'), asyncHandler(controller.listRoles));
router.post(
  '/',
  authenticate,
  authorize('roles', 'create'),
  validateRequest(['code', 'name']),
  asyncHandler(controller.createRole)
);
router.put(
  '/:id',
  authenticate,
  authorize('roles', 'update'),
  validateRequest(['code', 'name']),
  asyncHandler(controller.updateRole)
);
router.patch(
  '/:id/status',
  authenticate,
  authorize('roles', 'update'),
  validateRequest(['isActive']),
  asyncHandler(controller.updateRoleStatus)
);

module.exports = router;
