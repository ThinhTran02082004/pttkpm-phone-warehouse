import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import App from '../App';
import { getCurrentUser } from '../api/auth';
import { getInventoryItems } from '../api/products';
import {
  createServiceTicket,
  getServiceTickets,
  updateServiceTicketStatus,
} from '../api/services';

jest.mock('../api/auth', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock('../api/products', () => ({
  getProductModels: jest.fn(),
  createProductModel: jest.fn(),
  getProductVariants: jest.fn(),
  createProductVariant: jest.fn(),
  getInventoryItems: jest.fn(),
}));

jest.mock('../api/services', () => ({
  getServiceTickets: jest.fn(),
  createServiceTicket: jest.fn(),
  updateServiceTicketStatus: jest.fn(),
}));

describe('Services page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('pttkpm_access_token', 'saved-token');
    jest.clearAllMocks();

    getCurrentUser.mockResolvedValue({
      account: { username: 'admin' },
      employee: { fullName: 'Nguyễn Thị Mai' },
      role: { name: 'Quản trị viên' },
    });

    getInventoryItems.mockResolvedValue([
      {
        id: 1,
        imei: '353123456789001',
        itemStatus: 'sold',
        variantCode: 'IP14PM-8-256-BLACK',
        productModelName: 'iPhone 14 Pro Max',
      },
      {
        id: 2,
        imei: '353123456789002',
        itemStatus: 'in_stock',
        variantCode: 'IP14PM-8-256-BLACK',
        productModelName: 'iPhone 14 Pro Max',
      },
    ]);

    getServiceTickets.mockResolvedValue([
      {
        id: 1,
        code: 'SV-001',
        imei: '353123456789001',
        ticketType: 'warranty',
        status: 'received',
        issueDescription: 'Máy nóng bất thường',
        customerName: 'Nguyễn Văn A',
        receivedAt: '2026-03-20 18:00:00',
      },
    ]);

    createServiceTicket.mockResolvedValue({
      id: 2,
      code: 'SV-002',
      imei: '353123456789001',
      ticketType: 'repair',
      status: 'received',
      issueDescription: 'Không nhận SIM',
      receivedAt: '2026-03-20 19:00:00',
    });

    updateServiceTicketStatus.mockResolvedValue({
      id: 1,
      code: 'SV-001',
      status: 'completed',
      resolutionSummary: 'Hoàn tất xử lý và bàn giao máy',
      completedAt: '2026-03-20 20:00:00',
    });
  });

  it('renders a real service form instead of the placeholder page', async () => {
    window.history.pushState({}, '', '/services');

    render(<App />);

    expect(await screen.findByLabelText('Mã phiếu dịch vụ')).toBeInTheDocument();
  });

  it('loads tickets and creates a new service ticket from sold imei only', async () => {
    window.history.pushState({}, '', '/services');

    render(<App />);

    const serviceTable = await screen.findByRole('table', {
      name: 'Danh sách phiếu dịch vụ',
    });
    expect(await within(serviceTable).findByText('SV-001')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Mã phiếu dịch vụ'), {
      target: { value: 'SV-002' },
    });
    fireEvent.change(screen.getByLabelText('IMEI tiếp nhận'), {
      target: { value: '353123456789001' },
    });
    fireEvent.change(screen.getByLabelText('Loại phiếu'), {
      target: { value: 'repair' },
    });
    fireEvent.change(screen.getByLabelText('Mô tả lỗi'), {
      target: { value: 'Không nhận SIM' },
    });
    fireEvent.change(screen.getByLabelText('Thời điểm tiếp nhận'), {
      target: { value: '2026-03-20T19:00' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lưu phiếu dịch vụ' }));

    await waitFor(() => {
      expect(createServiceTicket).toHaveBeenCalledWith('saved-token', {
        code: 'SV-002',
        imei: '353123456789001',
        ticketType: 'repair',
        issueDescription: 'Không nhận SIM',
        receivedAt: '2026-03-20 19:00:00',
      });
    });

    expect(screen.queryByRole('option', { name: '353123456789002' })).not.toBeInTheDocument();

    await waitFor(() => {
      expect(within(serviceTable).getByText('SV-002')).toBeInTheDocument();
    });
  });

  it('marks an existing service ticket as completed', async () => {
    getInventoryItems.mockResolvedValueOnce([
      {
        id: 1,
        imei: '353123456789001',
        itemStatus: 'in_service',
        variantCode: 'IP14PM-8-256-BLACK',
        productModelName: 'iPhone 14 Pro Max',
      },
    ]);

    window.history.pushState({}, '', '/services');

    render(<App />);

    await screen.findByRole('table', {
      name: 'Danh sách phiếu dịch vụ',
    });

    fireEvent.click(await screen.findByRole('button', { name: 'Hoàn tất SV-001' }));

    await waitFor(() => {
      expect(updateServiceTicketStatus).toHaveBeenCalledWith(
        'saved-token',
        1,
        expect.objectContaining({
          status: 'completed',
          resolutionSummary: 'Hoàn tất xử lý và bàn giao máy',
        })
      );
    });

    expect(await screen.findByText('completed')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '353123456789001' })).toBeInTheDocument();
  });
});
