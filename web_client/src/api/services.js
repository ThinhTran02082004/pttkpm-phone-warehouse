import apiRequest from '../app/http/client';

export async function getServiceTickets(token) {
  const response = await apiRequest('/services', {
    method: 'GET',
    token,
  });

  return response.data;
}

export async function createServiceTicket(token, payload) {
  const response = await apiRequest('/services', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateServiceTicketStatus(token, serviceTicketId, payload) {
  const response = await apiRequest(`/services/${serviceTicketId}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}
