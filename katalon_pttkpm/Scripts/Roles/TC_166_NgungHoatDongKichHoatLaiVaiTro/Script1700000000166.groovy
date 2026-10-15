import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.roles.RoleKeywords

// TC_166: Ngưng hoạt động / Kích hoạt lại Vai trò
// Phan he: Vai trò & Phân quyền | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/roles')
RoleKeywords.toggleRoleStatus('sales')
WebUI.delay(1)
RoleKeywords.toggleRoleStatus('sales')
AuthKeywords.logout()

WebUI.closeBrowser()
