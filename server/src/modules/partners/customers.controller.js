const customerService = require('./customers.service');

async function listCustomers(req, res) {
  const data = await customerService.listCustomers(req.query.q);
  res.json({ success: true, data });
}

async function createCustomer(req, res) {
  const data = await customerService.createCustomer(req.body);
  res.status(201).json({ success: true, data });
}

async function updateCustomer(req, res) {
  const data = await customerService.updateCustomer(req.params.id, req.body);
  res.json({ success: true, data });
}

async function updateCustomerStatus(req, res) {
  const data = await customerService.updateCustomerStatus(req.params.id, req.body.isActive);
  res.json({ success: true, data });
}

module.exports = {
  listCustomers,
  createCustomer,
  updateCustomer,
  updateCustomerStatus,
};
