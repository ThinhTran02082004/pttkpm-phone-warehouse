import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.partners.PartnerKeywords

// TC_130: Xuất danh sách Nhà cung cấp ra file Excel
// Phan he: Nhà cung cấp | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/suppliers')
WebUI.click(WebUIHelper.xpath("//button[normalize-space(.)='Xuất Excel']"))
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
