import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.warehouse.WarehouseKeywords

// TC_083: Xuất danh sách phiếu nhập kho ra file Excel
// Phan he: Nhập kho & IMEI | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/imports')
WebUI.waitForElementPresent(WebUIHelper.xpath("//table"), 10)
WebUI.click(WebUIHelper.xpath("//button[normalize-space(.)='Xuất Excel']"))
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
