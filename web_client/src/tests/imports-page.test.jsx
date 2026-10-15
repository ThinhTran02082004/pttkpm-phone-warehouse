import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import App from '../App';
import { getCurrentUser } from '../api/auth';
import { getSuppliers } from '../api/suppliers';
import { getProductVariants } from '../api/products';
import { createImportOrder, getImports } from '../api/imports';

jest.mock('../api/auth', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock('../api/suppliers', () => ({
  getSuppliers: jest.fn(),
}));

jest.mock('../api/products', () => ({
  getProductModels: jest.fn(),
  createProductModel: jest.fn(),
  getProductVariants: jest.fn(),
  createProductVariant: jest.fn(),
  getInventoryItems: jest.fn(),
}));

jest.mock('../api/imports', () => ({
  getImports: jest.fn(),
  createImportOrder: jest.fn(),
}));

describe('Imports page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('pttkpm_access_token', 'saved-token');
    jest.clearAllMocks();

    getCurrentUser.mockResolvedValue({
      account: { username: 'admin' },
      employee: { fullName: 'Nguyễn Thị Mai' },
      role: { name: 'Quản trị viên' },
    });

    getSuppliers.mockResolvedValue([
      {
        id: 1,
        code: 'SUP001',
        name: 'Apple Việt Nam',
        phone: '0901234567',
        email: 'apple@vietnam.com',
      },
    ]);

    getProductVariants.mockResolvedValue([
      {
        id: 1,
        code: 'IP14PM-8-256-BLACK',
        productModelName: 'iPhone 14 Pro Max',
      },
    ]);

    getImports.mockResolvedValue([
      {
        id: 1,
        code: 'PO-001',
        supplierName: 'Apple Việt Nam',
        receivedAt: '2026-03-20 10:00:00',
        totalAmount: 25000000,
        inventoryItemCount: 1,
      },
    ]);

    createImportOrder.mockResolvedValue({
      id: 2,
      code: 'PO-002',
      supplierId: 1,
      receivedAt: '2026-03-20 14:30:00',
      totalAmount: 50000000,
    });
  });

  it('renders a real import form instead of the placeholder page', async () => {
    window.history.pushState({}, '', '/imports');

    render(<App />);

    expect(await screen.findByLabelText('Mã phiếu nhập')).toBeInTheDocument();
  });

  it('loads imports and creates a new import order', async () => {
    window.history.pushState({}, '', '/imports');

    render(<App />);

    const importsTable = await screen.findByRole('table', {
      name: 'Danh sách phiếu nhập kho',
    });
    expect(await within(importsTable).findByText('PO-001')).toBeInTheDocument();
    expect(within(importsTable).getByText('20/03/2026 10:00')).toBeInTheDocument();
    expect(within(importsTable).getByText('25.000.000 đ')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Mã phiếu nhập'), {
      target: { value: 'PO-002' },
    });
    fireEvent.change(screen.getByLabelText('Nhà cung cấp'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText('Thời điểm đặt'), {
      target: { value: '2026-03-20T14:00' },
    });
    fireEvent.change(screen.getByLabelText('Thời điểm nhận'), {
      target: { value: '2026-03-20T14:30' },
    });
    fireEvent.change(screen.getByLabelText('Ghi chú phiếu nhập'), {
      target: { value: 'Lô đầu ngày' },
    });
    fireEvent.change(screen.getByLabelText('Biến thể nhập'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText('Đơn giá nhập'), {
      target: { value: '25000000' },
    });
    fireEvent.change(screen.getByLabelText('Danh sách IMEI'), {
      target: { value: '353123456789111\n353123456789112' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lưu phiếu nhập' }));

    await waitFor(() => {
      expect(createImportOrder).toHaveBeenCalledWith('saved-token', {
        code: 'PO-002',
        supplierId: 1,
        orderedAt: '2026-03-20 14:00:00',
        receivedAt: '2026-03-20 14:30:00',
        notes: 'Lô đầu ngày',
        items: [
          {
            variantId: 1,
            unitCost: 25000000,
            imeis: ['353123456789111', '353123456789112'],
          },
        ],
      });
    });

    await waitFor(() => {
      expect(within(importsTable).getByText('PO-002')).toBeInTheDocument();
    });
    expect(within(importsTable).getByText('20/03/2026 14:30')).toBeInTheDocument();
    expect(within(importsTable).getByText('50.000.000 đ')).toBeInTheDocument();
  });
});
