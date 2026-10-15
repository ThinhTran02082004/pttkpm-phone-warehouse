import { useEffect, useState } from 'react';

import { getAttributes } from '../../api/attributes';
import {
  createProductModel,
  createProductVariant,
  getInventoryItems,
  getProductModels,
  getProductVariants,
  uploadProductModelImage,
  updateProductModel,
  updateProductModelStatus,
  updateProductVariant,
  updateProductVariantStatus,
} from '../../api/products';
import { useAuth } from '../../app/providers/AuthProvider';
import AlertBanner from '../../components/feedback/AlertBanner';
import DataTable from '../../components/ui/DataTable';
import FormField from '../../components/ui/FormField';
import PageHeader from '../../components/ui/PageHeader';
import { downloadWorkbook } from '../../utils/excel';
import { formatCurrency } from '../../utils/formatters';

const initialModelForm = {
  code: '',
  name: '',
  brandId: '',
  originId: '',
  operatingSystemId: '',
};

const initialVariantForm = {
  code: '',
  productModelId: '',
  ramId: '',
  romId: '',
  colorId: '',
  purchasePrice: '',
  sellingPrice: '',
};

const inventoryStatusLabels = {
  in_stock: 'Còn trong kho',
  reserved: 'Đang giữ chỗ',
  sold: 'Đã bán',
  in_service: 'Đang dịch vụ',
  returned: 'Đã trả hàng',
  exchanged: 'Đã đổi hàng',
  damaged: 'Hư hỏng',
};

function buildModelPayload(modelForm) {
  return {
    code: modelForm.code.trim(),
    name: modelForm.name.trim(),
    brandId: Number(modelForm.brandId),
    originId: Number(modelForm.originId),
    operatingSystemId: Number(modelForm.operatingSystemId),
  };
}

function buildVariantPayload(variantForm) {
  return {
    code: variantForm.code.trim(),
    productModelId: Number(variantForm.productModelId),
    ramId: Number(variantForm.ramId),
    romId: Number(variantForm.romId),
    colorId: Number(variantForm.colorId),
    purchasePrice: Number(variantForm.purchasePrice),
    sellingPrice: Number(variantForm.sellingPrice),
  };
}

