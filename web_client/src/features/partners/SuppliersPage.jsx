import { useEffect, useState } from 'react';

import {
  createSupplier,
  getSuppliers,
  updateSupplier,
  updateSupplierStatus,
} from '../../api/suppliers';
import { useAuth } from '../../app/providers/AuthProvider';
import AlertBanner from '../../components/feedback/AlertBanner';
import DataTable from '../../components/ui/DataTable';
import FormField from '../../components/ui/FormField';
import PageHeader from '../../components/ui/PageHeader';
import { downloadWorkbook } from '../../utils/excel';

const initialForm = {
  code: '',
  name: '',
  phone: '',
  email: '',
};

function SuppliersPage() {
  const { token } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [formState, setFormState] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadSuppliers() {
      try {
        const data = await getSuppliers(token);
        if (!ignore) {
          setSuppliers(data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error?.payload?.message || error.message);
        }
      }
    }

    loadSuppliers();

    return () => {
      ignore = true;
    };
  }, [token]);

  function resetForm() {
    setEditingSupplierId(null);
    setFormState(initialForm);
  }

  function handleEdit(supplier) {
    setErrorMessage('');
    setSuccessMessage('');
    setEditingSupplierId(supplier.id);
    setFormState({
      code: supplier.code || '',
      name: supplier.name || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
    });
  }

  function handleExportSuppliers() {
    downloadWorkbook(
      'danh-sach-nha-cung-cap.xlsx',
      'Nha cung cap',
      ['Mã nhà cung cấp', 'Tên đối tác', 'Số điện thoại', 'Email', 'Trạng thái'],
      suppliers.map((supplier) => [
        supplier.code,
        supplier.name,
        supplier.phone || '',
        supplier.email || '',
        supplier.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động',
      ])
    );
  }

  async function handleToggleStatus(supplier) {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatedSupplier = await updateSupplierStatus(token, supplier.id, !supplier.isActive);
      setSuppliers((current) =>
        current.map((item) => (item.id === supplier.id ? updatedSupplier : item))
      );
      setSuccessMessage(
        updatedSupplier.isActive
          ? 'Đã kích hoạt nhà cung cấp.'
          : 'Đã ngưng nhà cung cấp.'
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
      name: formState.name.trim(),
      phone: formState.phone.trim(),
      email: formState.email.trim() || null,
    };

    try {
      if (editingSupplierId) {
        const updatedSupplier = await updateSupplier(token, editingSupplierId, payload);
        setSuppliers((current) =>
          current.map((item) => (item.id === editingSupplierId ? updatedSupplier : item))
        );
        setSuccessMessage('Đã cập nhật nhà cung cấp.');
      } else {
        const createdSupplier = await createSupplier(token, payload);
        setSuppliers((current) => [...current, createdSupplier]);
        setSuccessMessage('Đã tạo nhà cung cấp mới.');
      }

      resetForm();
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  return (
    <div className="admin-page">
      <PageHeader
        title="Nhà cung cấp"
        description="Quản lý đối tác đầu vào dùng cho luồng nhập kho và theo dõi nguồn hàng."
      />

      <div className="admin-grid">
        <section className="shell-panel admin-form-card">
          <h2>{editingSupplierId ? 'Cập nhật nhà cung cấp' : 'Tạo nhà cung cấp'}</h2>
          <p className="admin-form-card__hint">
            Mỗi nhà cung cấp cần mã riêng, số điện thoại chính và thông tin liên hệ cơ bản.
          </p>

          {errorMessage ? <AlertBanner type="error">{errorMessage}</AlertBanner> : null}
          {successMessage ? <AlertBanner type="success">{successMessage}</AlertBanner> : null}

          <form className="shell-form-grid" onSubmit={handleSubmit}>
            <FormField
              id="supplier-code"
              label="Mã nhà cung cấp"
              value={formState.code}
              onChange={(event) =>
                setFormState((current) => ({ ...current, code: event.target.value }))
              }
            />
            <FormField
              id="supplier-name"
              label="Tên nhà cung cấp"
              value={formState.name}
              onChange={(event) =>
                setFormState((current) => ({ ...current, name: event.target.value }))
              }
            />
            <FormField
              id="supplier-phone"
              label="Số điện thoại NCC"
              value={formState.phone}
              onChange={(event) =>
                setFormState((current) => ({ ...current, phone: event.target.value }))
              }
            />
            <FormField
              id="supplier-email"
              label="Email NCC"
              value={formState.email}
              onChange={(event) =>
                setFormState((current) => ({ ...current, email: event.target.value }))
              }
            />

            <div className="form-action-row">
              {editingSupplierId ? (
                <button
                  type="button"
                  className="shell-button shell-button--ghost"
                  onClick={resetForm}
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
              <button type="submit" className="shell-button shell-button--primary">
                {editingSupplierId ? 'Cập nhật nhà cung cấp' : 'Lưu nhà cung cấp'}
              </button>
            </div>
          </form>
        </section>

        <section className="shell-panel admin-table-card">
          <div className="card-section-header">
            <h2>Danh sách nhà cung cấp</h2>
            <button
              type="button"
              className="shell-button shell-button--ghost"
              onClick={handleExportSuppliers}
            >
              Xuất Excel
            </button>
          </div>
          <DataTable
            columns={[
              { key: 'code', label: 'Mã' },
              { key: 'name', label: 'Tên đối tác' },
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
            rows={suppliers}
            emptyMessage="Chưa có nhà cung cấp nào."
          />
        </section>
      </div>
    </div>
  );
}

export default SuppliersPage;
