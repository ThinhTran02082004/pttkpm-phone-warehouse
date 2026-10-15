import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.roles.RoleKeywords

// TC_163: Tạo Vai trò khi để trống Mã hoặc Tên vai trò
// Phan he: Vai trò & Phân quyền | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/roles')
RoleKeywords.createRole('admin', 'Quan tri')
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
