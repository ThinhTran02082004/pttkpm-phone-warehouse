import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.employees.EmployeeKeywords

// TC_150: Cập nhật Họ tên và Số điện thoại Nhân viên
// Phan he: Nhân viên | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/employees')
EmployeeKeywords.updateEmployee('EMP001', 'Admin Tong Updated', '0912999888')
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
