import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.employees.EmployeeKeywords

// TC_143: Tạo mới Nhân viên đầy đủ thông tin hợp lệ
// Phan he: Nhân viên | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/employees')
String code = DataGenerator.generateRandomCode('NV')
EmployeeKeywords.addEmployee(code, 'Nhan Vien ' + code, 'nv' + code + '@company.com', '0912345678')
WebUI.verifyEqual(WebUIHelper.verifySuccessBanner(), true, FailureHandling.STOP_ON_FAILURE)
AuthKeywords.logout()

WebUI.closeBrowser()
