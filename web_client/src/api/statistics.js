import apiRequest from '../app/http/client';

function buildStatisticsPath(path, filters = null) {
  const query = new URLSearchParams();

  if (filters?.startDate) {
    query.set('startDate', filters.startDate);
  }

  if (filters?.endDate) {
    query.set('endDate', filters.endDate);
  }

  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}

export async function getDashboardSummary(token, filters = null) {
  const response = await apiRequest(buildStatisticsPath('/statistics/dashboard', filters), {
    method: 'GET',
    token,
  });

  return response.data;
}

export async function getInventorySummary(token) {
  const response = await apiRequest('/statistics/inventory', {
    method: 'GET',
    token,
  });

  return response.data;
}

export async function getRevenueSummary(token, filters = null) {
  const response = await apiRequest(buildStatisticsPath('/statistics/revenue', filters), {
    method: 'GET',
    token,
  });

  return response.data;
}
