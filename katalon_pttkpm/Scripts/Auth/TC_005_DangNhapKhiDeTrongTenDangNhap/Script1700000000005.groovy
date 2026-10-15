import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper

// TC_005: Đăng nhập khi để trống Tên đăng nhập
// Phan he: Xác thực & Điều hướng | Do uu tien: P2

AuthKeywords.submitLoginForm('', '123456')

WebUI.closeBrowser()
