import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.accounts.AccountKeywords

// TC_160: Khóa (Ngưng hoạt động) một Tài khoản
// Phan he: Tài khoản | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/accounts')
AccountKeywords.toggleAccountStatus('warehouse01')
WebUI.delay(1)
AccountKeywords.toggleAccountStatus('warehouse01')
AuthKeywords.logout()

WebUI.closeBrowser()
