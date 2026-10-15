import { useEffect, useState } from 'react';

import {
  createRole,
  getRoles,
  updateRole,
  updateRoleStatus,
} from '../../api/roles';
import { useAuth } from '../../app/providers/AuthProvider';
import AlertBanner from '../../components/feedback/AlertBanner';
import DataTable from '../../components/ui/DataTable';
import FormField from '../../components/ui/FormField';
import PageHeader from '../../components/ui/PageHeader';
import { downloadWorkbook } from '../../utils/excel';

const initialForm = {
  code: '',
  name: '',
  description: '',
};

function RolesPage() {
  const { token } = useAuth();
  const [roles, setRoles] = useState([]);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [formState, setFormState] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadRoles() {
      try {
        const data = await getRoles(token);
        if (!ignore) {
          setRoles(data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error?.payload?.message || error.message);
        }
      }
    }

    loadRoles();

    return () => {
      ignore = true;
    };
  }, [token]);

  function resetForm() {
    setEditingRoleId(null);
    setFormState(initialForm);
  }

  function handleEdit(role) {
    setErrorMessage('');
    setSuccessMessage('');
    setEditingRoleId(role.id);
    setFormState({
      code: role.code || '',
      name: role.name || '',
      description: role.description || '',
    });
  }

  function handleExportRoles() {
    downloadWorkbook(
      'danh-sach-vai-tro.xlsx',
      'Vai tro',
      ['Mã vai trò', 'Tên vai trò', 'Mô tả', 'Số quyền', 'Trạng thái'],
      roles.map((role) => [
        role.code,
        role.name,
        role.description || '',
        role.permissionCount ?? 0,
        role.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động',
      ])
    );
  }

  async function handleToggleStatus(role) {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatedRole = await updateRoleStatus(token, role.id, !role.isActive);
      setRoles((current) =>
        current.map((item) => (item.id === role.id ? updatedRole : item))
      );
      setSuccessMessage(updatedRole.isActive ? 'Đã kích hoạt vai trò.' : 'Đã ngưng vai trò.');
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
      description: formState.description.trim(),
    };

    try {
      if (editingRoleId) {
        const updatedRole = await updateRole(token, editingRoleId, payload);
        setRoles((current) =>
          current.map((item) => (item.id === editingRoleId ? updatedRole : item))
        );
        setSuccessMessage('Đã cập nhật vai trò.');
      } else {
        const createdRole = await createRole(token, payload);
        setRoles((current) => [...current, { ...createdRole, permissionCount: 0 }]);
        setSuccessMessage('Đã tạo vai trò mới.');
      }

      resetForm();
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  return (
    <div className="admin-page">
      <PageHeader
        title="Vai trò"
        description="Thiết lập nhóm quyền dùng cho RBAC và kiểm soát truy cập backend."
      />

      <div className="admin-grid">
        <section className="shell-panel admin-form-card">
          <h2>{editingRoleId ? 'Cập nhật vai trò' : 'Tạo vai trò'}</h2>
          <p className="admin-form-card__hint">Mã vai trò nên ngắn gọn và ổn định để dùng lâu dài.</p>

          {errorMessage ? <AlertBanner type="error">{errorMessage}</AlertBanner> : null}
          {successMessage ? <AlertBanner type="success">{successMessage}</AlertBanner> : null}

          <form className="shell-form-grid" onSubmit={handleSubmit}>
            <FormField
              id="role-code"
              label="Mã vai trò"
              value={formState.code}
              onChange={(event) =>
                setFormState((current) => ({ ...current, code: event.target.value }))
              }
            />
            <FormField
              id="role-name"
              label="Tên vai trò"
              value={formState.name}
              onChange={(event) =>
                setFormState((current) => ({ ...current, name: event.target.value }))
              }
            />
            <FormField id="role-description" label="Mô tả vai trò">
              <textarea
                id="role-description"
                rows="4"
                value={formState.description}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, description: event.target.value }))
                }
              />
            </FormField>

            <div className="form-action-row">
              {editingRoleId ? (
                <button
                  type="button"
                  className="shell-button shell-button--ghost"
                  onClick={resetForm}
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
              <button type="submit" className="shell-button shell-button--primary">
                {editingRoleId ? 'Cập nhật vai trò' : 'Lưu vai trò'}
              </button>
            </div>
          </form>
        </section>

        <section className="shell-panel admin-table-card">
          <div className="card-section-header">
            <h2>Danh sách vai trò</h2>
            <button
              type="button"
              className="shell-button shell-button--ghost"
              onClick={handleExportRoles}
            >
              Xuất Excel
            </button>
          </div>
          <DataTable
            columns={[
              { key: 'code', label: 'Mã' },
              { key: 'name', label: 'Tên vai trò' },
              { key: 'description', label: 'Mô tả' },
              { key: 'permissionCount', label: 'Số quyền' },
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
            rows={roles}
            emptyMessage="Chưa có vai trò nào."
          />
        </section>
      </div>
    </div>
  );
}

export default RolesPage;
