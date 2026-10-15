import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper

// TC_001: Đăng nhập thành công với tài khoản Admin
// Phan he: Xác thực & Điều hướng | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.logout()
WebUI.verifyMatch(WebUI.getUrl(), '.*login.*', true)

WebUI.closeBrowser()
