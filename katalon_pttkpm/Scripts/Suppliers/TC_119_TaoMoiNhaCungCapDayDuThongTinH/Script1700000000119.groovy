import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.partners.PartnerKeywords

// TC_119: Tạo mới Nhà cung cấp đầy đủ thông tin hợp lệ
// Phan he: Nhà cung cấp | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/suppliers')
String code = DataGenerator.generateRandomCode('NCC')
PartnerKeywords.addSupplier(code, 'Nha Cung Cap ' + code, '0987333444', 'ncc' + code + '@gmail.com')
WebUI.verifyEqual(WebUIHelper.verifySuccessBanner(), true, FailureHandling.STOP_ON_FAILURE)
AuthKeywords.logout()

WebUI.closeBrowser()
