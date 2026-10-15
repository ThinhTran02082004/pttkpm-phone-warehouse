import apiRequest from '../app/http/client';

export async function getImports(token) {
  const response = await apiRequest('/imports', {
    method: 'GET',
    token,
  });

  return response.data;
}

export async function createImportOrder(token, payload) {
  const response = await apiRequest('/imports', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}
