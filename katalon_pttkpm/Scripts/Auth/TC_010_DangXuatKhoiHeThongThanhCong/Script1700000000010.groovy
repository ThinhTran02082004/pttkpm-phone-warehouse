import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper

// TC_010: Đăng xuất khỏi hệ thống thành công
// Phan he: Xác thực & Điều hướng | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.logout()
WebUI.verifyMatch(WebUI.getUrl(), '.*login.*', true)

WebUI.closeBrowser()
