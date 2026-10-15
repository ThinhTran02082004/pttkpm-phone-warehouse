import { useEffect, useMemo, useState } from 'react';

import {
  createAccount,
  getAccounts,
  updateAccount,
  updateAccountStatus,
} from '../../api/accounts';
import { getEmployees } from '../../api/employees';
import { getRoles } from '../../api/roles';
import { useAuth } from '../../app/providers/AuthProvider';
import AlertBanner from '../../components/feedback/AlertBanner';
import DataTable from '../../components/ui/DataTable';
import FormField from '../../components/ui/FormField';
import PageHeader from '../../components/ui/PageHeader';
import { downloadWorkbook } from '../../utils/excel';

const initialForm = {
  employeeId: '',
  roleId: '',
  username: '',
  password: '',
};

function mapAccountStatus(status) {
  switch (status) {
    case 'locked':
      return 'Đã khóa';
    case 'inactive':
      return 'Ngưng hoạt động';
    default:
      return 'Đang hoạt động';
  }
}

function AccountsPage() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [formState, setFormState] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const [accountData, employeeData, roleData] = await Promise.all([
          getAccounts(token),
          getEmployees(token),
          getRoles(token),
        ]);

        if (!ignore) {
          setAccounts(accountData);
          setEmployees(employeeData);
          setRoles(roleData);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error?.payload?.message || error.message);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [token]);

  const availableEmployees = useMemo(() => {
    const accountEmployeeIds = new Set(accounts.map((account) => Number(account.employeeId)));
    const editableEmployeeId = Number(formState.employeeId || 0);

    return employees.filter(
      (employee) =>
        !accountEmployeeIds.has(Number(employee.id)) || Number(employee.id) === editableEmployeeId
    );
  }, [accounts, employees, formState.employeeId]);

  function resetForm() {
    setEditingAccountId(null);
    setFormState(initialForm);
  }

  function handleEdit(account) {
    setErrorMessage('');
    setSuccessMessage('');
    setEditingAccountId(account.id);
    setFormState({
      employeeId: String(account.employeeId),
      roleId: String(account.roleId),
      username: account.username || '',
      password: '',
    });
  }

  function handleExportAccounts() {
    downloadWorkbook(
      'danh-sach-tai-khoan.xlsx',
      'Tai khoan',
      ['Tên đăng nhập', 'Nhân viên', 'Vai trò', 'Trạng thái'],
      accounts.map((account) => [
        account.username,
        account.employeeName || '',
        account.roleName || '',
        mapAccountStatus(account.status),
      ])
    );
  }

  async function handleToggleStatus(account) {
    setErrorMessage('');
    setSuccessMessage('');

    const nextStatus = account.status === 'locked' ? 'active' : 'locked';

    try {
      const updatedAccount = await updateAccountStatus(token, account.id, nextStatus);
      setAccounts((current) =>
        current.map((item) => (item.id === account.id ? updatedAccount : item))
      );
      setSuccessMessage(
        updatedAccount.status === 'locked'
          ? 'Đã khóa tài khoản.'
          : 'Đã mở khóa tài khoản.'
      );
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (editingAccountId) {
        const updatedAccount = await updateAccount(token, editingAccountId, {
          roleId: Number(formState.roleId),
          username: formState.username.trim(),
          password: formState.password.trim() || null,
        });

        setAccounts((current) =>
          current.map((item) => (item.id === editingAccountId ? updatedAccount : item))
        );
        setSuccessMessage('Đã cập nhật tài khoản.');
      } else {
        const createdAccount = await createAccount(token, {
          employeeId: Number(formState.employeeId),
          roleId: Number(formState.roleId),
          username: formState.username.trim(),
          password: formState.password,
        });

        setAccounts((current) => [...current, createdAccount]);
        setSuccessMessage('Đã tạo tài khoản mới.');
      }

      resetForm();
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  return (
    <div className="admin-page">
      <PageHeader
        title="Tài khoản"
        description="Tạo và gắn tài khoản hệ thống cho nhân viên với đúng vai trò hoạt động."
      />

      <div className="admin-grid">
        <section className="shell-panel admin-form-card">
          <h2>{editingAccountId ? 'Cập nhật tài khoản' : 'Tạo tài khoản'}</h2>
          <p className="admin-form-card__hint">
            Chỉ những nhân viên chưa có tài khoản mới xuất hiện trong danh sách chọn.
          </p>

          {errorMessage ? <AlertBanner type="error">{errorMessage}</AlertBanner> : null}
          {successMessage ? <AlertBanner type="success">{successMessage}</AlertBanner> : null}

          <form className="shell-form-grid" onSubmit={handleSubmit}>
            <FormField id="account-employee" label="Nhân viên">
              <select
                id="account-employee"
                disabled={Boolean(editingAccountId)}
                value={formState.employeeId}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, employeeId: event.target.value }))
                }
              >
                <option value="">Chọn nhân viên</option>
                {availableEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.code} - {employee.fullName}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField id="account-role" label="Vai trò">
              <select
                id="account-role"
                value={formState.roleId}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, roleId: event.target.value }))
                }
              >
                <option value="">Chọn vai trò</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              id="account-username"
              label="Tên đăng nhập mới"
              value={formState.username}
              onChange={(event) =>
                setFormState((current) => ({ ...current, username: event.target.value }))
              }
            />
            <FormField
              id="account-password"
              label={editingAccountId ? 'Mật khẩu mới (nếu đổi)' : 'Mật khẩu khởi tạo'}
              type="password"
              value={formState.password}
              onChange={(event) =>
                setFormState((current) => ({ ...current, password: event.target.value }))
              }
            />

            <div className="form-action-row">
              {editingAccountId ? (
                <button
                  type="button"
                  className="shell-button shell-button--ghost"
                  onClick={resetForm}
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
              <button type="submit" className="shell-button shell-button--primary">
                {editingAccountId ? 'Cập nhật tài khoản' : 'Lưu tài khoản'}
              </button>
            </div>
          </form>
        </section>

        <section className="shell-panel admin-table-card">
          <div className="card-section-header">
            <h2>Danh sách tài khoản</h2>
            <button
              type="button"
              className="shell-button shell-button--ghost"
              onClick={handleExportAccounts}
            >
              Xuất Excel
            </button>
          </div>
          <DataTable
            columns={[
              { key: 'username', label: 'Tên đăng nhập' },
              { key: 'employeeName', label: 'Nhân viên' },
              { key: 'roleName', label: 'Vai trò' },
              {
                key: 'status',
                label: 'Trạng thái',
                render: (row) => mapAccountStatus(row.status),
              },
              {
                key: 'actions',
                label: 'Thao tác',
                render: (row) => (
                  <div className="table-actions">
                    <button
                      type="button"
                      className="shell-button shell-button--ghost"
                      aria-label={`Sửa ${row.username}`}
                      onClick={() => handleEdit(row)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="shell-button shell-button--ghost"
                      aria-label={`${row.status === 'locked' ? 'Mở khóa' : 'Khóa'} ${row.username}`}
                      onClick={() => handleToggleStatus(row)}
                    >
                      {row.status === 'locked' ? 'Mở khóa' : 'Khóa'}
                    </button>
                  </div>
                ),
              },
            ]}
            rows={accounts}
            emptyMessage="Chưa có tài khoản nào."
          />
        </section>
      </div>
    </div>
  );
}

export default AccountsPage;
