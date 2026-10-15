package com.pttkpm.attributes

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.pttkpm.common.WebUIHelper as H

/**
 * Keyword cho trang /attributes (ProductAttributesPage.jsx)
 */
public class AttributeKeywords {

    @Keyword
    public static void selectAttributeType(String label) {
        H.selectOption(H.byId('attribute-type'), label)
        WebUI.delay(1)
    }

    @Keyword
    public static void addTextAttribute(String typeLabel, String code, String name) {
        selectAttributeType(typeLabel)
        H.clearAndSetText(H.byId('attribute-code'), code)
        H.clearAndSetText(H.byId('attribute-name'), name)
        WebUI.click(H.primaryButton('Lưu thuộc tính'))
    }

    @Keyword
    public static void addSizeAttribute(String typeLabel, String sizeGb) {
        selectAttributeType(typeLabel)
        H.clearAndSetText(H.byId('attribute-size'), sizeGb)
        WebUI.click(H.primaryButton('Lưu thuộc tính'))
    }

    @Keyword
    public static void clickEditAttribute(String codeOrLabel) {
        WebUI.click(H.xpath("//button[@aria-label='Sửa " + codeOrLabel + "']"))
    }

    @Keyword
    public static void updateTextAttribute(String codeOrLabel, String newName) {
        clickEditAttribute(codeOrLabel)
        H.clearAndSetText(H.byId('attribute-name'), newName)
        WebUI.click(H.primaryButton('Cập nhật thuộc tính'))
    }

    @Keyword
    public static void toggleAttributeStatus(String codeOrLabel) {
        WebUI.click(H.xpath("//button[contains(@aria-label, '" + codeOrLabel + "') and (starts-with(@aria-label, 'Ngưng') or starts-with(@aria-label, 'Kích hoạt'))]"))
    }

    @Keyword
    public static void cancelEdit() {
        WebUI.click(H.xpath("//button[normalize-space(.)='Hủy chỉnh sửa']"))
    }

    @Keyword
    public static void exportExcel() {
        WebUI.click(H.xpath("//button[normalize-space(.)='Xuất Excel']"))
    }
}
