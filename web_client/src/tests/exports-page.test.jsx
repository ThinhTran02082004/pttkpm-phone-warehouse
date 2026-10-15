import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import App from '../App';
import { getCurrentUser } from '../api/auth';
import { getCustomers } from '../api/customers';
import { createExportOrder, getExports } from '../api/exports';
import { getInventoryItems, getProductVariants } from '../api/products';

jest.mock('../api/auth', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock('../api/customers', () => ({
  getCustomers: jest.fn(),
  createCustomer: jest.fn(),
}));

jest.mock('../api/products', () => ({
  getProductModels: jest.fn(),
  createProductModel: jest.fn(),
  getProductVariants: jest.fn(),
  createProductVariant: jest.fn(),
  getInventoryItems: jest.fn(),
}));

jest.mock('../api/exports', () => ({
  getExports: jest.fn(),
  createExportOrder: jest.fn(),
}));

describe('Exports page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('pttkpm_access_token', 'saved-token');
    jest.clearAllMocks();

    getCurrentUser.mockResolvedValue({
      account: { username: 'admin' },
      employee: { fullName: 'Nguyễn Thị Mai' },
      role: { name: 'Quản trị viên' },
    });

    getCustomers.mockResolvedValue([
      {
        id: 1,
        code: 'CUS001',
        fullName: 'Nguyễn Văn A',
        phone: '0987654321',
      },
    ]);

    getProductVariants.mockResolvedValue([
      {
        id: 1,
        code: 'IP14PM-8-256-BLACK',
        productModelName: 'iPhone 14 Pro Max',
      },
    ]);

    getInventoryItems.mockResolvedValue([
      {
        id: 1,
        imei: '353123456789001',
        itemStatus: 'in_stock',
        variantId: 1,
        variantCode: 'IP14PM-8-256-BLACK',
        productModelName: 'iPhone 14 Pro Max',
      },
      {
        id: 2,
        imei: '353123456789002',
        itemStatus: 'sold',
        variantId: 1,
        variantCode: 'IP14PM-8-256-BLACK',
        productModelName: 'iPhone 14 Pro Max',
      },
    ]);

    getExports.mockResolvedValue([
      {
        id: 1,
        code: 'SO-001',
        customerName: 'Nguyễn Văn A',
        soldAt: '2026-03-20 16:00:00',
        totalAmount: 29990000,
        inventoryItemCount: 1,
      },
    ]);

    createExportOrder.mockResolvedValue({
      id: 2,
      code: 'SO-002',
      customerId: 1,
      soldAt: '2026-03-20 17:30:00',
      totalAmount: 29990000,
    });
  });

  it('renders a real export form instead of the placeholder page', async () => {
    window.history.pushState({}, '', '/exports');

    render(<App />);

    expect(await screen.findByLabelText('Mã phiếu xuất')).toBeInTheDocument();
  });

  it('loads exports and creates a new export order from available imei only', async () => {
    window.history.pushState({}, '', '/exports');

    render(<App />);

    const exportsTable = await screen.findByRole('table', {
      name: 'Danh sách phiếu xuất kho',
    });
    expect(await within(exportsTable).findByText('SO-001')).toBeInTheDocument();
    expect(within(exportsTable).getByText('20/03/2026 16:00')).toBeInTheDocument();
    expect(within(exportsTable).getByText('29.990.000 đ')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Mã phiếu xuất'), {
      target: { value: 'SO-002' },
    });
    fireEvent.change(screen.getByLabelText('Khách hàng'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText('Thời điểm bán'), {
      target: { value: '2026-03-20T17:30' },
    });
    fireEvent.change(screen.getByLabelText('Ghi chú phiếu xuất'), {
      target: { value: 'Xuất bán tại quầy' },
    });
    fireEvent.change(screen.getByLabelText('Biến thể xuất'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText('Đơn giá bán'), {
      target: { value: '29990000' },
    });
    fireEvent.change(screen.getByLabelText('Danh sách IMEI xuất'), {
      target: { value: '353123456789001\n353123456789002' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lưu phiếu xuất' }));

    await waitFor(() => {
      expect(createExportOrder).toHaveBeenCalledWith('saved-token', {
        code: 'SO-002',
        customerId: 1,
        soldAt: '2026-03-20 17:30:00',
        notes: 'Xuất bán tại quầy',
        items: [
          {
            variantId: 1,
            unitPrice: 29990000,
            imeis: ['353123456789001'],
          },
        ],
      });
    });

    await waitFor(() => {
      expect(within(exportsTable).getByText('SO-002')).toBeInTheDocument();
    });
    expect(within(exportsTable).getByText('20/03/2026 17:30')).toBeInTheDocument();
  });
});
