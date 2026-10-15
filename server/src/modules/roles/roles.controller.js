const roleService = require('./roles.service');

async function listRoles(req, res) {
  const data = await roleService.listRoles();
  res.json({ success: true, data });
}

async function createRole(req, res) {
  const data = await roleService.createRole(req.body);
  res.status(201).json({ success: true, data });
}

async function updateRole(req, res) {
  const data = await roleService.updateRole(req.params.id, req.body);
  res.json({ success: true, data });
}

async function updateRoleStatus(req, res) {
  const data = await roleService.updateRoleStatus(req.params.id, req.body.isActive);
  res.json({ success: true, data });
}

module.exports = {
  listRoles,
  createRole,
  updateRole,
  updateRoleStatus,
};
