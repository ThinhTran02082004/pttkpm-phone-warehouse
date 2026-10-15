const express = require('express');

const asyncHandler = require('../../utils/async-handler');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const controller = require('./statistics.controller');

const router = express.Router();

router.use(authenticate, authorize('statistics', 'view'));

router.get('/dashboard', asyncHandler(controller.getDashboardSummary));
router.get('/inventory', asyncHandler(controller.getInventorySummary));
router.get('/revenue', asyncHandler(controller.getRevenueSummary));

module.exports = router;
