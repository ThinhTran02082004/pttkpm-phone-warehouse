import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.exports.ExportKeywords

// TC_087: Tạo phiếu xuất kho với nhiều IMEI cùng lúc
// Phan he: Xuất kho & Bán hàng | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/exports')
String code = DataGenerator.generateRandomCode('EXP')
ExportKeywords.createExport(code, '25000000', '864201060000002\n864201060000003')
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
