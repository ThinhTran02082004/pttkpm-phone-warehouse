import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.warehouse.WarehouseKeywords

// TC_066: Tạo phiếu nhập kho 1 dòng với 3 IMEI hợp lệ
// Phan he: Nhập kho & IMEI | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/imports')
String code = DataGenerator.generateRandomCode('IMP')
String imeis = DataGenerator.generateIMEIList(3)
WarehouseKeywords.createImport(code, '15000000', imeis)
WebUI.verifyEqual(WebUIHelper.verifySuccessBanner(), true, FailureHandling.STOP_ON_FAILURE)
WebUI.verifyEqual(WebUIHelper.verifyRowExists(code), true, FailureHandling.STOP_ON_FAILURE)
AuthKeywords.logout()

WebUI.closeBrowser()
