import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.roles.RoleKeywords

// TC_161: Xem danh sách các Vai trò mặc định hệ thống
// Phan he: Vai trò & Phân quyền | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/roles')
WebUI.waitForElementPresent(WebUIHelper.xpath("//table"), 10)
AuthKeywords.logout()

WebUI.closeBrowser()
