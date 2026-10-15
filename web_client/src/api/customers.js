import apiRequest from '../app/http/client';

export async function getCustomers(token) {
  const response = await apiRequest('/customers', {
    method: 'GET',
    token,
  });

  return response.data;
}

export async function createCustomer(token, payload) {
  const response = await apiRequest('/customers', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateCustomer(token, customerId, payload) {
  const response = await apiRequest(`/customers/${customerId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateCustomerStatus(token, customerId, isActive) {
  const response = await apiRequest(`/customers/${customerId}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ isActive }),
  });

  return response.data;
}
