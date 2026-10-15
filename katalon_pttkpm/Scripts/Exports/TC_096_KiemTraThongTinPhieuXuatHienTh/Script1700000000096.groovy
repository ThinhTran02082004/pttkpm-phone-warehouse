import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.exports.ExportKeywords

// TC_096: Kiểm tra thông tin phiếu xuất hiển thị trên bảng
// Phan he: Xuất kho & Bán hàng | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/exports')
WebUI.waitForElementPresent(WebUIHelper.xpath("//table"), 10)
ExportKeywords.exportExcel()
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
