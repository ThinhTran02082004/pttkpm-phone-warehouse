package com.pttkpm.warehouse

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.pttkpm.common.WebUIHelper as H

/**
 * Keyword cho trang /imports (ImportsPage.jsx) và /exports (ExportsPage.jsx)
 */
public class WarehouseKeywords {

    /**
     * Điền thông tin chung phiếu nhập. supplier = null sẽ chọn NCC đầu tiên.
     */
    @Keyword
    public static void fillImportHeader(String code, String supplier = null, String notes = '') {
        H.clearAndSetText(H.byId('import-code'), code)
        H.selectOption(H.byId('import-supplier'), supplier)
        if (notes) {
            H.clearAndSetText(H.byId('import-notes'), notes)
        }
    }

    /**
     * Điền một dòng nhập (index bắt đầu từ 0). variant = null sẽ chọn biến thể đầu tiên.
     */
    @Keyword
    public static void fillImportLine(int index, String unitCost, String imeiText, String variant = null) {
        H.selectOption(H.byId('import-variant-' + index), variant)
        H.clearAndSetText(H.byId('import-unit-cost-' + index), unitCost)
        H.clearAndSetText(H.byId('import-imeis-' + index), imeiText)
    }

    @Keyword
    public static void addImportLine() {
        WebUI.click(H.xpath("//button[normalize-space(.)='Thêm dòng nhập']"))
    }

    @Keyword
    public static void submitImport() {
        WebUI.click(H.primaryButton('Lưu phiếu nhập'))
    }

    /**
     * Tạo nhanh một phiếu nhập 1 dòng
     */
    @Keyword
    public static void createImport(String code, String unitCost, String imeiText, String supplier = null, String variant = null) {
        fillImportHeader(code, supplier)
        fillImportLine(0, unitCost, imeiText, variant)
        submitImport()
    }
}
