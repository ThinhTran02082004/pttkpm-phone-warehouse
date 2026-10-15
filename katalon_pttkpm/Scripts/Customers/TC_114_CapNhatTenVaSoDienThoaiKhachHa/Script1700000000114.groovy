import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.partners.PartnerKeywords

// TC_114: Cập nhật Tên và Số điện thoại Khách hàng
// Phan he: Khách hàng | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/customers')
PartnerKeywords.clickEdit('CUST001')
WebUIHelper.clearAndSetText(WebUIHelper.byId('customer-name'), 'Nguyen Van A Updated')
WebUI.click(WebUIHelper.primaryButton('Cập nhật khách hàng'))
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
