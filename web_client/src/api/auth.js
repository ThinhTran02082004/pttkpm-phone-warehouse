import apiRequest from '../app/http/client';

export async function login(credentials) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return response.data;
}

export async function getCurrentUser(token) {
  const response = await apiRequest('/auth/me', {
    method: 'GET',
    token,
  });

  return response.data;
}
