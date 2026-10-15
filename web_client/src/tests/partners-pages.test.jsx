import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import App from '../App';
import { getCurrentUser } from '../api/auth';
import { getDashboardSummary } from '../api/statistics';
import {
  createSupplier,
  getSuppliers,
  updateSupplier,
  updateSupplierStatus,
} from '../api/suppliers';
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  updateCustomerStatus,
} from '../api/customers';

jest.mock('../api/auth', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock('../api/statistics', () => ({
  getDashboardSummary: jest.fn(),
}));

jest.mock('../api/suppliers', () => ({
  getSuppliers: jest.fn(),
  createSupplier: jest.fn(),
  updateSupplier: jest.fn(),
  updateSupplierStatus: jest.fn(),
}));

jest.mock('../api/customers', () => ({
  getCustomers: jest.fn(),
  createCustomer: jest.fn(),
  updateCustomer: jest.fn(),
  updateCustomerStatus: jest.fn(),
}));

const dashboardSummary = {
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
};

describe('Partner pages', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('pttkpm_access_token', 'saved-token');
    jest.clearAllMocks();

    getCurrentUser.mockResolvedValue({
      account: { username: 'admin' },
      employee: { fullName: 'Nguyễn Thị Mai' },
      role: { name: 'Quản trị viên' },
    });

    getDashboardSummary.mockResolvedValue(dashboardSummary);
    getSuppliers.mockResolvedValue([
      {
        id: 1,
        code: 'SUP001',
        name: 'Apple Việt Nam',
        phone: '0901234567',
        email: 'apple@vietnam.com',
        isActive: true,
      },
    ]);
    createSupplier.mockResolvedValue({
      id: 4,
      code: 'SUP010',
      name: 'FPT Trading',
      phone: '0909999999',
      email: 'fpt@trading.vn',
      isActive: true,
    });
    updateSupplier.mockResolvedValue({
      id: 1,
      code: 'SUP001',
      name: 'Apple Trading',
      phone: '0901234567',
      email: 'apple-trading@vietnam.com',
      isActive: true,
    });
    updateSupplierStatus.mockResolvedValue({
      id: 1,
      code: 'SUP001',
      name: 'Apple Việt Nam',
      phone: '0901234567',
      email: 'apple@vietnam.com',
      isActive: false,
    });

    getCustomers.mockResolvedValue([
      {
        id: 1,
        code: 'CUS001',
        fullName: 'Nguyễn Văn A',
        phone: '0987654321',
        email: 'nguyenvana@gmail.com',
        isActive: true,
      },
    ]);
    createCustomer.mockResolvedValue({
      id: 4,
      code: 'CUS010',
      fullName: 'Phạm Thị Hạnh',
      phone: '0988111222',
      email: 'hanhpt@gmail.com',
      isActive: true,
    });
    updateCustomer.mockResolvedValue({
      id: 1,
      code: 'CUS001',
      fullName: 'Nguyễn Văn A Đã Sửa',
      phone: '0987654321',
      email: 'nguyenvana-new@gmail.com',
      isActive: true,
    });
    updateCustomerStatus.mockResolvedValue({
      id: 1,
      code: 'CUS001',
      fullName: 'Nguyễn Văn A',
      phone: '0987654321',
      email: 'nguyenvana@gmail.com',
      isActive: false,
    });
  });

  it('loads supplier list and creates a new supplier', async () => {
    window.history.pushState({}, '', '/suppliers');

    render(<App />);

    expect(await screen.findByText('Apple Việt Nam')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Mã nhà cung cấp'), {
      target: { value: 'SUP010' },
    });
    fireEvent.change(screen.getByLabelText('Tên nhà cung cấp'), {
      target: { value: 'FPT Trading' },
    });
    fireEvent.change(screen.getByLabelText('Số điện thoại NCC'), {
      target: { value: '0909999999' },
    });
    fireEvent.change(screen.getByLabelText('Email NCC'), {
      target: { value: 'fpt@trading.vn' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lưu nhà cung cấp' }));

    await waitFor(() => {
      expect(createSupplier).toHaveBeenCalledWith('saved-token', {
        code: 'SUP010',
        name: 'FPT Trading',
        phone: '0909999999',
        email: 'fpt@trading.vn',
      });
    });

    expect(await screen.findByText('FPT Trading')).toBeInTheDocument();
  });

  it('edits a supplier and toggles active status from the list', async () => {
    window.history.pushState({}, '', '/suppliers');

    render(<App />);

    expect(await screen.findByText('Apple Việt Nam')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sửa SUP001' }));
    fireEvent.change(screen.getByLabelText('Tên nhà cung cấp'), {
      target: { value: 'Apple Trading' },
    });
    fireEvent.change(screen.getByLabelText('Email NCC'), {
      target: { value: 'apple-trading@vietnam.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cập nhật nhà cung cấp' }));

    await waitFor(() => {
      expect(updateSupplier).toHaveBeenCalledWith('saved-token', 1, {
        code: 'SUP001',
        name: 'Apple Trading',
        phone: '0901234567',
        email: 'apple-trading@vietnam.com',
      });
    });

    expect(await screen.findByText('Apple Trading')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ngưng SUP001' }));

    await waitFor(() => {
      expect(updateSupplierStatus).toHaveBeenCalledWith('saved-token', 1, false);
    });
  });

  it('loads customer list and creates a new customer', async () => {
    window.history.pushState({}, '', '/customers');

    render(<App />);

    expect(await screen.findByText('Nguyễn Văn A')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Mã khách hàng'), {
      target: { value: 'CUS010' },
    });
    fireEvent.change(screen.getByLabelText('Tên khách hàng'), {
      target: { value: 'Phạm Thị Hạnh' },
    });
    fireEvent.change(screen.getByLabelText('Số điện thoại KH'), {
      target: { value: '0988111222' },
    });
    fireEvent.change(screen.getByLabelText('Email KH'), {
      target: { value: 'hanhpt@gmail.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lưu khách hàng' }));

    await waitFor(() => {
      expect(createCustomer).toHaveBeenCalledWith('saved-token', {
        code: 'CUS010',
        fullName: 'Phạm Thị Hạnh',
        phone: '0988111222',
        email: 'hanhpt@gmail.com',
      });
    });

    expect(await screen.findByText('Phạm Thị Hạnh')).toBeInTheDocument();
  });

  it('edits a customer and toggles active status from the list', async () => {
    window.history.pushState({}, '', '/customers');

    render(<App />);

    expect(await screen.findByText('Nguyễn Văn A')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sửa CUS001' }));
    fireEvent.change(screen.getByLabelText('Tên khách hàng'), {
      target: { value: 'Nguyễn Văn A Đã Sửa' },
    });
    fireEvent.change(screen.getByLabelText('Email KH'), {
      target: { value: 'nguyenvana-new@gmail.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cập nhật khách hàng' }));

    await waitFor(() => {
      expect(updateCustomer).toHaveBeenCalledWith('saved-token', 1, {
        code: 'CUS001',
        fullName: 'Nguyễn Văn A Đã Sửa',
        phone: '0987654321',
        email: 'nguyenvana-new@gmail.com',
      });
    });

    expect(await screen.findByText('Nguyễn Văn A Đã Sửa')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ngưng CUS001' }));

    await waitFor(() => {
      expect(updateCustomerStatus).toHaveBeenCalledWith('saved-token', 1, false);
    });
  });
});
