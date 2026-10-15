const employeeService = require('./employees.service');

async function listEmployees(req, res) {
  const data = await employeeService.listEmployees();
  res.json({ success: true, data });
}

async function createEmployee(req, res) {
  const data = await employeeService.createEmployee(req.body);
  res.status(201).json({ success: true, data });
}

async function updateEmployee(req, res) {
  const data = await employeeService.updateEmployee(req.params.id, req.body);
  res.json({ success: true, data });
}

async function updateEmployeeStatus(req, res) {
  const data = await employeeService.updateEmployeeStatus(req.params.id, req.body.isActive);
  res.json({ success: true, data });
}

module.exports = {
  listEmployees,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
};
