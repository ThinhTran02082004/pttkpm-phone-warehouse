import { useEffect, useMemo, useState } from 'react';

import { getCustomers } from '../../api/customers';
import { createExportOrder, getExports } from '../../api/exports';
import { getInventoryItems, getProductVariants } from '../../api/products';
import { useAuth } from '../../app/providers/AuthProvider';
import AlertBanner from '../../components/feedback/AlertBanner';
import DataTable from '../../components/ui/DataTable';
import FormField from '../../components/ui/FormField';
import PageHeader from '../../components/ui/PageHeader';
import { downloadWorkbook } from '../../utils/excel';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const initialLineItem = {
  variantId: '',
  unitPrice: '',
  imeisText: '',
};

const initialFormState = {
  code: '',
  customerId: '',
  soldAt: '',
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

function ExportsPage() {
  const { token } = useAuth();
  const [exportsData, setExportsData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [variants, setVariants] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [formState, setFormState] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setErrorMessage('');
        const [exportRows, customerRows, variantRows, inventoryRows] = await Promise.all([
          getExports(token),
          getCustomers(token),
          getProductVariants(token),
          getInventoryItems(token),
        ]);

        if (!ignore) {
          setExportsData(exportRows);
          setCustomers(customerRows);
          setVariants(variantRows);
          setInventoryItems(inventoryRows);
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

  const availableInventory = useMemo(
    () => inventoryItems.filter((item) => item.itemStatus === 'in_stock'),
    [inventoryItems]
  );

  function updateLineItem(index, field, value) {
    setFormState((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
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

  function getAvailableImeisByVariant(variantId) {
    return availableInventory.filter((item) => Number(item.variantId) === Number(variantId));
  }

  function handleExportExports() {
    downloadWorkbook(
      'danh-sach-phieu-xuat.xlsx',
      'Phieu xuat',
      ['Mã phiếu', 'Khách hàng', 'Ngày bán', 'Số IMEI', 'Tổng tiền'],
      exportsData.map((item) => [
        item.code,
        item.customerName || '',
        formatDateTime(item.soldAt),
        item.inventoryItemCount ?? 0,
        item.totalAmount ?? 0,
      ])
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const payload = {
      code: formState.code.trim(),
      customerId: formState.customerId ? Number(formState.customerId) : null,
      soldAt: formatDatetimeForApi(formState.soldAt),
      notes: formState.notes.trim() || null,
      items: formState.items.map((item) => {
        const allowedImeis = new Set(
          getAvailableImeisByVariant(item.variantId).map((inventoryItem) => inventoryItem.imei)
        );

        return {
          variantId: Number(item.variantId),
          unitPrice: Number(item.unitPrice),
          imeis: parseImeis(item.imeisText).filter((imei) => allowedImeis.has(imei)),
        };
      }),
    };

    try {
      const createdExport = await createExportOrder(token, payload);
      const selectedCustomer = customers.find(
        (customer) => customer.id === Number(formState.customerId)
      );
      const soldImeis = payload.items.flatMap((item) => item.imeis);

      setExportsData((current) => [
        {
          ...createdExport,
          customerName: selectedCustomer?.fullName || 'Khách lẻ',
          inventoryItemCount: soldImeis.length,
          lineCount: payload.items.length,
        },
        ...current,
      ]);
      setInventoryItems((current) =>
        current.map((item) =>
          soldImeis.includes(item.imei) ? { ...item, itemStatus: 'sold' } : item
        )
      );
      setFormState(initialFormState);
      setSuccessMessage('Đã tạo phiếu xuất kho mới.');
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  return (
    <div className="admin-page">
      <PageHeader
        title="Xuất kho"
        description="Lập phiếu bán hàng theo khách hàng và chỉ chọn IMEI còn tồn kho cho từng biến thể."
      />

      <div className="admin-grid">
        <section className="shell-panel admin-form-card">
          <h2>Tạo phiếu xuất kho</h2>
          <p className="admin-form-card__hint">
            Hệ thống chỉ gửi các IMEI còn trạng thái tồn kho để tránh xuất trùng hoặc bán lại máy đã bán.
          </p>

          {errorMessage ? <AlertBanner type="error">{errorMessage}</AlertBanner> : null}
          {successMessage ? <AlertBanner type="success">{successMessage}</AlertBanner> : null}

          <form className="shell-form-grid" onSubmit={handleSubmit}>
            <div className="import-form-grid">
              <FormField
                id="export-code"
                label="Mã phiếu xuất"
                value={formState.code}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, code: event.target.value }))
                }
              />
              <FormField id="export-customer" label="Khách hàng">
                <select
                  id="export-customer"
                  value={formState.customerId}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      customerId: event.target.value,
                    }))
                  }
                >
                  <option value="">Khách lẻ / không chọn</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.fullName}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField
                id="export-sold-at"
                label="Thời điểm bán"
                type="datetime-local"
                value={formState.soldAt}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, soldAt: event.target.value }))
                }
              />
              <div className="form-span-full">
                <FormField id="export-notes" label="Ghi chú phiếu xuất">
                  <textarea
                    id="export-notes"
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
              {formState.items.map((item, index) => {
                const availableImeis = getAvailableImeisByVariant(item.variantId);

                return (
                  <div key={`export-item-${index}`} className="shell-panel import-item-card">
                    <div className="import-item-card__header">
                      <strong>Dòng xuất {index + 1}</strong>
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
                      <FormField id={`export-variant-${index}`} label="Biến thể xuất">
                        <select
                          id={`export-variant-${index}`}
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
                        id={`export-unit-price-${index}`}
                        label="Đơn giá bán"
                        type="number"
                        value={item.unitPrice}
                        onChange={(event) =>
                          updateLineItem(index, 'unitPrice', event.target.value)
                        }
                      />
                      <div className="form-span-full">
                        <FormField id={`export-imeis-${index}`} label="Danh sách IMEI xuất">
                          <textarea
                            id={`export-imeis-${index}`}
                            rows="5"
                            placeholder="Nhập IMEI cần xuất, mỗi dòng một mã"
                            value={item.imeisText}
                            onChange={(event) =>
                              updateLineItem(index, 'imeisText', event.target.value)
                            }
                          />
                        </FormField>
                        <div className="inline-hint">
                          IMEI khả dụng: {availableImeis.map((imei) => imei.imei).join(', ') || 'Không có'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="import-form-actions">
              <button
                type="button"
                className="shell-button shell-button--ghost"
                onClick={handleAddLineItem}
              >
                Thêm dòng xuất
              </button>
              <button type="submit" className="shell-button shell-button--primary">
                Lưu phiếu xuất
              </button>
            </div>
          </form>
        </section>

        <section className="shell-panel admin-table-card">
          <div className="card-section-header">
            <h2>Danh sách phiếu xuất</h2>
            <button
              type="button"
              className="shell-button shell-button--ghost"
              onClick={handleExportExports}
            >
              Xuất Excel
            </button>
          </div>
          <DataTable
            ariaLabel="Danh sách phiếu xuất kho"
            columns={[
              { key: 'code', label: 'Mã phiếu' },
              { key: 'customerName', label: 'Khách hàng' },
              {
                key: 'soldAt',
                label: 'Ngày bán',
                render: (row) => formatDateTime(row.soldAt),
              },
              { key: 'inventoryItemCount', label: 'IMEI' },
              {
                key: 'totalAmount',
                label: 'Tổng tiền',
                render: (row) => formatCurrency(row.totalAmount),
              },
            ]}
            rows={exportsData}
            emptyMessage="Chưa có phiếu xuất nào."
          />
        </section>
      </div>
    </div>
  );
}

export default ExportsPage;
