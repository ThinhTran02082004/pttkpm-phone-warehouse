import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import App from '../App';
import { getCurrentUser, login } from '../api/auth';
import { getDashboardSummary, getRevenueSummary } from '../api/statistics';

jest.mock('../api/auth', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock('../api/statistics', () => ({
  getDashboardSummary: jest.fn(),
  getRevenueSummary: jest.fn(),
}));

describe('Frontend auth flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState({}, '', '/dashboard');
    jest.clearAllMocks();
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

  it('redirects protected routes to the login page when no session exists', async () => {
    render(<App />);

    expect(
      await screen.findByRole('heading', {
        name: 'Đăng nhập',
      })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Tên đăng nhập')).toBeInTheDocument();
    expect(getCurrentUser).not.toHaveBeenCalled();
  });

  it('logs in successfully and renders the dashboard shell', async () => {
    login.mockResolvedValue({ token: 'frontend-test-token' });
    getCurrentUser.mockResolvedValue({
      account: { username: 'admin' },
      employee: { fullName: 'Nguyễn Thị Mai' },
      role: { name: 'Quản trị viên' },
    });

    window.history.pushState({}, '', '/login');

    render(<App />);

    fireEvent.change(screen.getByLabelText('Tên đăng nhập'), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByLabelText('Mật khẩu'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Vào hệ thống' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        username: 'admin',
        password: '123456',
      });
    });

    expect(await screen.findByText('Bảng điều khiển vận hành')).toBeInTheDocument();
    expect(screen.getByText(/Nguyễn Thị Mai • Quản trị viên/i)).toBeInTheDocument();
    expect(window.localStorage.getItem('pttkpm_access_token')).toBe('frontend-test-token');
  });
});
