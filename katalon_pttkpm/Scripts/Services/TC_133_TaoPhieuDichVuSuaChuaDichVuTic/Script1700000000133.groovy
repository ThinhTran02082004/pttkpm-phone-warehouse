import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.services.ServiceKeywords

// TC_133: Tạo phiếu dịch vụ sửa chữa dịch vụ (ticket type: repair)
// Phan he: Dịch vụ & Bảo hành | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/services')
String code = DataGenerator.generateRandomCode('SRV')
ServiceKeywords.createTicket(code, null, 'repair', 'Loi man hinh va pin')
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
