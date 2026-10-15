import apiRequest from '../app/http/client';

export async function getRoles(token) {
  const response = await apiRequest('/roles', {
    method: 'GET',
    token,
  });

  return response.data;
}

export async function createRole(token, payload) {
  const response = await apiRequest('/roles', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateRole(token, roleId, payload) {
  const response = await apiRequest(`/roles/${roleId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateRoleStatus(token, roleId, isActive) {
  const response = await apiRequest(`/roles/${roleId}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ isActive }),
  });

  return response.data;
}
