import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.roles.RoleKeywords

// TC_165: Cập nhật Tên và Mô tả Vai trò
// Phan he: Vai trò & Phân quyền | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/roles')
RoleKeywords.updateRole('admin', 'Quan tri vien He thong', 'Toan quyen quan tri')
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
