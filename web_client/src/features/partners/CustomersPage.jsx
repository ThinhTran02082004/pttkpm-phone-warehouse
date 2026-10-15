import { useEffect, useState } from 'react';

import {
  createCustomer,
  getCustomers,
  updateCustomer,
  updateCustomerStatus,
} from '../../api/customers';
import { useAuth } from '../../app/providers/AuthProvider';
import AlertBanner from '../../components/feedback/AlertBanner';
import DataTable from '../../components/ui/DataTable';
import FormField from '../../components/ui/FormField';
import PageHeader from '../../components/ui/PageHeader';
import { downloadWorkbook } from '../../utils/excel';

const initialForm = {
  code: '',
  fullName: '',
  phone: '',
  email: '',
};

function CustomersPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [formState, setFormState] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadCustomers() {
      try {
        const data = await getCustomers(token);
        if (!ignore) {
          setCustomers(data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error?.payload?.message || error.message);
        }
      }
    }

    loadCustomers();

    return () => {
      ignore = true;
    };
  }, [token]);

  function resetForm() {
    setEditingCustomerId(null);
    setFormState(initialForm);
  }

  function handleEdit(customer) {
    setErrorMessage('');
    setSuccessMessage('');
    setEditingCustomerId(customer.id);
    setFormState({
      code: customer.code || '',
      fullName: customer.fullName || '',
      phone: customer.phone || '',
      email: customer.email || '',
    });
  }

  function handleExportCustomers() {
    downloadWorkbook(
      'danh-sach-khach-hang.xlsx',
      'Khach hang',
      ['Mã khách hàng', 'Tên khách hàng', 'Số điện thoại', 'Email', 'Trạng thái'],
      customers.map((customer) => [
        customer.code,
        customer.fullName,
        customer.phone || '',
        customer.email || '',
        customer.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động',
      ])
    );
  }

  async function handleToggleStatus(customer) {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatedCustomer = await updateCustomerStatus(token, customer.id, !customer.isActive);
      setCustomers((current) =>
        current.map((item) => (item.id === customer.id ? updatedCustomer : item))
      );
      setSuccessMessage(
        updatedCustomer.isActive ? 'Đã kích hoạt khách hàng.' : 'Đã ngưng khách hàng.'
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
      phone: formState.phone.trim(),
      email: formState.email.trim() || null,
    };

    try {
      if (editingCustomerId) {
        const updatedCustomer = await updateCustomer(token, editingCustomerId, payload);
        setCustomers((current) =>
          current.map((item) => (item.id === editingCustomerId ? updatedCustomer : item))
        );
        setSuccessMessage('Đã cập nhật khách hàng.');
      } else {
        const createdCustomer = await createCustomer(token, payload);
        setCustomers((current) => [...current, createdCustomer]);
        setSuccessMessage('Đã tạo khách hàng mới.');
      }

      resetForm();
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  return (
    <div className="admin-page">
      <PageHeader
        title="Khách hàng"
        description="Quản lý danh sách khách mua hàng phục vụ xuất kho, dịch vụ và chăm sóc sau bán."
      />

      <div className="admin-grid">
        <section className="shell-panel admin-form-card">
          <h2>{editingCustomerId ? 'Cập nhật khách hàng' : 'Tạo khách hàng'}</h2>
          <p className="admin-form-card__hint">
            Dữ liệu khách hàng được dùng lại cho phiếu xuất và các ticket dịch vụ.
          </p>

          {errorMessage ? <AlertBanner type="error">{errorMessage}</AlertBanner> : null}
          {successMessage ? <AlertBanner type="success">{successMessage}</AlertBanner> : null}

          <form className="shell-form-grid" onSubmit={handleSubmit}>
            <FormField
              id="customer-code"
              label="Mã khách hàng"
              value={formState.code}
              onChange={(event) =>
                setFormState((current) => ({ ...current, code: event.target.value }))
              }
            />
            <FormField
              id="customer-name"
              label="Tên khách hàng"
              value={formState.fullName}
              onChange={(event) =>
                setFormState((current) => ({ ...current, fullName: event.target.value }))
              }
            />
            <FormField
              id="customer-phone"
              label="Số điện thoại KH"
              value={formState.phone}
              onChange={(event) =>
                setFormState((current) => ({ ...current, phone: event.target.value }))
              }
            />
            <FormField
              id="customer-email"
              label="Email KH"
              value={formState.email}
              onChange={(event) =>
                setFormState((current) => ({ ...current, email: event.target.value }))
              }
            />

            <div className="form-action-row">
              {editingCustomerId ? (
                <button
                  type="button"
                  className="shell-button shell-button--ghost"
                  onClick={resetForm}
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
              <button type="submit" className="shell-button shell-button--primary">
                {editingCustomerId ? 'Cập nhật khách hàng' : 'Lưu khách hàng'}
              </button>
            </div>
          </form>
        </section>

        <section className="shell-panel admin-table-card">
          <div className="card-section-header">
            <h2>Danh sách khách hàng</h2>
            <button
              type="button"
              className="shell-button shell-button--ghost"
              onClick={handleExportCustomers}
            >
              Xuất Excel
            </button>
          </div>
          <DataTable
            columns={[
              { key: 'code', label: 'Mã' },
              { key: 'fullName', label: 'Tên khách hàng' },
              { key: 'phone', label: 'Số điện thoại' },
              { key: 'email', label: 'Email' },
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
            rows={customers}
            emptyMessage="Chưa có khách hàng nào."
          />
        </section>
      </div>
    </div>
  );
}

export default CustomersPage;
