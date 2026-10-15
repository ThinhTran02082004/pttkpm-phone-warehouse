import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper

// TC_002: Đăng nhập thành công với tài khoản Quản lý kho
// Phan he: Xác thực & Điều hướng | Do uu tien: P1

AuthKeywords.loginWith('warehouse01', '123456')
AuthKeywords.logout()

WebUI.closeBrowser()
