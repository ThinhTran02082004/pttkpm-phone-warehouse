import apiRequest from '../app/http/client';

export async function getSuppliers(token) {
  const response = await apiRequest('/suppliers', {
    method: 'GET',
    token,
  });

  return response.data;
}

export async function createSupplier(token, payload) {
  const response = await apiRequest('/suppliers', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateSupplier(token, supplierId, payload) {
  const response = await apiRequest(`/suppliers/${supplierId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateSupplierStatus(token, supplierId, isActive) {
  const response = await apiRequest(`/suppliers/${supplierId}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ isActive }),
  });

  return response.data;
}
