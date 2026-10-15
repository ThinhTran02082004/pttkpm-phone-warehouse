import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.partners.PartnerKeywords

// TC_106: Tạo mới Khách hàng thành công với thông tin hợp lệ
// Phan he: Khách hàng | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/customers')
String code = DataGenerator.generateRandomCode('KH')
PartnerKeywords.addCustomer(code, 'Khach Hang ' + code, '0987111222', 'khach' + code + '@gmail.com')
WebUI.verifyEqual(WebUIHelper.verifySuccessBanner(), true, FailureHandling.STOP_ON_FAILURE)
AuthKeywords.logout()

WebUI.closeBrowser()
