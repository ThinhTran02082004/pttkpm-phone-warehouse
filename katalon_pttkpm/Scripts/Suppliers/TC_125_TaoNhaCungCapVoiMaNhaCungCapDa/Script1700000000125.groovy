import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.partners.PartnerKeywords

// TC_125: Tạo Nhà cung cấp với Mã nhà cung cấp đã tồn tại
// Phan he: Nhà cung cấp | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/suppliers')
PartnerKeywords.addSupplier('', '', '', '')
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
