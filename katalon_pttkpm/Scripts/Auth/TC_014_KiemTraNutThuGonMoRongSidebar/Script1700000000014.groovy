import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper

// TC_014: Kiểm tra nút Thu gọn / Mở rộng Sidebar
// Phan he: Xác thực & Điều hướng | Do uu tien: P3

AuthKeywords.loginAsAdmin()
WebUI.click(WebUIHelper.xpath("//button[contains(@class,'sidebar-toggle') or contains(@class,'menu-toggle') or contains(@class,'shell-topbar__toggle')]"))
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
