import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.exports.ExportKeywords

// TC_091: Xuất kho với mã IMEI không tồn tại trong hệ thống
// Phan he: Xuất kho & Bán hàng | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/exports')
ExportKeywords.submitExport()
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
