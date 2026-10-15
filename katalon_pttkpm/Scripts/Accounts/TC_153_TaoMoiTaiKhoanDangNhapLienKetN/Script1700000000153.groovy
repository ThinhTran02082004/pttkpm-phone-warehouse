import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.accounts.AccountKeywords

// TC_153: Tạo mới Tài khoản đăng nhập liên kết Nhân viên
// Phan he: Tài khoản | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/accounts')
String username = 'user_' + System.currentTimeMillis() % 10000
AccountKeywords.createAccount(username, '123456')
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
