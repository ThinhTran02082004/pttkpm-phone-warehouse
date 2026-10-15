package com.pttkpm.partners

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.pttkpm.common.WebUIHelper as H

/**
 * Keyword cho trang /customers (CustomersPage.jsx) và /suppliers (SuppliersPage.jsx)
 */
public class PartnerKeywords {

    @Keyword
    public static void addCustomer(String code, String name, String phone, String email) {
        H.clearAndSetText(H.byId('customer-code'), code)
        H.clearAndSetText(H.byId('customer-name'), name)
        H.clearAndSetText(H.byId('customer-phone'), phone)
        H.clearAndSetText(H.byId('customer-email'), email)
        WebUI.click(H.primaryButton('Lưu khách hàng'))
    }

    @Keyword
    public static void addSupplier(String code, String name, String phone, String email) {
        H.clearAndSetText(H.byId('supplier-code'), code)
        H.clearAndSetText(H.byId('supplier-name'), name)
        H.clearAndSetText(H.byId('supplier-phone'), phone)
        H.clearAndSetText(H.byId('supplier-email'), email)
        WebUI.click(H.primaryButton('Lưu nhà cung cấp'))
    }

    /**
     * Bấm "Sửa" trên dòng theo mã (aria-label="Sửa {code}")
     */
    @Keyword
    public static void clickEdit(String code) {
        WebUI.click(H.xpath("//button[@aria-label='Sửa " + code + "']"))
    }

    /**
     * Bấm "Ngưng" hoặc "Kích hoạt" trên dòng theo mã
     */
    @Keyword
    public static void toggleStatus(String code) {
        WebUI.click(H.xpath("//button[@aria-label='Ngưng " + code + "' or @aria-label='Kích hoạt " + code + "']"))
    }
}
