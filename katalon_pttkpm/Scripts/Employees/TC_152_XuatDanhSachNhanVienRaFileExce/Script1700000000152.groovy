import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.employees.EmployeeKeywords

// TC_152: Xuất danh sách Nhân viên ra file Excel
// Phan he: Nhân viên | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/employees')
EmployeeKeywords.exportExcel()
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
