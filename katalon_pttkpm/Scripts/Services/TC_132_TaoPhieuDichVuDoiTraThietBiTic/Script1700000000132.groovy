import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.services.ServiceKeywords

// TC_132: Tạo phiếu dịch vụ đổi trả thiết bị (ticket type: return)
// Phan he: Dịch vụ & Bảo hành | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/services')
String code = DataGenerator.generateRandomCode('SRV')
ServiceKeywords.createTicket(code, null, 'return', 'Loi man hinh va pin')
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
