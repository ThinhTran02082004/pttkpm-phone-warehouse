const serviceTicketService = require('./services.service');

async function listServiceTickets(req, res) {
  const data = await serviceTicketService.listServiceTickets();
  res.json({ success: true, data });
}

async function createServiceTicket(req, res) {
  const data = await serviceTicketService.createServiceTicket(req.body, req.user);
  res.status(201).json({ success: true, data });
}

async function updateServiceTicketStatus(req, res) {
  const data = await serviceTicketService.updateServiceTicketStatus(
    req.params.id,
    req.body,
    req.user
  );
  res.json({ success: true, data });
}

module.exports = {
  listServiceTickets,
  createServiceTicket,
  updateServiceTicketStatus,
};
