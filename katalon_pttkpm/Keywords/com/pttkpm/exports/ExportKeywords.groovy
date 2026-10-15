package com.pttkpm.exports

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.pttkpm.common.WebUIHelper as H

/**
 * Keyword cho trang /exports (ExportsPage.jsx)
 */
public class ExportKeywords {

    @Keyword
    public static void fillExportHeader(String code, String customer = null, String notes = '', String soldAt = '') {
        H.clearAndSetText(H.byId('export-code'), code)
        if (customer) {
            H.selectOption(H.byId('export-customer'), customer)
        }
        if (notes) {
            H.clearAndSetText(H.byId('export-notes'), notes)
        }
        if (soldAt) {
            H.clearAndSetText(H.byId('export-sold-at'), soldAt)
        }
    }

    @Keyword
    public static void fillExportLine(int index, String unitPrice, String imeiText, String variant = null) {
        if (variant) {
            H.selectOption(H.byId('export-variant-' + index), variant)
        } else {
            H.selectOption(H.byId('export-variant-' + index), null)
        }
        H.clearAndSetText(H.byId('export-unit-price-' + index), unitPrice)
        H.clearAndSetText(H.byId('export-imeis-' + index), imeiText)
    }

    @Keyword
    public static void addExportLine() {
        WebUI.click(H.xpath("//button[normalize-space(.)='Thêm dòng xuất']"))
    }

    @Keyword
    public static void submitExport() {
        WebUI.click(H.primaryButton('Lưu phiếu xuất'))
    }

    @Keyword
    public static void createExport(String code, String unitPrice, String imeiText, String customer = null, String variant = null) {
        fillExportHeader(code, customer)
        fillExportLine(0, unitPrice, imeiText, variant)
        submitExport()
    }

    @Keyword
    public static void exportExcel() {
        WebUI.click(H.xpath("//button[normalize-space(.)='Xuất Excel']"))
    }
}
