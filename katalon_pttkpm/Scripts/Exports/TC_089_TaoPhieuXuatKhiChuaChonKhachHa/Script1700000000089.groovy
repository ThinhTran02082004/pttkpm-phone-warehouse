import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.exports.ExportKeywords

// TC_089: Tạo phiếu xuất khi chưa chọn Khách hàng
// Phan he: Xuất kho & Bán hàng | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/exports')
ExportKeywords.submitExport()
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
