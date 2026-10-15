const express = require('express');

const asyncHandler = require('../../utils/async-handler');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const validateRequest = require('../../middlewares/validate-request');
const controller = require('./services.controller');

const router = express.Router();

router.get('/', authenticate, authorize('services', 'view'), asyncHandler(controller.listServiceTickets));
router.post(
  '/',
  authenticate,
  authorize('services', 'create'),
  validateRequest(['code', 'imei', 'ticketType', 'issueDescription']),
  asyncHandler(controller.createServiceTicket)
);
router.patch(
  '/:id/status',
  authenticate,
  authorize('services', 'update'),
  validateRequest(['status']),
  asyncHandler(controller.updateServiceTicketStatus)
);

module.exports = router;
