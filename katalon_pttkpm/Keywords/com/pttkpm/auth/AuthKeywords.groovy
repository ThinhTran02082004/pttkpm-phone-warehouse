package com.pttkpm.auth

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.webui.driver.DriverFactory
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.common.WebUIHelper

public class AuthKeywords {

    private static TestObject getObjectByXPath(String xpath) {
        TestObject to = new TestObject()
        to.addProperty("xpath", ConditionType.EQUALS, xpath)
        return to
    }

    /**
     * Khởi động trình duyệt và đăng nhập với tài khoản Quản trị viên (Admin)
     */
    @Keyword
    public static void loginAsAdmin() {
        loginWith(GlobalVariable.ADMIN_USER, GlobalVariable.ADMIN_PASS)
    }

    /**
     * Đăng nhập với tài khoản và mật khẩu tùy chỉnh
     */
    @Keyword
    public static void loginWith(String username, String password) {
        submitLoginForm(username, password)
        WebUI.waitForElementPresent(getObjectByXPath("//header[contains(@class,'shell-topbar')]"), GlobalVariable.DEFAULT_TIMEOUT)
        WebUI.verifyMatch(WebUI.getUrl(), '.*/dashboard.*', true)
    }

    /**
     * Gửi form đăng nhập nhưng KHÔNG yêu cầu thành công (dùng cho test sai mật khẩu, bỏ trống...)
     */
    @Keyword
    public static void submitLoginForm(String username, String password) {
        try {
            DriverFactory.getWebDriver()
        } catch (Exception e) {
            WebUI.openBrowser('')
            WebUI.maximizeWindow()
        }

        WebUI.navigateToUrl(GlobalVariable.BASE_URL + '/login')
        WebUI.waitForPageLoad(GlobalVariable.DEFAULT_TIMEOUT)

        TestObject txtUsername = getObjectByXPath("//input[@id='username']")
        TestObject txtPassword = getObjectByXPath("//input[@id='password']")
        TestObject btnSubmit = getObjectByXPath("//button[@type='submit' and contains(., 'Vào hệ thống')]")

        WebUIHelper.clearAndSetText(txtUsername, username)
        WebUIHelper.clearAndSetText(txtPassword, password)
        WebUI.click(btnSubmit)
    }

    /**
     * Đăng xuất khỏi hệ thống
     */
    @Keyword
    public static void logout() {
        TestObject btnLogout = getObjectByXPath("//header//button[contains(text(), 'Đăng xuất')]")
        if (WebUI.verifyElementPresent(btnLogout, 5, com.kms.katalon.core.model.FailureHandling.OPTIONAL)) {
            WebUI.click(btnLogout)
            WebUI.waitForPageLoad(5)
        }
    }

    /**
     * Điều hướng nhanh đến phân hệ theo path (ví dụ: '/employees', '/imports')
     */
    @Keyword
    public static void navigateTo(String path) {
        WebUI.navigateToUrl(GlobalVariable.BASE_URL + path)
        WebUIHelper.waitForPageReady(GlobalVariable.DEFAULT_TIMEOUT)
    }
}
