import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper

// TC_015: Tự động chuyển hướng về trang yêu cầu ban đầu sau khi đăng nhập
// Phan he: Xác thực & Điều hướng | Do uu tien: P2

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.BASE_URL + '/customers')
WebUI.delay(1)
AuthKeywords.submitLoginForm('admin', '123456')
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
