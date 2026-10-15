import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.services.ServiceKeywords

// TC_135: Tạo phiếu dịch vụ khi chưa chọn mã IMEI thiết bị
// Phan he: Dịch vụ & Bảo hành | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/services')
WebUI.click(WebUIHelper.primaryButton('Lưu phiếu dịch vụ'))
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
