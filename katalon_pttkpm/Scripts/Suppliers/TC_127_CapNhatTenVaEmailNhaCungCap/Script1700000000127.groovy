import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.partners.PartnerKeywords

// TC_127: Cập nhật Tên và Email Nhà cung cấp
// Phan he: Nhà cung cấp | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/suppliers')
PartnerKeywords.clickEdit('SUPP001')
WebUIHelper.clearAndSetText(WebUIHelper.byId('supplier-name'), 'FPT Trading Pro')
WebUI.click(WebUIHelper.primaryButton('Cập nhật nhà cung cấp'))
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
