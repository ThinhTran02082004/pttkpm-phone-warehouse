import { fireEvent, render, screen } from '@testing-library/react';

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
  return function MockChart() {
    return <div data-testid="mock-chart" />;
  };
});

function buildPermissions(moduleCodes) {
  return moduleCodes.map((moduleCode) => ({
    moduleCode,
    actionCode: 'view',
    displayName: `${moduleCode}:view`,
  }));
}

function mockAuthenticatedUser({
  username = 'admin',
  fullName = 'Nguyễn Thị Mai',
  roleName = 'Quản trị viên',
  permissions = buildPermissions([
    'dashboard',
    'employees',
    'roles',
    'accounts',
    'suppliers',
    'customers',
    'product_attributes',
    'products',
    'imports',
    'exports',
    'services',
    'statistics',
  ]),
} = {}) {
  getCurrentUser.mockResolvedValue({
    account: { username },
    employee: { fullName },
    role: { name: roleName },
    permissions,
  });
}

describe('Shell layout', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('pttkpm_access_token', 'saved-token');
    window.history.pushState({}, '', '/dashboard');
    jest.clearAllMocks();

    mockAuthenticatedUser();

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

    getRevenueSummary.mockResolvedValue([]);
  });

  it('supports collapsing the sidebar and no longer shows the old rebuild label', async () => {
    render(<App />);

    expect(await screen.findByText('Phone Warehouse')).toBeInTheDocument();
    expect(screen.queryByText('PTTKPM Rebuild')).not.toBeInTheDocument();

    const shellLayout = document.querySelector('.shell-layout');
    expect(shellLayout).not.toHaveClass('shell-layout--collapsed');

    fireEvent.click(screen.getByRole('button', { name: 'Thu gọn menu' }));
    expect(shellLayout).toHaveClass('shell-layout--collapsed');

    fireEvent.click(screen.getByRole('button', { name: 'Mở rộng menu' }));
    expect(shellLayout).not.toHaveClass('shell-layout--collapsed');
  });

  it('shows all main menu items for an admin account', async () => {
    render(<App />);

    expect(await screen.findByRole('link', { name: 'Nhân viên' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Vai trò' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Tài khoản' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Nhà cung cấp' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Khách hàng' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Thuộc tính' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sản phẩm' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Nhập kho' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Xuất kho' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dịch vụ' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Thống kê' })).toBeInTheDocument();
  });

  it('hides menu items that the current account cannot view', async () => {
    mockAuthenticatedUser({
      username: 'accountant01',
      fullName: 'Phạm Văn Tuấn',
      roleName: 'Kế toán',
      permissions: buildPermissions([
        'dashboard',
        'suppliers',
        'customers',
        'imports',
        'exports',
        'statistics',
      ]),
    });

    render(<App />);

    expect(await screen.findByRole('link', { name: 'Nhà cung cấp' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Khách hàng' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Nhập kho' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Xuất kho' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Thống kê' })).toBeInTheDocument();

    expect(screen.queryByRole('link', { name: 'Nhân viên' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Vai trò' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Tài khoản' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Thuộc tính' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Sản phẩm' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Dịch vụ' })).not.toBeInTheDocument();
  });

  it('redirects a signed-in user away from routes they cannot view', async () => {
    mockAuthenticatedUser({
      username: 'accountant01',
      fullName: 'Phạm Văn Tuấn',
      roleName: 'Kế toán',
      permissions: buildPermissions([
        'dashboard',
        'suppliers',
        'customers',
        'imports',
        'exports',
        'statistics',
      ]),
    });
    window.history.pushState({}, '', '/employees');

    render(<App />);

    expect(await screen.findByText('Bảng điều khiển')).toBeInTheDocument();
    expect(screen.queryByText('Danh sách nhân viên')).not.toBeInTheDocument();
  });
});
