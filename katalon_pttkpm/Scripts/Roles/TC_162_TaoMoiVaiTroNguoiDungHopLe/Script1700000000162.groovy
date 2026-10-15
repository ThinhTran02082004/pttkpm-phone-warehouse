import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.roles.RoleKeywords

// TC_162: Tạo mới Vai trò người dùng hợp lệ
// Phan he: Vai trò & Phân quyền | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/roles')
String code = 'role_' + (System.currentTimeMillis() % 1000)
RoleKeywords.createRole(code, 'Vai tro ' + code, 'Mo ta vai tro')
WebUI.verifyEqual(WebUIHelper.verifySuccessBanner(), true, FailureHandling.STOP_ON_FAILURE)
AuthKeywords.logout()

WebUI.closeBrowser()
