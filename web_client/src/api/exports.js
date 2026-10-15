import apiRequest from '../app/http/client';

export async function getExports(token) {
  const response = await apiRequest('/exports', {
    method: 'GET',
    token,
  });

  return response.data;
}

export async function createExportOrder(token, payload) {
  const response = await apiRequest('/exports', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}
