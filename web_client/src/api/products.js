import apiRequest from '../app/http/client';

export async function getProductModels(token) {
  const response = await apiRequest('/products/models', {
    method: 'GET',
    token,
  });

  return response.data;
}

export async function createProductModel(token, payload) {
  const response = await apiRequest('/products/models', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateProductModel(token, id, payload) {
  const response = await apiRequest(`/products/models/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateProductModelStatus(token, id, isActive) {
  const response = await apiRequest(`/products/models/${id}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ isActive }),
  });

  return response.data;
}

export async function uploadProductModelImage(token, id, file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiRequest(`/products/models/${id}/image`, {
    method: 'POST',
    token,
    body: formData,
  });

  return response.data;
}

export async function getProductVariants(token) {
  const response = await apiRequest('/products/variants', {
    method: 'GET',
    token,
  });

  return response.data;
}

export async function createProductVariant(token, payload) {
  const response = await apiRequest('/products/variants', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateProductVariant(token, id, payload) {
  const response = await apiRequest(`/products/variants/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateProductVariantStatus(token, id, isActive) {
  const response = await apiRequest(`/products/variants/${id}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ isActive }),
  });

  return response.data;
}

export async function getInventoryItems(token) {
  const response = await apiRequest('/products/inventory', {
    method: 'GET',
    token,
  });

  return response.data;
}
