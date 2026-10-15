package com.pttkpm.products

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.pttkpm.common.WebUIHelper as H

/**
 * Keyword cho trang /products (web_client/src/features/products/ProductsPage.jsx)
 */
public class ProductKeywords {

    /**
     * Tạo model sản phẩm. brand/origin/os để null sẽ chọn option đầu tiên có sẵn.
     */
    @Keyword
    public static void createModel(String code, String name, String brand = null, String origin = null, String os = null) {
        H.clearAndSetText(H.byId('product-model-code'), code)
        H.clearAndSetText(H.byId('product-model-name'), name)
        H.selectOption(H.byId('product-brand'), brand)
        H.selectOption(H.byId('product-origin'), origin)
        H.selectOption(H.byId('product-os'), os)
        WebUI.click(H.primaryButton('Lưu model'))
    }

    /**
     * Bấm nút "Sửa" trên dòng model theo mã (aria-label="Sửa model {code}")
     */
    @Keyword
    public static void clickEditModel(String code) {
        WebUI.click(H.xpath("//button[@aria-label='Sửa model " + code + "']"))
    }

    /**
     * Đổi tên model đang sửa và bấm "Cập nhật model"
     */
    @Keyword
    public static void updateModelName(String code, String newName) {
        clickEditModel(code)
        H.clearAndSetText(H.byId('product-model-name'), newName)
        WebUI.click(H.primaryButton('Cập nhật model'))
    }

    /**
     * Tạo biến thể (RAM/ROM/Màu/Giá) cho model. Các select để null sẽ chọn option đầu tiên.
     */
    @Keyword
    public static void createVariant(String code, String modelLabel, String purchasePrice, String sellingPrice,
                                     String ram = null, String rom = null, String color = null) {
        H.clearAndSetText(H.byId('variant-code'), code)
        H.selectOption(H.byId('variant-model'), modelLabel)
        H.selectOption(H.byId('variant-ram'), ram)
        H.selectOption(H.byId('variant-rom'), rom)
        H.selectOption(H.byId('variant-color'), color)
        H.clearAndSetText(H.byId('variant-purchase-price'), purchasePrice)
        H.clearAndSetText(H.byId('variant-selling-price'), sellingPrice)
        WebUI.click(H.primaryButton('Lưu biến thể'))
    }

    /**
     * Tìm IMEI hoặc model trong khối "Danh sách IMEI"
     */
    @Keyword
    public static void searchInventory(String keyword) {
        H.clearAndSetText(H.byId('inventory-search'), keyword)
    }
}
