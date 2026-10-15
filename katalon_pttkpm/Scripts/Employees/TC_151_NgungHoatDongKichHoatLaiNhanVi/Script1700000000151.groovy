import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.employees.EmployeeKeywords

// TC_151: Ngưng hoạt động / Kích hoạt lại Nhân viên
// Phan he: Nhân viên | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/employees')
EmployeeKeywords.toggleEmployeeStatus('EMP002')
WebUI.delay(1)
EmployeeKeywords.toggleEmployeeStatus('EMP002')
AuthKeywords.logout()

WebUI.closeBrowser()
