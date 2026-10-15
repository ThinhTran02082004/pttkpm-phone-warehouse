import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.partners.PartnerKeywords

// TC_128: Hủy chế độ chỉnh sửa Nhà cung cấp
// Phan he: Nhà cung cấp | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/suppliers')
PartnerKeywords.clickEdit('SUPP001')
WebUI.click(WebUIHelper.xpath("//button[normalize-space(.)='Hủy chỉnh sửa']"))
AuthKeywords.logout()

WebUI.closeBrowser()
