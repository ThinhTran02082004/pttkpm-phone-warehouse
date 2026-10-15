package com.pttkpm.accounts

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.pttkpm.common.WebUIHelper as H

/**
 * Keyword cho trang /accounts (AccountsPage.jsx)
 */
public class AccountKeywords {

    @Keyword
    public static void createAccount(String username, String password, String employee = null, String role = null) {
        if (employee) {
            H.selectOption(H.byId('account-employee'), employee)
        } else {
            H.selectOption(H.byId('account-employee'), null)
        }
        if (role) {
            H.selectOption(H.byId('account-role'), role)
        } else {
            H.selectOption(H.byId('account-role'), null)
        }
        H.clearAndSetText(H.byId('account-username'), username)
        H.clearAndSetText(H.byId('account-password'), password)
        WebUI.click(H.primaryButton('Tạo tài khoản'))
    }

    @Keyword
    public static void clickEditAccount(String username) {
        WebUI.click(H.xpath("//button[@aria-label='Sửa " + username + "']"))
    }

    @Keyword
    public static void updateAccountRole(String username, String roleLabel) {
        clickEditAccount(username)
        H.selectOption(H.byId('account-role'), roleLabel)
        WebUI.click(H.primaryButton('Cập nhật tài khoản'))
    }

    @Keyword
    public static void toggleAccountStatus(String username) {
        WebUI.click(H.xpath("//button[contains(@aria-label, '" + username + "') and (starts-with(@aria-label, 'Ngưng') or starts-with(@aria-label, 'Kích hoạt'))]"))
    }

    @Keyword
    public static void cancelEdit() {
        WebUI.click(H.xpath("//button[normalize-space(.)='Hủy chỉnh sửa']"))
    }
}
