import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.warehouse.WarehouseKeywords

// TC_081: Kiểm tra trạng thái các IMEI vừa nhập trong kho
// Phan he: Nhập kho & IMEI | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/imports')
WebUI.waitForElementPresent(WebUIHelper.xpath("//table"), 10)
WebUI.click(WebUIHelper.xpath("//button[normalize-space(.)='Xuất Excel']"))
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
