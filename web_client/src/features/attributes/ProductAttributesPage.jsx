import { useEffect, useMemo, useState } from 'react';

import {
  createAttribute,
  getAttributes,
  updateAttribute,
  updateAttributeStatus,
} from '../../api/attributes';
import { useAuth } from '../../app/providers/AuthProvider';
import AlertBanner from '../../components/feedback/AlertBanner';
import DataTable from '../../components/ui/DataTable';
import FormField from '../../components/ui/FormField';
import PageHeader from '../../components/ui/PageHeader';
import { downloadWorkbook } from '../../utils/excel';

const attributeOptions = [
  { value: 'brands', label: 'Thương hiệu', usesCodeAndName: true },
  { value: 'origins', label: 'Xuất xứ', usesCodeAndName: true },
  { value: 'operatingSystems', label: 'Hệ điều hành', usesCodeAndName: true },
  { value: 'colors', label: 'Màu sắc', usesCodeAndName: true },
  { value: 'rams', label: 'RAM', usesCodeAndName: false },
  { value: 'roms', label: 'ROM', usesCodeAndName: false },
];

const initialTextForm = {
  code: '',
  name: '',
};

function ProductAttributesPage() {
  const { token } = useAuth();
  const [attributeType, setAttributeType] = useState('brands');
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [textForm, setTextForm] = useState(initialTextForm);
  const [sizeGb, setSizeGb] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedOption = useMemo(
    () => attributeOptions.find((option) => option.value === attributeType),
    [attributeType]
  );

  useEffect(() => {
    let ignore = false;

    async function loadAttributes() {
      try {
        setErrorMessage('');
        const data = await getAttributes(token, attributeType);
        if (!ignore) {
          setItems(data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error?.payload?.message || error.message);
        }
      }
    }

    loadAttributes();

    return () => {
      ignore = true;
    };
  }, [attributeType, token]);

  function resetForm() {
    setEditingItemId(null);
    setTextForm(initialTextForm);
    setSizeGb('');
  }

  function handleTypeChange(nextType) {
    setAttributeType(nextType);
    setSuccessMessage('');
    setErrorMessage('');
    resetForm();
  }

  function handleEdit(item) {
    setErrorMessage('');
    setSuccessMessage('');
    setEditingItemId(item.id);

    if (selectedOption.usesCodeAndName) {
      setTextForm({
        code: item.code || '',
        name: item.name || '',
      });
      setSizeGb('');
      return;
    }

    setTextForm(initialTextForm);
    setSizeGb(String(item.sizeGb || ''));
  }

  function handleExportAttributes() {
    const headers = selectedOption.usesCodeAndName
      ? ['Mã thuộc tính', 'Tên thuộc tính', 'Trạng thái']
      : [selectedOption.label, 'Trạng thái'];
    const rows = selectedOption.usesCodeAndName
      ? items.map((item) => [
          item.code,
          item.name,
          item.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động',
        ])
      : items.map((item) => [`${item.sizeGb} GB`, item.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động']);

    downloadWorkbook(
      `danh-sach-${selectedOption.label.toLowerCase().replace(/\s+/g, '-')}.xlsx`,
      selectedOption.label,
      headers,
      rows
    );
  }

  async function handleToggleStatus(item) {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatedItem = await updateAttributeStatus(token, attributeType, item.id, !item.isActive);
      setItems((current) => current.map((row) => (row.id === item.id ? updatedItem : row)));
      setSuccessMessage(
        updatedItem.isActive ? 'Đã kích hoạt thuộc tính.' : 'Đã ngưng hoạt động thuộc tính.'
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
      const payload = selectedOption.usesCodeAndName
        ? {
            code: textForm.code.trim(),
            name: textForm.name.trim(),
          }
        : {
            sizeGb: Number(sizeGb),
          };

      if (editingItemId) {
        const updatedItem = await updateAttribute(token, attributeType, editingItemId, payload);
        setItems((current) => current.map((row) => (row.id === editingItemId ? updatedItem : row)));
        setSuccessMessage('Đã cập nhật thuộc tính.');
      } else {
        const createdItem = await createAttribute(token, attributeType, payload);
        setItems((current) => [...current, createdItem]);
        setSuccessMessage('Đã thêm thuộc tính mới.');
      }

      resetForm();
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  const columns = selectedOption.usesCodeAndName
    ? [
        { key: 'code', label: 'Mã' },
        { key: 'name', label: selectedOption.label },
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
      ]
    : [
        {
          key: 'sizeGb',
          label: selectedOption.label,
          render: (row) => `${row.sizeGb} GB`,
        },
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
                aria-label={`Sửa ${row.sizeGb} GB`}
                onClick={() => handleEdit(row)}
              >
                Sửa
              </button>
              <button
                type="button"
                className="shell-button shell-button--ghost"
                aria-label={`${row.isActive ? 'Ngưng' : 'Kích hoạt'} ${row.sizeGb} GB`}
                onClick={() => handleToggleStatus(row)}
              >
                {row.isActive ? 'Ngưng' : 'Kích hoạt'}
              </button>
            </div>
          ),
        },
      ];

  return (
    <div className="admin-page">
      <PageHeader
        title="Thuộc tính sản phẩm"
        description="Quản lý các danh mục nền như thương hiệu, xuất xứ, hệ điều hành, RAM, ROM và màu sắc."
      />

      <div className="admin-grid">
        <section className="shell-panel admin-form-card">
          <h2>{editingItemId ? 'Cập nhật thuộc tính' : 'Thêm thuộc tính'}</h2>
          <p className="admin-form-card__hint">
            Chọn đúng loại thuộc tính rồi thêm giá trị để dùng cho model và biến thể.
          </p>

          {errorMessage ? <AlertBanner type="error">{errorMessage}</AlertBanner> : null}
          {successMessage ? <AlertBanner type="success">{successMessage}</AlertBanner> : null}

          <form className="shell-form-grid" onSubmit={handleSubmit}>
            <FormField id="attribute-type" label="Loại thuộc tính">
              <select
                id="attribute-type"
                value={attributeType}
                onChange={(event) => handleTypeChange(event.target.value)}
              >
                {attributeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            {selectedOption.usesCodeAndName ? (
              <>
                <FormField
                  id="attribute-code"
                  label="Mã thuộc tính"
                  value={textForm.code}
                  onChange={(event) =>
                    setTextForm((current) => ({ ...current, code: event.target.value }))
                  }
                />
                <FormField
                  id="attribute-name"
                  label="Tên thuộc tính"
                  value={textForm.name}
                  onChange={(event) =>
                    setTextForm((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </>
            ) : (
              <FormField
                id="attribute-size"
                label="Dung lượng (GB)"
                type="number"
                value={sizeGb}
                onChange={(event) => setSizeGb(event.target.value)}
              />
            )}

            <div className="form-action-row">
              {editingItemId ? (
                <button type="button" className="shell-button shell-button--ghost" onClick={resetForm}>
                  Hủy chỉnh sửa
                </button>
              ) : null}
              <button type="submit" className="shell-button shell-button--primary">
                {editingItemId ? 'Cập nhật thuộc tính' : 'Lưu thuộc tính'}
              </button>
            </div>
          </form>
        </section>

        <section className="shell-panel admin-table-card">
          <div className="card-section-header">
            <h2>Danh sách {selectedOption.label.toLowerCase()}</h2>
            <button
              type="button"
              className="shell-button shell-button--ghost"
              onClick={handleExportAttributes}
            >
              Xuất Excel
            </button>
          </div>
          <DataTable
            ariaLabel={`Danh sách ${selectedOption.label.toLowerCase()}`}
            columns={columns}
            rows={items}
            emptyMessage="Chưa có dữ liệu thuộc tính."
          />
        </section>
      </div>
    </div>
  );
}

export default ProductAttributesPage;
