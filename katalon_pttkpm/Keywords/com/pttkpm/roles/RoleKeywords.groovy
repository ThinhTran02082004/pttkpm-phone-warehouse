package com.pttkpm.roles

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.pttkpm.common.WebUIHelper as H

/**
 * Keyword cho trang /roles (RolesPage.jsx)
 */
public class RoleKeywords {

    @Keyword
    public static void createRole(String code, String name, String description = '') {
        H.clearAndSetText(H.byId('role-code'), code)
        H.clearAndSetText(H.byId('role-name'), name)
        if (description) {
            H.clearAndSetText(H.byId('role-description'), description)
        }
        WebUI.click(H.primaryButton('Lưu vai trò'))
    }

    @Keyword
    public static void clickEditRole(String code) {
        WebUI.click(H.xpath("//button[@aria-label='Sửa " + code + "']"))
    }

    @Keyword
    public static void updateRole(String code, String name, String description = '') {
        clickEditRole(code)
        H.clearAndSetText(H.byId('role-name'), name)
        if (description) {
            H.clearAndSetText(H.byId('role-description'), description)
        }
        WebUI.click(H.primaryButton('Cập nhật vai trò'))
    }

    @Keyword
    public static void toggleRoleStatus(String code) {
        WebUI.click(H.xpath("//button[contains(@aria-label, '" + code + "') and (starts-with(@aria-label, 'Ngưng') or starts-with(@aria-label, 'Kích hoạt'))]"))
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
