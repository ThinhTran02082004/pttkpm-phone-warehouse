import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper

// TC_009: Kiểm tra trạng thái nút submit khi đang xác thực
// Phan he: Xác thực & Điều hướng | Do uu tien: P3

AuthKeywords.submitLoginForm('admin', '123456')

WebUI.closeBrowser()
