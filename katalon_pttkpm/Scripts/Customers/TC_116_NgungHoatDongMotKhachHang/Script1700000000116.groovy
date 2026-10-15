import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.partners.PartnerKeywords

// TC_116: Ngưng hoạt động một Khách hàng
// Phan he: Khách hàng | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/customers')
PartnerKeywords.toggleStatus('CUST001')
WebUI.delay(1)
PartnerKeywords.toggleStatus('CUST001')
AuthKeywords.logout()

WebUI.closeBrowser()
