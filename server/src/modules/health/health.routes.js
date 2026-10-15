const express = require('express');

const pool = require('../../config/database');
const asyncHandler = require('../../utils/async-handler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT DATABASE() AS database_name');

    res.json({
      success: true,
      status: 'ok',
      database: {
        connected: true,
        name: rows[0]?.database_name || null,
      },
      timestamp: new Date().toISOString(),
    });
  })
);

module.exports = router;
