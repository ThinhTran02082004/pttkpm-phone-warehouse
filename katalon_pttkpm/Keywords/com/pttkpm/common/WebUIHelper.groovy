package com.pttkpm.common

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.webui.common.WebUiCommonHelper
import com.kms.katalon.core.webui.driver.DriverFactory
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import org.openqa.selenium.JavascriptExecutor
import org.openqa.selenium.WebElement
import org.openqa.selenium.Keys

public class WebUIHelper {

    /**
     * Tô viền đỏ phần tử trên trang web để trực quan hóa khi chạy demo kiểm thử
     */
    @Keyword
    public static void highlightElement(TestObject testObject) {
        try {
            WebElement element = WebUiCommonHelper.findWebElement(testObject, 10)
            JavascriptExecutor js = (JavascriptExecutor) DriverFactory.getWebDriver()
            js.executeScript("arguments[0].style.border='3px solid red'; arguments[0].style.backgroundColor='#fff0f0';", element)
        } catch (Exception e) {
            // Bỏ qua nếu không highlight được để không ảnh hưởng luồng test
        }
    }

    /**
     * Xóa sạch dữ liệu cũ trong ô nhập liệu và điền dữ liệu mới an toàn
     */
    @Keyword
    public static void clearAndSetText(TestObject testObject, String text) {
        WebUI.waitForElementVisible(testObject, 10)
        highlightElement(testObject)
        WebUI.sendKeys(testObject, Keys.chord(Keys.CONTROL, "a"))
        WebUI.sendKeys(testObject, Keys.chord(Keys.BACK_SPACE))
        WebUI.setText(testObject, text)
    }

    /**
     * Chờ trang web và AJAX hoàn tất tải (document.readyState == 'complete')
     */
    @Keyword
    public static void waitForPageReady(int timeoutSeconds) {
        JavascriptExecutor js = (JavascriptExecutor) DriverFactory.getWebDriver()
        for (int i = 0; i < timeoutSeconds; i++) {
            boolean ready = js.executeScript("return document.readyState").toString().equals("complete")
            if (ready) {
                break
            }
            WebUI.delay(1)
        }
    }

    /**
     * Cuộn màn hình đến phần tử cần thao tác
     */
    @Keyword
    public static void scrollToElement(TestObject testObject) {
        WebElement element = WebUiCommonHelper.findWebElement(testObject, 10)
        JavascriptExecutor js = (JavascriptExecutor) DriverFactory.getWebDriver()
        js.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element)
        WebUI.delay(1)
    }

    /**
     * Tạo TestObject từ XPath
     */
    public static TestObject xpath(String xp) {
        TestObject to = new TestObject()
        to.addProperty("xpath", ConditionType.EQUALS, xp)
        return to
    }

    /**
     * Tạo TestObject từ thuộc tính id (các form trong src/features đều có id)
     */
    public static TestObject byId(String id) {
        return xpath("//*[@id='" + id + "']")
    }

    /**
     * Nút submit chính của form (class shell-button--primary) theo nhãn hiển thị
     */
    public static TestObject primaryButton(String label) {
        return xpath("//button[contains(@class,'shell-button--primary') and normalize-space(.)='" + label + "']")
    }

    /**
     * Kiểm tra banner thành công (AlertBanner type=success) xuất hiện
     */
    @Keyword
    public static boolean verifySuccessBanner(int timeout = 10) {
        return WebUI.waitForElementVisible(xpath("//div[contains(@class,'shell-alert--success')]"), timeout, FailureHandling.OPTIONAL)
    }

    /**
     * Kiểm tra banner lỗi (AlertBanner type=error) xuất hiện
     */
    @Keyword
    public static boolean verifyErrorBanner(int timeout = 10) {
        return WebUI.waitForElementVisible(xpath("//div[contains(@class,'shell-alert--error')]"), timeout, FailureHandling.OPTIONAL)
    }

    /**
     * Kiểm tra trong bảng DataTable có dòng chứa đoạn text
     */
    @Keyword
    public static boolean verifyRowExists(String text, int timeout = 10) {
        return WebUI.waitForElementPresent(xpath("//div[contains(@class,'data-table')]//tbody/tr[td[contains(normalize-space(.),'" + text + "')]]"), timeout, FailureHandling.OPTIONAL)
    }

    /**
     * Chọn option trong select: theo nhãn nếu có, ngược lại chọn option đầu tiên khác rỗng
     */
    @Keyword
    public static void selectOption(TestObject select, String label) {
        WebUI.waitForElementVisible(select, 10)
        if (label) {
            WebUI.selectOptionByLabel(select, label, false)
        } else {
            WebUI.selectOptionByIndex(select, 1)
        }
    }
}
