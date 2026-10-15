const express = require('express');

const asyncHandler = require('../../utils/async-handler');
const authenticate = require('../../middlewares/authenticate');
const validateRequest = require('../../middlewares/validate-request');
const controller = require('./auth.controller');

const router = express.Router();

router.post('/login', validateRequest(['username', 'password']), asyncHandler(controller.login));
router.get('/me', authenticate, asyncHandler(controller.me));
router.post('/logout', authenticate, asyncHandler(controller.logout));

module.exports = router;
