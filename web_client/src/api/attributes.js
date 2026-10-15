import apiRequest from '../app/http/client';

export async function getAttributes(token, attributeType) {
  const response = await apiRequest(`/product-attributes/${attributeType}`, {
    method: 'GET',
    token,
  });

  return response.data;
}

export async function createAttribute(token, attributeType, payload) {
  const response = await apiRequest(`/product-attributes/${attributeType}`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateAttribute(token, attributeType, id, payload) {
  const response = await apiRequest(`/product-attributes/${attributeType}/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateAttributeStatus(token, attributeType, id, isActive) {
  const response = await apiRequest(`/product-attributes/${attributeType}/${id}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ isActive }),
  });

  return response.data;
}
