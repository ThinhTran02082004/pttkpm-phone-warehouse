import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.warehouse.WarehouseKeywords

// TC_067: Tạo phiếu nhập kho với nhiều dòng nhập hàng
// Phan he: Nhập kho & IMEI | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/imports')
String code = DataGenerator.generateRandomCode('IMP')
WarehouseKeywords.fillImportHeader(code)
WarehouseKeywords.fillImportLine(0, '15000000', DataGenerator.generateIMEIList(2))
WarehouseKeywords.addImportLine()
WarehouseKeywords.fillImportLine(1, '16000000', DataGenerator.generateIMEIList(2))
WarehouseKeywords.submitImport()
WebUI.verifyEqual(WebUIHelper.verifySuccessBanner(), true, FailureHandling.STOP_ON_FAILURE)
AuthKeywords.logout()

WebUI.closeBrowser()
