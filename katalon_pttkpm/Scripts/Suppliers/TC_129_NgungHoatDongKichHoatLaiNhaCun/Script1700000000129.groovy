import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.partners.PartnerKeywords

// TC_129: Ngưng hoạt động / Kích hoạt lại Nhà cung cấp
// Phan he: Nhà cung cấp | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/suppliers')
PartnerKeywords.toggleStatus('SUPP001')
WebUI.delay(1)
PartnerKeywords.toggleStatus('SUPP001')
AuthKeywords.logout()

WebUI.closeBrowser()
