import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import App from '../App';
import { getCurrentUser } from '../api/auth';
import {
  getDashboardSummary,
  getInventorySummary,
  getRevenueSummary,
} from '../api/statistics';

jest.mock('../api/auth', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock('../api/statistics', () => ({
  getDashboardSummary: jest.fn(),
  getInventorySummary: jest.fn(),
  getRevenueSummary: jest.fn(),
}));

jest.mock('react-apexcharts', () => {
  return function MockChart(props) {
    return (
      <div data-testid={`chart-${props.type}`}>
        <span>{props.options?.chart?.id || 'chart'}</span>
        <pre>{JSON.stringify(props.series)}</pre>
      </div>
    );
  };
});

describe('Statistics page', () => {
  let createObjectURLMock;
  let revokeObjectURLMock;
  let clickMock;

  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('pttkpm_access_token', 'saved-token');
    jest.clearAllMocks();
    createObjectURLMock = jest.fn(() => 'blob:mock');
    revokeObjectURLMock = jest.fn();
    clickMock = jest.fn();

    URL.createObjectURL = createObjectURLMock;
    URL.revokeObjectURL = revokeObjectURLMock;
    HTMLAnchorElement.prototype.click = clickMock;

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

    getInventorySummary.mockResolvedValue([
      {
        id: 1,
        variantCode: 'IP14PM-8-256-BLACK',
        productName: 'iPhone 14 Pro Max',
        ramGb: 8,
        romGb: 256,
        colorName: 'Đen',
        totalItems: 3,
        inStockItems: 1,
        soldItems: 1,
        inServiceItems: 1,
      },
      {
        id: 2,
        variantCode: 'SGS23U-12-256-BLACK',
        productName: 'Samsung Galaxy S23 Ultra',
        ramGb: 12,
        romGb: 256,
        colorName: 'Đen',
        totalItems: 4,
        inStockItems: 3,
        soldItems: 1,
        inServiceItems: 0,
      },
    ]);

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

  it('renders statistics tables and chart sections with derived chart data', async () => {
    window.history.pushState({}, '', '/statistics');

    render(<App />);

    expect(await screen.findByText('Báo cáo tồn kho')).toBeInTheDocument();
    expect(await screen.findByText('4 mẫu máy')).toBeInTheDocument();
    expect(await screen.findByText('89.979.000 đ')).toBeInTheDocument();

    const inventoryTable = screen.getByRole('table', { name: 'Báo cáo tồn kho' });
    expect(await within(inventoryTable).findByText('IP14PM-8-256-BLACK')).toBeInTheDocument();

    const revenueTable = screen.getByRole('table', { name: 'Báo cáo doanh thu' });
    expect(await within(revenueTable).findByText('20/03/2026')).toBeInTheDocument();
    expect(await within(revenueTable).findByText('59.980.000 đ')).toBeInTheDocument();

    expect(screen.getByText('Biểu đồ doanh thu theo ngày')).toBeInTheDocument();
    expect(screen.getByText('Phân bổ trạng thái IMEI')).toBeInTheDocument();
    expect(screen.getByText('Top biến thể còn tồn kho')).toBeInTheDocument();

    expect(screen.getByText('revenue-chart')).toBeInTheDocument();
    expect(screen.getByText('inventory-status-chart')).toBeInTheDocument();
    expect(screen.getByText('top-stock-chart')).toBeInTheDocument();

    expect(screen.getByText(/59980000/)).toBeInTheDocument();
    expect(screen.getByText(/\[6,2,1\]/)).toBeInTheDocument();
    expect(screen.getByText(/\[3,1\]/)).toBeInTheDocument();
  });

  it('applies date range filter and refreshes revenue statistics', async () => {
    getDashboardSummary
      .mockResolvedValueOnce({
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
      })
      .mockResolvedValueOnce({
        totalProducts: 4,
        totalVariants: 6,
        totalInventoryItems: 9,
        inStockItems: 6,
        soldItems: 2,
        inServiceItems: 1,
        totalSuppliers: 3,
        totalCustomers: 3,
        totalRevenue: 59989000,
        totalServiceTickets: 1,
      });

    getRevenueSummary
      .mockResolvedValueOnce([
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
      ])
      .mockResolvedValueOnce([
        {
          soldDate: '2026-03-12',
          totalOrders: 1,
          totalRevenue: 59989000,
        },
      ]);

    window.history.pushState({}, '', '/statistics');

    render(<App />);

    expect(await screen.findByText(/89\.979\.000/)).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('statistics-start-date'), { target: { value: '2026-03-12' } });
    fireEvent.change(screen.getByTestId('statistics-end-date'), { target: { value: '2026-03-12' } });
    fireEvent.click(screen.getByTestId('statistics-apply-filter'));

    await waitFor(() =>
      expect(getDashboardSummary).toHaveBeenLastCalledWith('saved-token', {
        startDate: '2026-03-12',
        endDate: '2026-03-12',
      })
    );

    await waitFor(() =>
      expect(getRevenueSummary).toHaveBeenLastCalledWith('saved-token', {
        startDate: '2026-03-12',
        endDate: '2026-03-12',
      })
    );

    const revenueTable = screen.getByRole('table', { name: 'Báo cáo doanh thu' });
    expect(await within(revenueTable).findByText(/59\.989\.000/)).toBeInTheDocument();
    expect(await within(revenueTable).findByText(/12\/03\/2026/)).toBeInTheDocument();
  });

  it('exports the current revenue and inventory reports to csv', async () => {
    window.history.pushState({}, '', '/statistics');

    render(<App />);

    expect(await screen.findByTestId('chart-line')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('statistics-export-revenue'));
    fireEvent.click(screen.getByTestId('statistics-export-inventory'));

    expect(createObjectURLMock).toHaveBeenCalledTimes(2);
    expect(clickMock).toHaveBeenCalledTimes(2);
    expect(revokeObjectURLMock).toHaveBeenCalledTimes(2);
  });
});
