import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.services.ServiceKeywords

// TC_141: Kiểm tra giải phóng trạng thái thiết bị sau khi hoàn thành dịch vụ
// Phan he: Dịch vụ & Bảo hành | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/services')
WebUI.waitForElementPresent(WebUIHelper.xpath("//table"), 10)
ServiceKeywords.exportExcel()
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
