import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.accounts.AccountKeywords

// TC_154: Tạo Tài khoản khi chưa chọn Nhân viên liên kết
// Phan he: Tài khoản | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/accounts')
AccountKeywords.createAccount('', '')
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
