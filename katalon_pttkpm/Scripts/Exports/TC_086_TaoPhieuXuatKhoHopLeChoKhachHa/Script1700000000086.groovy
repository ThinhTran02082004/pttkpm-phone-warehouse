import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.exports.ExportKeywords

// TC_086: Tao phieu xuat kho hop le cho Khach Hang
// Phan he: Xuat kho & Ban hang | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/exports')
String code = DataGenerator.generateRandomCode('EXP')
ExportKeywords.createExport(code, '25000000', '864201060000001')
WebUI.verifyEqual(WebUIHelper.verifySuccessBanner(), true, FailureHandling.STOP_ON_FAILURE)
WebUI.verifyEqual(WebUIHelper.verifyRowExists(code), true, FailureHandling.STOP_ON_FAILURE)
AuthKeywords.logout()

WebUI.closeBrowser()
