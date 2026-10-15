import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import App from '../App';
import { getCurrentUser } from '../api/auth';
import { getDashboardSummary } from '../api/statistics';
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  updateEmployeeStatus,
} from '../api/employees';
import {
  createRole,
  getRoles,
  updateRole,
  updateRoleStatus,
} from '../api/roles';
import {
  createAccount,
  getAccounts,
  updateAccount,
  updateAccountStatus,
} from '../api/accounts';
import { downloadWorkbook } from '../utils/excel';

jest.mock('../api/auth', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock('../api/statistics', () => ({
  getDashboardSummary: jest.fn(),
  getRevenueSummary: jest.fn(),
}));

jest.mock('../api/employees', () => ({
  getEmployees: jest.fn(),
  createEmployee: jest.fn(),
  updateEmployee: jest.fn(),
  updateEmployeeStatus: jest.fn(),
}));

jest.mock('../api/roles', () => ({
  getRoles: jest.fn(),
  createRole: jest.fn(),
  updateRole: jest.fn(),
  updateRoleStatus: jest.fn(),
}));

jest.mock('../api/accounts', () => ({
  getAccounts: jest.fn(),
  createAccount: jest.fn(),
  updateAccount: jest.fn(),
  updateAccountStatus: jest.fn(),
}));

jest.mock('../utils/excel', () => ({
  downloadWorkbook: jest.fn(),
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

const employeesFixture = [
  {
    id: 1,
    code: 'EMP001',
    fullName: 'Nguyễn Thị Mai',
    gender: 'female',
    phone: '0912345678',
    email: 'maitn@company.com',
    isActive: true,
  },
  {
    id: 2,
    code: 'EMP010',
    fullName: 'Phạm Minh Dũng',
    gender: 'male',
    phone: '0901112233',
    email: 'dungpm@company.com',
    isActive: true,
  },
];

const rolesFixture = [
  {
    id: 1,
    code: 'admin',
    name: 'Quản trị viên',
    description: 'Toàn quyền hệ thống',
    permissionCount: 40,
    isActive: true,
  },
  {
    id: 2,
    code: 'warehouse_manager',
    name: 'Quản lý kho',
    description: 'Quản lý sản phẩm và kho',
    permissionCount: 12,
    isActive: true,
  },
];

const accountsFixture = [
  {
    id: 1,
    username: 'admin',
    status: 'active',
    employeeId: 1,
    employeeCode: 'EMP001',
    employeeName: 'Nguyễn Thị Mai',
    roleId: 1,
    roleCode: 'admin',
    roleName: 'Quản trị viên',
  },
];

describe('Admin pages', () => {
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
    getEmployees.mockResolvedValue(employeesFixture);
    createEmployee.mockResolvedValue({
      id: 3,
      code: 'EMP011',
      fullName: 'Phạm Minh Dũng',
      gender: 'male',
      phone: '0901112233',
      email: 'dungpm@company.com',
      isActive: true,
    });
    updateEmployee.mockResolvedValue({
      id: 1,
      code: 'EMP001',
      fullName: 'Nguyễn Thị Mai Đã Sửa',
      gender: 'female',
      phone: '0999999999',
      email: 'maitn@company.com',
      isActive: true,
    });
    updateEmployeeStatus.mockResolvedValue({
      id: 2,
      code: 'EMP010',
      fullName: 'Phạm Minh Dũng',
      gender: 'male',
      phone: '0901112233',
      email: 'dungpm@company.com',
      isActive: false,
    });

    getRoles.mockResolvedValue(rolesFixture);
    createRole.mockResolvedValue({
      id: 3,
      code: 'auditor',
      name: 'Kiểm soát nội bộ',
      description: 'Theo dõi dữ liệu và kiểm tra',
      permissionCount: 0,
      isActive: true,
    });
    updateRole.mockResolvedValue({
      id: 2,
      code: 'warehouse_manager',
      name: 'Quản lý kho Đã Sửa',
      description: 'Quản lý kho và xuất nhập',
      permissionCount: 12,
      isActive: true,
    });
    updateRoleStatus.mockResolvedValue({
      id: 2,
      code: 'warehouse_manager',
      name: 'Quản lý kho',
      description: 'Quản lý sản phẩm và kho',
      permissionCount: 12,
      isActive: false,
    });

    getAccounts.mockResolvedValue(accountsFixture);
    createAccount.mockResolvedValue({
      id: 2,
      username: 'dungpm',
      status: 'active',
      employeeId: 2,
      employeeCode: 'EMP010',
      employeeName: 'Phạm Minh Dũng',
      roleId: 2,
      roleCode: 'warehouse_manager',
      roleName: 'Quản lý kho',
    });
    updateAccount.mockResolvedValue({
      id: 1,
      username: 'admin.updated',
      status: 'active',
      employeeId: 1,
      employeeCode: 'EMP001',
      employeeName: 'Nguyễn Thị Mai',
      roleId: 2,
      roleCode: 'warehouse_manager',
      roleName: 'Quản lý kho',
    });
    updateAccountStatus.mockResolvedValue({
      id: 1,
      username: 'admin.updated',
      status: 'locked',
      employeeId: 1,
      employeeCode: 'EMP001',
      employeeName: 'Nguyễn Thị Mai',
      roleId: 2,
      roleCode: 'warehouse_manager',
      roleName: 'Quản lý kho',
    });
  });

  it('loads employee list and creates a new employee', async () => {
    window.history.pushState({}, '', '/employees');

    render(<App />);

    expect(await screen.findByText('Nguyễn Thị Mai')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Mã nhân viên'), {
      target: { value: 'EMP011' },
    });
    fireEvent.change(screen.getByLabelText('Họ và tên'), {
      target: { value: 'Phạm Minh Dũng' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'dungpm@company.com' },
    });
    fireEvent.change(screen.getByLabelText('Số điện thoại'), {
      target: { value: '0901112233' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lưu nhân viên' }));

    await waitFor(() => {
      expect(createEmployee).toHaveBeenCalledWith('saved-token', {
        code: 'EMP011',
        fullName: 'Phạm Minh Dũng',
        email: 'dungpm@company.com',
        phone: '0901112233',
        gender: 'male',
      });
    });

    expect(await screen.findByText('Phạm Minh Dũng')).toBeInTheDocument();
  });

  it('edits an employee and toggles active status from the list', async () => {
    window.history.pushState({}, '', '/employees');

    render(<App />);

    expect(await screen.findByText('Nguyễn Thị Mai')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sửa EMP001' }));
    fireEvent.change(screen.getByLabelText('Họ và tên'), {
      target: { value: 'Nguyễn Thị Mai Đã Sửa' },
    });
    fireEvent.change(screen.getByLabelText('Số điện thoại'), {
      target: { value: '0999999999' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cập nhật nhân viên' }));

    await waitFor(() => {
      expect(updateEmployee).toHaveBeenCalledWith('saved-token', 1, {
        code: 'EMP001',
        fullName: 'Nguyễn Thị Mai Đã Sửa',
        email: 'maitn@company.com',
        phone: '0999999999',
        gender: 'female',
      });
    });

    expect(await screen.findByText('Nguyễn Thị Mai Đã Sửa')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ngưng EMP010' }));

    await waitFor(() => {
      expect(updateEmployeeStatus).toHaveBeenCalledWith('saved-token', 2, false);
    });

    expect(await screen.findByText('Ngưng hoạt động')).toBeInTheDocument();
  });

  it('exports the employee list to excel', async () => {
    window.history.pushState({}, '', '/employees');

    render(<App />);

    expect(await screen.findByText('Nguyễn Thị Mai')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Xuất Excel' }));

    expect(downloadWorkbook).toHaveBeenCalledWith(
      'danh-sach-nhan-vien.xlsx',
      'Nhan vien',
      ['Mã nhân viên', 'Họ và tên', 'Email', 'Số điện thoại', 'Giới tính', 'Trạng thái'],
      [
        ['EMP001', 'Nguyễn Thị Mai', 'maitn@company.com', '0912345678', 'Nữ', 'Đang hoạt động'],
        ['EMP010', 'Phạm Minh Dũng', 'dungpm@company.com', '0901112233', 'Nam', 'Đang hoạt động'],
      ]
    );
  });

  it('loads role list and creates a new role', async () => {
    window.history.pushState({}, '', '/roles');

    render(<App />);

    expect(await screen.findByText('Quản trị viên')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Mã vai trò'), {
      target: { value: 'auditor' },
    });
    fireEvent.change(screen.getByLabelText('Tên vai trò'), {
      target: { value: 'Kiểm soát nội bộ' },
    });
    fireEvent.change(screen.getByLabelText('Mô tả vai trò'), {
      target: { value: 'Theo dõi dữ liệu và kiểm tra' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lưu vai trò' }));

    await waitFor(() => {
      expect(createRole).toHaveBeenCalledWith('saved-token', {
        code: 'auditor',
        name: 'Kiểm soát nội bộ',
        description: 'Theo dõi dữ liệu và kiểm tra',
      });
    });

    expect(await screen.findByText('Kiểm soát nội bộ')).toBeInTheDocument();
  });

  it('edits a role and toggles active status from the list', async () => {
    window.history.pushState({}, '', '/roles');

    render(<App />);

    expect(await screen.findByText('Quản lý kho')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sửa warehouse_manager' }));
    fireEvent.change(screen.getByLabelText('Tên vai trò'), {
      target: { value: 'Quản lý kho Đã Sửa' },
    });
    fireEvent.change(screen.getByLabelText('Mô tả vai trò'), {
      target: { value: 'Quản lý kho và xuất nhập' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cập nhật vai trò' }));

    await waitFor(() => {
      expect(updateRole).toHaveBeenCalledWith('saved-token', 2, {
        code: 'warehouse_manager',
        name: 'Quản lý kho Đã Sửa',
        description: 'Quản lý kho và xuất nhập',
      });
    });

    expect(await screen.findByText('Quản lý kho Đã Sửa')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ngưng warehouse_manager' }));

    await waitFor(() => {
      expect(updateRoleStatus).toHaveBeenCalledWith('saved-token', 2, false);
    });
  });

  it('loads accounts and creates a new account linked to employee and role', async () => {
    window.history.pushState({}, '', '/accounts');

    render(<App />);

    expect(await screen.findByText('admin')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Nhân viên'), {
      target: { value: '2' },
    });
    fireEvent.change(screen.getByLabelText('Vai trò'), {
      target: { value: '2' },
    });
    fireEvent.change(screen.getByLabelText('Tên đăng nhập mới'), {
      target: { value: 'dungpm' },
    });
    fireEvent.change(screen.getByLabelText('Mật khẩu khởi tạo'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lưu tài khoản' }));

    await waitFor(() => {
      expect(createAccount).toHaveBeenCalledWith('saved-token', {
        employeeId: 2,
        roleId: 2,
        username: 'dungpm',
        password: '123456',
      });
    });

    expect(await screen.findByText('dungpm')).toBeInTheDocument();
    expect(screen.getAllByText('Quản lý kho').length).toBeGreaterThan(0);
  });

  it('edits an account and locks it from the list', async () => {
    window.history.pushState({}, '', '/accounts');

    render(<App />);

    expect(await screen.findByText('admin')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sửa admin' }));
    fireEvent.change(screen.getByLabelText('Vai trò'), {
      target: { value: '2' },
    });
    fireEvent.change(screen.getByLabelText('Tên đăng nhập mới'), {
      target: { value: 'admin.updated' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cập nhật tài khoản' }));

    await waitFor(() => {
      expect(updateAccount).toHaveBeenCalledWith('saved-token', 1, {
        roleId: 2,
        username: 'admin.updated',
        password: null,
      });
    });

    expect(await screen.findByText('admin.updated')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Khóa admin.updated' }));

    await waitFor(() => {
      expect(updateAccountStatus).toHaveBeenCalledWith('saved-token', 1, 'locked');
    });
  });
});
