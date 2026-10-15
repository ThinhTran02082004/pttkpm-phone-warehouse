import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.employees.EmployeeKeywords

// TC_149: Bấm nút 'Sửa' trên một dòng Nhân viên
// Phan he: Nhân viên | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/employees')
EmployeeKeywords.clickEditEmployee('EMP001')
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
