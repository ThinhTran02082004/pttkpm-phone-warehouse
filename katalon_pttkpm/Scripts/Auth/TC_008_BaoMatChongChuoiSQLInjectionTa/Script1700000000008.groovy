import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper

// TC_008: Bảo mật chống chuỗi SQL Injection tại ô đăng nhập
// Phan he: Xác thực & Điều hướng | Do uu tien: P1

AuthKeywords.submitLoginForm("admin' OR '1'='1", "123456")

WebUI.closeBrowser()