function ProductsPage() {
  const { token } = useAuth();
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [operatingSystems, setOperatingSystems] = useState([]);
  const [rams, setRams] = useState([]);
  const [roms, setRoms] = useState([]);
  const [colors, setColors] = useState([]);
  const [editingModelId, setEditingModelId] = useState(null);
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [modelForm, setModelForm] = useState(initialModelForm);
  const [variantForm, setVariantForm] = useState(initialVariantForm);
  const [modelImageFile, setModelImageFile] = useState(null);
  const [modelImageInputKey, setModelImageInputKey] = useState(0);
  const [inventorySearch, setInventorySearch] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setErrorMessage('');
        const [
          modelData,
          variantData,
          inventoryData,
          brandData,
          originData,
          osData,
          ramData,
          romData,
          colorData,
        ] = await Promise.all([
          getProductModels(token),
          getProductVariants(token),
          getInventoryItems(token),
          getAttributes(token, 'brands'),
          getAttributes(token, 'origins'),
          getAttributes(token, 'operatingSystems'),
          getAttributes(token, 'rams'),
          getAttributes(token, 'roms'),
          getAttributes(token, 'colors'),
        ]);

        if (!ignore) {
          setModels(modelData);
          setVariants(variantData);
          setInventoryItems(inventoryData);
          setBrands(brandData);
          setOrigins(originData);
          setOperatingSystems(osData);
          setRams(ramData);
          setRoms(romData);
          setColors(colorData);
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

  function resetModelForm() {
    setEditingModelId(null);
    setModelForm(initialModelForm);
    setModelImageFile(null);
    setModelImageInputKey((current) => current + 1);
  }

  function resetVariantForm() {
    setEditingVariantId(null);
    setVariantForm(initialVariantForm);
  }

  function handleEditModel(model) {
    setErrorMessage('');
    setSuccessMessage('');
    setEditingModelId(model.id);
    setModelForm({
      code: model.code || '',
      name: model.name || '',
      brandId: String(model.brandId || ''),
      originId: String(model.originId || ''),
      operatingSystemId: String(model.operatingSystemId || ''),
    });
  }

  function handleEditVariant(variant) {
    setErrorMessage('');
    setSuccessMessage('');
    setEditingVariantId(variant.id);
    setVariantForm({
      code: variant.code || '',
      productModelId: String(variant.productModelId || ''),
      ramId: String(variant.ramId || ''),
      romId: String(variant.romId || ''),
      colorId: String(variant.colorId || ''),
      purchasePrice: String(variant.purchasePrice || ''),
      sellingPrice: String(variant.sellingPrice || ''),
    });
  }

  async function handleToggleModelStatus(model) {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatedModel = await updateProductModelStatus(token, model.id, !model.isActive);
      setModels((current) => current.map((item) => (item.id === model.id ? updatedModel : item)));
      setSuccessMessage(
        updatedModel.isActive ? 'Đã kích hoạt model sản phẩm.' : 'Đã ngưng hoạt động model.'
      );
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  async function handleToggleVariantStatus(variant) {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatedVariant = await updateProductVariantStatus(token, variant.id, !variant.isActive);
      setVariants((current) =>
        current.map((item) => (item.id === variant.id ? updatedVariant : item))
      );
      setSuccessMessage(
        updatedVariant.isActive ? 'Đã kích hoạt biến thể.' : 'Đã ngưng hoạt động biến thể.'
      );
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  async function handleCreateOrUpdateModel(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = buildModelPayload(modelForm);
      let savedModel;

      if (editingModelId) {
        savedModel = await updateProductModel(token, editingModelId, payload);
      } else {
        savedModel = await createProductModel(token, payload);
      }

      if (modelImageFile) {
        try {
          savedModel = await uploadProductModelImage(token, savedModel.id, modelImageFile);
        } catch (error) {
          setModels((current) =>
            editingModelId
              ? current.map((item) => (item.id === editingModelId ? savedModel : item))
              : [...current, savedModel]
          );
          resetModelForm();
          setErrorMessage(`Đã lưu model nhưng tải ảnh thất bại: ${error?.payload?.message || error.message}`);
          return;
        }
      }

      setModels((current) =>
        editingModelId
          ? current.map((item) => (item.id === editingModelId ? savedModel : item))
          : [...current, savedModel]
      );
      setSuccessMessage(
        editingModelId ? 'Đã cập nhật model sản phẩm.' : 'Đã tạo model sản phẩm mới.'
      );
      resetModelForm();
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  async function handleCreateOrUpdateVariant(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = buildVariantPayload(variantForm);

      if (editingVariantId) {
        const updatedVariant = await updateProductVariant(token, editingVariantId, payload);
        setVariants((current) =>
          current.map((item) => (item.id === editingVariantId ? updatedVariant : item))
        );
        setSuccessMessage('Đã cập nhật biến thể.');
      } else {
        const createdVariant = await createProductVariant(token, payload);
        setVariants((current) => [...current, createdVariant]);
        setSuccessMessage('Đã tạo biến thể mới.');
      }

      resetVariantForm();
    } catch (error) {
      setErrorMessage(error?.payload?.message || error.message);
    }
  }

  const filteredInventoryItems = inventoryItems.filter((item) => {
    const searchText = inventorySearch.trim().toLowerCase();

    if (!searchText) {
      return true;
    }

    return [item.imei, item.variantCode, item.productModelName, item.itemStatus]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(searchText));
  });

  function handleExportModels() {
    downloadWorkbook(
      'danh-sach-model-san-pham.xlsx',
      'Model',
      ['Mã model', 'Tên model', 'Thương hiệu', 'Xuất xứ', 'Hệ điều hành', 'Trạng thái', 'Ảnh'],
      models.map((model) => [
        model.code,
        model.name,
        model.brandName || '',
        model.originName || '',
        model.operatingSystemName || '',
        model.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động',
        model.imagePath || '',
      ])
    );
  }

  function handleExportVariants() {
    downloadWorkbook(
      'danh-sach-bien-the-san-pham.xlsx',
      'Bien the',
      ['Mã biến thể', 'Model', 'Cấu hình', 'Giá nhập', 'Giá bán', 'Trạng thái'],
      variants.map((variant) => [
        variant.code,
        variant.productModelName || '',
        `${variant.ramSizeGb} GB / ${variant.romSizeGb} GB / ${variant.colorName}`,
        variant.purchasePrice ?? 0,
        variant.sellingPrice ?? 0,
        variant.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động',
      ])
    );
  }

  function handleExportInventory() {
    downloadWorkbook(
      'danh-sach-imei.xlsx',
      'IMEI',
      ['IMEI', 'Biến thể', 'Model', 'Trạng thái'],
      filteredInventoryItems.map((item) => [
        item.imei,
        item.variantCode || '',
        item.productModelName || '',
        inventoryStatusLabels[item.itemStatus] || item.itemStatus,
      ])
    );
  }

  return (
    <div className="admin-page">
      <PageHeader
        title="Sản phẩm"
        description="Quản lý model, biến thể cấu hình và danh sách IMEI hiện có trong kho."
      />

      {errorMessage ? <AlertBanner type="error">{errorMessage}</AlertBanner> : null}
      {successMessage ? <AlertBanner type="success">{successMessage}</AlertBanner> : null}

      <div className="product-stack">
        <section className="shell-panel admin-form-card">
          <h2>{editingModelId ? 'Cập nhật model sản phẩm' : 'Tạo model sản phẩm'}</h2>
          <form className="product-form-grid" onSubmit={handleCreateOrUpdateModel}>
            <FormField
              id="product-model-code"
              label="Mã model"
              value={modelForm.code}
              onChange={(event) =>
                setModelForm((current) => ({ ...current, code: event.target.value }))
              }
            />
            <FormField
              id="product-model-name"
              label="Tên model"
              value={modelForm.name}
              onChange={(event) =>
                setModelForm((current) => ({ ...current, name: event.target.value }))
              }
            />
            <FormField id="product-brand" label="Thương hiệu">
              <select
                id="product-brand"
                value={modelForm.brandId}
                onChange={(event) =>
                  setModelForm((current) => ({ ...current, brandId: event.target.value }))
                }
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="product-origin" label="Xuất xứ">
              <select
                id="product-origin"
                value={modelForm.originId}
                onChange={(event) =>
                  setModelForm((current) => ({ ...current, originId: event.target.value }))
                }
              >
                <option value="">Chọn xuất xứ</option>
                {origins.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="product-os" label="Hệ điều hành">
              <select
                id="product-os"
                value={modelForm.operatingSystemId}
                onChange={(event) =>
                  setModelForm((current) => ({
                    ...current,
                    operatingSystemId: event.target.value,
                  }))
                }
              >
                <option value="">Chọn hệ điều hành</option>
                {operatingSystems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="product-image" label="Ảnh sản phẩm">
              <input
                key={modelImageInputKey}
                id="product-image"
                type="file"
                accept="image/*"
                onChange={(event) => setModelImageFile(event.target.files?.[0] || null)}
              />
            </FormField>

            <div className="form-action-row">
              {editingModelId ? (
                <button
                  type="button"
                  className="shell-button shell-button--ghost"
                  onClick={resetModelForm}
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
              <button type="submit" className="shell-button shell-button--primary">
                {editingModelId ? 'Cập nhật model' : 'Lưu model'}
              </button>
            </div>
          </form>
        </section>

        <section className="shell-panel admin-table-card">
          <div className="card-section-header">
            <h2>Danh sách model</h2>
            <button
              type="button"
              className="shell-button shell-button--ghost"
              onClick={handleExportModels}
            >
              Xuất Excel
            </button>
          </div>
          <DataTable
            ariaLabel="Danh sách model sản phẩm"
            columns={[
              {
                key: 'imagePath',
                label: 'Ảnh',
                render: (row) =>
                  row.imagePath ? (
                    <img className="product-thumbnail" src={row.imagePath} alt={`Ảnh ${row.name}`} />
                  ) : (
                    'Chưa có ảnh'
                  ),
              },
              { key: 'code', label: 'Mã' },
              { key: 'name', label: 'Tên model' },
              { key: 'brandName', label: 'Thương hiệu' },
              { key: 'originName', label: 'Xuất xứ' },
              { key: 'operatingSystemName', label: 'Hệ điều hành' },
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
                      aria-label={`Sửa model ${row.code}`}
                      onClick={() => handleEditModel(row)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="shell-button shell-button--ghost"
                      aria-label={`${row.isActive ? 'Ngưng' : 'Kích hoạt'} model ${row.code}`}
                      onClick={() => handleToggleModelStatus(row)}
                    >
                      {row.isActive ? 'Ngưng' : 'Kích hoạt'}
                    </button>
                  </div>
                ),
              },
            ]}
            rows={models}
            emptyMessage="Chưa có model nào."
          />
        </section>

        <section className="shell-panel admin-form-card">
          <h2>{editingVariantId ? 'Cập nhật biến thể' : 'Tạo biến thể'}</h2>
          <form className="product-form-grid" onSubmit={handleCreateOrUpdateVariant}>
            <FormField
              id="variant-code"
              label="Mã biến thể"
              value={variantForm.code}
              onChange={(event) =>
                setVariantForm((current) => ({ ...current, code: event.target.value }))
              }
            />
            <FormField id="variant-model" label="Model áp dụng">
              <select
                id="variant-model"
                value={variantForm.productModelId}
                onChange={(event) =>
                  setVariantForm((current) => ({
                    ...current,
                    productModelId: event.target.value,
                  }))
                }
              >
                <option value="">Chọn model</option>
                {models.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="variant-ram" label="RAM">
              <select
                id="variant-ram"
                value={variantForm.ramId}
                onChange={(event) =>
                  setVariantForm((current) => ({ ...current, ramId: event.target.value }))
                }
              >
                <option value="">Chọn RAM</option>
                {rams.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.sizeGb} GB
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="variant-rom" label="ROM">
              <select
                id="variant-rom"
                value={variantForm.romId}
                onChange={(event) =>
                  setVariantForm((current) => ({ ...current, romId: event.target.value }))
                }
              >
                <option value="">Chọn ROM</option>
                {roms.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.sizeGb} GB
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="variant-color" label="Màu sắc">
              <select
                id="variant-color"
                value={variantForm.colorId}
                onChange={(event) =>
                  setVariantForm((current) => ({ ...current, colorId: event.target.value }))
                }
              >
                <option value="">Chọn màu sắc</option>
                {colors.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField
              id="variant-purchase-price"
              label="Giá nhập"
              type="number"
              value={variantForm.purchasePrice}
              onChange={(event) =>
                setVariantForm((current) => ({
                  ...current,
                  purchasePrice: event.target.value,
                }))
              }
            />
            <FormField
              id="variant-selling-price"
              label="Giá bán"
              type="number"
              value={variantForm.sellingPrice}
              onChange={(event) =>
                setVariantForm((current) => ({
                  ...current,
                  sellingPrice: event.target.value,
                }))
              }
            />

            <div className="form-action-row">
              {editingVariantId ? (
                <button
                  type="button"
                  className="shell-button shell-button--ghost"
                  onClick={resetVariantForm}
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
              <button type="submit" className="shell-button shell-button--primary">
                {editingVariantId ? 'Cập nhật biến thể' : 'Lưu biến thể'}
              </button>
            </div>
          </form>
        </section>

        <section className="shell-panel admin-table-card">
          <div className="card-section-header">
            <h2>Danh sách biến thể</h2>
            <button
              type="button"
              className="shell-button shell-button--ghost"
              onClick={handleExportVariants}
            >
              Xuất Excel
            </button>
          </div>
          <DataTable
            ariaLabel="Danh sách biến thể sản phẩm"
            columns={[
              { key: 'code', label: 'Mã' },
              { key: 'productModelName', label: 'Model' },
              {
                key: 'config',
                label: 'Cấu hình',
                render: (row) => `${row.ramSizeGb} GB / ${row.romSizeGb} GB / ${row.colorName}`,
              },
              {
                key: 'sellingPrice',
                label: 'Giá bán',
                render: (row) => formatCurrency(row.sellingPrice),
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
                      aria-label={`Sửa biến thể ${row.code}`}
                      onClick={() => handleEditVariant(row)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="shell-button shell-button--ghost"
                      aria-label={`${row.isActive ? 'Ngưng' : 'Kích hoạt'} biến thể ${row.code}`}
                      onClick={() => handleToggleVariantStatus(row)}
                    >
                      {row.isActive ? 'Ngưng' : 'Kích hoạt'}
                    </button>
                  </div>
                ),
              },
            ]}
            rows={variants}
            emptyMessage="Chưa có biến thể nào."
          />
        </section>

        <section className="shell-panel admin-table-card">
          <div className="product-search-header">
            <div>
              <h2>Danh sách IMEI</h2>
              <p className="admin-form-card__hint">
                Tra cứu nhanh IMEI theo số máy, model hoặc trạng thái hiện tại.
              </p>
            </div>
            <div className="product-search-actions">
              <FormField id="inventory-search" label="Tìm IMEI hoặc model">
                <input
                  id="inventory-search"
                  type="text"
                  value={inventorySearch}
                  onChange={(event) => setInventorySearch(event.target.value)}
                />
              </FormField>
              <button
                type="button"
                className="shell-button shell-button--ghost"
                onClick={handleExportInventory}
              >
                Xuất Excel
              </button>
            </div>
          </div>

          <DataTable
            ariaLabel="Danh sách IMEI trong kho"
            columns={[
              { key: 'imei', label: 'IMEI' },
              { key: 'variantCode', label: 'Biến thể' },
              { key: 'productModelName', label: 'Model' },
              {
                key: 'itemStatus',
                label: 'Trạng thái',
                render: (row) => inventoryStatusLabels[row.itemStatus] || row.itemStatus,
              },
            ]}
            rows={filteredInventoryItems}
            emptyMessage="Không tìm thấy IMEI phù hợp."
          />
        </section>
      </div>
    </div>
  );
}

export default ProductsPage;
