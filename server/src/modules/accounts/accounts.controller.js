const accountService = require('./accounts.service');

async function listAccounts(req, res) {
  const data = await accountService.listAccounts();
  res.json({ success: true, data });
}

async function createAccount(req, res) {
  const data = await accountService.createAccount(req.body);
  res.status(201).json({ success: true, data });
}

async function updateAccount(req, res) {
  const data = await accountService.updateAccount(req.params.id, req.body);
  res.json({ success: true, data });
}

async function updateAccountStatus(req, res) {
  const data = await accountService.updateAccountStatus(req.params.id, req.body.status);
  res.json({ success: true, data });
}

module.exports = {
  listAccounts,
  createAccount,
  updateAccount,
  updateAccountStatus,
};
