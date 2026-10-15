import { useEffect, useState } from 'react';

import {
  createEmployee,
  getEmployees,
  updateEmployee,
  updateEmployeeStatus,
} from '../../api/employees';
import { useAuth } from '../../app/providers/AuthProvider';
import AlertBanner from '../../components/feedback/AlertBanner';
import DataTable from '../../components/ui/DataTable';
import FormField from '../../components/ui/FormField';
import PageHeader from '../../components/ui/PageHeader';
import { downloadWorkbook } from '../../utils/excel';

const initialForm = {
  code: '',
  fullName: '',
  email: '',
  phone: '',
  gender: 'male',
};

function EmployeesPage() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [formState, setFormState] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadEmployees() {
      try {
        const data = await getEmployees(token);
        if (!ignore) {
          setEmployees(data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error?.payload?.message || error.message);
        }
      }
    }

    loadEmployees();

    return () => {
      ignore = true;
    };
  }, [token]);

  function resetForm() {
    setEditingEmployeeId(null);
    setFormState(initialForm);
  }

  function handleEdit(employee) {
    setErrorMessage('');
    setSuccessMessage('');
    setEditingEmployeeId(employee.id);
    setFormState({
      code: employee.code || '',
      fullName: employee.fullName || '',
      email: employee.email || '',
      phone: employee.phone || '',
      gender: employee.gender || 'male',
    });
  }

  function handleExportEmployees() {
    downloadWorkbook(
      'danh-sach-nhan-vien.xlsx',
      'Nhan vien',
      ['Mã nhân viên', 'Họ và tên', 'Email', 'Số điện thoại', 'Giới tính', 'Trạng thái'],
      employees.map((employee) => [
        employee.code,
        employee.fullName,
        employee.email,
        employee.phone || '',
        employee.gender === 'female' ? 'Nữ' : employee.gender === 'male' ? 'Nam' : 'Khác',
        employee.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động',
      ])
    );
  }

  async function handleToggleStatus(employee) {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatedEmployee = await updateEmployeeStatus(token, employee.id, !employee.isActive);
      setEmployees((current) =>
        current.map((item) => (item.id === employee.id ? updatedEmployee : item))
      );
      setSuccessMessage(
        updatedEmployee.isActive
          ? 'Đã kích hoạt lại nhân viên.'
          : 'Đã ngưng hoạt động nhân viên.'
      );
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const payload = {
      code: formState.code.trim(),
      fullName: formState.fullName.trim(),
      email: formState.email.trim(),
      phone: formState.phone.trim() || null,
      gender: formState.gender,
    };

    try {
      if (editingEmployeeId) {
        const updatedEmployee = await updateEmployee(token, editingEmployeeId, payload);
        setEmployees((current) =>
          current.map((item) => (item.id === editingEmployeeId ? updatedEmployee : item))
        );
        setSuccessMessage('Đã cập nhật nhân viên.');
      } else {
        const createdEmployee = await createEmployee(token, payload);
        setEmployees((current) => [...current, createdEmployee]);
        setSuccessMessage('Đã tạo nhân viên mới.');
      }

      resetForm();
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  return (
    <div className="admin-page">
      <PageHeader
        title="Nhân viên"
        description="Quản lý hồ sơ nhân sự và đồng bộ dữ liệu dùng cho tài khoản hệ thống."
      />

      <div className="admin-grid">
        <section className="shell-panel admin-form-card">
          <h2>{editingEmployeeId ? 'Cập nhật nhân viên' : 'Tạo nhân viên'}</h2>
          <p className="admin-form-card__hint">Thông tin tối thiểu để cấp tài khoản ở bước sau.</p>

          {errorMessage ? <AlertBanner type="error">{errorMessage}</AlertBanner> : null}
          {successMessage ? <AlertBanner type="success">{successMessage}</AlertBanner> : null}

          <form className="shell-form-grid" onSubmit={handleSubmit}>
            <FormField
              id="employee-code"
              label="Mã nhân viên"
              value={formState.code}
              onChange={(event) =>
                setFormState((current) => ({ ...current, code: event.target.value }))
              }
            />
            <FormField
              id="employee-full-name"
              label="Họ và tên"
              value={formState.fullName}
              onChange={(event) =>
                setFormState((current) => ({ ...current, fullName: event.target.value }))
              }
            />
            <FormField
              id="employee-email"
              label="Email"
              value={formState.email}
              onChange={(event) =>
                setFormState((current) => ({ ...current, email: event.target.value }))
              }
            />
            <FormField
              id="employee-phone"
              label="Số điện thoại"
              value={formState.phone}
              onChange={(event) =>
                setFormState((current) => ({ ...current, phone: event.target.value }))
              }
            />
            <FormField id="employee-gender" label="Giới tính">
              <select
                id="employee-gender"
                value={formState.gender}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, gender: event.target.value }))
                }
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </FormField>

            <div className="form-action-row">
              {editingEmployeeId ? (
                <button
                  type="button"
                  className="shell-button shell-button--ghost"
                  onClick={resetForm}
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
              <button type="submit" className="shell-button shell-button--primary">
                {editingEmployeeId ? 'Cập nhật nhân viên' : 'Lưu nhân viên'}
              </button>
            </div>
          </form>
        </section>

        <section className="shell-panel admin-table-card">
          <div className="card-section-header">
            <h2>Danh sách nhân viên</h2>
            <button
              type="button"
              className="shell-button shell-button--ghost"
              onClick={handleExportEmployees}
            >
              Xuất Excel
            </button>
          </div>
          <DataTable
            columns={[
              { key: 'code', label: 'Mã' },
              { key: 'fullName', label: 'Họ và tên' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Số điện thoại' },
              {
                key: 'isActive',
                label: 'Trạng thái',
                render: (row) => (row.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'),
              },
              {
                key: 'actions',
                label: 'Thao tác',
                render: (row) => (
                  <div className="table-actions">
                    <button
                      type="button"
                      className="shell-button shell-button--ghost"
                      aria-label={`Sửa ${row.code}`}
                      onClick={() => handleEdit(row)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="shell-button shell-button--ghost"
                      aria-label={`${row.isActive ? 'Ngưng' : 'Kích hoạt'} ${row.code}`}
                      onClick={() => handleToggleStatus(row)}
                    >
                      {row.isActive ? 'Ngưng' : 'Kích hoạt'}
                    </button>
                  </div>
                ),
              },
            ]}
            rows={employees}
            emptyMessage="Chưa có nhân viên nào."
          />
        </section>
      </div>
    </div>
  );
}

export default EmployeesPage;
