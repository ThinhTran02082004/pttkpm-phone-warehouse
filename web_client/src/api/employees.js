import apiRequest from '../app/http/client';

export async function getEmployees(token) {
  const response = await apiRequest('/employees', {
    method: 'GET',
    token,
  });

  return response.data;
}

export async function createEmployee(token, payload) {
  const response = await apiRequest('/employees', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateEmployee(token, employeeId, payload) {
  const response = await apiRequest(`/employees/${employeeId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateEmployeeStatus(token, employeeId, isActive) {
  const response = await apiRequest(`/employees/${employeeId}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ isActive }),
  });

  return response.data;
}
