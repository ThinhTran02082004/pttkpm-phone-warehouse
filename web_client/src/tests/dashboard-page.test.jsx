import { render, screen } from '@testing-library/react';

import App from '../App';
import { getCurrentUser } from '../api/auth';
import { getDashboardSummary, getRevenueSummary } from '../api/statistics';

jest.mock('../api/auth', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock('../api/statistics', () => ({
  getDashboardSummary: jest.fn(),
  getRevenueSummary: jest.fn(),
}));

jest.mock('react-apexcharts', () => {
  return function MockChart(props) {
    return (
      <div data-testid={`chart-${props.options?.chart?.id || props.type}`}>
        <span>{props.options?.chart?.id || props.type}</span>
      </div>
    );
  };
});

describe('Dashboard page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('pttkpm_access_token', 'saved-token');
    window.history.pushState({}, '', '/dashboard');
    jest.clearAllMocks();

    getCurrentUser.mockResolvedValue({
      account: { username: 'admin' },
      employee: { fullName: 'Nguyễn Thị Mai' },
      role: { name: 'Quản trị viên' },
    });

    getDashboardSummary.mockResolvedValue({
      totalProducts: 4,
      totalVariants: 6,
      totalInventoryItems: 9,
      inStockItems: 6,
      soldItems: 2,
      inServiceItems: 1,
      totalSuppliers: 3,
      totalCustomers: 3,
      totalRevenue: 89979000,
      totalServiceTickets: 1,
    });

    getRevenueSummary.mockResolvedValue([
      {
        soldDate: '2026-03-20',
        totalOrders: 2,
        totalRevenue: 59980000,
      },
      {
        soldDate: '2026-03-21',
        totalOrders: 1,
        totalRevenue: 30000000,
      },
    ]);
  });

  it('loads and renders dashboard statistics and charts from the backend', async () => {
    render(<App />);

    expect(await screen.findByText('4 mẫu máy')).toBeInTheDocument();
    expect(screen.getByText('6 biến thể')).toBeInTheDocument();
    expect(screen.getByText('9 IMEI')).toBeInTheDocument();
    expect(screen.getByText('6 thiết bị')).toBeInTheDocument();
    expect(screen.getByText('89.979.000 đ')).toBeInTheDocument();
    expect(screen.getByText('1 phiếu dịch vụ')).toBeInTheDocument();

    expect(screen.getByText('Doanh thu gần đây')).toBeInTheDocument();
    expect(screen.getByText('Tình trạng thiết bị')).toBeInTheDocument();
    expect(screen.getByText('dashboard-revenue-chart')).toBeInTheDocument();
    expect(screen.getByText('dashboard-status-chart')).toBeInTheDocument();
  });
});
