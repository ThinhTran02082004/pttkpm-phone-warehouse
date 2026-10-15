import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import App from '../App';
import { getCurrentUser } from '../api/auth';
import { getDashboardSummary } from '../api/statistics';
import {
  createAttribute,
  getAttributes,
  updateAttribute,
  updateAttributeStatus,
} from '../api/attributes';
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
} from '../api/products';

jest.mock('../api/auth', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock('../api/statistics', () => ({
  getDashboardSummary: jest.fn(),
}));

jest.mock('../api/attributes', () => ({
  getAttributes: jest.fn(),
  createAttribute: jest.fn(),
  updateAttribute: jest.fn(),
  updateAttributeStatus: jest.fn(),
}));

jest.mock('../api/products', () => ({
  getProductModels: jest.fn(),
  createProductModel: jest.fn(),
  uploadProductModelImage: jest.fn(),
  updateProductModel: jest.fn(),
  updateProductModelStatus: jest.fn(),
  getProductVariants: jest.fn(),
  createProductVariant: jest.fn(),
  updateProductVariant: jest.fn(),
  updateProductVariantStatus: jest.fn(),
  getInventoryItems: jest.fn(),
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

describe('Product pages', () => {
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

    getAttributes.mockImplementation(async (token, attributeType) => {
      const fixtures = {
        brands: [
          { id: 1, code: 'apple', name: 'Apple', isActive: true },
          { id: 2, code: 'samsung', name: 'Samsung', isActive: false },
        ],
        origins: [{ id: 1, code: 'vn', name: 'Việt Nam', isActive: true }],
        operatingSystems: [{ id: 1, code: 'ios', name: 'iOS', isActive: true }],
        colors: [
          { id: 1, code: 'black', name: 'Đen', isActive: true },
          { id: 2, code: 'white', name: 'Trắng', isActive: true },
        ],
        rams: [{ id: 1, sizeGb: 8, isActive: true }],
        roms: [{ id: 1, sizeGb: 256, isActive: true }],
      };

      return fixtures[attributeType] || [];
    });

    createAttribute.mockImplementation(async (token, attributeType, payload) => {
      if (attributeType === 'rams') {
        return { id: 9, sizeGb: payload.sizeGb, isActive: true };
      }

      return {
        id: 9,
        code: payload.code,
        name: payload.name,
        isActive: true,
      };
    });

    updateAttribute.mockResolvedValue({
      id: 1,
      code: 'apple-updated',
      name: 'Apple Updated',
      isActive: true,
    });

    updateAttributeStatus.mockResolvedValue({
      id: 2,
      code: 'samsung',
      name: 'Samsung',
      isActive: true,
    });

    getProductModels.mockResolvedValue([
      {
        id: 1,
        code: 'IP14PM',
        name: 'iPhone 14 Pro Max',
        brandId: 1,
        brandName: 'Apple',
        originId: 1,
        originName: 'Việt Nam',
        operatingSystemId: 1,
        operatingSystemName: 'iOS',
        isActive: true,
        warrantyMonths: 12,
      },
    ]);

    createProductModel.mockResolvedValue({
      id: 2,
      code: 'IP15',
      name: 'iPhone 15',
      brandId: 1,
      brandName: 'Apple',
      originId: 1,
      originName: 'Việt Nam',
      operatingSystemId: 1,
      operatingSystemName: 'iOS',
      isActive: true,
      warrantyMonths: 12,
    });

    uploadProductModelImage.mockResolvedValue({
      id: 2,
      code: 'IP15',
      name: 'iPhone 15',
      brandId: 1,
      brandName: 'Apple',
      originId: 1,
      originName: 'Việt Nam',
      operatingSystemId: 1,
      operatingSystemName: 'iOS',
      isActive: true,
      warrantyMonths: 12,
      imagePath: '/api/images/products/iphone15.png',
    });

    updateProductModel.mockResolvedValue({
      id: 1,
      code: 'IP14PM-NEW',
      name: 'iPhone 14 Pro Max New',
      brandId: 1,
      brandName: 'Apple',
      originId: 1,
      originName: 'Việt Nam',
      operatingSystemId: 1,
      operatingSystemName: 'iOS',
      isActive: true,
      warrantyMonths: 12,
    });

    updateProductModelStatus.mockResolvedValue({
      id: 1,
      code: 'IP14PM-NEW',
      name: 'iPhone 14 Pro Max New',
      brandId: 1,
      brandName: 'Apple',
      originId: 1,
      originName: 'Việt Nam',
      operatingSystemId: 1,
      operatingSystemName: 'iOS',
      isActive: false,
      warrantyMonths: 12,
    });

    getProductVariants.mockResolvedValue([
      {
        id: 1,
        code: 'IP14PM-8-256-BLACK',
        productModelId: 1,
        productModelName: 'iPhone 14 Pro Max',
        ramId: 1,
        ramSizeGb: 8,
        romId: 1,
        romSizeGb: 256,
        colorId: 1,
        colorName: 'Đen',
        sellingPrice: 29990000,
        purchasePrice: 27990000,
        isActive: true,
      },
    ]);

    createProductVariant.mockResolvedValue({
      id: 2,
      code: 'IP14PM-8-256-WHITE',
      productModelId: 1,
      productModelName: 'iPhone 14 Pro Max',
      ramId: 1,
      ramSizeGb: 8,
      romId: 1,
      romSizeGb: 256,
      colorId: 2,
      colorName: 'Trắng',
      sellingPrice: 31990000,
      purchasePrice: 28000000,
      isActive: true,
    });

    updateProductVariant.mockResolvedValue({
      id: 1,
      code: 'IP14PM-8-256-WHITE',
      productModelId: 1,
      productModelName: 'iPhone 14 Pro Max',
      ramId: 1,
      ramSizeGb: 8,
      romId: 1,
      romSizeGb: 256,
      colorId: 2,
      colorName: 'Trắng',
      sellingPrice: 30990000,
      purchasePrice: 28000000,
      isActive: true,
    });

    updateProductVariantStatus.mockResolvedValue({
      id: 1,
      code: 'IP14PM-8-256-WHITE',
      productModelId: 1,
      productModelName: 'iPhone 14 Pro Max',
      ramId: 1,
      ramSizeGb: 8,
      romId: 1,
      romSizeGb: 256,
      colorId: 2,
      colorName: 'Trắng',
      sellingPrice: 30990000,
      purchasePrice: 27990000,
      isActive: false,
    });

    getInventoryItems.mockResolvedValue([
      {
        id: 1,
        imei: '353123456789002',
        itemStatus: 'in_stock',
        variantCode: 'IP14PM-8-256-BLACK',
        productModelName: 'iPhone 14 Pro Max',
      },
      {
        id: 2,
        imei: '353123456789099',
        itemStatus: 'sold',
        variantCode: 'IP14PM-8-256-WHITE',
        productModelName: 'iPhone 14 Pro Max',
      },
    ]);
  });

  it('loads attributes and creates a new brand', async () => {
    window.history.pushState({}, '', '/attributes');

    render(<App />);

    expect(await screen.findByText('Apple')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Mã thuộc tính'), {
      target: { value: 'oneplus' },
    });
    fireEvent.change(screen.getByLabelText('Tên thuộc tính'), {
      target: { value: 'OnePlus' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lưu thuộc tính' }));

    await waitFor(() => {
      expect(createAttribute).toHaveBeenCalledWith('saved-token', 'brands', {
        code: 'oneplus',
        name: 'OnePlus',
      });
    });

    expect(await screen.findByText('OnePlus')).toBeInTheDocument();
  });

  it('edits a brand attribute and toggles its status', async () => {
    window.history.pushState({}, '', '/attributes');

    render(<App />);

    const table = await screen.findByRole('table', { name: 'Danh sách thương hiệu' });
    expect(await within(table).findByText('Apple')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sửa apple' }));
    fireEvent.change(screen.getByLabelText('Mã thuộc tính'), {
      target: { value: 'apple-updated' },
    });
    fireEvent.change(screen.getByLabelText('Tên thuộc tính'), {
      target: { value: 'Apple Updated' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cập nhật thuộc tính' }));

    await waitFor(() => {
      expect(updateAttribute).toHaveBeenCalledWith('saved-token', 'brands', 1, {
        code: 'apple-updated',
        name: 'Apple Updated',
      });
    });

    expect(await within(table).findByText('Apple Updated')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Kích hoạt samsung' }));

    await waitFor(() => {
      expect(updateAttributeStatus).toHaveBeenCalledWith('saved-token', 'brands', 2, true);
    });

    expect(await within(table).findByText('Đang hoạt động')).toBeInTheDocument();
  });

  it('loads product data and creates a new model', async () => {
    window.history.pushState({}, '', '/products');

    render(<App />);

    const modelTable = await screen.findByRole('table', {
      name: 'Danh sách model sản phẩm',
    });
    expect(await within(modelTable).findByText('iPhone 14 Pro Max')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Mã model'), {
      target: { value: 'IP15' },
    });
    fireEvent.change(screen.getByLabelText('Tên model'), {
      target: { value: 'iPhone 15' },
    });
    fireEvent.change(screen.getByLabelText('Thương hiệu'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText('Xuất xứ'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText('Hệ điều hành'), {
      target: { value: '1' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lưu model' }));

    await waitFor(() => {
      expect(createProductModel).toHaveBeenCalledWith('saved-token', {
        code: 'IP15',
        name: 'iPhone 15',
        brandId: 1,
        originId: 1,
        operatingSystemId: 1,
      });
    });

    await waitFor(() => {
      expect(within(modelTable).getByText('iPhone 15')).toBeInTheDocument();
    });
  });

  it('uploads an image after creating a model and renders the preview', async () => {
    window.history.pushState({}, '', '/products');

    render(<App />);

    const modelTable = await screen.findByRole('table', {
      name: 'Danh sách model sản phẩm',
    });

    const imageFile = new File(['image-data'], 'iphone15.png', { type: 'image/png' });

    fireEvent.change(screen.getByLabelText('Ảnh sản phẩm'), {
      target: { files: [imageFile] },
    });
    fireEvent.change(screen.getByLabelText('Mã model'), {
      target: { value: 'IP15' },
    });
    fireEvent.change(screen.getByLabelText('Tên model'), {
      target: { value: 'iPhone 15' },
    });
    fireEvent.change(screen.getByLabelText('Thương hiệu'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText('Xuất xứ'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText('Hệ điều hành'), {
      target: { value: '1' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lưu model' }));

    await waitFor(() => {
      expect(uploadProductModelImage).toHaveBeenCalledWith('saved-token', 2, imageFile);
    });

    expect(await within(modelTable).findByAltText('Ảnh iPhone 15')).toBeInTheDocument();
  });

  it('edits a model and toggles its status', async () => {
    window.history.pushState({}, '', '/products');

    render(<App />);

    const modelTable = await screen.findByRole('table', {
      name: 'Danh sách model sản phẩm',
    });
    expect(await within(modelTable).findByText('IP14PM')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sửa model IP14PM' }));
    fireEvent.change(screen.getByLabelText('Mã model'), {
      target: { value: 'IP14PM-NEW' },
    });
    fireEvent.change(screen.getByLabelText('Tên model'), {
      target: { value: 'iPhone 14 Pro Max New' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cập nhật model' }));

    await waitFor(() => {
      expect(updateProductModel).toHaveBeenCalledWith('saved-token', 1, {
        code: 'IP14PM-NEW',
        name: 'iPhone 14 Pro Max New',
        brandId: 1,
        originId: 1,
        operatingSystemId: 1,
      });
    });

    expect(await within(modelTable).findByText('IP14PM-NEW')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ngưng model IP14PM-NEW' }));

    await waitFor(() => {
      expect(updateProductModelStatus).toHaveBeenCalledWith('saved-token', 1, false);
    });

    expect(await within(modelTable).findByText('Ngưng hoạt động')).toBeInTheDocument();
  });

  it('creates a new variant and renders it in the list', async () => {
    window.history.pushState({}, '', '/products');

    render(<App />);

    const variantTable = await screen.findByRole('table', {
      name: 'Danh sách biến thể sản phẩm',
    });
    expect(await within(variantTable).findByText('IP14PM-8-256-BLACK')).toBeInTheDocument();
    expect(within(variantTable).getByText('29.990.000 đ')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Mã biến thể'), {
      target: { value: 'IP14PM-8-256-WHITE' },
    });
    fireEvent.change(screen.getByLabelText('Model áp dụng'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText('RAM'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText('ROM'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText('Màu sắc'), {
      target: { value: '2' },
    });
    fireEvent.change(screen.getByLabelText('Giá nhập'), {
      target: { value: '28000000' },
    });
    fireEvent.change(screen.getByLabelText('Giá bán'), {
      target: { value: '31990000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lưu biến thể' }));

    await waitFor(() => {
      expect(createProductVariant).toHaveBeenCalledWith('saved-token', {
        code: 'IP14PM-8-256-WHITE',
        productModelId: 1,
        ramId: 1,
        romId: 1,
        colorId: 2,
        purchasePrice: 28000000,
        sellingPrice: 31990000,
      });
    });

    await waitFor(() => {
      expect(within(variantTable).getByText('IP14PM-8-256-WHITE')).toBeInTheDocument();
    });
    expect(within(variantTable).getByText('31.990.000 đ')).toBeInTheDocument();
  });

  it('edits a variant and toggles its status', async () => {
    window.history.pushState({}, '', '/products');

    render(<App />);

    const variantTable = await screen.findByRole('table', {
      name: 'Danh sách biến thể sản phẩm',
    });
    expect(await within(variantTable).findByText('IP14PM-8-256-BLACK')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sửa biến thể IP14PM-8-256-BLACK' }));
    fireEvent.change(screen.getByLabelText('Mã biến thể'), {
      target: { value: 'IP14PM-8-256-WHITE' },
    });
    fireEvent.change(screen.getByLabelText('Màu sắc'), {
      target: { value: '2' },
    });
    fireEvent.change(screen.getByLabelText('Giá bán'), {
      target: { value: '30990000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cập nhật biến thể' }));

    await waitFor(() => {
      expect(updateProductVariant).toHaveBeenCalledWith('saved-token', 1, {
        code: 'IP14PM-8-256-WHITE',
        productModelId: 1,
        ramId: 1,
        romId: 1,
        colorId: 2,
        purchasePrice: 27990000,
        sellingPrice: 30990000,
      });
    });

    expect(await within(variantTable).findByText('IP14PM-8-256-WHITE')).toBeInTheDocument();
    expect(within(variantTable).getByText('30.990.000 đ')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ngưng biến thể IP14PM-8-256-WHITE' }));

    await waitFor(() => {
      expect(updateProductVariantStatus).toHaveBeenCalledWith('saved-token', 1, false);
    });

    expect(await within(variantTable).findByText('Ngưng hoạt động')).toBeInTheDocument();
  });

  it('filters inventory items by imei search text', async () => {
    window.history.pushState({}, '', '/products');

    render(<App />);

    const inventoryTable = await screen.findByRole('table', {
      name: 'Danh sách IMEI trong kho',
    });
    expect(await within(inventoryTable).findByText('353123456789002')).toBeInTheDocument();
    expect(within(inventoryTable).getByText('353123456789099')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Tìm IMEI hoặc model'), {
      target: { value: '9002' },
    });

    expect(await within(inventoryTable).findByText('353123456789002')).toBeInTheDocument();
    expect(within(inventoryTable).queryByText('353123456789099')).not.toBeInTheDocument();
  });
});
