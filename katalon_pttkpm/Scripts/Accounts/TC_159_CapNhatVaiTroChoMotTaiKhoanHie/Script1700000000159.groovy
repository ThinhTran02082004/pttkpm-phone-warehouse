import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.accounts.AccountKeywords

// TC_159: Cập nhật Vai trò cho một Tài khoản hiện có
// Phan he: Tài khoản | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/accounts')
AccountKeywords.updateAccountRole('warehouse01', null)
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
