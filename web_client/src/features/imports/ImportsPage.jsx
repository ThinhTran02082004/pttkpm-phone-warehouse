import { useEffect, useState } from 'react';

import { createImportOrder, getImports } from '../../api/imports';
import { getProductVariants } from '../../api/products';
import { getSuppliers } from '../../api/suppliers';
import { useAuth } from '../../app/providers/AuthProvider';
import AlertBanner from '../../components/feedback/AlertBanner';
import DataTable from '../../components/ui/DataTable';
import FormField from '../../components/ui/FormField';
import PageHeader from '../../components/ui/PageHeader';
import { downloadWorkbook } from '../../utils/excel';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const initialLineItem = {
  variantId: '',
  unitCost: '',
  imeisText: '',
};

const initialFormState = {
  code: '',
  supplierId: '',
  orderedAt: '',
  receivedAt: '',
  notes: '',
  items: [{ ...initialLineItem }],
};

function formatDatetimeForApi(value) {
  if (!value) {
    return null;
  }

  return `${value.replace('T', ' ')}:00`;
}

function parseImeis(text) {
  return text
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function ImportsPage() {
  const { token } = useAuth();
  const [imports, setImports] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [variants, setVariants] = useState([]);
  const [formState, setFormState] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setErrorMessage('');
        const [importData, supplierData, variantData] = await Promise.all([
          getImports(token),
          getSuppliers(token),
          getProductVariants(token),
        ]);

        if (!ignore) {
          setImports(importData);
          setSuppliers(supplierData);
          setVariants(variantData);
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

  function updateLineItem(index, field, value) {
    setFormState((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function handleExportImports() {
    downloadWorkbook(
      'danh-sach-phieu-nhap.xlsx',
      'Phieu nhap',
      ['Mã phiếu', 'Nhà cung cấp', 'Ngày nhận', 'Số IMEI', 'Tổng tiền'],
      imports.map((item) => [
        item.code,
        item.supplierName || '',
        formatDateTime(item.receivedAt),
        item.inventoryItemCount ?? 0,
        item.totalAmount ?? 0,
      ])
    );
  }

  function handleAddLineItem() {
    setFormState((current) => ({
      ...current,
      items: [...current.items, { ...initialLineItem }],
    }));
  }

  function handleRemoveLineItem(index) {
    setFormState((current) => {
      if (current.items.length === 1) {
        return current;
      }

      return {
        ...current,
        items: current.items.filter((_, itemIndex) => itemIndex !== index),
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const payload = {
      code: formState.code.trim(),
      supplierId: Number(formState.supplierId),
      orderedAt: formatDatetimeForApi(formState.orderedAt),
      receivedAt: formatDatetimeForApi(formState.receivedAt),
      notes: formState.notes.trim() || null,
      items: formState.items.map((item) => ({
        variantId: Number(item.variantId),
        unitCost: Number(item.unitCost),
        imeis: parseImeis(item.imeisText),
      })),
    };

    try {
      const createdImport = await createImportOrder(token, payload);
      const selectedSupplier = suppliers.find(
        (supplier) => supplier.id === Number(formState.supplierId)
      );
      const inventoryItemCount = payload.items.reduce(
        (total, item) => total + item.imeis.length,
        0
      );

      setImports((current) => [
        {
          ...createdImport,
          supplierName: selectedSupplier?.name || `NCC #${payload.supplierId}`,
          inventoryItemCount,
          lineCount: payload.items.length,
        },
        ...current,
      ]);
      setFormState(initialFormState);
      setSuccessMessage('Đã tạo phiếu nhập kho mới.');
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  return (
    <div className="admin-page">
      <PageHeader
        title="Nhập kho"
        description="Lập phiếu nhập, gán NCC cho từng lô hàng và tạo IMEI tồn kho ngay khi phiếu hoàn tất."
      />

      <div className="admin-grid">
        <section className="shell-panel admin-form-card">
          <h2>Tạo phiếu nhập kho</h2>
          <p className="admin-form-card__hint">
            Mỗi dòng nhập gắn với một biến thể sản phẩm và danh sách IMEI tương ứng của lô hàng.
          </p>

          {errorMessage ? <AlertBanner type="error">{errorMessage}</AlertBanner> : null}
          {successMessage ? <AlertBanner type="success">{successMessage}</AlertBanner> : null}

          <form className="shell-form-grid" onSubmit={handleSubmit}>
            <div className="import-form-grid">
              <FormField
                id="import-code"
                label="Mã phiếu nhập"
                value={formState.code}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, code: event.target.value }))
                }
              />
              <FormField id="import-supplier" label="Nhà cung cấp">
                <select
                  id="import-supplier"
                  value={formState.supplierId}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      supplierId: event.target.value,
                    }))
                  }
                >
                  <option value="">Chọn nhà cung cấp</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <div className="form-span-full">
                <FormField
                  id="import-ordered-at"
                  label="Thời điểm đặt"
                  type="datetime-local"
                  value={formState.orderedAt}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, orderedAt: event.target.value }))
                  }
                />
              </div>
              <div className="form-span-full">
                <FormField
                  id="import-received-at"
                  label="Thời điểm nhận"
                  type="datetime-local"
                  value={formState.receivedAt}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, receivedAt: event.target.value }))
                  }
                />
              </div>
              <div className="form-span-full">
                <FormField
                  id="import-notes"
                  label="Ghi chú phiếu nhập"
                  value={formState.notes}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, notes: event.target.value }))
                  }
                >
                  <textarea
                    id="import-notes"
                    rows="3"
                    value={formState.notes}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, notes: event.target.value }))
                    }
                  />
                </FormField>
              </div>
            </div>

            <div className="import-items">
              {formState.items.map((item, index) => (
                <div key={`import-item-${index}`} className="shell-panel import-item-card">
                  <div className="import-item-card__header">
                    <strong>Dòng nhập {index + 1}</strong>
                    <button
                      type="button"
                      className="shell-button shell-button--ghost"
                      onClick={() => handleRemoveLineItem(index)}
                      disabled={formState.items.length === 1}
                    >
                      Xóa dòng
                    </button>
                  </div>

                  <div className="import-form-grid">
                    <FormField id={`import-variant-${index}`} label="Biến thể nhập">
                      <select
                        id={`import-variant-${index}`}
                        value={item.variantId}
                        onChange={(event) =>
                          updateLineItem(index, 'variantId', event.target.value)
                        }
                      >
                        <option value="">Chọn biến thể</option>
                        {variants.map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.code} - {variant.productModelName}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <FormField
                      id={`import-unit-cost-${index}`}
                      label="Đơn giá nhập"
                      type="number"
                      value={item.unitCost}
                      onChange={(event) =>
                        updateLineItem(index, 'unitCost', event.target.value)
                      }
                    />
                    <div className="form-span-full">
                      <FormField id={`import-imeis-${index}`} label="Danh sách IMEI">
                        <textarea
                          id={`import-imeis-${index}`}
                          rows="5"
                          placeholder="Mỗi IMEI một dòng hoặc phân tách bằng dấu phẩy"
                          value={item.imeisText}
                          onChange={(event) =>
                            updateLineItem(index, 'imeisText', event.target.value)
                          }
                        />
                      </FormField>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="import-form-actions">
              <button
                type="button"
                className="shell-button shell-button--ghost"
                onClick={handleAddLineItem}
              >
                Thêm dòng nhập
              </button>
              <button type="submit" className="shell-button shell-button--primary">
                Lưu phiếu nhập
              </button>
            </div>
          </form>
        </section>

        <section className="shell-panel admin-table-card">
          <div className="card-section-header">
            <h2>Danh sách phiếu nhập</h2>
            <button
              type="button"
              className="shell-button shell-button--ghost"
              onClick={handleExportImports}
            >
              Xuất Excel
            </button>
          </div>
          <DataTable
            ariaLabel="Danh sách phiếu nhập kho"
            columns={[
              { key: 'code', label: 'Mã phiếu' },
              { key: 'supplierName', label: 'Nhà cung cấp' },
              {
                key: 'receivedAt',
                label: 'Ngày nhận',
                render: (row) => formatDateTime(row.receivedAt),
              },
              { key: 'inventoryItemCount', label: 'IMEI' },
              {
                key: 'totalAmount',
                label: 'Tổng tiền',
                render: (row) => formatCurrency(row.totalAmount),
              },
            ]}
            rows={imports}
            emptyMessage="Chưa có phiếu nhập nào."
          />
        </section>
      </div>
    </div>
  );
}

export default ImportsPage;
