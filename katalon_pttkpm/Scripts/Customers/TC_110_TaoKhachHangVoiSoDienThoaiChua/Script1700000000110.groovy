import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.partners.PartnerKeywords

// TC_110: Tạo Khách hàng với Số điện thoại chứa ký tự chữ
// Phan he: Khách hàng | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/customers')
PartnerKeywords.addCustomer('', '', '', '')
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
