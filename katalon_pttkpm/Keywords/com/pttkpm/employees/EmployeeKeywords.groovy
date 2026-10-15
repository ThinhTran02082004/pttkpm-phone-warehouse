package com.pttkpm.employees

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.pttkpm.common.WebUIHelper as H

/**
 * Keyword cho trang /employees (EmployeesPage.jsx)
 */
public class EmployeeKeywords {

    @Keyword
    public static void addEmployee(String code, String fullName, String email, String phone, String gender = 'male') {
        H.clearAndSetText(H.byId('employee-code'), code)
        H.clearAndSetText(H.byId('employee-full-name'), fullName)
        H.clearAndSetText(H.byId('employee-email'), email)
        H.clearAndSetText(H.byId('employee-phone'), phone)
        H.selectOption(H.byId('employee-gender'), gender)
        WebUI.click(H.primaryButton('Lưu nhân viên'))
    }

    @Keyword
    public static void clickEditEmployee(String code) {
        WebUI.click(H.xpath("//button[@aria-label='Sửa " + code + "']"))
    }

    @Keyword
    public static void updateEmployee(String code, String fullName, String phone) {
        clickEditEmployee(code)
        H.clearAndSetText(H.byId('employee-full-name'), fullName)
        H.clearAndSetText(H.byId('employee-phone'), phone)
        WebUI.click(H.primaryButton('Cập nhật nhân viên'))
    }

    @Keyword
    public static void toggleEmployeeStatus(String code) {
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
