const ApiError = require('../../utils/api-error');
const statisticsService = require('./statistics.service');

function parseDateFilter(query) {
  const { startDate, endDate } = query;
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!startDate && !endDate) {
    return null;
  }

  if ((startDate && !datePattern.test(startDate)) || (endDate && !datePattern.test(endDate))) {
    throw new ApiError(400, 'Invalid statistics date filter');
  }

  if (startDate && endDate && startDate > endDate) {
    throw new ApiError(400, 'Invalid statistics date filter');
  }

  return {
    startDate: startDate || null,
    endDate: endDate || null,
  };
}

async function getDashboardSummary(req, res) {
  const data = await statisticsService.getDashboardSummary(parseDateFilter(req.query));
  res.json({ success: true, data });
}

async function getInventorySummary(req, res) {
  const data = await statisticsService.getInventorySummary();
  res.json({ success: true, data });
}

async function getRevenueSummary(req, res) {
  const data = await statisticsService.getRevenueSummary(parseDateFilter(req.query));
  res.json({ success: true, data });
}

module.exports = {
  getDashboardSummary,
  getInventorySummary,
  getRevenueSummary,
};
