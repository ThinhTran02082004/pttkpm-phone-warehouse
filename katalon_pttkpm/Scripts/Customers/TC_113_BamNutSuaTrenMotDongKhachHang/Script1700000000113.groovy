import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.partners.PartnerKeywords

// TC_113: Bấm nút 'Sửa' trên một dòng Khách hàng
// Phan he: Khách hàng | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/customers')
PartnerKeywords.clickEdit('CUST001')
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
