import apiRequest from '../app/http/client';

export async function getAccounts(token) {
  const response = await apiRequest('/accounts', {
    method: 'GET',
    token,
  });

  return response.data;
}

export async function createAccount(token, payload) {
  const response = await apiRequest('/accounts', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateAccount(token, accountId, payload) {
  const response = await apiRequest(`/accounts/${accountId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateAccountStatus(token, accountId, status) {
  const response = await apiRequest(`/accounts/${accountId}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ status }),
  });

  return response.data;
}
