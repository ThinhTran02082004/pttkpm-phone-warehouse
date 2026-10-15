import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper

// TC_003: Đăng nhập thất bại khi nhập sai mật khẩu
// Phan he: Xác thực & Điều hướng | Do uu tien: P1

AuthKeywords.submitLoginForm('admin', 'wrongpass')
WebUI.verifyEqual(WebUIHelper.verifyErrorBanner(5), true, FailureHandling.OPTIONAL)

WebUI.closeBrowser()
