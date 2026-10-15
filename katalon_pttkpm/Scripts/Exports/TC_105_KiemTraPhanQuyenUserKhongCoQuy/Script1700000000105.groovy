import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.exports.ExportKeywords

// TC_105: Kiểm tra phân quyền: User không có quyền xuất kho
// Phan he: Xuất kho & Bán hàng | Do uu tien: P1

AuthKeywords.loginWith('warehouse01', '123456')
AuthKeywords.navigateTo('/exports')
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
