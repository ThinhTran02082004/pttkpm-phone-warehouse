import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper

// TC_013: Duy trì phiên đăng nhập khi F5 làm mới trình duyệt
// Phan he: Xác thực & Điều hướng | Do uu tien: P2

AuthKeywords.loginAsAdmin()
WebUI.refresh()
WebUI.verifyMatch(WebUI.getUrl(), '.*dashboard.*', true)
AuthKeywords.logout()

WebUI.closeBrowser()
